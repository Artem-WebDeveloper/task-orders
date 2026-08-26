import express from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from './auth.controller.ts';
import { validate } from '../../middlewares/validate.middleware.ts';
import { loginUserSchema, verifyCodeSchema } from '@task-orders/shared';
import { protect } from '../../middlewares/auth.middleware.ts';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: 'Слишком много попыток, попробуйте позже',
});

const router = express.Router();

router.post('/login', authLimiter, validate(loginUserSchema), authController.login);
router.post('/verify-2fa', authLimiter, validate(verifyCodeSchema), authController.confirmLogin);
router.post('/logout', protect, authController.logout);
router.get('/me', protect, authController.getMe);

export default router;
