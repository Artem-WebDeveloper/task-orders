import { useState } from "react";
import type { OrderStatus } from "@task-orders/shared";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { ApiError } from "@/shared/api/http";
import type { ApiOrder } from "@/shared/api/types";
import { formatExecutionAt, ORDER_STATUS_LABELS } from "../lib/format";
import { useOrders } from "../hooks/useOrders";
import { OrderFormDialog } from "./OrderFormDialog";
import { OrderDeleteDialog } from "./OrderDeleteDialog";
import { OrderStatusBadge } from "./OrderStatusBadge";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

type StatusFilter = "all" | OrderStatus;

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Все статусы" },
  ...(Object.entries(ORDER_STATUS_LABELS) as [OrderStatus, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];

export function OperatorOrders() {
  const ordersQuery = useOrders();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ApiOrder | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<ApiOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<ApiOrder | null>(null);

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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Наряды</h1>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value: string) =>
              setStatusFilter(value as StatusFilter)
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.map(({ value, label }) => (
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

      {!ordersQuery.isPending && !ordersQuery.error && (
        <>
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Дата выполнения</TableHead>
                <TableHead>Адрес</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Исполнитель</TableHead>
                <TableHead className="w-24 text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
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
                  <TableCell>{order.assignee?.fullname ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Редактировать"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingOrder(order);
                        setFormOpen(true);
                      }}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Удалить"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingOrder(order);
                      }}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
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
      <OrderDeleteDialog
        order={deletingOrder}
        onOpenChange={(open) => !open && setDeletingOrder(null)}
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
