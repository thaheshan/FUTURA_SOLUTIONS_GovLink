import * as jwt from 'jsonwebtoken';
import { redisClient } from '../../config/redis';
import config from '../../config/environment';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions?: string[];
}

export class JWTService {
  private static instance: JWTService;
  
  public static getInstance(): JWTService {
    if (!JWTService.instance) {
      JWTService.instance = new JWTService();
    }
    return JWTService.instance;
  }
  
  public generateTokens(payload: JWTPayload): { accessToken: string; refreshToken: string } {
    const accessToken = (jwt as any).sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE,
      issuer: 'shakthi-gov',
      audience: 'shakthi-users'
    });
    
    const refreshToken = (jwt as any).sign(
      { userId: payload.userId, type: 'refresh' },
      config.JWT_REFRESH_SECRET,
      {
        expiresIn: config.JWT_REFRESH_EXPIRE,
        issuer: 'shakthi-gov',
        audience: 'shakthi-users'
      }
    );
    
    return { accessToken, refreshToken };
  }
  
  public verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = (jwt as any).verify(token, config.JWT_SECRET, {
        issuer: 'shakthi-gov',
        audience: 'shakthi-users'
      }) as JWTPayload;
      
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }
  
  public verifyRefreshToken(token: string): { userId: string; type: string } {
    try {
      const decoded = (jwt as any).verify(token, config.JWT_REFRESH_SECRET, {
        issuer: 'shakthi-gov',
        audience: 'shakthi-users'
      }) as { userId: string; type: string };
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }
  
  public async blacklistToken(token: string, expiryTime?: number): Promise<void> {
    const key = `blacklist_${token}`;
    const ttl = expiryTime || 24 * 60 * 60; // 24 hours default
    
    await redisClient.set(key, 'true', ttl);
  }
  
  public async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist_${token}`;
    return await redisClient.exists(key);
  }
  
  public async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const key = `refresh_${userId}`;
    const ttl = 7 * 24 * 60 * 60; // 7 days
    
    await redisClient.set(key, refreshToken, ttl);
  }
  
  public async removeRefreshToken(userId: string): Promise<void> {
    const key = `refresh_${userId}`;
    await redisClient.del(key);
  }
  
  public async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const key = `refresh_${userId}`;
    const storedToken = await redisClient.get(key);
    
    return storedToken === refreshToken;
  }
}

export const jwtService = JWTService.getInstance();