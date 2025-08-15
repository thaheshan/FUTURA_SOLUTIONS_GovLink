import { Router } from 'express';
import { appointmentController } from '../../../controllers/citizen/appointmentsController';
import { authenticate } from '../../../middleware/auth/authenticate';
import { authorize } from '../../../middleware/auth/authorize';
import { validateAppointmentBooking } from '../../../middleware/validation/validation';
import { generalLimiter } from '../../../middleware/security/rateLimit';

const router = Router();

// Public routes
router.get('/available-slots', generalLimiter, appointmentController.getAvailableSlots);

// Protected routes
router.use(authenticate);

router.post('/', validateAppointmentBooking, appointmentController.bookAppointment);
router.get('/my', appointmentController.getAppointments);
router.get('/:id', appointmentController.getAppointment);
router.put('/:id/reschedule', appointmentController.rescheduleAppointment);
router.put('/:id/cancel', appointmentController.cancelAppointment);

// Officer/Admin only routes
router.put('/:id/check-in', authorize(['officer', 'admin']), appointmentController.checkInAppointment);
router.put('/:id/check-out', authorize(['officer', 'admin']), appointmentController.checkOutAppointment);
router.get('/officer/:officerId', authorize(['officer', 'admin']), appointmentController.getAppointmentsByOfficer);

export default router;