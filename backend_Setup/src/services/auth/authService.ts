import { User } from '../../models/User';
// import { RefreshToken } from '../../models/RefreshToken';

import { RefreshToken } from '../../models/RefreshToken';
import { IRegisterRequest, ILoginRequest, IAuthResponse, OTPType } from '../../types/auth';
import { jwtService } from './jwtService';
import { otpService } from './otpService';
import { PasswordService } from './passwordService';
import { UserRole } from '../../types/user';

export class AuthService {
  public async register(data: IRegisterRequest): Promise<{ user: any; message: string }> {
    const { email, mobile, password, firstName, lastName, role } = data;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      throw new Error('User already exists with this email or mobile');
    }

    // Validate password strength
    const passwordValidation = PasswordService.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    // Create user
    const user = await User.create({
      email,
      mobile,
      password,
      firstName,
      lastName,
      role: role || UserRole.CITIZEN
    });

    // Generate and send OTPs
    const emailOTP = await otpService.createOTP(user._id.toString(), OTPType.EMAIL_VERIFICATION);
    const mobileOTP = await otpService.createOTP(user._id.toString(), OTPType.MOBILE_VERIFICATION);

    // Send OTPs (in parallel)
    await Promise.all([
      otpService.sendEmailOTP(email, emailOTP),
      otpService.sendSMSOTP(mobile, mobileOTP)
    ]);

    return {
      user: {
        id: user._id,
        email: user.email,
        mobile: user.mobile,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      message: 'Registration successful. Please verify your email and mobile number.'
    };
  }

  public async login(data: ILoginRequest): Promise<IAuthResponse> {
    const { identifier, password } = data;

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { mobile: identifier }
      ],
      isActive: true
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = await user.generateAuthTokens();

    // Store refresh token
    await RefreshToken.create({
      userId: user._id,
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        mobile: user.mobile,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isMobileVerified: user.isMobileVerified
      },
      tokens
    };
  }

  public async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify refresh token
    const decoded = await jwtService.verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const tokenDoc = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    });

    if (!tokenDoc) {
      throw new Error('Invalid refresh token');
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Generate new tokens
    const newTokens = await user.generateAuthTokens();

    // Revoke old refresh token and create new one
    tokenDoc.isRevoked = true;
    await tokenDoc.save();

    await RefreshToken.create({
      userId: user._id,
      token: newTokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return newTokens;
  }

  public async logout(accessToken: string, refreshToken: string): Promise<void> {
    // Blacklist access token
    await jwtService.blacklistToken(accessToken);

    // Revoke refresh token
    if (refreshToken) {
      await RefreshToken.updateOne(
        { token: refreshToken },
        { isRevoked: true }
      );
    }
  }

  public async verifyOTP(userId: string, code: string, type: OTPType): Promise<void> {
    const isValid = await otpService.verifyOTP(userId, code, type);
    if (!isValid) {
      throw new Error('Invalid or expired OTP');
    }

    // Update user verification status
    const updateData: any = {};
    if (type === OTPType.EMAIL_VERIFICATION) {
      updateData.isEmailVerified = true;
    } else if (type === OTPType.MOBILE_VERIFICATION) {
      updateData.isMobileVerified = true;
    }

    await User.findByIdAndUpdate(userId, updateData);
  }

  public async resendOTP(userId: string, type: OTPType): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const otp = await otpService.createOTP(userId, type);

    if (type === OTPType.EMAIL_VERIFICATION) {
      await otpService.sendEmailOTP(user.email, otp);
    } else if (type === OTPType.MOBILE_VERIFICATION) {
      await otpService.sendSMSOTP(user.mobile, otp);
    }
  }

  public async forgotPassword(identifier: string): Promise<void> {
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { mobile: identifier }
      ],
      isActive: true
    });

    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    const otp = await otpService.createOTP(user._id.toString(), OTPType.PASSWORD_RESET);
    await otpService.sendEmailOTP(user.email, otp);
  }

  public async resetPassword(identifier: string, otp: string, newPassword: string): Promise<void> {
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { mobile: identifier }
      ],
      isActive: true
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify OTP
    const isValidOTP = await otpService.verifyOTP(user._id.toString(), otp, OTPType.PASSWORD_RESET);
    if (!isValidOTP) {
      throw new Error('Invalid or expired OTP');
    }

    // Validate password strength
    const passwordValidation = PasswordService.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    // Update password
    (user as any).password = newPassword;
    await user.save();

    // Revoke all refresh tokens for this user
    await RefreshToken.updateMany(
      { userId: user._id },
      { isRevoked: true }
    );
  }
}