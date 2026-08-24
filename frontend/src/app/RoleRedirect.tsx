import { Navigate } from 'react-router';

import { useAuth } from '@/features/auth/model/context';
import { homePathForRole } from './paths';

/** Перенаправляет пользователя на его домашний раздел в зависимости от роли. */
export function RoleRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={homePathForRole(user.role.code)} replace />;
}
