import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "@/store"; 

interface ProtectedRouteProps {
  allowedRoles: ("Admin" | "SuperAdmin")[];
  children: React.ReactNode; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { isAuthenticated, userType } = useSelector(
    (state: RootState) => state.auth
  );

if (!isAuthenticated) {
    const loginPath = userType === "Admin" ? "/admin-login" : "/superadmin-login";
    return <Navigate to={loginPath} replace />;
}

  if (!allowedRoles.includes(userType!)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
