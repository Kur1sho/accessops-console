import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { LoginPage } from "../pages/LoginPage";
import { UsersPage } from "../pages/UsersPage";
import { PoliciesPage } from "../pages/PoliciesPage";
import { AuditPage } from "../pages/AuditPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/users", element: <UsersPage /> },
      { path: "/policies", element: <PoliciesPage /> },
      { path: "/audit", element: <AuditPage /> },
      // default route:
      { path: "/", element: <UsersPage /> },
    ],
  },
]);
