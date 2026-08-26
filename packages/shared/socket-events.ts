export const SOCKET_EVENTS = {
  ORDER_CREATED: 'order:created',
  ORDER_STATUS_CHANGED: 'order:status_changed',
  ORDER_ASSIGNED: 'order:assigned',
  ORDER_DELETED: 'order:deleted',
} as const;

export type OrderSocketPayload = {
  orderId: string;
};
