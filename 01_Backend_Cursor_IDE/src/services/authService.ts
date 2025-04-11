import jwt from "jsonwebtoken";
import crypto from "crypto";
import User, { IUser } from "../models/User";

class AuthService {
  async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ user: IUser; token: string; verificationToken: string }> {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists");
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const user = new User({
      ...userData,
      verificationToken,
      verificationTokenExpiry,
    });
    await user.save();

    // Generate JWT token
    const token = this.generateToken(user);
    // Generate refresh token
    const refreshToken = this.generateRefreshToken(user);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationToken;
    delete userResponse.verificationTokenExpiry;

    return { user: userResponse, token, verificationToken };
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: IUser; token: string; refreshToken: string }> {
    // Find user by email
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password
    const isPasswordValid = await user.comparePassword(credentials.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw new Error("Please verify your email first");
    }

    // Generate tokens
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationToken;
    delete userResponse.verificationTokenExpiry;

    return { user: userResponse, token, refreshToken };
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired verification token");
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = resetTokenExpiry;
    await user.save();

    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;
    await user.save();
  }

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  private generateToken(user: IUser): string {
    return jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your_jwt_secret_key_here",
      { expiresIn: "15m" }
    );
  }

  private generateRefreshToken(user: IUser): string {
    return jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret_here",
      { expiresIn: "7d" }
    );
  }
}

export default new AuthService();
