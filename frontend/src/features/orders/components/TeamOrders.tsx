import { useState } from "react";
import type { ApiOrder } from "@/shared/api/types";
import { ApiError } from "@/shared/api/http";
import { formatExecutionAt } from "../lib/format";
import { useChangeOrderStatus, useOrders } from "../hooks/useOrders";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderCompleteDialog } from "./OrderCompleteDialog";
import { OrderDetailsDialog } from "./OrderDetailsDialog";

import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

export function TeamOrders() {
  const ordersQuery = useOrders();
  const changeStatus = useChangeOrderStatus();

  const [completingOrder, setCompletingOrder] = useState<ApiOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<ApiOrder | null>(null);
  const [pendingUuid, setPendingUuid] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const orders = ordersQuery.data ?? [];

  const handleStart = async (order: ApiOrder) => {
    setActionError(null);
    setPendingUuid(order.uuid);
    try {
      await changeStatus.mutateAsync({
        uuid: order.uuid,
        status: "in_progress",
      });
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Не удалось изменить статус",
      );
    } finally {
      setPendingUuid(null);
    }
  };

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Мои наряды</h1>

      {ordersQuery.isPending && (
        <p className="text-muted-foreground text-sm">Загрузка нарядов...</p>
      )}

      {ordersQuery.error instanceof ApiError &&
        ordersQuery.error.status === 401 && (
          <p className="text-destructive text-sm">
            Сессия истекла. Обновите страницу.
          </p>
        )}
      {ordersQuery.error instanceof ApiError &&
        ordersQuery.error.status !== 401 && (
          <p className="text-destructive text-sm">
            {ordersQuery.error.message}
          </p>
        )}

      {actionError && <p className="text-destructive text-sm">{actionError}</p>}

      {!ordersQuery.isPending && !ordersQuery.error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата выполнения</TableHead>
                <TableHead>Адрес</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-32 text-right">Действие</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.uuid}
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => setViewingOrder(order)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setViewingOrder(order);
                    }
                  }}
                >
                  <TableCell className="whitespace-nowrap">
                    {formatExecutionAt(order.executionAt)}
                  </TableCell>
                  <TableCell className="max-w-48 truncate font-medium">
                    {order.address}
                  </TableCell>
                  <TableCell className="max-w-72 whitespace-normal">
                    <p className="text-muted-foreground line-clamp-1 wrap-anywhere">
                      {order.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {order.status === "new" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pendingUuid === order.uuid}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStart(order);
                        }}
                      >
                        {pendingUuid === order.uuid
                          ? "Начинаем..."
                          : "Приступить"}
                      </Button>
                    )}
                    {order.status === "in_progress" && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCompletingOrder(order);
                        }}
                      >
                        Выполнить
                      </Button>
                    )}
                    {order.status === "done" && (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {orders.length === 0 && (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="font-medium">Нарядов пока нет</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Когда оператор назначит наряд вашей бригаде, он появится здесь
              </p>
            </div>
          )}
        </>
      )}

      <OrderCompleteDialog
        order={completingOrder}
        onOpenChange={(open) => !open && setCompletingOrder(null)}
      />
      <OrderDetailsDialog
        order={viewingOrder}
        onOpenChange={(open) => !open && setViewingOrder(null)}
      />
    </div>
  );
}
