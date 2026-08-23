import type { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync.ts';
import * as authService from './auth.service.ts';

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.requestLogin(req.body);
  res.status(200).json({ status: 'success', data: { userId: result } });
});

export const confirmLogin = catchAsync(async (req: Request, res: Response) => {
  const token = await authService.verifyCode(req.body);
  res.status(200).json({ status: 'success', message: 'You are logged in', token });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logoutCurUser(req.token!);
  res.status(204).send();
});
