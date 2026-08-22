import type { CreateOrderDto, UpdateOrderDto } from '@task-orders/shared';
import { AppDataSource } from '../../data-source.ts';
import { Order } from '../../entities/Order.ts';
import { User } from '../../entities/User.ts';
import AppError from '../../utils/AppError.ts';

const orderRepo = AppDataSource.getRepository(Order);
const userRepo = AppDataSource.getRepository(User);

export const findAll = async () => await orderRepo.find({ relations: { assignee: true } });

export const findOne = async (orderId: string) => {
  const result = await orderRepo.findOne({
    where: { uuid: orderId },
    relations: { assignee: true },
  });

  if (!result) {
    throw new AppError('Order not found', 404);
  }
  return result;
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
    throw new AppError('Order not found', 404);
  }

  const assigneeUser = await resolveAssignee(updatedData.assignee);
  orderRepo.merge(order, { ...updatedData, assignee: assigneeUser });

  return orderRepo.save(order);
};

export const remove = async (orderId: string) => {
  const result = await orderRepo.delete({ uuid: orderId });

  if (result.affected === 0) {
    throw new AppError('Order not found', 404);
  }
};

async function resolveAssignee(assigneeInput: string | null | undefined) {
  if (assigneeInput === undefined) return undefined;
  if (assigneeInput === null) return null;

  const user = await userRepo.findOneBy({ uuid: assigneeInput });
  if (!user) throw new AppError('Assignee not found', 404);
  return user;
}
