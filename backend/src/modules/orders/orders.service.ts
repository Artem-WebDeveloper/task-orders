import type { CreateOrderDto } from '@task-orders/shared';
import { AppDataSource } from '../../data-source.ts';
import { Order } from '../../entities/Order.ts';
import { User } from '../../entities/User.ts';
import AppError from '../../utils/AppError.ts';

const orderRepo = AppDataSource.getRepository(Order);
const userRepo = AppDataSource.getRepository(User);

export const orders = async () => await orderRepo.find();

export const create = async (data: CreateOrderDto) => {
  let assigneeUser: User | null = null;

  if (data.assignee) {
    assigneeUser = await userRepo.findOneBy({ uuid: data.assignee });
    if (!assigneeUser) {
      throw new AppError('Assignee not found', 404);
    }
  }

  const order = orderRepo.create({
    executionAt: data.executionAt,
    address: data.address,
    description: data.description,
    status: 'new',
    assignee: assigneeUser,
  });

  return orderRepo.save(order);
};
