"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var servicesController_1 = require("../../../controllers/citizen/servicesController");
var authenticate_1 = require("../../../middleware/auth/authenticate");
var authorize_1 = require("../../../middleware/auth/authorize");
var validation_1 = require("../../../middleware/validation/validation");
var rateLimit_1 = require("../../../middleware/security/rateLimit");
var router = express.Router();
// Public routes
router.get('/', rateLimit_1.serviceQueryLimiter, servicesController_1.servicesController.getAllServices);
router.get('/categories', servicesController_1.servicesController.getServiceCategories);
router.get('/districts', servicesController_1.servicesController.getServiceDistricts);
router.get('/stats', servicesController_1.servicesController.getServiceStats);
router.get('/:id', servicesController_1.servicesController.getService);
// Protected routes (admin only)
router.use(authenticate_1.authenticate);
router.use((0, authorize_1.authorize)(['admin']));
router.post('/', validation_1.validateServiceCreation, servicesController_1.servicesController.createService);
router.put('/:id', validation_1.validateServiceCreation, servicesController_1.servicesController.updateService);
router.delete('/:id', servicesController_1.servicesController.deleteService);
exports.default = router;
