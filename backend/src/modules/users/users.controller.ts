import type { Request, Response } from 'express';
import * as usersService from './users.service.ts';
import catchAsync from '../../utils/catchAsync.ts';

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await usersService.allUsers();
  res.status(200).json({ status: 'success', results: users.length, data: { users } });
});

export function getUser(req: Request, res: Response) {
  res.status(200).json({ status: 'success', results: '', data: {} });
}
