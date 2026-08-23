import express from 'express';
import * as ordersController from './orders.controller.ts';
import { validate, validateParams } from '../../middlewares/validate.middleware.ts';
import { createOrderSchema, orderParamsSchema, updateOrderSchema } from '@task-orders/shared';
import { protect, restrictTo } from '../../middlewares/auth.middleware.ts';

const router = express.Router();

router.use(protect);

router.get('/', ordersController.getOrders);

router.get('/:uuid', validateParams(orderParamsSchema), ordersController.getOrder);

router.post('/', restrictTo('operator'), validate(createOrderSchema), ordersController.createOrder);

router.delete(
  '/:uuid',
  restrictTo('operator'),
  validateParams(orderParamsSchema),
  ordersController.deleteOrder,
);

router.patch(
  '/:uuid',
  restrictTo('operator'),
  validateParams(orderParamsSchema),
  validate(updateOrderSchema),
  ordersController.updateOrder,
);

router.patch(
  '/:uuid/status',
  restrictTo('team'),
  // validateParams(orderParamsSchema),
  // validate(updateOrderSchema),
  ordersController.updateStatus,
);

export default router;
