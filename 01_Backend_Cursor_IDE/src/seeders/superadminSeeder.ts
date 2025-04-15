import User from "../models/User";
import { Role } from "../types/rbac.types";

export const checkSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({ role: Role.SUPERADMIN });
    if (!existingSuperAdmin) {
      console.warn(
        "No superadmin found. Please register a superadmin using the API."
      );
    }
  } catch (error: any) {
    console.error("Error checking superadmin:", error.message);
    throw error;
  }
};
