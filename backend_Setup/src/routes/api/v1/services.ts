import * as express from 'express';
import { servicesController } from '../../../controllers/citizen/servicesController';
import { authenticate } from '../../../middleware/auth/authenticate';
import { authorize } from '../../../middleware/auth/authorize';
import { validateServiceCreation } from '../../../middleware/validation/validation';
import { serviceQueryLimiter } from '../../../middleware/security/rateLimit';

const router = express.Router();

// Public routes
router.get('/', serviceQueryLimiter, servicesController.getAllServices);
router.get('/categories', servicesController.getServiceCategories);
router.get('/districts', servicesController.getServiceDistricts);
router.get('/stats', servicesController.getServiceStats);
router.get('/:id', servicesController.getService);

// Protected routes (admin only)
router.use(authenticate);
router.use(authorize(['admin']));

router.post('/', validateServiceCreation, servicesController.createService);
router.put('/:id', validateServiceCreation, servicesController.updateService);
router.delete('/:id', servicesController.deleteService);

export default router;