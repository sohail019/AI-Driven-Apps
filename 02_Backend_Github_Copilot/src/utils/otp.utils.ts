import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { OTP } from '../models/otp.model';

// Email configuration
const emailConfig = {
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

// Twilio configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Message templates
const messageTemplates = {
  'verification': {
    email: {
      subject: 'Account Verification OTP',
      body: (otp: string) => `Your verification OTP is: ${otp}. This OTP is valid for 5 minutes.`,
    },
    sms: (otp: string) => `Your verification OTP is: ${otp}. Valid for 5 minutes.`,
  },
  'password-reset': {
    email: {
      subject: 'Password Reset OTP',
      body: (otp: string) => `Your password reset OTP is: ${otp}. This OTP is valid for 5 minutes.`,
    },
    sms: (otp: string) => `Your password reset OTP is: ${otp}. Valid for 5 minutes.`,
  },
  'login': {
    email: {
      subject: 'Login OTP',
      body: (otp: string) => `Your login OTP is: ${otp}. This OTP is valid for 5 minutes.`,
    },
    sms: (otp: string) => `Your login OTP is: ${otp}. Valid for 5 minutes.`,
  },
};

// Generate a random 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
const sendEmailOTP = async (email: string, otp: string, purpose: string): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport(emailConfig);
    const template = messageTemplates[purpose as keyof typeof messageTemplates];

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: template.email.subject,
      text: template.email.body(otp),
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email OTP:', error);
    return false;
  }
};

// Send OTP via SMS
const sendSMSOTP = async (mobile: string, otp: string, purpose: string): Promise<boolean> => {
  try {
    const template = messageTemplates[purpose as keyof typeof messageTemplates];

    await twilioClient.messages.create({
      body: template.sms(otp),
      to: mobile,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    return true;
  } catch (error) {
    console.error('Error sending SMS OTP:', error);
    return false;
  }
};

// Main OTP sending function
export const sendOTP = async (
  email?: string,
  mobile?: string,
  purpose: string = 'verification'
): Promise<string> => {
  try {
    const otp = generateOTP();
    const results = {
      email: false,
      sms: false,
    };

    // Send OTP via email if email is provided
    if (email) {
      results.email = await sendEmailOTP(email, otp, purpose);
    }

    // Send OTP via SMS if mobile is provided
    if (mobile) {
      results.sms = await sendSMSOTP(mobile, otp, purpose);
    }

    // Check if at least one delivery method was successful
    if (!results.email && !results.sms) {
      throw new Error('Failed to send OTP via both email and SMS');
    }

    // Save OTP to database
    await OTP.create({
      otp,
      email: email || undefined,
      mobile: mobile || undefined,
      purpose,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
    });

    return otp;
  } catch (error) {
    console.error('Error in sendOTP:', error);
    throw new Error('Failed to send OTP');
  }
};

// Verify OTP
export const verifyOTP = async (
  otp: string,
  email?: string,
  mobile?: string,
  purpose?: string
): Promise<boolean> => {
  try {
    const query: any = {
      otp,
      expiresAt: { $gt: new Date() },
    };

    if (email) query.email = email;
    if (mobile) query.mobile = mobile;
    if (purpose) query.purpose = purpose;

    const validOTP = await OTP.findOne(query);

    if (!validOTP) {
      return false;
    }

    // Delete the used OTP
    await OTP.findByIdAndDelete(validOTP._id);
    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
}; 