import { Notification, INotification } from '../../models/Notification';
import * as nodemailer from 'nodemailer';
const twilio = require('twilio');
import { config } from '../../config/environment';

export class NotificationService {
  private static instance: NotificationService;
  private emailTransporter: nodemailer.Transporter;
  private smsClient: any;
  
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }
  
  constructor() {
    this.initializeEmailService();
    this.initializeSMSService();
  }
  
  private initializeEmailService(): void {
    this.emailTransporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS
      }
    });
  }
  
  private initializeSMSService(): void {
    if (config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN) {
      this.smsClient = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
    }
  }
  
  public async sendApplicationConfirmation(application: any): Promise<void> {
    const emailNotification = new Notification({
      userId: application.referenceNumber,
      userType: 'citizen',
      type: 'email',
      channel: application.personalInfo.email,
      priority: 'high',
      category: 'application',
      subject: `NIC Application Submitted Successfully - ${application.referenceNumber}`,
      message: this.generateEmailTemplate('application_confirmation', {
        referenceNumber: application.referenceNumber,
        applicantName: application.personalInfo.fullName,
        trackingUrl: `${config.FRONTEND_URL}/track/${application.referenceNumber}`,
        expectedCompletion: application.expectedCompletionDate?.toDateString()
      }),
      status: 'pending',
      metadata: { 
        applicationType: 'nic', 
        applicationId: application.referenceNumber,
        source: 'nic_service'
      }
    });
    
    const smsNotification = new Notification({
      userId: application.referenceNumber,
      userType: 'citizen',
      type: 'sms',
      channel: application.personalInfo.phoneNumber,
      priority: 'high',
      category: 'application',
      message: `NIC application submitted successfully. Reference: ${application.referenceNumber}. Track at: ${config.FRONTEND_URL}/track/${application.referenceNumber}`,
      status: 'pending',
      metadata: { 
        applicationType: 'nic', 
        applicationId: application.referenceNumber,
        source: 'nic_service'
      }
    });
    
    await Promise.all([emailNotification.save(), smsNotification.save()]);
    await this.processNotificationQueue();
  }
  
  public async sendStatusUpdate(application: any, newStatus: string): Promise<void> {
    const statusMessages = {
      'under_review': {
        subject: 'Application Under Review',
        message: 'Your NIC application is now under review by our team.'
      },
      'document_verification': {
        subject: 'Document Verification in Progress',
        message: 'We are verifying the documents submitted with your application.'
      },
      'approved': {
        subject: 'Application Approved - Ready for Collection',
        message: 'Congratulations! Your NIC application has been approved and is ready for collection.'
      },
      'rejected': {
        subject: 'Application Requires Additional Information',
        message: 'Your application needs additional documentation or correction.'
      },
      'ready_for_collection': {
        subject: 'NIC Ready for Collection',
        message: 'Your National Identity Card is ready for collection.'
      }
    };
    
    const statusInfo = statusMessages[newStatus as keyof typeof statusMessages];
    if (!statusInfo) return;
    
    const emailNotification = new Notification({
      userId: application.referenceNumber,
      userType: 'citizen',
      type: 'email',
      channel: application.personalInfo.email,
      priority: newStatus === 'approved' ? 'high' : 'medium',
      category: 'application',
      subject: `${statusInfo.subject} - ${application.referenceNumber}`,
      message: this.generateEmailTemplate('status_update', {
        referenceNumber: application.referenceNumber,
        applicantName: application.personalInfo.fullName,
        status: newStatus,
        statusMessage: statusInfo.message,
        trackingUrl: `${config.FRONTEND_URL}/track/${application.referenceNumber}`
      }),
      status: 'pending',
      metadata: { 
        applicationType: 'nic', 
        applicationId: application.referenceNumber,
        status: newStatus,
        source: 'nic_service'
      }
    });
    
    await emailNotification.save();
    await this.processNotificationQueue();
  }
  
  public async sendAppointmentConfirmation(appointment: any): Promise<void> {
    const notification = new Notification({
      userId: appointment.applicationId,
      userType: 'citizen',
      type: 'email',
      channel: appointment.applicantInfo.email,
      priority: 'high',
      category: 'appointment',
      subject: 'Appointment Confirmed',
      message: this.generateEmailTemplate('appointment_confirmation', {
        applicantName: appointment.applicantInfo.name,
        appointmentDate: appointment.appointmentDetails.date.toDateString(),
        appointmentTime: appointment.appointmentDetails.timeSlot,
        venue: appointment.appointmentDetails.venue.name,
        address: appointment.appointmentDetails.venue.address,
        officerName: appointment.officerInfo.officerName
      }),
      status: 'pending',
      metadata: { 
        appointmentId: appointment._id,
        source: 'appointment_service'
      }
    });
    
    await notification.save();
    await this.processNotificationQueue();
  }
  
  public async sendAppointmentRescheduled(appointment: any): Promise<void> {
    const notification = new Notification({
      userId: appointment.applicationId,
      userType: 'citizen',
      type: 'email',
      channel: appointment.applicantInfo.email,
      priority: 'high',
      category: 'appointment',
      subject: 'Appointment Rescheduled',
      message: this.generateEmailTemplate('appointment_rescheduled', {
        applicantName: appointment.applicantInfo.name,
        newDate: appointment.appointmentDetails.date.toDateString(),
        newTime: appointment.appointmentDetails.timeSlot,
        venue: appointment.appointmentDetails.venue.name
      }),
      status: 'pending',
      metadata: { 
        appointmentId: appointment._id,
        source: 'appointment_service'
      }
    });
    
    await notification.save();
    await this.processNotificationQueue();
  }
  
  public async sendAppointmentCancelled(appointment: any): Promise<void> {
    const notification = new Notification({
      userId: appointment.applicationId,
      userType: 'citizen',
      type: 'email',
      channel: appointment.applicantInfo.email,
      priority: 'medium',
      category: 'appointment',
      subject: 'Appointment Cancelled',
      message: this.generateEmailTemplate('appointment_cancelled', {
        applicantName: appointment.applicantInfo.name,
        originalDate: appointment.appointmentDetails.date.toDateString(),
        originalTime: appointment.appointmentDetails.timeSlot,
        reason: appointment.cancellationReason
      }),
      status: 'pending',
      metadata: { 
        appointmentId: appointment._id,
        source: 'appointment_service'
      }
    });
    
    await notification.save();
    await this.processNotificationQueue();
  }
  
  public async sendOfficerAssignment(application: any, officerId: string): Promise<void> {
    const notification = new Notification({
      userId: officerId,
      userType: 'officer',
      type: 'system',
      channel: 'system',
      priority: 'medium',
      category: 'application',
      subject: 'New Application Assigned',
      message: `New ${application.applicationType} application assigned: ${application.referenceNumber}`,
      status: 'pending',
      actionRequired: true,
      actionUrl: `/admin/applications/${application.referenceNumber}`,
      metadata: { 
        applicationId: application.referenceNumber,
        source: 'nic_service'
      }
    });
    
    await notification.save();
    await this.processNotificationQueue();
  }
  
  public async scheduleNotification(notificationData: Partial<INotification>): Promise<void> {
    const notification = new Notification({
      ...notificationData,
      status: 'pending'
    });
    
    await notification.save();
  }
  
  public async processNotificationQueue(): Promise<void> {
    const pendingNotifications = await Notification.find({
      status: 'pending',
      $or: [
        { scheduledAt: { $exists: false } },
        { scheduledAt: { $lte: new Date() } }
      ]
    })
    .sort({ priority: -1, createdAt: 1 })
    .limit(100);
    
    const promises = pendingNotifications.map(async (notification) => {
      try {
        await this.sendNotification(notification);
        notification.status = 'sent';
        notification.sentAt = new Date();
      } catch (error) {
        notification.retryCount += 1;
        
        if (notification.retryCount >= notification.maxRetries) {
          notification.status = 'failed';
          notification.failureReason = error.message;
        } else {
          // Schedule retry in 5 minutes
          notification.scheduledAt = new Date(Date.now() + 5 * 60 * 1000);
        }
        
        console.error(`Failed to send notification ${notification._id}:`, error);
      }
      
      await notification.save();
    });
    
    await Promise.all(promises);
  }
  
  private async sendNotification(notification: INotification): Promise<void> {
    switch (notification.type) {
      case 'email':
        await this.sendEmail(notification);
        break;
      case 'sms':
        await this.sendSMS(notification);
        break;
      case 'push':
        await this.sendPushNotification(notification);
        break;
      case 'system':
        // System notifications are stored in database only
        break;
    }
  }
  
  private async sendEmail(notification: INotification): Promise<void> {
    const mailOptions = {
      from: `"Government Services" <${config.SMTP_USER}>`,
      to: notification.channel,
      subject: notification.subject || 'Government Services Notification',
      html: notification.message,
      priority: (notification.priority === 'urgent' ? 'high' : 'normal') as 'high' | 'normal' | 'low'
    };
    
    await this.emailTransporter.sendMail(mailOptions);
  }
  
  private async sendSMS(notification: INotification): Promise<void> {
    if (!this.smsClient) {
      throw new Error('SMS service not configured');
    }
    
    await this.smsClient.messages.create({
      body: notification.message,
      from: config.TWILIO_PHONE_NUMBER,
      to: notification.channel
    });
  }
  
  private async sendPushNotification(notification: INotification): Promise<void> {
    // Push notification implementation would depend on the service used
    // (Firebase, OneSignal, etc.)
    console.log(`Push notification sent: ${notification.message}`);
  }
  
  private generateEmailTemplate(templateType: string, variables: any): string {
    const templates = {
      'application_confirmation': `
        <h2>Application Submitted Successfully</h2>
        <p>Dear ${variables.applicantName},</p>
        <p>Your NIC application has been submitted successfully.</p>
        <p><strong>Reference Number:</strong> ${variables.referenceNumber}</p>
        <p><strong>Expected Completion:</strong> ${variables.expectedCompletion}</p>
        <p>You can track your application status at: <a href="${variables.trackingUrl}">${variables.trackingUrl}</a></p>
        <p>Thank you for using our services.</p>
      `,
      'status_update': `
        <h2>Application Status Update</h2>
        <p>Dear ${variables.applicantName},</p>
        <p><strong>Reference Number:</strong> ${variables.referenceNumber}</p>
        <p><strong>Status:</strong> ${variables.status.replace('_', ' ').toUpperCase()}</p>
        <p>${variables.statusMessage}</p>
        <p>Track your application: <a href="${variables.trackingUrl}">Click here</a></p>
      `,
      'appointment_confirmation': `
        <h2>Appointment Confirmed</h2>
        <p>Dear ${variables.applicantName},</p>
        <p>Your appointment has been confirmed for:</p>
        <p><strong>Date:</strong> ${variables.appointmentDate}</p>
        <p><strong>Time:</strong> ${variables.appointmentTime}</p>
        <p><strong>Venue:</strong> ${variables.venue}</p>
        <p><strong>Address:</strong> ${variables.address}</p>
        <p><strong>Officer:</strong> ${variables.officerName}</p>
        <p>Please arrive 15 minutes early.</p>
      `,
      'appointment_rescheduled': `
        <h2>Appointment Rescheduled</h2>
        <p>Dear ${variables.applicantName},</p>
        <p>Your appointment has been rescheduled to:</p>
        <p><strong>New Date:</strong> ${variables.newDate}</p>
        <p><strong>New Time:</strong> ${variables.newTime}</p>
        <p><strong>Venue:</strong> ${variables.venue}</p>
      `,
      'appointment_cancelled': `
        <h2>Appointment Cancelled</h2>
        <p>Dear ${variables.applicantName},</p>
        <p>Your appointment scheduled for ${variables.originalDate} at ${variables.originalTime} has been cancelled.</p>
        <p><strong>Reason:</strong> ${variables.reason}</p>
        <p>Please reschedule your appointment at your convenience.</p>
      `
    };
    
    return templates[templateType as keyof typeof templates] || variables.message;
  }
  
  public async getNotificationsByUser(
    userId: string,
    filters: any = {},
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;
    const query: any = { userId };
    
    if (filters.type) query.type = filters.type;
    if (filters.category) query.category = filters.category;
    if (filters.status) query.status = filters.status;
    if (filters.read === 'true') query.readAt = { $exists: true };
    if (filters.read === 'false') query.readAt = { $exists: false };
    
    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query)
    ]);
    
    return {
      notifications,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
        totalItems: total
      }
    };
  }
  
  public async markAsRead(notificationId: string, userId: string): Promise<void> {
    await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { readAt: new Date() }
    );
  }
  
  public async getNotificationStats(userId: string): Promise<any> {
    const stats = await Notification.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { $sum: { $cond: [{ $exists: ['$readAt', false] }, 1, 0] } },
          byType: {
            $push: {
              type: '$type',
              status: '$status'
            }
          }
        }
      }
    ]);
    
    return stats[0] || { total: 0, unread: 0, byType: [] };
  }
}

export const notificationService = NotificationService.getInstance();