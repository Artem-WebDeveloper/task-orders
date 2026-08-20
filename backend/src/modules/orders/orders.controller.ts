import type { Request, Response } from 'express';
import * as ordersService from './orders.service.ts';
import catchAsync from '../../utils/catchAsync.ts';

export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await ordersService.orders();
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await ordersService.create(req.body);
  res.status(201).json({ status: 'success', data: { order } });
});
