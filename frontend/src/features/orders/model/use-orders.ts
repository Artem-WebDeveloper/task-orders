import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateOrderDto, OrderStatus, UpdateOrderDto } from '@task-orders/shared';

import * as ordersApi from '@/api/orders.api';

export const ordersQueryKey = ['orders'] as const;

export function useOrders() {
  return useQuery({
    queryKey: ordersQueryKey,
    queryFn: ordersApi.listOrders,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateOrderDto) => ordersApi.createOrder(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
  });
}

export function useUpdateOrder(uuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateOrderDto) => ordersApi.updateOrder(uuid, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => ordersApi.deleteOrder(uuid),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
  });
}

export function useChangeOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, status }: { uuid: string; status: OrderStatus }) =>
      ordersApi.changeOrderStatus(uuid, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
  });
}
