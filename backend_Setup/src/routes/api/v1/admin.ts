import * as express from 'express';
import { reportingController } from '../../../controllers/government/reportingController';
import { authenticate } from '../../../middleware/auth/authenticate';
import { authorize } from '../../../middleware/auth/authorize';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize(['admin']));

// Dashboard and reporting routes
router.get('/dashboard', reportingController.getDashboardStats);
router.get('/reports/applications', reportingController.getApplicationReport);
router.get('/reports/performance', reportingController.getPerformanceReport);
router.post('/reports/export', reportingController.exportReport);

export default router;