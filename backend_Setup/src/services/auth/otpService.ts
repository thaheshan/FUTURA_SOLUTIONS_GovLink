import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import Twilio from 'twilio';
import { config } from '../../config/environment';
import { OTP } from '../../models/OTP';
import { OTPType } from '../../types/auth';

export class OTPService {
  private emailTransporter: nodemailer.Transporter;
  private twilioClient: Twilio.Twilio;

  constructor() {
    // Email transporter
    this.emailTransporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });

    // SMS client
    if (config.sms.accountSid && config.sms.authToken) {
      this.twilioClient = Twilio(config.sms.accountSid, config.sms.authToken);
    }
  }

  public generateOTP(): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < config.otp.length; i++) {
      otp += digits[crypto.randomInt(0, digits.length)];
    }
    return otp;
  }

  public async createOTP(userId: string, type: OTPType): Promise<string> {
    // Remove any existing unused OTP for this user and type
    await OTP.deleteMany({ userId, type, isUsed: false });

    const code = this.generateOTP();
    const expiresAt = new Date(Date.now() + config.otp.expiresIn);

    await OTP.create({
      userId,
      code,
      type,
      expiresAt
    });

    return code;
  }

  public async verifyOTP(userId: string, code: string, type: OTPType): Promise<boolean> {
    const otpDoc = await OTP.findOne({
      userId,
      code,
      type,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }) as OTPType & { isUsed: boolean; save: () => Promise<void> };

    if (!otpDoc) {
      return false;
    }

    // Mark OTP as used
    otpDoc.isUsed = true;
    await otpDoc.save();

    return true;
  }

  public async sendEmailOTP(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: config.email.user,
      to: email,
      subject: 'Email Verification Code',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    await this.emailTransporter.sendMail(mailOptions);
  }

  public async sendSMSOTP(mobile: string, otp: string): Promise<void> {
    if (!this.twilioClient) {
      throw new Error('SMS service not configured');
    }

    const message = `Your verification code is: ${otp}. This code will expire in 5 minutes.`;

    await this.twilioClient.messages.create({
      body: message,
      from: config.sms.phoneNumber,
      to: mobile
    });
  }

  public async cleanupExpiredOTPs(): Promise<void> {
    await OTP.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { isUsed: true }
      ]
    });
  }
}

export const otpService = new OTPService();