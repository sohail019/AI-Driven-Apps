import jwt from "jsonwebtoken";
import { IAdminAuthenticatedRequest } from "../types/admin.types";

export const generateToken = (
  payload: IAdminAuthenticatedRequest,
  expiresIn: string
): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn,
  } as jwt.SignOptions);
};
