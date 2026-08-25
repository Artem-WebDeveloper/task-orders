import { createBrowserRouter } from "react-router";

import { AppLayout } from "./AppLayout";
import {
  GuestGuard,
  RequireAuth,
  RequireRole,
  RoleHomeRedirect,
} from "./Guards";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { OperatorOrdersPage } from "@/pages/OperatorOrdersPage";
import { OperatorTeamsPage } from "@/pages/OperatorTeamsPage";
import { TeamOrdersPage } from "@/pages/TeamOrdersPage";

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [{ path: "/login", element: <LoginPage /> }],
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

  { path: "*", element: <NotFoundPage /> },
]);
