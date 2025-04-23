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
import Dashboard from "../pages/Dashboard";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import PagesList from "../pages/cms/PagesList";
import PageEditor from "../pages/cms/PageEditor";
import Settings from "../pages/Settings";
import AccessDenied from "../pages/AccessDenied";
import UsersList from "../pages/users/UsersList";

// Auth Guard
import AccessGuard from "../components/auth/AccessGuard";

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
          { path: "dashboard", element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
          { path: "settings", element: <Settings /> },
          //   {
          //     path: "users",
          //     element: (
          //       <AccessGuard requiredRole="admin">
          //         <UsersList />
          //       </AccessGuard>
          //     ),
          //   },
          {
            path: "users",
            element: <UsersList />,
          },

          {
            path: "users/create",
            element: (
              <AccessGuard requiredRole="admin">
                <div>Create User Page</div>
              </AccessGuard>
            ),
          },
          {
            path: "users/edit/:id",
            element: (
              <AccessGuard requiredRole="admin">
                <div>Edit User Page</div>
              </AccessGuard>
            ),
          },
          {
            path: "cms",
            children: [
              {
                path: "pages",
                element: (
                  <AccessGuard requiredAccess="pages">
                    <PagesList />
                  </AccessGuard>
                ),
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
            ],
          },
          // Add additional protected routes here as needed
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
          { path: "register", element: <Register /> },
          { path: "forgot-password", element: <ForgotPassword /> },
        ],
      },
    ],
  },
  { path: "access-denied", element: <AccessDenied /> },
  { path: "*", element: <NotFound /> },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
