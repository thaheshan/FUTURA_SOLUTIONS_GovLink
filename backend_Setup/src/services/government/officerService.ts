const { Officer } = require('../../models/Officer');
import { IOfficer } from '../../types/officer';
import { User } from '../../models/User';
import { NICApplication } from '../../models/NICApplication';
import { Appointment } from '../../models/Appointment';

export class OfficerService {
  private static instance: OfficerService;
  
  public static getInstance(): OfficerService {
    if (!OfficerService.instance) {
      OfficerService.instance = new OfficerService();
    }
    return OfficerService.instance;
  }
  
  public async createOfficer(userId: string, officerData: Partial<IOfficer>): Promise<IOfficer> {
    // Verify user exists and has officer role
    const user = await User.findById(userId);
    if (!user || user.role !== 'officer') {
      throw new Error('User not found or not authorized to be an officer');
    }
    
    const officer = new Officer({
      userId,
      ...officerData
    });
    
    await officer.save();
    return officer;
  }
  
  public async getOfficerById(officerId: string): Promise<IOfficer | null> {
    return await Officer.findOne({ userId: officerId })
      .populate('userId', 'fullName email phoneNumber');
  }
  
  public async updateOfficer(officerId: string, updateData: Partial<IOfficer>): Promise<IOfficer | null> {
    return await Officer.findOneAndUpdate(
      { userId: officerId },
      updateData,
      { new: true, runValidators: true }
    );
  }
  
  public async getOfficersByDepartment(
    department: string,
    filters: any = {},
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;
    const query: any = { department };
    
    if (filters.status) query.status = filters.status;
    if (filters.specialization) query.specializations = { $in: [filters.specialization] };
    
    const [officers, total] = await Promise.all([
      Officer.find(query)
        .populate('userId', 'fullName email phoneNumber')
        .sort({ 'performance.rating': -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Officer.countDocuments(query)
    ]);
    
    return {
      officers,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
        totalItems: total
      }
    };
  }
  
  public async assignApplicationsAutomatically(): Promise<void> {
    // Get unassigned applications
    const unassignedApplications = await NICApplication.find({
      'assignedOfficer.officerId': { $exists: false },
      status: { $in: ['submitted', 'under_review'] }
    }).sort({ priority: -1, submissionDate: 1 });
    
    // Get available officers sorted by current workload
    const availableOfficers = await Officer.find({
      status: 'active',
      $expr: { $lt: ['$workload.current', '$workload.maximum'] }
    }).sort({ 'workload.current': 1 });
    
    if (availableOfficers.length === 0) return;
    
    let officerIndex = 0;
    
    for (const application of unassignedApplications) {
      const officer = availableOfficers[officerIndex];
      
      // Assign application to officer
      await NICApplication.findByIdAndUpdate(application._id, {
        'assignedOfficer': {
          officerId: officer.userId,
          officerName: `${officer.employeeId}`, // You might want to get actual name from User
          assignedDate: new Date()
        }
      });
      
      // Update officer workload
      await Officer.findByIdAndUpdate(officer._id, {
        $inc: { 'workload.current': 1 }
      });
      
      // Move to next officer (round-robin)
      officerIndex = (officerIndex + 1) % availableOfficers.length;
    }
  }
  
  public async getOfficerWorkload(officerId: string): Promise<any> {
    const officer = await Officer.findOne({ userId: officerId });
    if (!officer) {
      throw new Error('Officer not found');
    }
    
    const [applications, appointments, completedToday] = await Promise.all([
      NICApplication.find({ 'assignedOfficer.officerId': officerId })
        .sort({ submissionDate: -1 })
        .limit(10),
      
      Appointment.find({ 
        'officerInfo.officerId': officerId,
        'appointmentDetails.date': {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999))
        }
      }),
      
      NICApplication.countDocuments({
        'assignedOfficer.officerId': officerId,
        actualCompletionDate: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      })
    ]);
    
    return {
      officer,
      currentWorkload: {
        applications: applications.length,
        todayAppointments: appointments.length,
        completedToday
      },
      recentApplications: applications,
      todayAppointments: appointments
    };
  }
  
  public async getOfficerPerformanceReport(
    officerId: string,
    dateRange: { from: Date; to: Date }
  ): Promise<any> {
    const officer = await Officer.findOne({ userId: officerId });
    if (!officer) {
      throw new Error('Officer not found');
    }
    
    const [applicationsStats, appointmentsStats] = await Promise.all([
      NICApplication.aggregate([
        {
          $match: {
            'assignedOfficer.officerId': officerId,
            submissionDate: { $gte: dateRange.from, $lte: dateRange.to }
          }
        },
        {
          $group: {
            _id: null,
            totalApplications: { $sum: 1 },
            completed: { $sum: { $cond: [{ $ne: ['$actualCompletionDate', null] }, 1, 0] } },
            avgProcessingTime: {
              $avg: {
                $cond: [
                  { $ne: ['$actualCompletionDate', null] },
                  { $subtract: ['$actualCompletionDate', '$submissionDate'] },
                  null
                ]
              }
            },
            statusBreakdown: {
              $push: '$status'
            }
          }
        }
      ]),
      
      Appointment.aggregate([
        {
          $match: {
            'officerInfo.officerId': officerId,
            'appointmentDetails.date': { $gte: dateRange.from, $lte: dateRange.to }
          }
        },
        {
          $group: {
            _id: null,
            totalAppointments: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            avgRating: { $avg: '$feedback.rating' }
          }
        }
      ])
    ]);
    
    return {
      officer,
      dateRange,
      applications: applicationsStats[0] || { totalApplications: 0, completed: 0, avgProcessingTime: 0 },
      appointments: appointmentsStats[0] || { totalAppointments: 0, completed: 0, avgRating: 0 }
    };
  }
  
  public async updateOfficerAvailability(
    officerId: string,
    availability: IOfficer['availability']
  ): Promise<IOfficer | null> {
    return await Officer.findOneAndUpdate(
      { userId: officerId },
      { availability },
      { new: true }
    );
  }
  
  public async getTopPerformingOfficers(limit = 10): Promise<IOfficer[]> {
    return await Officer.find({ status: 'active' })
      .populate('userId', 'fullName email')
      .sort({ 
        'performance.rating': -1,
        'performance.applicationsProcessed': -1
      })
      .limit(limit);
  }
}

export const officerService = OfficerService.getInstance();