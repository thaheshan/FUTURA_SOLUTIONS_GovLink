"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var appointmentsController_1 = require("../../../controllers/citizen/appointmentsController");
var authenticate_1 = require("../../../middleware/auth/authenticate");
var authorize_1 = require("../../../middleware/auth/authorize");
var validation_1 = require("../../../middleware/validation/validation");
var rateLimit_1 = require("../../../middleware/security/rateLimit");
var router = (0, express_1.Router)();
// Public routes
router.get('/available-slots', rateLimit_1.generalLimiter, appointmentsController_1.appointmentController.getAvailableSlots);
// Protected routes
router.use(authenticate_1.authenticate);
router.post('/', validation_1.validateAppointmentBooking, appointmentsController_1.appointmentController.bookAppointment);
router.get('/my', appointmentsController_1.appointmentController.getAppointments);
router.get('/:id', appointmentsController_1.appointmentController.getAppointment);
router.put('/:id/reschedule', appointmentsController_1.appointmentController.rescheduleAppointment);
router.put('/:id/cancel', appointmentsController_1.appointmentController.cancelAppointment);
// Officer/Admin only routes
router.put('/:id/check-in', (0, authorize_1.authorize)(['officer', 'admin']), appointmentsController_1.appointmentController.checkInAppointment);
router.put('/:id/check-out', (0, authorize_1.authorize)(['officer', 'admin']), appointmentsController_1.appointmentController.checkOutAppointment);
router.get('/officer/:officerId', (0, authorize_1.authorize)(['officer', 'admin']), appointmentsController_1.appointmentController.getAppointmentsByOfficer);
exports.default = router;
