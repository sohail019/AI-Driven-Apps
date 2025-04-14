import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import authService from "../../src/services/authService";
import {
  register,
  login,
  refreshToken,
  verifyEmail,
} from "../../src/controllers/authController";
import { AppError } from "../../src/utils/AppError";
import {
  IAuthResponse,
  IRegisterRequest,
  ILoginRequest,
  IRefreshTokenRequest,
  IEmailVerificationResponse,
} from "../../src/types/auth.types";

// Mock the authService
jest.mock("../../src/services/authService", () => ({
  __esModule: true,
  default: {
    registerUser: jest.fn<() => Promise<IAuthResponse>>(),
    loginUser: jest.fn<() => Promise<IAuthResponse>>(),
    refreshAccessToken: jest.fn<() => Promise<string>>(),
    verifyEmail: jest.fn<() => Promise<IEmailVerificationResponse>>(),
  },
}));

describe("Auth Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock request
    mockRequest = {
      body: {},
      params: {},
    };

    // Setup mock response
    mockResponse = {
      status: jest.fn().mockReturnThis() as unknown as Response["status"],
      json: jest.fn().mockReturnThis() as unknown as Response["json"],
    };

    // Setup mock next function
    mockNext = jest.fn();
  });

  describe("register", () => {
    const mockUserData: IRegisterRequest = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      mobile: "1234567890",
    };

    const mockAuthResponse: IAuthResponse = {
      user: {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        mobile: "1234567890",
        isVerified: false,
      },
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    };

    it("should register user successfully", async () => {
      // Setup
      mockRequest.body = mockUserData;
      const mockRegisterUser = authService.registerUser as jest.Mock<
        () => Promise<IAuthResponse>
      >;
      mockRegisterUser.mockResolvedValue(mockAuthResponse);

      // Execute
      await register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockRegisterUser).toHaveBeenCalledWith(mockUserData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: mockAuthResponse,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle registration error", async () => {
      // Setup
      mockRequest.body = mockUserData;
      const mockError = new AppError("Email already exists", 409);
      const mockRegisterUser = authService.registerUser as jest.Mock<
        () => Promise<IAuthResponse>
      >;
      mockRegisterUser.mockRejectedValue(mockError);

      // Execute
      await register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockRegisterUser).toHaveBeenCalledWith(mockUserData);
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    const mockLoginData: ILoginRequest = {
      email: "test@example.com",
      password: "password123",
    };

    const mockAuthResponse: IAuthResponse = {
      user: {
        id: "1",
        username: "testuser",
        email: "test@example.com",
        mobile: "1234567890",
        isVerified: true,
      },
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    };

    it("should login user successfully", async () => {
      // Setup
      mockRequest.body = mockLoginData;
      const mockLoginUser = authService.loginUser as jest.Mock<
        () => Promise<IAuthResponse>
      >;
      mockLoginUser.mockResolvedValue(mockAuthResponse);

      // Execute
      await login(mockRequest as Request, mockResponse as Response, mockNext);

      // Verify
      expect(mockLoginUser).toHaveBeenCalledWith(
        mockLoginData.email,
        mockLoginData.password
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: mockAuthResponse,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle login error", async () => {
      // Setup
      mockRequest.body = mockLoginData;
      const mockError = new AppError("Invalid credentials", 401);
      const mockLoginUser = authService.loginUser as jest.Mock<
        () => Promise<IAuthResponse>
      >;
      mockLoginUser.mockRejectedValue(mockError);

      // Execute
      await login(mockRequest as Request, mockResponse as Response, mockNext);

      // Verify
      expect(mockLoginUser).toHaveBeenCalledWith(
        mockLoginData.email,
        mockLoginData.password
      );
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe("refreshToken", () => {
    const mockRefreshData: IRefreshTokenRequest = {
      refreshToken: "mock-refresh-token",
    };

    it("should refresh token successfully", async () => {
      // Setup
      mockRequest.body = mockRefreshData;
      const mockRefreshAccessToken =
        authService.refreshAccessToken as jest.Mock<() => Promise<string>>;
      mockRefreshAccessToken.mockResolvedValue("new-access-token");

      // Execute
      await refreshToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockRefreshAccessToken).toHaveBeenCalledWith(
        mockRefreshData.refreshToken
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: { accessToken: "new-access-token" },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle refresh token error", async () => {
      // Setup
      mockRequest.body = mockRefreshData;
      const mockError = new AppError("Invalid refresh token", 401);
      const mockRefreshAccessToken =
        authService.refreshAccessToken as jest.Mock<() => Promise<string>>;
      mockRefreshAccessToken.mockRejectedValue(mockError);

      // Execute
      await refreshToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockRefreshAccessToken).toHaveBeenCalledWith(
        mockRefreshData.refreshToken
      );
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe("verifyEmail", () => {
    const mockVerificationResponse: IEmailVerificationResponse = {
      message: "Email verified successfully",
      user: {
        id: "1",
        email: "test@example.com",
        isVerified: true,
      },
    };

    it("should verify email successfully", async () => {
      // Setup
      mockRequest.params = { token: "verification-token" };
      const mockVerifyEmail = authService.verifyEmail as jest.Mock<
        () => Promise<IEmailVerificationResponse>
      >;
      mockVerifyEmail.mockResolvedValue(mockVerificationResponse);

      // Execute
      await verifyEmail(
        mockRequest as Request<{ token: string }>,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockVerifyEmail).toHaveBeenCalledWith("verification-token");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: "success",
        data: mockVerificationResponse,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle verification error", async () => {
      // Setup
      mockRequest.params = { token: "invalid-token" };
      const mockError = new AppError("Invalid verification token", 400);
      const mockVerifyEmail = authService.verifyEmail as jest.Mock<
        () => Promise<IEmailVerificationResponse>
      >;
      mockVerifyEmail.mockRejectedValue(mockError);

      // Execute
      await verifyEmail(
        mockRequest as Request<{ token: string }>,
        mockResponse as Response,
        mockNext
      );

      // Verify
      expect(mockVerifyEmail).toHaveBeenCalledWith("invalid-token");
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});
