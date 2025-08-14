import { Request, Response } from 'express';
import { AuthService } from '../../services/auth/authService';
import { sendSuccess, sendError } from '../../utils/response';
import { Logger } from '../../utils/logger';
import { OTPType } from '../../types/auth';

const authService = new AuthService();

export class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.register(req.body);
      
      Logger.info('User registered successfully', { email: req.body.email });
      sendSuccess(res, result.message, result.user, 201);
      
    } catch (error: any) {
      Logger.error('Registration failed', error);
      sendError(res, error.message, 400);
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      
      Logger.info('User logged in successfully', { userId: result.user.id });
      sendSuccess(res, 'Login successful', result);
      
    } catch (error: any) {
      Logger.error('Login failed', error);
      sendError(res, error.message, 401);
    }
  }

  public async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);
      
      sendSuccess(res, 'Tokens refreshed successfully', tokens);
      
    } catch (error: any) {
      Logger.error('Token refresh failed', error);
      sendError(res, error.message, 401);
    }
  }

  public async logout(req: Request, res: Response): Promise<void> {
    try {
      const accessToken = req.headers.authorization?.replace('Bearer ', '') || '';
      const { refreshToken } = req.body;
      
      await authService.logout(accessToken, refreshToken);
      
      Logger.info('User logged out successfully', { userId: req.user?._id });
      sendSuccess(res, 'Logout successful');
      
    } catch (error: any) {
      Logger.error('Logout failed', error);
      sendError(res, error.message, 400);
    }
  }

  public async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { userId, code, type } = req.body;
      await authService.verifyOTP(userId, code, type as OTPType);
      
      Logger.info('OTP verified successfully', { userId, type });
      sendSuccess(res, 'OTP verification successful');
      
    } catch (error: any) {
      Logger.error('OTP verification failed', error);
      sendError(res, error.message, 400);
    }
  }

  public async resendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { userId, type } = req.body;
      await authService.resendOTP(userId, type as OTPType);
      
      Logger.info('OTP resent successfully', { userId, type });
      sendSuccess(res, 'OTP sent successfully');
      
    } catch (error: any) {
      Logger.error('OTP resend failed', error);
      sendError(res, error.message, 400);
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { identifier } = req.body;
      await authService.forgotPassword(identifier);
      
      Logger.info('Password reset initiated', { identifier });
      sendSuccess(res, 'Password reset code sent to your email');
      
    } catch (error: any) {
      Logger.error('Forgot password failed', error);
      sendError(res, error.message, 400);
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, otp, newPassword } = req.body;
      await authService.resetPassword(identifier, otp, newPassword);
      
      Logger.info('Password reset successful', { identifier });
      sendSuccess(res, 'Password reset successful');
      
    } catch (error: any) {
      Logger.error('Password reset failed', error);
      sendError(res, error.message, 400);
    }
  }
}

export const authController = new AuthController();