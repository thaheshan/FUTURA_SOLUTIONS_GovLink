import { Router } from 'express';
import { authController } from '../../../controllers/auth/authController';

const router = Router();

// Public routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

export default router;