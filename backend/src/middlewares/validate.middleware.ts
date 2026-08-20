import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import AppError from '../utils/AppError.ts';

function validate(schema: ZodObject) {
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

export default validate;
