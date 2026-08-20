import { z } from 'zod';
import { ROLE_CODES } from '../constants.ts';

export const createUserSchema = z.object({
  fullName: z.string().min(3, 'ФИО должно быть не короче 3 символов'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Некорректный номер телефона'),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
  role: z.enum(ROLE_CODES),
});
