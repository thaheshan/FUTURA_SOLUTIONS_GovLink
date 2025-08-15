import { Router } from 'express';
import { officerController } from '../../../controllers/government/officersController';
import { authenticate } from '../../../middleware/auth/authenticate';
import { authorize } from '../../../middleware/auth/authorize';
import { validateOfficerCreation } from '../../../middleware/validation/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.post('/', authorize(['admin']), validateOfficerCreation, officerController.createOfficer);
router.post('/auto-assign', authorize(['admin']), officerController.autoAssignApplications);

// Officer and Admin routes
router.get('/top-performers', authorize(['officer', 'admin']), officerController.getTopPerformers);
router.get('/department/:department', authorize(['officer', 'admin']), officerController.getOfficersByDepartment);

router.get('/:id', authorize(['officer', 'admin']), officerController.getOfficer);
router.put('/:id', authorize(['admin']), officerController.updateOfficer);
router.get('/:id/workload', authorize(['officer', 'admin']), officerController.getOfficerWorkload);
router.get('/:id/performance', authorize(['officer', 'admin']), officerController.getOfficerPerformance);
router.put('/:id/availability', authorize(['officer', 'admin']), officerController.updateAvailability);

export default router;