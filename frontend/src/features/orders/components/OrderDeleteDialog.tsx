import { useState } from 'react';

import type { ApiOrder } from '@/shared/api/types';
import { useDeleteOrder } from '../hooks/useOrders';
import { formatExecutionAt } from '../lib/format';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';

interface OrderDeleteDialogProps {
  order: ApiOrder | null;
  onOpenChange: (open: boolean) => void;
}

export function OrderDeleteDialog({ order, onOpenChange }: OrderDeleteDialogProps) {
  const deleteMutation = useDeleteOrder();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!order) return;
    try {
      await deleteMutation.mutateAsync(order.uuid);
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось удалить наряд');
    }
  };

  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Удалить наряд?</DialogTitle>
          <DialogDescription>
            Наряд по адресу «{order?.address}» от {order && formatExecutionAt(order.executionAt)}
            будет удалён безвозвратно.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Удаляем...' : 'Удалить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
