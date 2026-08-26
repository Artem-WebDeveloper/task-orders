import type { ExtendedError, Socket } from 'socket.io';
import { AppDataSource } from '../data-source.ts';
import { redisClient } from '../redis-client.ts';
import { User } from '../entities/User.ts';

const userRepo = AppDataSource.getRepository(User);

export async function socketAuth(socket: Socket, next: (err?: ExtendedError) => void) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next({ name: 'Error', message: 'Требуется авторизация', data: { statusCode: 401 } });

    const userId = await redisClient.get(`session:${token}`);
    if (!userId) return next({ name: 'Error', message: 'Сессия истекла', data: { statusCode: 401 } });

    const user = await userRepo.findOne({ where: { uuid: userId } });
    if (!user) return next({ name: 'Error', message: 'Пользователь не найден', data: { statusCode: 401 } });

    socket.data.user = user;
    next();
  } catch {
    next({ name: 'Error', message: 'Ошибка авторизации', data: { statusCode: 401 } });
  }
}
