import { redisClient } from '../../config/redis';
import * as crypto from 'crypto';

export class OTPService {
  private static instance: OTPService;
  
  public static getInstance(): OTPService {
    if (!OTPService.instance) {
      OTPService.instance = new OTPService();
    }
    return OTPService.instance;
  }
  
  public async generateOTP(identifier: string, purpose: string): Promise<string> {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in Redis with 10-minute expiry
    const key = `otp_${purpose}_${identifier}`;
    const data = JSON.stringify({
      otp,
      attempts: 0,
      generatedAt: new Date().toISOString()
    });
    
    await redisClient.set(key, data, 600); // 10 minutes
    
    return otp;
  }
  
  public async verifyOTP(identifier: string, purpose: string, otp: string): Promise<boolean> {
    const key = `otp_${purpose}_${identifier}`;
    const storedData = await redisClient.get(key);
    
    if (!storedData) {
      return false; // OTP expired or doesn't exist
    }
    
    const { otp: storedOTP, attempts } = JSON.parse(storedData);
    
    // Check if too many attempts
    if (attempts >= 3) {
      await redisClient.del(key); // Remove OTP after too many attempts
      return false;
    }
    
    if (storedOTP === otp) {
      await redisClient.del(key); // Remove OTP after successful verification
      return true;
    } else {
      // Increment attempts
      const updatedData = JSON.stringify({
        otp: storedOTP,
        attempts: attempts + 1,
        generatedAt: JSON.parse(storedData).generatedAt
      });
      await redisClient.set(key, updatedData, 600);
      return false;
    }
  }
  
  public async generateSecureToken(length: number = 32): Promise<string> {
    return crypto.randomBytes(length).toString('hex');
  }
  
  public async storeSecureToken(identifier: string, token: string, ttlSeconds: number = 3600): Promise<void> {
    const key = `secure_token_${identifier}`;
    await redisClient.set(key, token, ttlSeconds);
  }
  
  public async verifySecureToken(identifier: string, token: string): Promise<boolean> {
    const key = `secure_token_${identifier}`;
    const storedToken = await redisClient.get(key);
    
    if (storedToken === token) {
      await redisClient.del(key); // Remove token after use
      return true;
    }
    
    return false;
  }
}

export const otpService = OTPService.getInstance();