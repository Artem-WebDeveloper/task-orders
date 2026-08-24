import type { OrderStatus } from "@task-orders/shared";

import { Badge } from "@/shared/ui/badge";
import { ORDER_STATUS_LABELS } from "../lib/format";

const VARIANT_BY_STATUS: Record<
  OrderStatus,
  "info" | "warning" | "success"
> = {
  new: "info",
  in_progress: "warning",
  done: "success",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={VARIANT_BY_STATUS[status]} className="w-20 justify-center">
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
