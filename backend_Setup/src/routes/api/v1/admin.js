"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var reportingController_1 = require("../../../controllers/government/reportingController");
var authenticate_1 = require("../../../middleware/auth/authenticate");
var authorize_1 = require("../../../middleware/auth/authorize");
var router = express.Router();
// All admin routes require authentication and admin role
router.use(authenticate_1.authenticate);
router.use((0, authorize_1.authorize)(['admin']));
// Dashboard and reporting routes
router.get('/dashboard', reportingController_1.reportingController.getDashboardStats);
router.get('/reports/applications', reportingController_1.reportingController.getApplicationReport);
router.get('/reports/performance', reportingController_1.reportingController.getPerformanceReport);
router.post('/reports/export', reportingController_1.reportingController.exportReport);
exports.default = router;
