import { Request, Response } from 'express';
import { officerService } from '../../services/government/officerService';
import { AuthenticatedRequest } from '../../middleware/auth/authenticate';

export class OfficerController {
  // POST /api/officers
  public async createOfficer(req: Request, res: Response): Promise<void> {
    try {
      const officerData = req.body;
      
      const officer = await officerService.createOfficer(
        officerData.userId,
        officerData
      );
      
      res.status(201).json({
        success: true,
        officer,
        message: 'Officer created successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        error: 'Failed to create officer',
        message: error.message
      });
    }
  }

  // GET /api/officers/:id
  public async getOfficer(req: Request, res: Response): Promise<void> {
    try {
      const officer = await officerService.getOfficerById(req.params.id);
      
      if (!officer) {
        res.status(404).json({ error: 'Officer not found' });
        return;
      }
      
      res.json({
        success: true,
        officer
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch officer',
        message: error.message
      });
    }
  }

  // PUT /api/officers/:id
  public async updateOfficer(req: Request, res: Response): Promise<void> {
    try {
      const officer = await officerService.updateOfficer(
        req.params.id,
        req.body
      );
      
      if (!officer) {
        res.status(404).json({ error: 'Officer not found' });
        return;
      }
      
      res.json({
        success: true,
        officer,
        message: 'Officer updated successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        error: 'Failed to update officer',
        message: error.message
      });
    }
  }

  // GET /api/officers/department/:department
  public async getOfficersByDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { department } = req.params;
      const { page = 1, limit = 20, ...filters } = req.query;
      
      const result = await officerService.getOfficersByDepartment(
        department,
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
        error: 'Failed to fetch officers',
        message: error.message
      });
    }
  }

  // GET /api/officers/:id/workload
  public async getOfficerWorkload(req: Request, res: Response): Promise<void> {
    try {
      const workload = await officerService.getOfficerWorkload(req.params.id);
      
      res.json({
        success: true,
        workload
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch officer workload',
        message: error.message
      });
    }
  }

  // GET /api/officers/:id/performance
  public async getOfficerPerformance(req: Request, res: Response): Promise<void> {
    try {
      const { dateFrom, dateTo } = req.query;
      
      const dateRange = {
        from: dateFrom ? new Date(dateFrom as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: dateTo ? new Date(dateTo as string) : new Date()
      };
      
      const performance = await officerService.getOfficerPerformanceReport(
        req.params.id,
        dateRange
      );
      
      res.json({
        success: true,
        performance
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch officer performance',
        message: error.message
      });
    }
  }

  // PUT /api/officers/:id/availability
  public async updateAvailability(req: Request, res: Response): Promise<void> {
    try {
      const { availability } = req.body;
      
      const officer = await officerService.updateOfficerAvailability(
        req.params.id,
        availability
      );
      
      if (!officer) {
        res.status(404).json({ error: 'Officer not found' });
        return;
      }
      
      res.json({
        success: true,
        officer,
        message: 'Availability updated successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        error: 'Failed to update availability',
        message: error.message
      });
    }
  }

  // GET /api/officers/top-performers
  public async getTopPerformers(req: Request, res: Response): Promise<void> {
    try {
      const { limit = 10 } = req.query;
      
      const officers = await officerService.getTopPerformingOfficers(Number(limit));
      
      res.json({
        success: true,
        officers
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to fetch top performers',
        message: error.message
      });
    }
  }

  // POST /api/officers/auto-assign
  public async autoAssignApplications(req: Request, res: Response): Promise<void> {
    try {
      await officerService.assignApplicationsAutomatically();
      
      res.json({
        success: true,
        message: 'Applications assigned automatically'
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to auto-assign applications',
        message: error.message
      });
    }
  }
}

export const officerController = new OfficerController();