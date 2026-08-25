import { Navigate, Outlet } from "react-router";
import type { RoleCode } from "@task-orders/shared";

import { useAuth } from "@/features/auth";
import { homePathForRole } from "./paths";

import { Spinner } from "../shared/ui/spinner";

export function RequireAuth() {
  const { status } = useAuth();

  if (status === "loading") return <Spinner label="Загрузка..." />;
  if (status === "unauthenticated") return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function GuestGuard() {
  const { status, user } = useAuth();

  if (status === "loading") return <Spinner label="Загрузка..." />;
  if (status === "authenticated" && user) {
    return <Navigate to={homePathForRole(user.role.code)} replace />;
  }

  return <Outlet />;
}

export function RequireRole({ role }: { role: RoleCode }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role.code !== role) {
    return <Navigate to={homePathForRole(user.role.code)} replace />;
  }

  return <Outlet />;
}

export function RoleHomeRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={homePathForRole(user.role.code)} replace />;
}
