import { NICApplication, INICApplication } from '../../models/NICApplication';
import { notificationService } from '../notification/notificationService';
import { User } from '../../models/User';

export class NICService {
  private static instance: NICService;

  public static getInstance(): NICService {
    if (!NICService.instance) {
      NICService.instance = new NICService();
    }
    return NICService.instance;
  }

  public async submitApplication(applicationData: any): Promise<INICApplication> {
    try {
      // Generate reference number
      const referenceNumber = this.generateReferenceNumber();
      
      // Create application
      const application = new NICApplication({
        ...applicationData,
        referenceNumber,
        status: 'submitted',
        submissionDate: new Date(),
        expectedCompletionDate: this.calculateExpectedCompletion()
      });

      await application.save();

      // Send confirmation notification
      await notificationService.sendApplicationConfirmation(application);

      return application;
    } catch (error) {
      throw new Error(`Failed to submit application: ${error.message}`);
    }
  }

  public async updateApplicationStatus(
    referenceNumber: string,
    newStatus: string,
    officerId?: string,
    officerName?: string,
    notes?: string
  ): Promise<INICApplication | null> {
    try {
      const application = await NICApplication.findOne({ referenceNumber });

      if (!application) {
        throw new Error('Application not found');
      }

      // Update status
      application.status = newStatus as 'submitted' | 'under_review' | 'document_verification' | 'approved' | 'rejected' | 'ready_for_collection';
      
      // Add to status history
      application.statusHistory.push({
        status: newStatus,
        timestamp: new Date(),
        officerId,
        officerName,
        officerNotes: notes
      });

      // Set completion date if approved
      if (newStatus === 'approved' || newStatus === 'completed') {
        application.actualCompletionDate = new Date();
      }

      await application.save();

      // Send status update notification
      await notificationService.sendStatusUpdate(application, newStatus);

      return application;
    } catch (error) {
      throw new Error(`Failed to update application status: ${error.message}`);
    }
  }

  public async assignOfficer(
    referenceNumber: string,
    officerId: string,
    officerName: string,
    department: string
  ): Promise<INICApplication | null> {
    try {
      const application = await NICApplication.findOne({ referenceNumber });

      if (!application) {
        throw new Error('Application not found');
      }

      application.assignedOfficer = {
        officerId,
        officerName,
        assignedDate: new Date()
      } as any;

      application.status = 'under_review';

      // Add to status history
      application.statusHistory.push({
        status: 'under_review',
        timestamp: new Date(),
        officerId,
        officerName,
        officerNotes: `Application assigned to ${officerName}`
      });

      await application.save();

      // Notify officer about assignment
      await notificationService.sendOfficerAssignment(application, officerId);

      return application;
    } catch (error: any) {
      throw new Error(`Failed to assign officer: ${error.message}`);
    }
  }

  public async getApplicationByReference(referenceNumber: string): Promise<INICApplication | null> {
    return await NICApplication.findOne({ referenceNumber })
      .populate('assignedOfficer.officerId', 'fullName department')
      .lean();
  }

  public async searchApplications(filters: any, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const query: any = {};
    
    // Apply filters
    if (filters.status) query.status = filters.status;
    if (filters.applicationType) query.applicationType = filters.applicationType;
    if (filters.priority) query.priority = filters.priority;
    if (filters.district) query['personalInfo.address.district'] = filters.district;
    if (filters.assignedOfficer) query['assignedOfficer.officerId'] = filters.assignedOfficer;
    
    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      query.submissionDate = {};
      if (filters.dateFrom) query.submissionDate.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.submissionDate.$lte = new Date(filters.dateTo);
    }
    
    // Search by reference number or name
    if (filters.search) {
      query.$or = [
        { referenceNumber: new RegExp(filters.search, 'i') },
        { 'personalInfo.fullName': new RegExp(filters.search, 'i') }
      ];
    }
    
    const [applications, total] = await Promise.all([
      NICApplication.find(query)
        .sort({ submissionDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate('assignedOfficer.officerId', 'fullName department')
        .lean(),
      NICApplication.countDocuments(query)
    ]);
    
    return {
      applications,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
        totalItems: total
      }
    };
  }

  public async bulkUpdateStatus(
    applicationIds: string[],
    newStatus: string,
    officerId: string,
    officerName: string,
    notes?: string
  ): Promise<number> {
    const result = await NICApplication.updateMany(
      { _id: { $in: applicationIds } },
      {
        $set: { status: newStatus },
        $push: {
          statusHistory: {
            status: newStatus,
            timestamp: new Date(),
            officerId,
            officerName,
            officerNotes: notes
          }
        }
      }
    );
    
    return result.modifiedCount;
  }
  
  public async getApplicationStats(dateRange?: { from: Date; to: Date }) {
    const matchStage: any = {};
    if (dateRange) {
      matchStage.submissionDate = {
        $gte: dateRange.from,
        $lte: dateRange.to
      };
    }
    
    const stats = await NICApplication.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          submitted: { $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] } },
          underReview: { $sum: { $cond: [{ $eq: ['$status', 'under_review'] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
          avgProcessingTime: {
            $avg: {
              $cond: [
                { $ne: ['$actualCompletionDate', null] },
                { $subtract: ['$actualCompletionDate', '$submissionDate'] },
                null
              ]
            }
          }
        }
      }
    ]);
    
    return stats[0] || {
      totalApplications: 0,
      submitted: 0,
      underReview: 0,
      approved: 0,
      rejected: 0,
      avgProcessingTime: 0
    };
  }

  private generateReferenceNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `NIC-${timestamp.slice(-6)}-${random}`;
  }

  private calculateExpectedCompletion(): Date {
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + 14); // 14 days processing time
    return completionDate;
  }

  public async getApplicationsByUserId(userId: string): Promise<INICApplication[]> {
    return await NICApplication.find({ userId })
      .sort({ submissionDate: -1 })
      .lean();
  }

  public async validateApplication(referenceNumber: string, validationNotes: string): Promise<INICApplication | null> {
    try {
      const application = await NICApplication.findOne({ referenceNumber });

      if (!application) {
        throw new Error('Application not found');
      }

      (application as any).validationStatus = 'validated';
      (application as any).validationNotes = validationNotes;
      (application as any).validatedDate = new Date();

      await application.save();
      return application;
    } catch (error: any) {
      throw new Error(`Failed to validate application: ${error.message}`);
    }
  }
}

export const nicService = NICService.getInstance();