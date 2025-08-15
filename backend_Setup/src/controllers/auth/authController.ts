import { Request, Response } from 'express';
import { User } from '../../models/User';
import { jwtService } from '../../services/auth/jwtService';
import { otpService } from '../../services/auth/otpService';
import { notificationService } from '../../services/notification/notificationService';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';

export class AuthController {
  // POST /api/auth/register
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, phoneNumber, fullName } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { phoneNumber }]
      });
      
      if (existingUser) {
        res.status(400).json({
          error: 'User already exists with this email or phone number'
        });
        return;
      }
      
      // Create user
      const user = new User({
        email,
        password,
        mobile: phoneNumber,
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ').slice(1).join(' ') || fullName.split(' ')[0],
        role: 'citizen'
      });
      
      await user.save();
      
      // Generate OTP for verification
      const emailOTP = await otpService.generateOTP(email, 'email_verification');
      const phoneOTP = await otpService.generateOTP(phoneNumber, 'phone_verification');
      
      // Send verification notifications
      await Promise.all([
        notificationService.scheduleNotification({
          userId: user._id.toString(),
          userType: 'citizen',
          type: 'email',
          channel: email,
          priority: 'high',
          category: 'system',
          subject: 'Email Verification Required',
          message: `Your verification code is: ${emailOTP}`,
          metadata: { source: 'auth_service' }
        }),
        
        notificationService.scheduleNotification({
          userId: user._id.toString(),
          userType: 'citizen',
          type: 'sms',
          channel: phoneNumber,
          priority: 'high',
          category: 'system',
          message: `Your phone verification code is: ${phoneOTP}`,
          metadata: { source: 'auth_service' }
        })
      ]);
      
      await notificationService.processNotificationQueue();
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please verify your email and phone number.',
        userId: user._id,
        verificationRequired: {
          email: true,
          phone: true
        }
      });
    } catch (error: any) {
      res.status(400).json({
        error: 'Registration failed',
        message: error.message
      });
    }
  }
  
  // POST /api/auth/login
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      // Find user and include password for comparison
      const user = await User.findOne({ email }).select('+password');
      
      if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({
          error: 'Invalid credentials'
        });
        return;
      }
      
      if (!user.isActive) {
        res.status(401).json({
          error: 'Account is deactivated'
        });
        return;
      }
      
      // Generate tokens
      const tokens = jwtService.generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      });
      
      // Store refresh token
      await jwtService.storeRefreshToken(user._id.toString(), tokens.refreshToken);
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isMobileVerified: user.isMobileVerified
        },
        tokens
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Login failed',
        message: error.message
      });
    }
  }
  
  // POST /api/auth/verify-otp
  public async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, otp, purpose } = req.body;
      
      const isValid = await otpService.verifyOTP(identifier, purpose, otp);
      
      if (!isValid) {
        res.status(400).json({
          error: 'Invalid or expired OTP'
        });
        return;
      }
      
      // Update user verification status
      if (purpose === 'email_verification') {
        await User.findOneAndUpdate(
          { email: identifier },
          { isEmailVerified: true }
        );
      } else if (purpose === 'phone_verification') {
        await User.findOneAndUpdate(
          { mobile: identifier },
          { isMobileVerified: true }
        );
      }
      
      // Check if both email and phone are verified
      const user = await User.findOne({
        $or: [{ email: identifier }, { mobile: identifier }]
      });
      
      // User is considered fully verified when both email and mobile are verified
      const isFullyVerified = user && user.isEmailVerified && user.isMobileVerified;
      
      res.json({
        success: true,
        message: 'OTP verified successfully',
        verified: isFullyVerified || false
      });
    } catch (error: any) {
      res.status(400).json({
        error: 'OTP verification failed',
        message: error.message
      });
    }
  }
  
  // POST /api/auth/logout
  public async logout(req: Request, res: Response): Promise<void> {
    try {
      const userInfo = (req as any).user;
      const token = req.headers.authorization?.substring(7);
      
      if (token) {
        // Blacklist the access token
        await jwtService.blacklistToken(token);
      }
      
      // Remove refresh token - use user ID from token or user object
      const userId = userInfo?.userId || userInfo?._id?.toString();
      if (userId) {
        await jwtService.removeRefreshToken(userId);
      }
      
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Logout failed',
        message: error.message
      });
    }
  }
  
  // POST /api/auth/refresh-token
  public async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        res.status(401).json({
          error: 'Refresh token is required'
        });
        return;
      }
      
      // Verify refresh token
      const decoded = jwtService.verifyRefreshToken(refreshToken);
      
      // Validate stored refresh token
      const isValidStored = await jwtService.validateRefreshToken(decoded.userId, refreshToken);
      
      if (!isValidStored) {
        res.status(401).json({
          error: 'Invalid refresh token'
        });
        return;
      }
      
      // Get user
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        res.status(401).json({
          error: 'User not found or inactive'
        });
        return;
      }
      
      // Generate new tokens
      const tokens = jwtService.generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role
      });
      
      // Store new refresh token
      await jwtService.storeRefreshToken(user._id.toString(), tokens.refreshToken);
      
      res.json({
        success: true,
        tokens
      });
    } catch (error: any) {
      res.status(401).json({
        error: 'Token refresh failed',
        message: error.message
      });
    }
  }
  
  // GET /api/auth/profile
  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userInfo = (req as any).user;
      const userId = userInfo?.userId || userInfo?._id?.toString();
      
      const userProfile = await User.findById(userId);
      
      if (!userProfile) {
        res.status(404).json({
          error: 'User not found'
        });
        return;
      }
      
      res.json({
        success: true,
        user: userProfile
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch profile',
        message: error.message
      });
    }
  }
  
  // PUT /api/auth/profile
  public async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userInfo = (req as any).user;
      const userId = userInfo?.userId || userInfo?._id?.toString();
      const updateData = req.body;
      
      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updateData.password;
      delete updateData.email;
      delete updateData.role;
      delete updateData.isActive;
      delete updateData.isEmailVerified;
      delete updateData.isMobileVerified;
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error: any) {
      res.status(400).json({
        error: 'Profile update failed',
        message: error.message
      });
    }
  }
  
  // POST /api/auth/change-password
  public async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userInfo = (req as any).user;
      const userId = userInfo?.userId || userInfo?._id?.toString();
      const { currentPassword, newPassword } = req.body;
      
      // Get user with password
      const userDoc = await User.findById(userId).select('+password');
      
      if (!userDoc || !(await userDoc.comparePassword(currentPassword))) {
        res.status(400).json({
          error: 'Current password is incorrect'
        });
        return;
      }
      
      userDoc.password = newPassword;
      await userDoc.save();
      
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        error: 'Password change failed',
        message: error.message
      });
    }
  }
  
  // POST /api/auth/forgot-password
  public async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      
      const user = await User.findOne({ email });
      
      if (!user) {
        // Don't reveal if user exists
        res.json({
          success: true,
          message: 'If the email exists, a reset link has been sent'
        });
        return;
      }
      
      // Generate reset token
      const resetToken = await otpService.generateSecureToken();
      await otpService.storeSecureToken(`password_reset_${email}`, resetToken, 3600); // 1 hour
      
      // Send reset email
      await notificationService.scheduleNotification({
        userId: user._id.toString(),
        userType: 'citizen',
        type: 'email',
        channel: email,
        priority: 'high',
        category: 'system',
        subject: 'Password Reset Request',
        message: `Click here to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`,
        metadata: { source: 'auth_service' }
      });
      
      await notificationService.processNotificationQueue();
      
      res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Password reset request failed',
        message: error.message
      });
    }
  }
  
  // POST /api/auth/reset-password
  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, token, newPassword } = req.body;
      
      // Verify reset token
      const isValidToken = await otpService.verifySecureToken(`password_reset_${email}`, token);
      
      if (!isValidToken) {
        res.status(400).json({
          error: 'Invalid or expired reset token'
        });
        return;
      }
      
      // Update password
      const user = await User.findOne({ email });
      
      if (!user) {
        res.status(404).json({
          error: 'User not found'
        });
        return;
      }
      
      user.password = newPassword;
      await user.save();
      
      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        error: 'Password reset failed',
        message: error.message
      });
    }
  }
}

export const authController = new AuthController();