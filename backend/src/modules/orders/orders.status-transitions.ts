import type { OrderStatus } from '@task-orders/shared';

const transitions: Record<OrderStatus, OrderStatus | null> = {
  new: 'in_progress',
  in_progress: 'done',
  done: null,
};

export const canTransition = (from: OrderStatus, to: OrderStatus) => {
  return transitions[from] === to;
};
