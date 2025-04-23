import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { UserRole } from "../../store/slices/authSlice";

interface AccessGuardProps {
  children: ReactNode;
  requiredAccess?: string;
  requiredRole?: UserRole;
  fallback?: string;
}

/**
 * AccessGuard - A component that controls access to routes based on user role and permissions
 *
 * @param children - The protected content
 * @param requiredAccess - The specific access/module name required to view this content
 * @param requiredRole - A specific role required to view this content
 * @param fallback - The route to redirect to if access is denied (defaults to "/access-denied")
 */
const AccessGuard = ({
  children,
  requiredAccess,
  requiredRole,
  fallback = "/access-denied",
}: AccessGuardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);

  // If no user, we shouldn't be here
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Superadmin can access everything
  if (user.role === "superadmin") {
    return <>{children}</>;
  }

  // Role check: if specific role is required
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={fallback} replace />;
  }

  // Access check: if specific module access is required
  if (requiredAccess && !user.accessTo.includes(requiredAccess)) {
    return <Navigate to={fallback} replace />;
  }

  // If no specific access is required, or user has the required access
  return <>{children}</>;
};

export default AccessGuard;
