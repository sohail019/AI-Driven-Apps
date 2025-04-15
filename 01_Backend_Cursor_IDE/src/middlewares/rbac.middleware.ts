import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { Role, Permission } from "../types/rbac.types";
import { IAuthenticatedUser } from "../types/auth.types";

type AuthenticatedRequest = Request & { user?: IAuthenticatedUser };

export const requireRole = (roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Insufficient permissions", 403));
    }

    next();
  };
};

export const requirePermission = (permissions: Permission[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    // Superadmin has all permissions
    if (req.user.role === Role.SUPERADMIN) {
      return next();
    }

    // Check if user has all required permissions
    const hasAllPermissions = permissions.every((permission) =>
      req.user?.permissions?.includes(permission)
    );

    if (!hasAllPermissions) {
      return next(new AppError("Insufficient permissions", 403));
    }

    next();
  };
};
