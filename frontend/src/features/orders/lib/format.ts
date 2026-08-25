import type { OrderStatus } from "@task-orders/shared";
import { format, parseISO } from "date-fns";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Новый",
  in_progress: "В работе",
  done: "Выполнен",
};

export const ORDER_FILTER_OPTIONS = [
  { value: "all" as const, label: "Все статусы" },
  ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
    value: value as OrderStatus,
    label,
  })),
];

/** ISO-строка из API → «05.07.2026 12:00». */
export function formatExecutionAt(iso: string): string {
  return format(parseISO(iso), "dd.MM.yyyy HH:mm");
}

/** Date | строка → значение для <input type="datetime-local">. */
export function toDatetimeLocalValue(value: Date | string): string {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

/** Строка datetime-local 'yyyy-MM-ddTHH:mm' → { date: 'yyyy-MM-dd', time: 'HH:mm' }. */
export function splitDateTimeLocal(value: string): {
  date: string;
  time: string;
} {
  const [date = "", time = ""] = value.split("T");
  return { date, time };
}

/** Date + 'HH:mm' → строка datetime-local (локальная зона, как и раньше). */
export function joinDateTimeLocal(
  date: Date | undefined,
  time: string,
): string {
  if (!date) return "";
  return `${format(date, "yyyy-MM-dd")}T${time || "00:00"}`;
}
