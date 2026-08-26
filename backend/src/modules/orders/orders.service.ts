import type { CreateOrderDto, OrderStatus, UpdateOrderDto } from '@task-orders/shared';
import { AppDataSource } from '../../data-source.ts';
import { Order } from '../../entities/Order.ts';
import { User } from '../../entities/User.ts';
import AppError from '../../utils/AppError.ts';
import { canTransition } from './orders.status-transitions.ts';

const orderRepo = AppDataSource.getRepository(Order);
const userRepo = AppDataSource.getRepository(User);

export const findAll = async (currentUser: User) => {
  if (currentUser.role.code === 'team') {
    return await orderRepo.find({
      relations: { assignee: true },
      where: { assignee: { uuid: currentUser.uuid } },
      order: { executionAt: 'DESC' },
    });
  }

  return await orderRepo.find({
    relations: { assignee: true },
    order: { executionAt: 'DESC' },
  });
};

export const findOne = async (currentUser: User, orderId: string) => {
  const where =
    currentUser.role.code === 'team'
      ? { uuid: orderId, assignee: { uuid: currentUser.uuid } }
      : { uuid: orderId };

  const order = await orderRepo.findOne({
    where,
    relations: { assignee: true },
  });

  if (!order) {
    throw new AppError('Заказ не найден', 404);
  }

  return order;
};

export const create = async (data: CreateOrderDto) => {
  const assigneeUser = await resolveAssignee(data.assignee);

  const order = orderRepo.create({
    executionAt: data.executionAt,
    address: data.address,
    description: data.description,
    status: data.status ?? 'new',
    assignee: assigneeUser,
  });

  return orderRepo.save(order);
};

export const update = async (orderId: string, updatedData: UpdateOrderDto) => {
  const order = await orderRepo.findOne({
    where: { uuid: orderId },
    relations: { assignee: true },
  });
  if (!order) {
    throw new AppError('Заказ не найден', 404);
  }

  const assigneeUser = await resolveAssignee(updatedData.assignee);
  const { assignee: _assignee, ...rest } = updatedData;
  orderRepo.merge(order, rest);
  order.assignee = assigneeUser ?? null;

  return orderRepo.save(order);
};

export const remove = async (orderId: string) => {
  const order = await orderRepo.findOne({
    where: { uuid: orderId },
    relations: { assignee: true },
  });

  if (!order) {
    throw new AppError('Заказ не найден', 404);
  }

  await orderRepo.remove(order);

  return order;
};

export const changeStatus = async (orderId: string, newStatus: OrderStatus, currentUser: User) => {
  const order = await orderRepo.findOne({
    where: { uuid: orderId },
    relations: { assignee: true },
  });

  if (!order) {
    throw new AppError('Заказ не найден', 404);
  }

  if (order.assignee?.uuid !== currentUser.uuid) {
    throw new AppError('Вы не назначены на этот заказ', 403);
  }

  if (!canTransition(order.status, newStatus)) {
    throw new AppError(`Невозможно изменить статус с ${order.status} на ${newStatus}`, 400);
  }

  order.status = newStatus;
  return orderRepo.save(order);
};

async function resolveAssignee(assigneeInput: string | null | undefined) {
  if (assigneeInput === undefined) return undefined;
  if (assigneeInput === null) return null;

  const user = await userRepo.findOneBy({ uuid: assigneeInput });
  if (!user) throw new AppError('Исполнитель не найден', 404);
  return user;
}
