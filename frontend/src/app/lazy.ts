import { lazy } from "react";

export const LoginPage = lazy(() => import("@/pages/LoginPage"));
export const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
export const OperatorOrdersPage = lazy(() => import("@/pages/OperatorOrdersPage"));
export const OperatorTeamsPage = lazy(() => import("@/pages/OperatorTeamsPage"));
export const TeamOrdersPage = lazy(() => import("@/pages/TeamOrdersPage"));
