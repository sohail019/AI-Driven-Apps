import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ("Admin" | "SuperAdmin")[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, userType } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) {
    const loginPath =
      userType === "Admin" ? "/admin-login" : "/superadmin-login";
    return <Navigate to={loginPath} replace />;
  }

  // SuperAdmin has access to everything
  if (userType === "SuperAdmin") {
    return <>{children}</>;
  }

  if (!allowedRoles.includes(userType!)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
