import { createBrowserRouter } from 'react-router';

import { AppLayout } from './layouts/AppLayout';
import { GuestGuard, RequireAuth, RequireRole } from './guards';
import { LoginPage } from '@/features/auth/ui/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OperatorOrdersPage } from '@/pages/operator/OrdersPage';
import { OperatorTeamsPage } from '@/pages/operator/TeamsPage';
import { TeamOrdersPage } from '@/pages/team/OrdersPage';
import { RoleRedirect } from './RoleRedirect';

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <AppLayout />,
        children: [
          { index: true, element: <RoleRedirect /> },
          {
            element: <RequireRole role="operator" />,
            children: [
              { path: 'operator/orders', element: <OperatorOrdersPage /> },
              { path: 'operator/teams', element: <OperatorTeamsPage /> },
            ],
          },
          {
            element: <RequireRole role="team" />,
            children: [{ path: 'team/orders', element: <TeamOrdersPage /> }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
