const cron = require('node-cron');
import { Appointment } from '../models/Appointment';
import { notificationService } from '../services/notification/notificationService';

export class ReminderProcessor {
  public start(): void {
    // Process appointment reminders every 30 minutes
    cron.schedule('*/30 * * * *', async () => {
      try {
        await this.processAppointmentReminders();
      } catch (error) {
        console.error('Error processing appointment reminders:', error);
      }
    });

    console.log('✅ Reminder processor started - runs every 30 minutes');
  }

  private async processAppointmentReminders(): Promise<void> {
    const now = new Date();
    
    // Process 24-hour reminders
    await this.process24HourReminders(now);
    
    // Process 2-hour reminders
    await this.process2HourReminders(now);
    
    // Process 30-minute reminders
    await this.process30MinuteReminders(now);
  }

  private async process24HourReminders(now: Date): Promise<void> {
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Find appointments scheduled in 24 hours that haven't received 24h reminder
    const appointments = await Appointment.find({
      'appointmentDetails.date': {
        $gte: new Date(twentyFourHoursFromNow.getTime() - 15 * 60 * 1000), // 15 min before
        $lte: new Date(twentyFourHoursFromNow.getTime() + 15 * 60 * 1000)  // 15 min after
      },
      status: { $in: ['scheduled', 'confirmed'] },
      'remindersSent.twentyFourHour': false
    });

    for (const appointment of appointments) {
      try {
        // Send email reminder
        await notificationService.scheduleNotification({
          userId: appointment.applicationId,
          userType: 'citizen',
          type: 'email',
          channel: appointment.applicantInfo.email,
          priority: 'high',
          category: 'reminder',
          subject: 'Appointment Reminder - Tomorrow',
          message: `Dear ${appointment.applicantInfo.name},\n\nThis is a reminder that you have an appointment tomorrow at ${appointment.appointmentDetails.timeSlot}.\n\nVenue: ${appointment.appointmentDetails.venue.name}\nAddress: ${appointment.appointmentDetails.venue.address}\n\nPlease arrive 15 minutes early.\n\nThank you.`,
          metadata: { 
            appointmentId: appointment._id.toString(),
            reminderType: '24h',
            source: 'reminder_processor'
          }
        });

        // Mark as sent
        appointment.remindersSent.twentyFourHour = true;
        await appointment.save();

        console.log(`24h reminder sent for appointment ${appointment._id}`);
      } catch (error) {
        console.error(`Failed to send 24h reminder for appointment ${appointment._id}:`, error);
      }
    }
  }

  private async process2HourReminders(now: Date): Promise<void> {
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    const appointments = await Appointment.find({
      'appointmentDetails.date': {
        $gte: new Date(twoHoursFromNow.getTime() - 15 * 60 * 1000),
        $lte: new Date(twoHoursFromNow.getTime() + 15 * 60 * 1000)
      },
      status: { $in: ['scheduled', 'confirmed'] },
      'remindersSent.twoHour': false
    });

    for (const appointment of appointments) {
      try {
        // Send SMS reminder
        await notificationService.scheduleNotification({
          userId: appointment.applicationId,
          userType: 'citizen',
          type: 'sms',
          channel: appointment.applicantInfo.phone,
          priority: 'high',
          category: 'reminder',
          message: `Reminder: Your appointment starts in 2 hours at ${appointment.appointmentDetails.timeSlot}. Venue: ${appointment.appointmentDetails.venue.name}. Please arrive 15 minutes early.`,
          metadata: { 
            appointmentId: appointment._id.toString(),
            reminderType: '2h',
            source: 'reminder_processor'
          }
        });

        appointment.remindersSent.twoHour = true;
        await appointment.save();

        console.log(`2h reminder sent for appointment ${appointment._id}`);
      } catch (error) {
        console.error(`Failed to send 2h reminder for appointment ${appointment._id}:`, error);
      }
    }
  }

  private async process30MinuteReminders(now: Date): Promise<void> {
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
    
    const appointments = await Appointment.find({
      'appointmentDetails.date': {
        $gte: new Date(thirtyMinutesFromNow.getTime() - 5 * 60 * 1000),
        $lte: new Date(thirtyMinutesFromNow.getTime() + 5 * 60 * 1000)
      },
      status: { $in: ['scheduled', 'confirmed'] },
      'remindersSent.thirtyMinute': false
    });

    for (const appointment of appointments) {
      try {
        // Send push notification
        await notificationService.scheduleNotification({
          userId: appointment.applicationId,
          userType: 'citizen',
          type: 'push',
          channel: appointment.applicantInfo.email, // In real implementation, this would be device token
          priority: 'urgent',
          category: 'reminder',
          subject: 'Appointment Starting Soon',
          message: `Your appointment starts in 30 minutes. Please head to ${appointment.appointmentDetails.venue.name} now.`,
          metadata: { 
            appointmentId: appointment._id.toString(),
            reminderType: '30min',
            source: 'reminder_processor'
          }
        });

        appointment.remindersSent.thirtyMinute = true;
        await appointment.save();

        console.log(`30min reminder sent for appointment ${appointment._id}`);
      } catch (error) {
        console.error(`Failed to send 30min reminder for appointment ${appointment._id}:`, error);
      }
    }
  }

  public async processOverdueAppointments(): Promise<void> {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    
    // Find appointments that are 30+ minutes overdue
    const overdueAppointments = await Appointment.find({
      'appointmentDetails.date': { $lte: thirtyMinutesAgo },
      status: { $in: ['scheduled', 'confirmed'] }
    });

    for (const appointment of overdueAppointments) {
      try {
        appointment.status = 'no_show';
        await appointment.save();
        
        // Notify officer
        await notificationService.scheduleNotification({
          userId: appointment.officerInfo.officerId,
          userType: 'officer',
          type: 'system',
          channel: 'system',
          priority: 'medium',
          category: 'alert',
          subject: 'No-show Appointment',
          message: `Appointment ${appointment._id} marked as no-show. Applicant: ${appointment.applicantInfo.name}`,
          metadata: { 
            appointmentId: appointment._id.toString(),
            source: 'reminder_processor'
          }
        });

        console.log(`Marked appointment ${appointment._id} as no-show`);
      } catch (error) {
        console.error(`Failed to process overdue appointment ${appointment._id}:`, error);
      }
    }
  }
}

export const reminderProcessor = new ReminderProcessor();