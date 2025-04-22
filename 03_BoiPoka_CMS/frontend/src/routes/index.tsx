import { Suspense, lazy } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import NotFound from "@/pages/errors/not-found";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import AdminRegisterPage from "@/pages/auth/admin-register";
import ChangePasswordPage from "@/pages/dashboard/profile/change-password";
import ProfilePage from "@/pages/dashboard/profile/profile";
import ProfileUpdatePage from "@/pages/dashboard/profile/update-profile";
import AddUserPage from "@/pages/users/add-user";
import FormPage from "@/pages/forms/form-page";
import { SidebarProvider } from "@/hooks/use-sidebar";
import TabPage from "@/pages/dashboard/profile/tab-page";
import AdminResetPage from "@/pages/auth/reset-password";
import AdminCheckEmail from "@/pages/auth/check-email";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ProtectedRoute from "@/components/routes/protected-route";
import UnauthorizedPage from "@/pages/errors/unauthorized";
import AdminsPage from "@/pages/admins/admins";
import CreateAdminPage from "@/pages/admins/crud/create-admin";
import UpdateAdminPage from "@/pages/admins/crud/update-admin";
import UsersPage from "@/pages/users/users";
import UpdateUserPage from "@/pages/users/update-user";
import BooksPage from "@/pages/books/books";

const AdminLoginPage = lazy(() => import("@/pages/auth/admin-login"));
const SuperAdminLoginPage = lazy(() => import("@/pages/auth/superadmin-login"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: "/",
      element: (
        <SidebarProvider>
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </SidebarProvider>
      ),
      children: [
        {
          path: "",
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: "dashboard",
          element: (
            <ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
              <Suspense fallback={<div>Loading Dashboard...</div>}>
                <DashboardPage />
              </Suspense>
            </ProtectedRoute>
          ),
        },
        {
          path: "form-page",
          element: (
            <Suspense fallback={<div>Loading Form Page...</div>}>
              <FormPage />
            </Suspense>
          ),
        },
        {
          path: "users",
          element: (
            <ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
              <UsersPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "update-user/:id",
          element: (
            <ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
              <UpdateUserPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "books",
          element: (
            <ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
              <BooksPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "admins",
          element: (
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <AdminsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "create-admin",
          element: (
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <CreateAdminPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "update-admin/:id",
          element: (
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <UpdateAdminPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "profile",
          element: <ProfilePage />,
        },
        {
          path: "change-password",
          element: <ChangePasswordPage />,
        },
        {
          path: "profile-update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "add-user",
          element: <AddUserPage />,
        },
        {
          path: "tab-page",
          element: <TabPage />,
        },
      ],
    },
  ];

  const publicRoutes = [
    {
      path: "/admin-login",
      element: (
        <Suspense fallback={<div>Loading Login...</div>}>
          <AdminLoginPage />
        </Suspense>
      ),
      index: true,
    },
    {
      path: "/admin-register",
      element: (
        <Suspense fallback={<div>Loading Register...</div>}>
          <AdminRegisterPage />
        </Suspense>
      ),
      index: true,
    },
    {
      path: "/forgot-password",
      element: (
        <Suspense fallback={<div>Loading Forgot Password...</div>}>
          <ForgotPasswordPage />
        </Suspense>
      ),
      index: true,
    },
    {
      path: "/reset-password/:token",
      element: (
        <Suspense fallback={<div>Loading Reset Password...</div>}>
          <AdminResetPage />
        </Suspense>
      ),
      index: true,
    },
    {
      path: "/check-email",
      element: (
        <Suspense fallback={<div>Loading Check Email...</div>}>
          <AdminCheckEmail />
        </Suspense>
      ),
      index: true,
    },
    {
      path: "/superadmin-login",
      element: (
        <Suspense fallback={<div>Loading Login...</div>}>
          <SuperAdminLoginPage />
        </Suspense>
      ),
      index: true,
    },
    {
      path: "/404",
      element: <NotFound />,
    },
    {
      path: "/unauthorized",
      element: <UnauthorizedPage />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ];

  // Combine dashboard and public routes and pass them to `useRoutes`
  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
