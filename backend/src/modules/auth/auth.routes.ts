import express from 'express';
import * as authController from './auth.controller.ts';
import { validate } from '../../middlewares/validate.middleware.ts';
import { loginUserSchema, verifyCodeSchema } from '@task-orders/shared';
import { protect } from '../../middlewares/auth.middleware.ts';

const router = express.Router();

router.post('/login', validate(loginUserSchema), authController.login);
router.post('/verify-2fa', validate(verifyCodeSchema), authController.confirmLogin);
router.post('/logout', protect, authController.logout);

export default router;
