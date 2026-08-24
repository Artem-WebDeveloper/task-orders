import type { OrderStatus, RoleCode } from '@task-orders/shared';

/** Пользователь в том виде, в котором его отдаёт бэкенд (JSON сущности User). */
export interface ApiUser {
  uuid: string;
  fullname: string;
  phone: string;
  role: {
    id: number;
    name: string;
    code: RoleCode;
  };
}

/** Наряд в том виде, в котором его отдаёт бэкенд (JSON сущности Order). */
export interface ApiOrder {
  uuid: string;
  executionAt: string;
  address: string;
  description: string;
  status: OrderStatus;
  assignee: ApiUser | null;
}
