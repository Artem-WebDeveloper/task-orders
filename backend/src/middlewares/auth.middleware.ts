import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.ts';
import { redisClient } from '../redis-client.ts';
import catchAsync from '../utils/catchAsync.ts';
import { AppDataSource } from '../data-source.ts';
import { User } from '../entities/User.ts';
import type { RoleCode } from '@task-orders/shared';

const userRepo = AppDataSource.getRepository(User);

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Вы не авторизованы. Войдите в систему.', 401));
  }

  const userId = await redisClient.get(`session:${token}`);

  if (!userId) {
    throw new AppError('Сессия истекла. Войдите заново.', 401);
  }

  jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await userRepo.findOne({
    where: { uuid: userId },
  });

  if (!currentUser) {
    throw new AppError('Пользователь не найден', 401);
  }

  req.user = currentUser;
  req.token = token;

  next();
});

export const restrictTo = (...roles: RoleCode[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role.code)) {
      return next(new AppError('Недостаточно прав для этого действия', 403));
    }

    next();
  };
};
