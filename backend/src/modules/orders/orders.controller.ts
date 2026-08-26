import type { Request, Response } from 'express';
import * as ordersService from './orders.service.ts';
import catchAsync from '../../utils/catchAsync.ts';
import { getRouteParam } from '../../utils/getRouteParam.ts';
import {
  emitOrderCreated,
  emitOrderDeleted,
  emitOrderStatusChanged,
  emitOrderAssigned,
} from './orders.events.ts';

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
  emitOrderCreated(order.uuid, order.assignee?.uuid);
  res.status(201).json({ status: 'success', data: { order } });
});

export const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const uuid = getRouteParam(req.params.uuid, 'order id');
  const deletedOrder = await ordersService.remove(uuid);
  emitOrderDeleted(uuid, deletedOrder.assignee?.uuid);
  res.status(204).send();
});

export const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const uuid = getRouteParam(req.params.uuid, 'order id');

  const oldOrder = await ordersService.findOne(req.user!, uuid);
  const oldAssigneeUuid = oldOrder.assignee?.uuid ?? null;
  const oldStatus = oldOrder.status;

  const updatedOrder = await ordersService.update(uuid, req.body);
  const newAssigneeUuid = updatedOrder.assignee?.uuid ?? null;
  const newStatus = updatedOrder.status;

  if (oldStatus !== newStatus) {
    emitOrderStatusChanged(uuid, newAssigneeUuid);
  }

  if (oldAssigneeUuid !== newAssigneeUuid) {
    if (oldAssigneeUuid) {
      emitOrderDeleted(uuid, oldAssigneeUuid);
    }
    if (newAssigneeUuid) {
      emitOrderAssigned(uuid, newAssigneeUuid);
    }
  }

  res.status(200).json({ status: 'success', data: { order: updatedOrder } });
});

export const updateStatus = catchAsync(async (req: Request, res: Response) => {
  const uuid = getRouteParam(req.params.uuid, 'order id');
  const updatedOrder = await ordersService.changeStatus(uuid, req.body.status, req.user!);
  emitOrderStatusChanged(uuid, updatedOrder.assignee?.uuid);
  res.status(200).json({
    status: 'success',
    message: `Status has been changed to '${req.body.status}'`,
    data: { order: updatedOrder },
  });
});
