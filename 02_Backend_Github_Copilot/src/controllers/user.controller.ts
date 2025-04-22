import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { OTP } from "../models/otp.model";
import { withTransaction } from "../utils/transaction.utils";
import { generateOTP } from '../utils/otp.utils';
import { resolvePendingInvitations } from '../controllers/innerCircle.controller';
import { sendSMS } from '../utils/sms.utils';

export const register = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobile,
      password,
      gender,
      address,
      state,
      pincode,
    } = req.body;

    await withTransaction(async (session) => {
      // Check if user exists (including soft-deleted users)
      const existingUser = await User.findOne({
        $or: [{ email }, { mobile }],
      }).session(session);

      if (existingUser) {
        if (existingUser.isActive && !existingUser.isDeleted) {
          return res.status(400).json({
            message: existingUser.email === email ? 'Email already exists' : 'Mobile number already exists',
          });
        }
        // If user exists but is soft-deleted, update instead of creating new
        existingUser.firstName = firstName;
        existingUser.lastName = lastName;
        existingUser.password = await bcrypt.hash(password, 10);
        existingUser.isActive = true;
        existingUser.isDeleted = false;
        existingUser.deletedAt = undefined;
        await existingUser.save({ session });
        return res.status(200).json({ message: 'User re-registered successfully' });
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        firstName,
        lastName,
        email,
        mobile,
        password: hashedPassword,
        gender,
        address,
        state,
        pincode,
        isActive: true,
        isDeleted: false,
      });

      await user.save({ session });

      // Generate and send OTP
      const otp = generateOTP();
      await OTP.create({
        userId: user._id,
        type: "email",
        code: otp,
        expiresAt: new Date(
          Date.now() +
            parseInt(process.env.OTP_EXPIRATION_MINUTES as string) * 60000
        ),
      });
      await sendSMS(mobile, `Your verification code is: ${otp}`);

      // Generate OTP for mobile verification
      const mobileOTP = generateOTP();
      await OTP.create({
        userId: user._id,
        type: "mobile",
        code: mobileOTP,
        expiresAt: new Date(
          Date.now() +
            parseInt(process.env.OTP_EXPIRATION_MINUTES as string) * 60000
        ),
      });
      // Resolve any pending invitations
      await resolvePendingInvitations(user._id, mobile, firstName);
      // TODO: Send OTPs via email and SMS

      res.status(201).json({
        message: "User registered successfully. Please verify your email and mobile number.",
        userId: user._id,
      });
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("email-->" + email + "<--");
    const user = await User.findOne({
      email,
      isDeleted: false,
      isActive: true,
    });
    console.log("user-->" + user + "<--");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        isEmailVerified: user.isEmailVerified,
        isMobileVerified: user.isMobileVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { userId, type, code } = req.body;

    const otp = await OTP.findOne({
      userId,
      type,
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Update user verification status
    const updateField =
      type === "email" ? "isEmailVerified" : "isMobileVerified";
    await User.findByIdAndUpdate(userId, { [updateField]: true });

    // Mark OTP as used
    otp.isUsed = true;
    await otp.save();

    res.json({ message: `${type} verified successfully` });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { userId, type } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already verified
    if (
      (type === "email" && user.isEmailVerified) ||
      (type === "mobile" && user.isMobileVerified)
    ) {
      return res.status(400).json({ message: `${type} is already verified` });
    }

    // Check retry limit
    const recentOTP = await OTP.findOne({
      userId,
      type,
      lastRetryAt: {
        $gt: new Date(
          Date.now() -
            parseInt(process.env.OTP_COOLDOWN_MINUTES as string) * 60000
        ),
      },
    });

    if (recentOTP) {
      return res.status(429).json({
        message: `Please wait ${process.env.OTP_COOLDOWN_MINUTES} minutes before requesting a new OTP`,
      });
    }

    // Generate new OTP
    const newOTP = generateOTP();
    await OTP.create({
      userId,
      type,
      code: newOTP,
      expiresAt: new Date(
        Date.now() +
          parseInt(process.env.OTP_EXPIRATION_MINUTES as string) * 60000
      ),
      lastRetryAt: new Date(),
    });

    // TODO: Send new OTP via email or SMS

    res.json({ message: `New ${type} OTP sent successfully` });
  } catch (error) {
    console.log("Error resending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobile,
      gender,
      profileUrl,
      address,
      state,
      pincode,
    } = req.body;
    const userId = req.user._id;

    const updates: any = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (mobile) updates.mobile = mobile;
    if (profileUrl) updates.profileUrl = profileUrl;

    if (gender) updates.gender = gender;
    if (address) updates.address = address;
    if (state) updates.state = state;
    if (pincode) updates.pincode = pincode;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender,
        profileUrl: user.profileUrl,
        address: user.address,
        state: user.state,
        pincode: user.pincode,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const softDelete = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User soft deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const reinstate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User reinstated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const activate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User activated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deactivate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
