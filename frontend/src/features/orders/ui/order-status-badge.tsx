import type { OrderStatus } from '@task-orders/shared';

import { Badge } from '@/shared/ui/badge';
import { ORDER_STATUS_LABELS } from '../lib/format';

const VARIANT_BY_STATUS: Record<OrderStatus, 'secondary' | 'default' | 'outline'> = {
  new: 'secondary',
  in_progress: 'default',
  done: 'outline',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={VARIANT_BY_STATUS[status]} className="capitalize">
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
