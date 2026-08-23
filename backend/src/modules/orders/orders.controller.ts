import type { Request, Response } from 'express';
import * as ordersService from './orders.service.ts';
import catchAsync from '../../utils/catchAsync.ts';
import { getRouteParam } from '../../utils/getRouteParam.ts';

export const getOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await ordersService.findAll(req.user!);
  res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

export const getOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = getRouteParam(req.params.uuid, 'order id');
  const order = await ordersService.findOne(req.user!, orderId);
  res.status(200).json({ status: 'success', data: { order } });
});

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await ordersService.create(req.body);
  res.status(201).json({ status: 'success', data: { order } });
});

export const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const uuid = getRouteParam(req.params.uuid, 'order id');

  await ordersService.remove(uuid);
  res.status(204).send();
});

export const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const uuid = getRouteParam(req.params.uuid, 'order id');

  const order = await ordersService.update(uuid, req.body);
  res.status(200).json({ status: 'success', data: { order } });
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const uuid = getRouteParam(req.params.uuid, 'order id');
  // const result = await ordersService.changeStatus(uuid);
  res.status(200).json({ status: 'success', message: 'It has not been implemented yet' });
});
