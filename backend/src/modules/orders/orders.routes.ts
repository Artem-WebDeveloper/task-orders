import express from 'express';
import * as ordersController from './orders.controller.ts';
import { validate, validateParams } from '../../middlewares/validate.middleware.ts';
import { createOrderSchema, orderParamsSchema, updateOrderSchema } from '@task-orders/shared';

const router = express.Router();

router.get('/', ordersController.getOrders);
router.get('/:uuid', validateParams(orderParamsSchema), ordersController.getOrder);
router.post('/', validate(createOrderSchema), ordersController.createOrder);
router.delete('/:uuid', validateParams(orderParamsSchema), ordersController.deleteOrder);

router.patch(
  '/:uuid',
  validateParams(orderParamsSchema),
  validate(updateOrderSchema),
  ordersController.updateOrder,
);

router.patch(
  '/:uuid/status',
  // validateParams(orderParamsSchema),
  // validate(updateOrderSchema),
  ordersController.updateStatus,
);

export default router;
