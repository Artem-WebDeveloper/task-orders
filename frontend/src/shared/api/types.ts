import type { OrderStatus, RoleCode } from '@task-orders/shared';


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


export interface ApiOrder {
  uuid: string;
  executionAt: string;
  address: string;
  description: string;
  status: OrderStatus;
  assignee: ApiUser | null;
}
