import { useState } from "react";
import type { OrderStatus } from "@task-orders/shared";
import { Plus } from "lucide-react";

import type { ApiOrder } from "@/shared/api/types";
import { QueryError } from "@/shared/ui/query-error";
import { formatExecutionAt, ORDER_FILTER_OPTIONS } from "../lib/format";
import { useDeleteOrder, useOrders } from "../hooks/useOrders";
import { OrderFormDialog } from "./OrderFormDialog";
import { ConfirmActionDialog } from "./ConfirmActionDialog";
import { OrderRow } from "./OrderRow";
import { OrderDetailsDialog } from "./OrderDetailsDialog";

import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import useOrderEvents from "../hooks/useOrderEvents";

type StatusFilter = "all" | OrderStatus;

export function OperatorOrders() {
  const ordersQuery = useOrders();
  const deleteOrder = useDeleteOrder();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ApiOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<ApiOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<ApiOrder | null>(null);

  useOrderEvents();

  const orders = ordersQuery.data ?? [];
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const openCreate = () => {
    setEditingOrder(null);
    setFormOpen(true);
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Наряды</h1>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value: string) =>
              setStatusFilter(value as StatusFilter)
            }
          >
            <SelectTrigger className="w-36 sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ORDER_FILTER_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openCreate}>
            <Plus data-icon="inline-start" />
            Создать наряд
          </Button>
        </div>
      </div>

      {ordersQuery.isPending && (
        <p className="text-muted-foreground text-sm">Загрузка нарядов...</p>
      )}

      {ordersQuery.error && <QueryError error={ordersQuery.error} />}

      {!ordersQuery.isPending && !ordersQuery.error && (
        <>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Адрес</TableHead>
                <TableHead className="hidden sm:table-cell">Описание</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="hidden md:table-cell">
                  Исполнитель
                </TableHead>
                <TableHead className="w-24 text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <OrderRow
                  key={order.uuid}
                  order={order}
                  onClick={() => setViewingOrder(order)}
                  onEdit={() => {
                    setEditingOrder(order);
                    setFormOpen(true);
                  }}
                  onDelete={() => setDeletingOrder(order)}
                />
              ))}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <p className="font-medium">
                {orders.length === 0
                  ? "Нарядов пока нет"
                  : "Под фильтр ничего не попало"}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {orders.length === 0
                  ? "Создайте первый наряд кнопкой выше"
                  : "Попробуйте выбрать другой статус"}
              </p>
            </div>
          )}

          <CountHint total={orders.length} shown={filteredOrders.length} />
        </>
      )}

      <OrderFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        order={editingOrder}
      />
      <ConfirmActionDialog
        open={!!deletingOrder}
        onOpenChange={(open) => !open && setDeletingOrder(null)}
        title="Удалить наряд?"
        description={
          deletingOrder
            ? `Наряд по адресу «${deletingOrder.address}» от ${formatExecutionAt(deletingOrder.executionAt)} будет удалён безвозвратно.`
            : ""
        }
        confirmLabel="Удалить"
        pendingLabel="Удаляем..."
        variant="destructive"
        onConfirm={async () => {
          if (!deletingOrder) return;
          await deleteOrder.mutateAsync(deletingOrder.uuid);
        }}
      />
      <OrderDetailsDialog
        order={viewingOrder}
        onOpenChange={(open) => !open && setViewingOrder(null)}
      />
    </div>
  );
}

function CountHint({ total, shown }: { total: number; shown: number }) {
  if (shown === total) return null;
  return (
    <p className="text-muted-foreground text-xs">
      Показано {shown} из {total}
    </p>
  );
}
