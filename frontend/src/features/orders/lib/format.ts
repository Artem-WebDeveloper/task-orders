import type { OrderStatus } from '@task-orders/shared';
import { format, parseISO } from 'date-fns';

/** Русские названия статусов наряда. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Новый',
  in_progress: 'В работе',
  done: 'Выполнен',
};

/** ISO-строка из API → «05.07.2026 12:00». */
export function formatExecutionAt(iso: string): string {
  return format(parseISO(iso), 'dd.MM.yyyy HH:mm');
}

/** Date | строка → значение для <input type="datetime-local">. */
export function toDatetimeLocalValue(value: Date | string): string {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return format(date, "yyyy-MM-dd'T'HH:mm");
}
