import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { SuperAdmin } from "../models/SuperAdmin";
import { Admin } from "../models/Admin";
import { Role } from "../types/rbac.types";
import { IAuthenticatedUser } from "../types/auth.types";

interface JwtPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthenticatedUser;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key_here"
    ) as JwtPayload;

    // Get user based on role
    let user;
    if (decoded.role === Role.SUPERADMIN) {
      user = await SuperAdmin.findById(decoded.id).select("-password");
    } else if (decoded.role === Role.ADMIN) {
      user = await Admin.findById(decoded.id).select("-password");
    } else {
      user = await User.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    if (decoded.role === Role.USER && !(user as any).isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email first" });
    }

    // Set the authenticated user with role
    req.user = {
      id: (user as any)._id.toString(),
      role: decoded.role as Role,
      ...(decoded.role !== Role.SUPERADMIN && {
        permissions: (user as any).permissions,
      }),
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    // Find user by refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Error refreshing token" });
  }
};
