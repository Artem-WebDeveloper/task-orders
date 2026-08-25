import type {
  CreateOrderDto,
  OrderStatus,
  UpdateOrderDto,
} from '@task-orders/shared';
import type { z } from 'zod';

import { changeOrderStatusSchema } from '@task-orders/shared';

import { requestData, request } from '@/shared/api/http';
import type { ApiOrder } from '@/shared/api/types';

export type ChangeOrderStatusDto = z.infer<typeof changeOrderStatusSchema>;

export async function listOrders(): Promise<ApiOrder[]> {
  const data = await requestData<{ orders: ApiOrder[] }>('orders');
  return data.orders;
}

export async function getOrder(uuid: string): Promise<ApiOrder> {
  const data = await requestData<{ order: ApiOrder }>(`orders/${uuid}`);
  return data.order;
}

export async function createOrder(dto: CreateOrderDto): Promise<ApiOrder> {
  const data = await requestData<{ order: ApiOrder }>('orders', { method: 'POST', body: dto });
  return data.order;
}

export async function updateOrder(uuid: string, dto: UpdateOrderDto): Promise<ApiOrder> {
  const data = await requestData<{ order: ApiOrder }>(`orders/${uuid}`, {
    method: 'PATCH',
    body: dto,
  });
  return data.order;
}

export async function deleteOrder(uuid: string): Promise<void> {
  await request<void>(`orders/${uuid}`, { method: 'DELETE' });
}

export async function changeOrderStatus(uuid: string, status: OrderStatus): Promise<ApiOrder> {
  const data = await requestData<{ order: ApiOrder }>(`orders/${uuid}/status`, {
    method: 'PATCH',
    body: { status } satisfies ChangeOrderStatusDto,
  });
  return data.order;
}
