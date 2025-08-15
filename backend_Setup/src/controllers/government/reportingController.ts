import { Request, Response } from 'express';
import { NICApplication } from '../../models/NICApplication';
import { Appointment } from '../../models/Appointment';
import { Officer } from '../../models/office';
import { Service } from '../../models/Service';

export class ReportingController {
  // GET /api/reports/dashboard
  public async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const { dateFrom, dateTo } = req.query;
      
      const dateRange = {
        $gte: dateFrom ? new Date(dateFrom as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        $lte: dateTo ? new Date(dateTo as string) : new Date()
      };
      
      const [
        applicationStats,
        appointmentStats,
        officerStats,
        serviceStats,
        recentActivities
      ] = await Promise.all([
        // Application statistics
        NICApplication.aggregate([
          { $match: { submissionDate: dateRange } },
          {
            $group: {
              _id: null,
              totalApplications: { $sum: 1 },
              pending: { $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] } },
              processing: { $sum: { $cond: [{ $eq: ['$status', 'under_review'] }, 1, 0] } },
              approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
              rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
              avgProcessingTime: {
                $avg: {
                  $cond: [
                    { $ne: ['$actualCompletionDate', null] },
                    { $divide: [{ $subtract: ['$actualCompletionDate', '$submissionDate'] }, 86400000] },
                    null
                  ]
                }
              }
            }
          }
        ]),
        
        // Appointment statistics
        Appointment.aggregate([
          { $match: { 'appointmentDetails.date': dateRange } },
          {
            $group: {
              _id: null,
              totalAppointments: { $sum: 1 },
              completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
              cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
              noShow: { $sum: { $cond: [{ $eq: ['$status', 'no_show'] }, 1, 0] } },
              avgRating: { $avg: '$feedback.rating' }
            }
          }
        ]),
        
        // Officer statistics
        Officer.aggregate([
          { $match: { status: 'active' } },
          {
            $group: {
              _id: null,
              totalOfficers: { $sum: 1 },
              avgWorkload: { $avg: '$workload.current' },
              avgRating: { $avg: '$performance.rating' },
              totalProcessed: { $sum: '$performance.applicationsProcessed' }
            }
          }
        ]),
        
        // Service statistics
        Service.aggregate([
          {
            $group: {
              _id: null,
              totalServices: { $sum: 1 },
              activeServices: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
              onlineServices: { $sum: { $cond: ['$onlineAvailable', 1, 0] } }
            }
          }
        ]),
        
        // Recent activities
        NICApplication.find({ submissionDate: dateRange })
          .sort({ submissionDate: -1 })
          .limit(10)
          .select('referenceNumber personalInfo.fullName status submissionDate')
      ]);
      
      const stats = {
        applications: applicationStats[0] || { totalApplications: 0, pending: 0, processing: 0, approved: 0, rejected: 0, avgProcessingTime: 0 },
        appointments: appointmentStats[0] || { totalAppointments: 0, completed: 0, cancelled: 0, noShow: 0, avgRating: 0 },
        officers: officerStats[0] || { totalOfficers: 0, avgWorkload: 0, avgRating: 0, totalProcessed: 0 },
        services: serviceStats[0] || { totalServices: 0, activeServices: 0, onlineServices: 0 },
        recentActivities
      };
      
      res.json({
        success: true,
        stats,
        dateRange: { from: dateRange.$gte, to: dateRange.$lte }
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch dashboard statistics',
        message: error.message
      });
    }
  }

  // GET /api/reports/applications
  public async getApplicationReport(req: Request, res: Response): Promise<void> {
    try {
      const { dateFrom, dateTo, groupBy = 'day' } = req.query;
      
      const matchStage: any = {};
      if (dateFrom || dateTo) {
        matchStage.submissionDate = {};
        if (dateFrom) matchStage.submissionDate.$gte = new Date(dateFrom as string);
        if (dateTo) matchStage.submissionDate.$lte = new Date(dateTo as string);
      }
      
      let groupStage: any = {};
      if (groupBy === 'day') {
        groupStage._id = {
          year: { $year: '$submissionDate' },
          month: { $month: '$submissionDate' },
          day: { $dayOfMonth: '$submissionDate' }
        };
      } else if (groupBy === 'month') {
        groupStage._id = {
          year: { $year: '$submissionDate' },
          month: { $month: '$submissionDate' }
        };
      } else if (groupBy === 'status') {
        groupStage._id = '$status';
      }
      
      const report = await NICApplication.aggregate([
        { $match: matchStage },
        {
          $group: {
            ...groupStage,
            count: { $sum: 1 },
            newApplications: { $sum: { $cond: [{ $eq: ['$applicationType', 'new'] }, 1, 0] } },
            renewals: { $sum: { $cond: [{ $eq: ['$applicationType', 'renewal'] }, 1, 0] } },
            replacements: { $sum: { $cond: [{ $eq: ['$applicationType', 'replacement'] }, 1, 0] } },
            corrections: { $sum: { $cond: [{ $eq: ['$applicationType', 'correction'] }, 1, 0] } }
          }
        },
        { $sort: { '_id': 1 } }
      ]);
      
      res.json({
        success: true,
        report,
        groupBy
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to generate application report',
        message: error.message
      });
    }
  }

  // GET /api/reports/performance
  public async getPerformanceReport(req: Request, res: Response): Promise<void> {
    try {
      const { dateFrom, dateTo, departmentCode } = req.query;
      
      const matchStage: any = {};
      if (dateFrom || dateTo) {
        matchStage['assignedOfficer.assignedDate'] = {};
        if (dateFrom) matchStage['assignedOfficer.assignedDate'].$gte = new Date(dateFrom as string);
        if (dateTo) matchStage['assignedOfficer.assignedDate'].$lte = new Date(dateTo as string);
      }
      
      const performanceReport = await NICApplication.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: 'officers',
            localField: 'assignedOfficer.officerId',
            foreignField: 'userId',
            as: 'officer'
          }
        },
        { $unwind: { path: '$officer', preserveNullAndEmptyArrays: true } },
        ...(departmentCode ? [{ $match: { 'officer.department': departmentCode } }] : []),
        {
          $group: {
            _id: {
              officerId: '$assignedOfficer.officerId',
              officerName: '$assignedOfficer.officerName',
              department: '$officer.department'
            },
            totalAssigned: { $sum: 1 },
            completed: { 
              $sum: { $cond: [{ $ne: ['$actualCompletionDate', null] }, 1, 0] } 
            },
            avgProcessingTime: {
              $avg: {
                $cond: [
                  { $ne: ['$actualCompletionDate', null] },
                  { $divide: [{ $subtract: ['$actualCompletionDate', '$submissionDate'] }, 86400000] },
                  null
                ]
              }
            },
            approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
            rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
          }
        },
        {
          $addFields: {
            completionRate: { $divide: ['$completed', '$totalAssigned'] },
            approvalRate: { $divide: ['$approved', '$totalAssigned'] }
          }
        },
        { $sort: { completionRate: -1, avgProcessingTime: 1 } }
      ]);
      
      res.json({
        success: true,
        report: performanceReport
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to generate performance report',
        message: error.message
      });
    }
  }

  // POST /api/reports/export
  public async exportReport(req: Request, res: Response): Promise<void> {
    try {
      const { reportType, format, filters } = req.body;
      
      // This is a simplified version - you would implement actual PDF/Excel generation
      let data: any[] = [];
      
      switch (reportType) {
        case 'applications':
          data = await NICApplication.find(filters).lean();
          break;
        case 'appointments':
          data = await Appointment.find(filters).lean();
          break;
        case 'officers':
          data = await Officer.find(filters).populate('userId', 'fullName email').lean();
          break;
        default:
          res.status(400).json({ error: 'Invalid report type' });
          return;
      }
      
      if (format === 'csv') {
        // Generate CSV
        const csv = this.generateCSV(data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${reportType}-report.csv"`);
        res.send(csv);
      } else if (format === 'json') {
        res.json({
          success: true,
          data,
          count: data.length
        });
      } else {
        res.status(400).json({ error: 'Unsupported format' });
      }
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to export report',
        message: error.message
      });
    }
  }

  private generateCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }
}

export const reportingController = new ReportingController();