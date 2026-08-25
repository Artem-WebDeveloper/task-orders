import { z } from "zod";
import { createOrderSchema } from "@task-orders/shared";

import type { ApiOrder } from "@/shared/api/types";
import { toDatetimeLocalValue } from "./format";

export const orderFormSchema = z.object({
  assignee: z.uuid({ message: "Некорректный исполнитель" }).or(z.literal("")),
  executionAt: z.string().min(1, "Укажите дату выполнения"),
  address: createOrderSchema.shape.address,
  description: createOrderSchema.shape.description,
  status: createOrderSchema.shape.status,
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export const NO_ASSIGNEE = "";

export function buildOrderDefaults(order?: ApiOrder | null): OrderFormValues {
  return {
    assignee: order?.assignee?.uuid ?? NO_ASSIGNEE,
    executionAt: order ? toDatetimeLocalValue(order.executionAt) : "",
    address: order?.address ?? "",
    description: order?.description ?? "",
    status: order?.status ?? "new",
  };
}
