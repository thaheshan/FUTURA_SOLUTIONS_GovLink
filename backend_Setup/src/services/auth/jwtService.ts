import * as jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt';
import { IJwtPayload } from '../../types/auth';
import { RedisClient } from '../../config/redis';

export class JWTService {
  private redis = RedisClient.getInstance();

  public generateAccessToken(payload: Omit<IJwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, jwtConfig.secret as jwt.Secret, {
      expiresIn: jwtConfig.expiresIn,
      algorithm: jwtConfig.algorithm as jwt.Algorithm
    });
  }

  public generateRefreshToken(payload: Omit<IJwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpiresIn,
      algorithm: jwtConfig.algorithm
    });
  }

  public async verifyAccessToken(token: string): Promise<IJwtPayload> {
    try {
      // Check if token is blacklisted
      const isBlacklisted = await this.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new Error('Token is blacklisted');
      }

      const decoded = jwt.verify(token, jwtConfig.secret, {
        algorithms: [jwtConfig.algorithm]
      }) as IJwtPayload;

      return decoded;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  public async verifyRefreshToken(token: string): Promise<IJwtPayload> {
    try {
      const decoded = jwt.verify(token, jwtConfig.refreshSecret, {
        algorithms: [jwtConfig.algorithm]
      }) as IJwtPayload;

      return decoded;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  public async blacklistToken(token: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as IJwtPayload;
      if (decoded && decoded.exp) {
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
        if (expiresIn > 0) {
          await this.redis.set(
            `${jwtConfig.tokenBlacklistPrefix}${token}`,
            'blacklisted',
            expiresIn
          );
        }
      }
    } catch (error) {
      console.error('Error blacklisting token:', error);
    }
  }

  public async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const exists = await this.redis.exists(`${jwtConfig.tokenBlacklistPrefix}${token}`);
      return exists === 1;
    } catch (error) {
      console.error('Error checking token blacklist:', error);
      return false;
    }
  }

  public getTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

export const jwtService = new JWTService();