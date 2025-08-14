import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../../services/auth/jwtService';
import { User } from '../../models/User';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const token = jwtService.getTokenFromHeader(authHeader);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    const decoded = await jwtService.verifyAccessToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    // Attach user to request
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};