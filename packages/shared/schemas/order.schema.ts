import { z } from 'zod';
import { ORDER_STATUSES } from '../constants.ts';

export const orderParamsSchema = z.object({
  uuid: z.uuid({ message: 'Некорректный ID наряда' }),
});

export const createOrderSchema = z.object({
  assignee: z.uuid({ message: 'Некорректный ID исполнителя' }).optional().nullable(),
  executionAt: z.coerce.date({
    message: 'Пожалуйста, укажите корректную дату выполнения',
  }),
  address: z.string().min(1, 'Введите адрес!').max(255, 'Адрес не должен превышать 255 символов'),
  description: z.string().min(1, 'Введите описание задачи!').max(1000, 'Не более 1000 символов'),
  status: z.enum(ORDER_STATUSES),
});

export const updateOrderSchema = createOrderSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Некорректные данные. Нечего обновлять!',
  });

export const changeOrderStatusSchema = createOrderSchema.pick({
  status: true,
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;

export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;
