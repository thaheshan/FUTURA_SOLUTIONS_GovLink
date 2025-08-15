import { Request, Response } from 'express';
import { appointmentService } from '../../services/citizen/appointmentService';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';
import { Appointment } from '../../models/Appointment';

export class AppointmentController {
  // GET /api/appointments/available-slots
  public async getAvailableSlots(req: Request, res: Response): Promise<void> {
    try {
      const { date, officerId, duration = 30 } = req.query;
      
      if (!date) {
        res.status(400).json({ error: 'Date is required' });
        return;
      }
      
      const slots = await appointmentService.getAvailableSlots(
        date as string,
        officerId as string,
        Number(duration)
      );
      
      res.json({
        success: true,
        date,
        availableSlots: slots
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch available slots',
        message: error.message 
      });
    }
  }

  // POST /api/appointments
  public async bookAppointment(req: Request, res: Response): Promise<void> {
    try {
      const appointment = await appointmentService.bookAppointment(req.body);
      
      res.status(201).json({
        success: true,
        appointment,
        message: 'Appointment booked successfully'
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: 'Failed to book appointment',
        message: error.message 
      });
    }
  }

  // GET /api/appointments/:id
  public async getAppointment(req: Request, res: Response): Promise<void> {
    try {
      const appointment = await Appointment.findById(req.params.id);
      
      if (!appointment) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }
      
      res.json({
        success: true,
        appointment
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch appointment',
        message: error.message 
      });
    }
  }

  // PUT /api/appointments/:id/reschedule
  public async rescheduleAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { newDate, newTimeSlot, reason } = req.body;
      
      const appointment = await appointmentService.rescheduleAppointment(
        req.params.id,
        new Date(newDate),
        newTimeSlot,
        reason
      );
      
      res.json({
        success: true,
        appointment,
        message: 'Appointment rescheduled successfully'
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: 'Failed to reschedule appointment',
        message: error.message 
      });
    }
  }

  // PUT /api/appointments/:id/cancel
  public async cancelAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { reason } = req.body;
      const user = (req as unknown as AuthenticatedRequest).user;
      
      const appointment = await appointmentService.cancelAppointment(
        req.params.id,
        reason,
        user.userId
      );
      
      res.json({
        success: true,
        appointment,
        message: 'Appointment cancelled successfully'
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: 'Failed to cancel appointment',
        message: error.message 
      });
    }
  }

  // PUT /api/appointments/:id/check-in
  public async checkInAppointment(req: Request, res: Response): Promise<void> {
    try {
      const appointment = await appointmentService.checkInAppointment(req.params.id);
      
      res.json({
        success: true,
        appointment,
        message: 'Checked in successfully'
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: 'Failed to check in',
        message: error.message 
      });
    }
  }

  // PUT /api/appointments/:id/check-out
  public async checkOutAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { feedback } = req.body;
      
      const appointment = await appointmentService.checkOutAppointment(
        req.params.id,
        feedback
      );
      
      res.json({
        success: true,
        appointment,
        message: 'Checked out successfully'
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: 'Failed to check out',
        message: error.message 
      });
    }
  }

  // GET /api/appointments/officer/:officerId
  public async getAppointmentsByOfficer(req: Request, res: Response): Promise<void> {
    try {
      const { officerId } = req.params;
      const { page = 1, limit = 20, ...filters } = req.query;
      
      const result = await appointmentService.getAppointmentsByOfficer(
        officerId,
        filters,
        Number(page),
        Number(limit)
      );
      
      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch appointments',
        message: error.message 
      });
    }
  }

  // GET /api/appointments
  public async getAppointments(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as unknown as AuthenticatedRequest).user;
      const { page = 1, limit = 20, status, date } = req.query;
      
      const filters = { status, date };
      
      let result;
      if (user.role === 'officer') {
        result = await appointmentService.getAppointmentsByOfficer(
          user.userId,
          filters,
          Number(page),
          Number(limit)
        );
      } else {
        // For citizens, get appointments by application ID
        const query: any = { 'applicantInfo.email': user.email };
        
        if (filters.status) query.status = filters.status;
        if (filters.date) {
          query['appointmentDetails.date'] = {
            $gte: new Date(filters.date + 'T00:00:00'),
            $lte: new Date(filters.date + 'T23:59:59')
          };
        }
        
        const skip = (Number(page) - 1) * Number(limit);
        const [appointments, total] = await Promise.all([
          Appointment.find(query)
            .sort({ 'appointmentDetails.date': -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
          Appointment.countDocuments(query)
        ]);
        
        result = {
          appointments,
          pagination: {
            current: Number(page),
            total: Math.ceil(total / Number(limit)),
            hasNext: Number(page) < Math.ceil(total / Number(limit)),
            hasPrev: Number(page) > 1,
            totalItems: total
          }
        };
      }
      
      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch appointments',
        message: error.message 
      });
    }
  }
}

export const appointmentController = new AppointmentController();