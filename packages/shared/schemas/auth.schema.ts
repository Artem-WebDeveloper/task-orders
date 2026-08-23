import { z } from 'zod';

export const verifyCodeSchema = z.object({
  userId: z.uuid({ message: 'Некорректный ID пользователя' }),
  verifyCode: z.string().length(6, 'Код должен содержать 6 цифр'),
});

export type VerifyCodeDto = z.infer<typeof verifyCodeSchema>;
