import { Suspense } from "react";
import { createBrowserRouter } from "react-router";

import { AppLayout } from "./AppLayout";
import {
  GuestGuard,
  RequireAuth,
  RequireRole,
  RoleHomeRedirect,
} from "./Guards";
import {
  LoginPage,
  NotFoundPage,
  OperatorOrdersPage,
  OperatorTeamsPage,
  TeamOrdersPage,
} from "./lazy";

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [
      {
        path: "/login",
        element: (
          <Suspense fallback={null}>
            <LoginPage />
          </Suspense>
        ),
      },
    ],
  },

  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <RoleHomeRedirect /> },

          {
            element: <RequireRole role="operator" />,
            children: [
              { path: "operator/orders", element: <OperatorOrdersPage /> },
              { path: "operator/teams", element: <OperatorTeamsPage /> },
            ],
          },

          {
            element: <RequireRole role="team" />,
            children: [{ path: "team/orders", element: <TeamOrdersPage /> }],
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: (
      <Suspense fallback={null}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
