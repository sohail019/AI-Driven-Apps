import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SuperAdmin } from '../models/superAdmin.model';
import { Admin } from '../models/admin.model';
import { AdminPermission } from '../models/admin.model';
import { User } from '../models/user.model';

interface JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
      role?: string;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    
    // Check if user exists and is active
    let user;
    if (decoded.role === 'super-admin') {
      user = await SuperAdmin.findOne({
        _id: decoded._id,
        isActive: true,
        isDeleted: false,
      });
    } else if (decoded.role === 'admin') {
      user = await Admin.findOne({
        _id: decoded._id,
        isActive: true,
        isDeleted: false,
      });
    }else {
      user = await User.findOne({
        _id: decoded.userId,
        isDeleted: false,
        isActive: true,
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = user;
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.role !== 'super-admin') {
    return res.status(403).json({ message: 'Super admin access required' });
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const checkPermission = (permission: AdminPermission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Super admins bypass permission checks
      if (req.role === 'super-admin') {
        return next();
      }

      // For admins, check if they have the required permission
      if (req.role === 'admin') {
        const admin = await Admin.findById(req.user._id);
        if (!admin || !admin.accessTo.includes(permission)) {
          return res.status(403).json({ message: 'Insufficient permissions' });
        }
        return next();
      }

      res.status(403).json({ message: 'Access denied' });
    } catch (error) {
      res.status(500).json({ message: 'Error checking permissions' });
    }
  };
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as JwtPayload;
    const user = await User.findOne({
      _id: decoded.userId,
      isDeleted: false,
      isActive: true,
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({ accessToken });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
}; 