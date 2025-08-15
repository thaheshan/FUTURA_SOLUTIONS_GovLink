import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate';

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
    }
    
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: user.role
      });
    }
    
    next();
  };
};

export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NOT_AUTHENTICATED'
      });
    }
    
    if (!user.permissions || !user.permissions.includes(permission)) {
      return res.status(403).json({ 
        error: 'Permission denied',
        code: 'PERMISSION_DENIED',
        required: permission
      });
    }
    
    next();
  };
};