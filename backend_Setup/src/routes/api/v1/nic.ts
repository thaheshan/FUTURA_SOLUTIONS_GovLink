import * as express from 'express';
import { nicController } from '../../../controllers/services/nicController';
import { authenticate } from '../../../middleware/auth/authenticate';
import { authorize } from '../../../middleware/auth/authorize';
import { documentUpload } from '../../../middleware/common/upload';
import { validateNICApplication } from '../../../middleware/validation/validation';
import { uploadLimiter } from '../../../middleware/security/rateLimit';

const router = express.Router();

// Public tracking route
router.get('/track/:referenceNumber', nicController.trackApplication);

// Protected routes
router.use(authenticate);

// Citizen routes
router.post('/applications', 
  uploadLimiter,
  documentUpload.array('documents', 10),
  validateNICApplication,
  nicController.submitApplication
);

router.get('/applications/:referenceNumber', nicController.getApplication);

// Officer/Admin routes
router.put('/applications/:referenceNumber/status', 
  authorize(['officer', 'admin']),
  nicController.updateStatus
);

router.put('/applications/:referenceNumber/assign',
  authorize(['admin']),
  nicController.assignOfficer
);

router.get('/applications',
  authorize(['officer', 'admin']),
  nicController.searchApplications
);

router.post('/applications/bulk-update',
  authorize(['admin']),
  nicController.bulkUpdateStatus
);

router.get('/applications/stats',
  authorize(['officer', 'admin']),
  nicController.getApplicationStats
);

export default router;