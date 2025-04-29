import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/auth/admin/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import PagesList from "../pages/cms/PagesList";
import PageEditor from "../pages/cms/PageEditor";
import Settings from "../pages/Settings";
import UsersList from "../pages/users/UsersList";
import ChartPage from "../pages/ChartPage";
import BooksPage from "../pages/books/BooksPage";
import SubscriptionPage from "../pages/cms/SubscriptionPage";
import FreeFeaturesPage from "../pages/cms/FreeFeaturesPage";

// Auth Guard
import AccessGuard from "../components/auth/AccessGuard";
import SuperAdminLogin from "@/pages/auth/superadmin/Login";
import AdminsList from "@/pages/admins/AdminsList";
import AISpotifyPage from "@/pages/AISpotifyPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";

// Protected route wrapper - only accessible when authenticated
const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Public route wrapper - only accessible when not authenticated
const PublicRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: "/", element: <Navigate to="/dashboard" replace /> },
          {
            path: "dashboard",
            element: (
              <AccessGuard requiredAccess="SuperAdmin">
                <DashboardPage />
              </AccessGuard>
            ),
          },
          { path: "profile", element: <Profile /> },
          { path: "settings", element: <Settings /> },
          { path: "charts", element: <ChartPage /> },
          { path: "books", element: <BooksPage /> },
          {
            path: "ai-spotify",
            element: <AISpotifyPage />,
          },
          {
            path: "users",
            element: <UsersList />,
          },
          {
            path: "admins",
            element: (
              <AccessGuard requiredAccess="SuperAdmin">
                <AdminsList />
              </AccessGuard>
            ),
          },
          {
            path: "users/create",
            element: (
              <AccessGuard requiredAccess="SuperAdmin">
                <div>Create User Page</div>
              </AccessGuard>
            ),
          },
          {
            path: "users/edit/:id",
            element: (
              <AccessGuard requiredAccess="SuperAdmin">
                <div>Edit User Page</div>
              </AccessGuard>
            ),
          },
          {
            path: "cms",
            children: [
              {
                path: "pages",
                element: <PagesList />,
              },
              {
                path: "pages/new",
                element: (
                  <AccessGuard requiredAccess="pages">
                    <PageEditor />
                  </AccessGuard>
                ),
              },
              {
                path: "pages/:id",
                element: (
                  <AccessGuard requiredAccess="pages">
                    <PageEditor />
                  </AccessGuard>
                ),
              },
              {
                path: "subscriptions",
                element: (
                  <AccessGuard requiredAccess="SuperAdmin">
                    <SubscriptionPage />
                  </AccessGuard>
                ),
              },
              {
                path: "free-features",
                element: (
                  <AccessGuard requiredAccess="SuperAdmin">
                    <FreeFeaturesPage />
                  </AccessGuard>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "superadmin-login", element: <SuperAdminLogin /> },
          { path: "register", element: <Register /> },
          { path: "forgot-password", element: <ForgotPassword /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
