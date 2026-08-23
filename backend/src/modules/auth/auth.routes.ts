import express from 'express';
import * as authController from './auth.controller.ts';
import { validate } from '../../middlewares/validate.middleware.ts';
import { loginUserSchema, verifyCodeSchema } from '@task-orders/shared';

const router = express.Router();

router.post('/login', validate(loginUserSchema), authController.login);
router.post('/verify-2fa', validate(verifyCodeSchema), authController.confirmLogin);

export default router;
