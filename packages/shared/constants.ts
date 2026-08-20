export const ORDER_STATUSES = ['new', 'in_progress', 'done'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ROLE_CODES = ['operator', 'team'] as const;
export type RoleCode = (typeof ROLE_CODES)[number];
