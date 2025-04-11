import { Request, Response } from "express";
import authService from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const { user, token, verificationToken } = await authService.register(
      req.body
    );

    // In a real application, you would send an email with the verification link
    // For testing purposes, we'll return the verification token in the response
    res.status(201).json({
      message:
        "User registered successfully. Please check your email for verification.",
      user,
      token,
      verificationToken, // Remove this in production
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Error registering user",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token, refreshToken } = await authService.login(req.body);
    res.json({
      message: "Login successful",
      user,
      token,
      refreshToken,
    });
  } catch (error: any) {
    res.status(401).json({
      message: error.message || "Invalid credentials",
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    await authService.verifyEmail(token);
    res.json({ message: "Email verified successfully" });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Error verifying email",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const resetToken = await authService.forgotPassword(email);

    // In a real application, you would send an email with the reset link
    // For testing purposes, we'll return the reset token in the response
    res.json({
      message: "Password reset instructions sent to your email",
      resetToken, // Remove this in production
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Error processing forgot password request",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    await authService.resetPassword(token, password);
    res.json({ message: "Password reset successful" });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || "Error resetting password",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await authService.logout(req.user._id);
    res.json({ message: "Logged out successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Error logging out",
    });
  }
};
