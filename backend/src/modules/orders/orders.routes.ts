import express from 'express';
import * as usersController from './orders.controller.ts';
import validate from '../../middlewares/validate.middleware.ts';
import { createOrderSchema } from '@task-orders/shared';

const router = express.Router();

router.get('/', usersController.getOrders);
router.post('/', validate(createOrderSchema), usersController.createOrder);

export default router;
