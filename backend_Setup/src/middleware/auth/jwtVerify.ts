import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../../services/auth/jwtService';

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const token = jwtService.getTokenFromHeader(authHeader);
    if (!token) {
      return next();
    }

    const decoded = await jwtService.verifyAccessToken(token);
    req.user = decoded as any; // Minimal user data from token
    
  } catch (error) {
    // Continue without authentication for optional auth
  }
  
  next();
};