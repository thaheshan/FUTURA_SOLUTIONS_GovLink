"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var nicController_1 = require("../../../controllers/services/nicController");
var authenticate_1 = require("../../../middleware/auth/authenticate");
var authorize_1 = require("../../../middleware/auth/authorize");
var upload_1 = require("../../../middleware/common/upload");
var validation_1 = require("../../../middleware/validation/validation");
var rateLimit_1 = require("../../../middleware/security/rateLimit");
var router = express.Router();
// Public tracking route
router.get('/track/:referenceNumber', nicController_1.nicController.trackApplication);
// Protected routes
router.use(authenticate_1.authenticate);
// Citizen routes
router.post('/applications', rateLimit_1.uploadLimiter, upload_1.documentUpload.array('documents', 10), validation_1.validateNICApplication, nicController_1.nicController.submitApplication);
router.get('/applications/:referenceNumber', nicController_1.nicController.getApplication);
// Officer/Admin routes
router.put('/applications/:referenceNumber/status', (0, authorize_1.authorize)(['officer', 'admin']), nicController_1.nicController.updateStatus);
router.put('/applications/:referenceNumber/assign', (0, authorize_1.authorize)(['admin']), nicController_1.nicController.assignOfficer);
router.get('/applications', (0, authorize_1.authorize)(['officer', 'admin']), nicController_1.nicController.searchApplications);
router.post('/applications/bulk-update', (0, authorize_1.authorize)(['admin']), nicController_1.nicController.bulkUpdateStatus);
router.get('/applications/stats', (0, authorize_1.authorize)(['officer', 'admin']), nicController_1.nicController.getApplicationStats);
exports.default = router;
