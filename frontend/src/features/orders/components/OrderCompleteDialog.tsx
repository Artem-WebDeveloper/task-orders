import { useState } from "react";

import type { ApiOrder } from "@/shared/api/types";
import { formatExecutionAt } from "../lib/format";
import { useChangeOrderStatus } from "../hooks/useOrders";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

interface OrderCompleteDialogProps {
  order: ApiOrder | null;
  onOpenChange: (open: boolean) => void;
}

export function OrderCompleteDialog({
  order,
  onOpenChange,
}: OrderCompleteDialogProps) {
  const changeStatus = useChangeOrderStatus();
  const [error, setError] = useState<string | null>(null);

  const [prevOrder, setPrevOrder] = useState(order);
  if (prevOrder !== order) {
    setPrevOrder(order);
    setError(null);
  }

  const handleComplete = async () => {
    if (!order) return;
    try {
      await changeStatus.mutateAsync({ uuid: order.uuid, status: "done" });
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось выполнить наряд");
    }
  };

  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Выполнить наряд?</DialogTitle>
          <DialogDescription>
            Наряд по адресу «{order?.address}» от{" "}
            {order && formatExecutionAt(order.executionAt)} будет отмечен как
            выполненный.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button
            type="button"
            onClick={handleComplete}
            disabled={changeStatus.isPending}
          >
            {changeStatus.isPending ? "Выполняем..." : "Выполнить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
