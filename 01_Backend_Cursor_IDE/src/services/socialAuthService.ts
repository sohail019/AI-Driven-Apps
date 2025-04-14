import { IUser } from "../models/User";
import User from "../models/User";
import { AppError } from "../utils/AppError";
import { v4 as uuidv4 } from "uuid";

class SocialAuthService {
  /**
   * Handle Google OAuth authentication
   * @param profile - Google profile data
   * @returns User data and tokens
   */
  async handleGoogleAuth(profile: any): Promise<{
    user: IUser;
    isNewUser: boolean;
    requiresMobileNumber: boolean;
  }> {
    try {
      // Check if user exists with this email
      let user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // User exists, check if they have a mobile number
        return {
          user,
          isNewUser: false,
          requiresMobileNumber: !user.mobile,
        };
      }

      // Create new user
      user = new User({
        id: uuidv4(),
        username: profile.displayName,
        email: profile.emails[0].value,
        password: uuidv4(), // Generate random password for social auth
        isVerified: true, // Google verified email
        mobileNumber: null, // Will be collected later
      });

      await user.save();

      return {
        user,
        isNewUser: true,
        requiresMobileNumber: true,
      };
    } catch (error) {
      console.error("Google auth error:", error);
      throw new AppError("Failed to process Google authentication", 500);
    }
  }

  /**
   * Update user's mobile number after social auth
   * @param userId - User ID
   * @param mobileNumber - Mobile number to add
   */
  async updateMobileNumber(
    userId: string,
    mobileNumber: string
  ): Promise<IUser> {
    try {
      const user = await User.findOne({ id: userId });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // Check if mobile number is already taken
      const existingUser = await User.findOne({ mobileNumber });
      if (existingUser && existingUser.id !== userId) {
        throw new AppError("Mobile number already in use", 400);
      }

      user.mobile = mobileNumber;
      await user.save();

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to update mobile number", 500);
    }
  }
}

export default new SocialAuthService();
