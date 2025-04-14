import nodemailer from "nodemailer";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const user = process.env.SMTP_USER || "shaikhhsohail0193@gmail.com";
    const pass = process.env.SMTP_PASS || "jbmhhfvonqezhrlv";

    if (!user || !pass) {
      console.error("Email credentials are missing!");
      console.log("SMTP_USER:", user);
      console.log("SMTP_PASS exists:", !!pass);
    }

    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP connection error:", error);
      } else {
        console.log("SMTP server is ready to send emails");
      }
    });
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationUrl = `${
      process.env.APP_URL || "http://localhost:3000"
    }/api/auth/verify-email/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "shaikhhsohail0193@gmail.com",
      to,
      subject: "Email Verification - Library Management System",
      html: `
        <h1>Email Verification</h1>
        <p>Thank you for registering with our Library Management System!</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
          margin: 20px 0;
        ">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not create an account, please ignore this email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${
      process.env.APP_URL || "http://localhost:3000"
    }/api/auth/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || "shaikhhsohail0193@gmail.com",
      to,
      subject: "Password Reset - Library Management System",
      html: `
        <h1>Password Reset Request</h1>
        <p>You have requested to reset your password.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}" style="
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
          margin: 20px 0;
        ">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }
  }
}

export default new EmailService();
