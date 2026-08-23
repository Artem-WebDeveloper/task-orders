import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../../data-source.ts';
import { redisClient } from '../../redis-client.ts';
import { User } from '../../entities/User.ts';
import { signToken } from '../../utils/signToken.ts';
import type { LoginUserDto, VerifyCodeDto } from '@task-orders/shared';
import AppError from '../../utils/AppError.ts';

const userRepo = AppDataSource.getRepository(User);

export const requestLogin = async ({ phone, password }: LoginUserDto) => {
  const user = await userRepo.findOne({
    where: { phone },
    select: {
      uuid: true,
      phone: true,
      fullname: true,
      passwordHash: true,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AppError('Invalid login or password', 401);
  }

  const code = crypto.randomInt(100000, 1000000).toString();
  console.log(`[2FA ИМИТАЦИЯ]: Код ${code} отправлен на номер ${user.phone}`);

  await redisClient.set(`verify:${user.uuid}`, code, { EX: 60 * 2 });

  return user.uuid;
};

export const verifyCode = async ({ verifyCode, userId }: VerifyCodeDto) => {
  console.log(verifyCode, userId);

  const authCode = await redisClient.get(`verify:${userId}`);

  if (authCode !== verifyCode) {
    throw new AppError('Incorrect or expired verify code! Please log in again!', 401);
  }

  await redisClient.del(`verify:${userId}`);
  const token = signToken(userId);

  await redisClient.set(`session:${userId}`, token, { EX: 60 * 60 * 24 });

  return token;
};
