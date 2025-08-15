import { Request, Response } from 'express';
import { nicService } from '../../services/registry/nicService';

// Define Multer file interface
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

// Extended Request interface for files that matches Express.Multer types
interface RequestWithFiles extends Request {
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined;
}

export class NICController {
  // POST /api/nic/applications
  public async submitApplication(req: RequestWithFiles, res: Response): Promise<void> {
    try {
      // Handle different multer file formats
      let files: Express.Multer.File[] = [];
      
      if (Array.isArray(req.files)) {
        files = req.files;
      } else if (req.files && typeof req.files === 'object') {
        // If files is an object with fieldnames, extract all files
        files = Object.values(req.files).flat();
      }
      
      const userId = (req as any).user.userId; // From auth middleware
      
      if (!files || files.length === 0) {
        res.status(400).json({ 
          error: 'At least one document is required' 
        });
        return;
      }
      
      // Prepare application data with user ID and file information
      const applicationData = {
        ...req.body,
        userId,
        documents: files.map(file => ({
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size
        }))
      };
      
      const application = await nicService.submitApplication(applicationData);
      
      res.status(201).json({
        success: true,
        referenceNumber: application.referenceNumber,
        expectedCompletionDate: application.expectedCompletionDate,
        message: 'Application submitted successfully'
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: 'Failed to submit application',
        message: error.message 
      });
    }
  }

  // GET /api/nic/applications/:referenceNumber
  public async getApplication(req: Request, res: Response): Promise<void> {
    try {
      const application = await nicService.getApplicationByReference(req.params.referenceNumber);
      
      if (!application) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }
      
      res.json({
        success: true,
        application
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch application',
        message: error.message 
      });
    }
  }

  // PUT /api/nic/applications/:referenceNumber/status
  public async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status, officerNotes } = req.body;
      const officerId = (req as any).user.userId;
      const officerName = (req as any).user.fullName;
      
      const application = await nicService.updateApplicationStatus(
        req.params.referenceNumber,
        status,
        officerNotes,
        officerId,
        officerName
      );
      
      res.json({
        success: true,
        application,
        message: 'Status updated successfully'
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: 'Failed to update status',
        message: error.message 
      });
    }
  }

  // GET /api/nic/applications
  public async searchApplications(req: Request, res: Response): Promise<void> {
    try {
      const result = await nicService.searchApplications(
        req.query,
        Number(req.query.page) || 1,
        Number(req.query.limit) || 20
      );
      
      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to search applications',
        message: error.message 
      });
    }
  }

  // PUT /api/nic/applications/:referenceNumber/assign
  public async assignOfficer(req: Request, res: Response): Promise<void> {
    try {
      const { officerId, officerName, department } = req.body;
      
      const application = await nicService.assignOfficer(
        req.params.referenceNumber,
        officerId,
        officerName,
        department
      );
      
      res.json({
        success: true,
        application,
        message: 'Officer assigned successfully'
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: 'Failed to assign officer',
        message: error.message 
      });
    }
  }

  // POST /api/nic/applications/bulk-update
  public async bulkUpdateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { applicationIds, status, notes } = req.body;
      const officerId = (req as any).user.userId;
      const officerName = (req as any).user.fullName;
      
      const updatedCount = await nicService.bulkUpdateStatus(
        applicationIds,
        status,
        officerId,
        officerName,
        notes
      );
      
      res.json({
        success: true,
        updatedCount,
        message: `${updatedCount} applications updated successfully`
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: 'Failed to bulk update applications',
        message: error.message 
      });
    }
  }

  // GET /api/nic/applications/stats
  public async getApplicationStats(req: Request, res: Response): Promise<void> {
    try {
      let dateRange;
      
      if (req.query.dateFrom || req.query.dateTo) {
        dateRange = {
          from: req.query.dateFrom ? new Date(req.query.dateFrom as string) : new Date(0),
          to: req.query.dateTo ? new Date(req.query.dateTo as string) : new Date()
        };
      }
      
      const stats = await nicService.getApplicationStats(dateRange);
      
      res.json({
        success: true,
        stats,
        dateRange
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch application statistics',
        message: error.message 
      });
    }
  }

  // GET /api/nic/track/:referenceNumber
  public async trackApplication(req: Request, res: Response): Promise<void> {
    try {
      const application = await nicService.getApplicationByReference(req.params.referenceNumber);
      
      if (!application) {
        res.status(404).json({ error: 'Application not found' });
        return;
      }
      
      // Return only tracking information (no sensitive data)
      const trackingInfo = {
        referenceNumber: application.referenceNumber,
        applicationType: application.applicationType,
        status: application.status,
        statusHistory: application.statusHistory,
        submissionDate: application.submissionDate,
        expectedCompletionDate: application.expectedCompletionDate,
        actualCompletionDate: application.actualCompletionDate,
        qrCode: application.qrCode
      };
      
      res.json({
        success: true,
        trackingInfo
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to track application',
        message: error.message 
      });
    }
  }
}

export const nicController = new NICController();