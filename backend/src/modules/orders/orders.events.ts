import { SOCKET_EVENTS } from '@task-orders/shared';
import { io } from '../../sockets/index.ts';

export const emitOrderStatusChanged = (orderId: string, assigneeUuid?: string | null) => {
  io.to('operators').emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, orderId);
  if (assigneeUuid) {
    io.to(`team:${assigneeUuid}`).emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, orderId);
  }
};

export const emitOrderCreated = (orderId: string, assigneeUuid?: string | null) => {
  if (assigneeUuid) {
    io.to(`team:${assigneeUuid}`).emit(SOCKET_EVENTS.ORDER_CREATED, orderId);
  }
};

export const emitOrderDeleted = (orderId: string, assigneeUuid?: string | null) => {
  if (assigneeUuid) {
    io.to(`team:${assigneeUuid}`).emit(SOCKET_EVENTS.ORDER_DELETED, orderId);
  }
};

export const emitOrderAssigned = (orderId: string, assigneeUuid: string) => {
  io.to(`team:${assigneeUuid}`).emit(SOCKET_EVENTS.ORDER_ASSIGNED, orderId);
};
