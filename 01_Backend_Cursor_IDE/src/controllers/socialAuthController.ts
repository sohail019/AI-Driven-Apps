import { Request, Response, NextFunction } from "express";
import passport from "passport";
import socialAuthService from "../services/socialAuthService";
import authService from "../services/authService";
import { AppError } from "../utils/AppError";

/**
 * Initiate Google OAuth
 * @route GET /api/auth/google
 */
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

/**
 * Google OAuth callback
 * @route GET /api/auth/google/callback
 */
export const googleAuthCallback = passport.authenticate("google", {
  failureRedirect: "/login",
  session: false,
});

/**
 * Handle Google OAuth success
 * @route GET /api/auth/google/success
 */
export const googleAuthSuccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, isNewUser, requiresMobileNumber } = req.user as any;
    // Generate tokens
    const { token, refreshToken } = await authService.generateAuthTokens(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          mobileNumber: user.mobileNumber,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        token,
        refreshToken,
        isNewUser,
        requiresMobileNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update mobile number after social auth
 * @route POST /api/auth/social/mobile
 */
export const updateSocialAuthMobile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, mobileNumber } = req.body;

    if (!userId || !mobileNumber) {
      throw new AppError("User ID and mobile number are required", 400);
    }

    const user = await socialAuthService.updateMobileNumber(
      userId,
      mobileNumber
    );

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          mobileNumber: user.mobile,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
