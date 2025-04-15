import { Request, Response } from "express";
import { SuperAdmin } from "../models/SuperAdmin";
import { IErrorResponse, ISuccessResponse } from "../types/response.types";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const superadminController = {
  async register(req: Request, res: Response) {
    try {
      const { username, email, password, mobile } = req.body;

      // Check if superadmin already exists
      const existingSuperAdmin = await SuperAdmin.findOne({
        $or: [{ email }, { username }],
      });

      if (existingSuperAdmin) {
        return res.status(400).json({
          success: false,
          error: "Superadmin already exists",
        });
      }

      // Create new superadmin
      const superadmin = await SuperAdmin.create({
        username,
        email,
        password,
        mobile,
      });

      res.status(201).json({
        success: true,
        data: superadmin,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to create superadmin",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Find superadmin by email
      const superadmin = await SuperAdmin.findOne({ email }).select(
        "+password"
      );

      if (!superadmin) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Check password
      const isPasswordValid = await superadmin.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { id: superadmin._id, role: "superadmin" },
        config.jwtSecret || "your-secret-key",
        { expiresIn: "1d" }
      );

      const refreshToken = jwt.sign(
        { id: superadmin._id, role: "superadmin" },
        config.jwtSecret || "your-secret-key",
        { expiresIn: "7d" }
      );

      // Save refresh token
      superadmin.refreshToken = refreshToken;
      await superadmin.save();

      res.status(200).json({
        success: true,
        data: {
          accessToken,
          refreshToken,
          superadmin: {
            id: superadmin._id,
            username: superadmin.username,
            email: superadmin.email,
            mobile: superadmin.mobile,
            isVerified: superadmin.isVerified,
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to login",
      });
    }
  },
};
