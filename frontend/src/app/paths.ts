import type { RoleCode } from '@task-orders/shared';

export function homePathForRole(role: RoleCode): string {
  return role === 'operator' ? '/operator/orders' : '/team/orders';
}
