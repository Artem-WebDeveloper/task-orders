import { Pencil, Trash2 } from "lucide-react";

import type { ApiOrder } from "@/shared/api/types";
import { formatExecutionAt } from "../lib/format";
import { OrderStatusBadge } from "./OrderStatusBadge";

import { Button } from "@/shared/ui/button";
import {
  TableCell,
  TableRow,
} from "@/shared/ui/table";

interface OrderRowProps {
  order: ApiOrder;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function OrderRow({ order, onClick, onEdit, onDelete }: OrderRowProps) {
  return (
    <TableRow
      tabIndex={0}
      className="cursor-pointer"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <TableCell className="whitespace-nowrap">
        {formatExecutionAt(order.executionAt)}
      </TableCell>
      <TableCell className="max-w-48 truncate font-medium">
        {order.address}
      </TableCell>
      <TableCell className="hidden sm:table-cell max-w-72 whitespace-normal">
        <p className="text-muted-foreground line-clamp-1 wrap-anywhere">
          {order.description}
        </p>
      </TableCell>
      <TableCell>
        <OrderStatusBadge status={order.status} />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {order.assignee?.fullname ?? "—"}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Редактировать"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
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
            onDelete();
          }}
        >
          <Trash2 className="text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
