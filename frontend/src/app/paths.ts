import type { RoleCode } from "@task-orders/shared";

export const ROLE_HOME: Record<RoleCode, string> = {
  operator: "/operator/orders",
  team: "/team/orders",
};

export function homePathForRole(role: RoleCode): string {
  return ROLE_HOME[role];
}
