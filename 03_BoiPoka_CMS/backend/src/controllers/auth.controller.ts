import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { Admin } from '../models/admin.model';
import { SuperAdmin } from '../models/superAdmin.model';
import { sendOTP, verifyOTP } from '../utils/otp.utils';
import { withTransaction } from '../utils/transaction.utils';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, mobile } = req.body;
    const { role } = req.params;

    let model: Model<any>; // or use a base interface instead of 'any'
    
    switch (role) {
      case 'user':
        model = User;
        break;
      case 'admin':
        model = Admin;
        break;
      case 'superAdmin':
        model = SuperAdmin;
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await model.findOne({
      $or: [{ email }, { mobile }],
      isActive: true,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send OTP
    await sendOTP(email, mobile, 'password-reset');

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, mobile, otp, newPassword } = req.body;
    const { role } = req.params;

    // Verify OTP
    const isValidOTP = await verifyOTP(otp, email, mobile, 'password-reset');
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    let model: Model<any>; // or use a base interface instead of 'any'
    
    switch (role) {
      case 'user':
        model = User;
        break;
      case 'admin':
        model = Admin;
        break;
      case 'superAdmin':
        model = SuperAdmin;
        break;
      default:
        return res.status(400).json({ message: 'Invalid role' });
    }

    await withTransaction(async (session) => {
      const user = await model.findOne({
        $or: [{ email }, { mobile }],
        isActive: true,
      }).session(session);

      if (!user) {
        throw new Error('User not found');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save({ session });
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const { role } = req.params;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as any;
    if (!decoded || decoded.role !== role) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: decoded.userId, role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // In a real application, you might want to:
    // 1. Store the refresh token in a blacklist
    // 2. Clear any session data
    // 3. Update last logout time
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error during logout' });
  }
}; 