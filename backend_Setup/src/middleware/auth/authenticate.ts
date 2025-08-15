import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../../services/auth/jwtService';
import { User } from '../../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        permissions?: string[];
      };
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    permissions?: string[];
  };
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'MISSING_TOKEN'
      });
    }
    
    const token = authHeader.substring(7);
    
    // Check if token is blacklisted
    const isBlacklisted = await jwtService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ 
        error: 'Token has been revoked',
        code: 'TOKEN_REVOKED'
      });
    }
    
    // Verify token
    const decoded = jwtService.verifyAccessToken(token);
    
    // Get user details
    const user = await User.findById(decoded.userId).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        error: 'User not found or inactive',
        code: 'USER_INACTIVE'
      });
    }
    
    // Attach user to request
    req.user = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      permissions: decoded.permissions || []
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    });
  }
};