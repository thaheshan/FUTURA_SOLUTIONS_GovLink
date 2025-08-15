import { Appointment, IAppointment } from '../../models/Appointment';
import { User } from '../../models/User';
import { notificationService } from '../notification/notificationService';

// Mock Officer interface for now
interface IOfficer {
  userId: string;
  status: string;
  availability: {
    [key: string]: {
      available: boolean;
      start: string;
      end: string;
    };
  };
  workload: {
    current: number;
  };
  performance: {
    applicationsProcessed: number;
    averageProcessingTime: number;
    rating: number;
  };
}

// Mock Officer model
const Officer = {
  find: async (query: any) => [] as IOfficer[],
  findOne: async (query: any) => null as IOfficer | null,
  findOneAndUpdate: async (query: any, update: any) => null as IOfficer | null
};

export class AppointmentService {
  private static instance: AppointmentService;
  
  public static getInstance(): AppointmentService {
    if (!AppointmentService.instance) {
      AppointmentService.instance = new AppointmentService();
    }
    return AppointmentService.instance;
  }
  
  public async getAvailableSlots(
    date: string,
    officerId?: string,
    duration: number = 30
  ): Promise<{ [officerId: string]: string[] }> {
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.toLocaleString('en-US', { weekday: 'short' }).toLowerCase(); // mon, tue, wed, etc.
    
    // Get available officers if not specified
    let officers;
    if (officerId) {
      officers = await Officer.find({ 
        userId: officerId, 
        status: 'active',
        [`availability.${this.getDayName(targetDate)}.available`]: true
      });
    } else {
      officers = await Officer.find({ 
        status: 'active',
        [`availability.${this.getDayName(targetDate)}.available`]: true
      });
    }
    
    const availableSlots: { [officerId: string]: string[] } = {};
    
    for (const officer of officers) {
      const dayAvailability = officer.availability[this.getDayName(targetDate)];
      if (!dayAvailability.available) continue;
      
      // Generate time slots based on officer's availability
      const allSlots = this.generateTimeSlots(
        dayAvailability.start,
        dayAvailability.end,
        duration
      );
      
      // Get booked slots for this officer on this date
      const bookedAppointments = await Appointment.find({
        'officerInfo.officerId': officer.userId,
        'appointmentDetails.date': {
          $gte: new Date(date + 'T00:00:00'),
          $lte: new Date(date + 'T23:59:59')
        },
        status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
      }, 'appointmentDetails.timeSlot');
      
      const bookedSlots = bookedAppointments.map(apt => apt.appointmentDetails.timeSlot);
      const freeSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
      
      availableSlots[officer.userId] = freeSlots;
    }
    
    return availableSlots;
  }
  
  private getDayName(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }
  
  private generateTimeSlots(startTime: string, endTime: string, duration: number): string[] {
    const slots: string[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);
    
    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);
    
    const current = new Date(startDate);
    
    while (current < endDate) {
      slots.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + duration);
    }
    
    return slots;
  }
  
  public async bookAppointment(appointmentData: any): Promise<IAppointment> {
    // Check for conflicts
    const conflictCheck = await Appointment.findOne({
      'officerInfo.officerId': appointmentData.officerInfo.officerId,
      'appointmentDetails.date': appointmentData.appointmentDetails.date,
      'appointmentDetails.timeSlot': appointmentData.appointmentDetails.timeSlot,
      status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
    });
    
    if (conflictCheck) {
      throw new Error('Time slot is already booked');
    }
    
    const appointment = new Appointment({
      ...appointmentData,
      status: 'scheduled'
    });
    
    await appointment.save();
    
    // Update officer workload
    await this.updateOfficerWorkload(appointmentData.officerInfo.officerId, 1);
    
    // Schedule reminder notifications
    await this.scheduleReminders(appointment);
    
    // Send confirmation notification
    await notificationService.sendAppointmentConfirmation(appointment);
    
    return appointment;
  }
  
  public async rescheduleAppointment(
    appointmentId: string,
    newDate: Date,
    newTimeSlot: string,
    reason?: string
  ): Promise<IAppointment> {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    // Check for conflicts at new time
    const conflictCheck = await Appointment.findOne({
      _id: { $ne: appointmentId },
      'officerInfo.officerId': appointment.officerInfo.officerId,
      'appointmentDetails.date': newDate,
      'appointmentDetails.timeSlot': newTimeSlot,
      status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
    });
    
    if (conflictCheck) {
      throw new Error('New time slot is already booked');
    }
    
    // Store reschedule history
    appointment.rescheduleHistory.push({
      previousDate: appointment.appointmentDetails.date,
      previousTimeSlot: appointment.appointmentDetails.timeSlot,
      reason: reason || 'User requested',
      rescheduledBy: 'user', // This should come from authentication context
      rescheduledAt: new Date()
    });
    
    // Update appointment
    appointment.appointmentDetails.date = newDate;
    appointment.appointmentDetails.timeSlot = newTimeSlot;
    appointment.status = 'rescheduled';
    appointment.remindersSent = {
      twentyFourHour: false,
      twoHour: false,
      thirtyMinute: false
    };
    
    await appointment.save();
    
    // Reschedule reminders
    await this.scheduleReminders(appointment);
    
    // Send rescheduling notification
    await notificationService.sendAppointmentRescheduled(appointment);
    
    return appointment;
  }
  
  public async cancelAppointment(
    appointmentId: string,
    reason: string,
    cancelledBy: string
  ): Promise<IAppointment> {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    appointment.cancelledBy = cancelledBy;
    appointment.cancelledAt = new Date();
    
    await appointment.save();
    
    // Update officer workload
    await this.updateOfficerWorkload(appointment.officerInfo.officerId, -1);
    
    // Send cancellation notification
    await notificationService.sendAppointmentCancelled(appointment);
    
    return appointment;
  }
  
  private async updateOfficerWorkload(officerId: string, increment: number): Promise<void> {
    await Officer.findOneAndUpdate(
      { userId: officerId },
      { $inc: { 'workload.current': increment } }
    );
  }
  
  private async scheduleReminders(appointment: IAppointment): Promise<void> {
    const appointmentDateTime = new Date(appointment.appointmentDetails.date);
    const [hours, minutes] = appointment.appointmentDetails.timeSlot.split(':').map(Number);
    appointmentDateTime.setHours(hours, minutes);
    
    const twentyFourHoursBefore = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);
    const twoHoursBefore = new Date(appointmentDateTime.getTime() - 2 * 60 * 60 * 1000);
    const thirtyMinutesBefore = new Date(appointmentDateTime.getTime() - 30 * 60 * 1000);
    
    // Schedule reminders
    await Promise.all([
      notificationService.scheduleNotification({
        userId: appointment.applicationId,
        type: 'email',
        channel: appointment.applicantInfo.email,
        subject: 'Appointment Reminder - Tomorrow',
        message: `Your ${appointment.applicationType.toUpperCase()} appointment is scheduled for tomorrow at ${appointment.appointmentDetails.timeSlot}`,
        scheduledAt: twentyFourHoursBefore,
        category: 'reminder',
        metadata: { 
          appointmentId: appointment._id.toString(), 
          reminderType: '24h',
          source: 'appointment_service'
        }
      }),
      
      notificationService.scheduleNotification({
        userId: appointment.applicationId,
        type: 'sms',
        channel: appointment.applicantInfo.phone,
        message: `Reminder: Your ${appointment.applicationType.toUpperCase()} appointment starts in 2 hours at ${appointment.appointmentDetails.timeSlot}. Location: ${appointment.appointmentDetails.venue.name}`,
        scheduledAt: twoHoursBefore,
        category: 'reminder',
        metadata: { 
          appointmentId: appointment._id.toString(), 
          reminderType: '2h',
          source: 'appointment_service'
        }
      }),
      
      notificationService.scheduleNotification({
        userId: appointment.applicationId,
        type: 'push',
        channel: appointment.applicantInfo.email, // Push notifications would use device tokens
        message: `Your appointment starts in 30 minutes. Please arrive on time.`,
        scheduledAt: thirtyMinutesBefore,
        category: 'reminder',
        metadata: { 
          appointmentId: appointment._id.toString(), 
          reminderType: '30min',
          source: 'appointment_service'
        }
      })
    ]);
  }
  
  public async checkInAppointment(appointmentId: string): Promise<IAppointment> {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    appointment.status = 'in_progress';
    appointment.checkInTime = new Date();
    
    await appointment.save();
    return appointment;
  }
  
  public async checkOutAppointment(
    appointmentId: string,
    feedback?: { rating: number; comment: string }
  ): Promise<IAppointment> {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    appointment.status = 'completed';
    appointment.checkOutTime = new Date();
    
    if (feedback) {
      appointment.feedback = {
        ...feedback,
        submittedAt: new Date()
      };
    }
    
    await appointment.save();
    
    // Update officer workload
    await this.updateOfficerWorkload(appointment.officerInfo.officerId, -1);
    
    // Update officer performance metrics
    await this.updateOfficerPerformance(appointment);
    
    return appointment;
  }
  
  private async updateOfficerPerformance(appointment: IAppointment): Promise<void> {
    const processingTime = appointment.checkOutTime && appointment.checkInTime 
      ? (appointment.checkOutTime.getTime() - appointment.checkInTime.getTime()) / (1000 * 60) // minutes
      : appointment.appointmentDetails.duration;
    
    const rating = appointment.feedback?.rating || 5;
    
    await Officer.findOneAndUpdate(
      { userId: appointment.officerInfo.officerId },
      {
        $inc: { 'performance.applicationsProcessed': 1 },
        $set: {
          'performance.averageProcessingTime': processingTime,
          'performance.rating': rating
        }
      }
    );
  }
  
  public async getAppointmentsByOfficer(
    officerId: string,
    filters: any = {},
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;
    const query: any = { 'officerInfo.officerId': officerId };
    
    // Apply filters
    if (filters.status) query.status = filters.status;
    if (filters.date) {
      query['appointmentDetails.date'] = {
        $gte: new Date(filters.date + 'T00:00:00'),
        $lte: new Date(filters.date + 'T23:59:59')
      };
    }
    
    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .sort({ 'appointmentDetails.date': 1, 'appointmentDetails.timeSlot': 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Appointment.countDocuments(query)
    ]);
    
    return {
      appointments,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
        totalItems: total
      }
    };
  }
}

export const appointmentService = AppointmentService.getInstance();