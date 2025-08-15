"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var officersController_1 = require("../../../controllers/government/officersController");
var authenticate_1 = require("../../../middleware/auth/authenticate");
var authorize_1 = require("../../../middleware/auth/authorize");
var validation_1 = require("../../../middleware/validation/validation");
var router = (0, express_1.Router)();
// All routes require authentication
router.use(authenticate_1.authenticate);
// Admin only routes
router.post('/', (0, authorize_1.authorize)(['admin']), validation_1.validateOfficerCreation, officersController_1.officerController.createOfficer);
router.post('/auto-assign', (0, authorize_1.authorize)(['admin']), officersController_1.officerController.autoAssignApplications);
// Officer and Admin routes
router.get('/top-performers', (0, authorize_1.authorize)(['officer', 'admin']), officersController_1.officerController.getTopPerformers);
router.get('/department/:department', (0, authorize_1.authorize)(['officer', 'admin']), officersController_1.officerController.getOfficersByDepartment);
router.get('/:id', (0, authorize_1.authorize)(['officer', 'admin']), officersController_1.officerController.getOfficer);
router.put('/:id', (0, authorize_1.authorize)(['admin']), officersController_1.officerController.updateOfficer);
router.get('/:id/workload', (0, authorize_1.authorize)(['officer', 'admin']), officersController_1.officerController.getOfficerWorkload);
router.get('/:id/performance', (0, authorize_1.authorize)(['officer', 'admin']), officersController_1.officerController.getOfficerPerformance);
router.put('/:id/availability', (0, authorize_1.authorize)(['officer', 'admin']), officersController_1.officerController.updateAvailability);
exports.default = router;
