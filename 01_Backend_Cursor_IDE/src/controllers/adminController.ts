import { Request, Response, NextFunction } from "express";
import adminService from "../services/adminService";
import { IAdminCreateRequest, IAdminUpdateRequest } from "../types/rbac.types";
import { AppError } from "../utils/AppError";

class AdminController {
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const adminData: IAdminCreateRequest = req.body;
      const createdBy = req.user?.id;

      if (!createdBy) {
        throw new AppError("Authentication required", 401);
      }

      const admin = await adminService.createAdmin(adminData, createdBy);

      res.status(201).json({
        status: "success",
        data: admin,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.params.id;
      const updateData: IAdminUpdateRequest = req.body;
      const updatedBy = req.user?.id;

      if (!updatedBy) {
        throw new AppError("Authentication required", 401);
      }

      const admin = await adminService.updateAdmin(
        adminId,
        updateData,
        updatedBy
      );

      res.status(200).json({
        status: "success",
        data: admin,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await adminService.getAdmins();

      res.status(200).json({
        status: "success",
        data: admins,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAdminById(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.params.id;
      const admin = await adminService.getAdminById(adminId);

      res.status(200).json({
        status: "success",
        data: admin,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
