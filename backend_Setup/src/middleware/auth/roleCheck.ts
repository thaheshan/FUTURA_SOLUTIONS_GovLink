import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../types/user';

export const requireRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `${role} role required`
      });
    }

    next();
  };
};

export const requireCitizen = requireRole(UserRole.CITIZEN);
export const requireOfficer = requireRole(UserRole.OFFICER);
export const requireAdmin = requireRole(UserRole.ADMIN);