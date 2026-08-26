import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import AppError from '../utils/AppError.ts';

export function validate(schema: z.ZodType) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => issue.message).join(', ');
        return next(new AppError(errorMessages, 400));
      }
      next(error);
    }
  };
}

export function validateParams(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(new AppError('Некорректный ID заказа', 400));
    }
    next();
  };
}
