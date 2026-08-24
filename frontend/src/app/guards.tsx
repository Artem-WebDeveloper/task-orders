import { Navigate, Outlet } from 'react-router';
import type { RoleCode } from '@task-orders/shared';

import { useAuth } from '@/features/auth/model/context';
import { homePathForRole } from './paths';

import { Spinner } from './Spinner';

/** Пропускает только авторизованных, остальных отправляет на логин. */
export function RequireAuth() {
  const { status } = useAuth();

  if (status === 'loading') return <Spinner label="Загрузка..." />;
  if (status === 'unauthenticated') return <Navigate to="/login" replace />;

  return <Outlet />;
}

/** Уже авторизованным на странице логина делать нечего. */
export function GuestGuard() {
  const { status, user } = useAuth();

  if (status === 'loading') return <Spinner label="Загрузка..." />;
  if (status === 'authenticated' && user) {
    return <Navigate to={homePathForRole(user.role.code)} replace />;
  }

  return <Outlet />;
}

/** Пропускает только пользователей с указанной ролью. */
export function RequireRole({ role }: { role: RoleCode }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role.code !== role) {
    return <Navigate to={homePathForRole(user.role.code)} replace />;
  }

  return <Outlet />;
}
