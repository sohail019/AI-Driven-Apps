import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import socialAuthService from "../services/socialAuthService";
import User from "../models/User";

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findOne({ id });
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `${process.env.APP_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { user, isNewUser, requiresMobileNumber } =
          await socialAuthService.handleGoogleAuth(profile);
        done(null, { user, isNewUser, requiresMobileNumber });
      } catch (error) {
        done(error, false);
      }
    }
  )
);
