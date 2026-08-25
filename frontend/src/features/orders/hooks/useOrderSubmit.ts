import type { UseFormReturn } from "react-hook-form";

import type { ApiOrder } from "@/shared/api/types";
import { useCreateOrder, useUpdateOrder } from "./useOrders";
import type { OrderFormValues } from "../lib/schemas";
import { NO_ASSIGNEE } from "../lib/schemas";

export function useOrderSubmit(
  order: ApiOrder | null | undefined,
  form: UseFormReturn<OrderFormValues>,
  onOpenChange: (open: boolean) => void,
) {
  const isEdit = !!order;
  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder(order?.uuid ?? "");
  const mutation = isEdit ? updateMutation : createMutation;

  const onSubmit = form.handleSubmit(async (values) => {
    const dto = {
      assignee: values.assignee === NO_ASSIGNEE ? null : values.assignee,
      executionAt: new Date(values.executionAt),
      address: values.address,
      description: values.description,
      status: values.status,
    };

    try {
      await mutation.mutateAsync(dto);
      onOpenChange(false);
    } catch (error) {
      form.setError("root", {
        message:
          error instanceof Error ? error.message : "Не удалось сохранить наряд",
      });
    }
  });

  return { onSubmit, isPending: mutation.isPending };
}
