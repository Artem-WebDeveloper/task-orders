import type { ApiOrder } from "@/shared/api/types";
import { formatExecutionAt } from "../lib/format";
import { OrderStatusBadge } from "./OrderStatusBadge";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

interface OrderDetailsDialogProps {
  order: ApiOrder | null;
  onOpenChange: (open: boolean) => void;
}

/** Просмотр наряда целиком: описание и адрес показываются без обрезки. */
export function OrderDetailsDialog({
  order,
  onOpenChange,
}: OrderDetailsDialogProps) {
  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle>Наряд</DialogTitle>
            {order && <OrderStatusBadge status={order.status} />}
          </div>
          <DialogDescription>Подробная информация о наряде</DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] min-w-0 overflow-y-auto">
          <dl className="grid gap-4 text-sm">
            <div className="grid gap-1">
              <dt className="text-muted-foreground text-xs">Дата выполнения</dt>
              <dd>{order && formatExecutionAt(order.executionAt)}</dd>
            </div>

            <div className="grid gap-1">
              <dt className="text-muted-foreground text-xs">Адрес</dt>
              <dd className="min-w-0 wrap-anywhere">{order?.address}</dd>
            </div>

            <div className="grid gap-1">
              <dt className="text-muted-foreground text-xs">Исполнитель</dt>
              <dd>{order?.assignee?.fullname ?? "—"}</dd>
            </div>

            <div className="grid gap-1">
              <dt className="text-muted-foreground text-xs">Описание</dt>
              <dd className="min-w-0 wrap-anywhere whitespace-pre-line">
                {order?.description}
              </dd>
            </div>
          </dl>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
