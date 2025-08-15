import { Request, Response } from 'express';
import { Service } from '../../models/Service';
import { redisClient } from '../../config/redis';

// Optional node-cache with fallback
let NodeCache: any;
let cache: any;

try {
  NodeCache = require('node-cache');
  cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache
} catch (error) {
  // Fallback cache implementation
  cache = {
    data: new Map(),
    get: (key: string) => cache.data.get(key),
    set: (key: string, value: any, ttl?: number) => {
      cache.data.set(key, value);
      if (ttl) {
        setTimeout(() => cache.data.delete(key), ttl * 1000);
      }
    }
  };
}

export class ServicesController {
  // GET /api/services
  public async getAllServices(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 20, 
        district, 
        category, 
        status, 
        search,
        departmentCode,
        onlineAvailable
      } = req.query;
      
      const cacheKey = `services:${JSON.stringify(req.query)}`;
      
      // Check cache first
      const cachedResult = cache.get(cacheKey);
      if (cachedResult) {
        res.json(cachedResult);
        return;
      }

      const skip = (Number(page) - 1) * Number(limit);
      const query: any = {};

      // Apply filters
      if (district) query.district = district;
      if (category) query.category = category;
      if (status) query.status = status;
      if (departmentCode) query.departmentCode = departmentCode;
      if (onlineAvailable !== undefined) query.onlineAvailable = onlineAvailable === 'true';
      
      // Apply search
      if (search) {
        query.$text = { $search: search as string };
      }

      const [services, total] = await Promise.all([
        Service.find(query)
          .sort(search ? { score: { $meta: 'textScore' } } : { name: 1 })
          .skip(skip)
          .limit(Number(limit))
          .lean(),
        Service.countDocuments(query)
      ]);

      const result = {
        services,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / Number(limit)),
          hasNext: Number(page) < Math.ceil(total / Number(limit)),
          hasPrev: Number(page) > 1,
          totalItems: total
        }
      };

      // Cache the result
      cache.set(cacheKey, result);
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch services',
        message: error.message 
      });
    }
  }

  // GET /api/services/:id
  public async getService(req: Request, res: Response): Promise<void> {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        res.status(404).json({ error: 'Service not found' });
        return;
      }
      
      res.json({
        success: true,
        service
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch service',
        message: error.message 
      });
    }
  }

  // POST /api/services
  public async createService(req: Request, res: Response): Promise<void> {
    try {
      const serviceData = {
        ...req.body,
        lastUpdated: new Date()
      };
      
      const service = new Service(serviceData);
      await service.save();
      
      // Clear cache
      cache.flushAll();
      
      res.status(201).json({
        success: true,
        service,
        message: 'Service created successfully'
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: 'Failed to create service',
        message: error.message 
      });
    }
  }

  // PUT /api/services/:id
  public async updateService(req: Request, res: Response): Promise<void> {
    try {
      const updateData = {
        ...req.body,
        lastUpdated: new Date()
      };
      
      const service = await Service.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!service) {
        res.status(404).json({ error: 'Service not found' });
        return;
      }

      // Clear cache
      cache.flushAll();
      
      res.json({
        success: true,
        service,
        message: 'Service updated successfully'
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: 'Failed to update service',
        message: error.message 
      });
    }
  }

  // DELETE /api/services/:id
  public async deleteService(req: Request, res: Response): Promise<void> {
    try {
      const service = await Service.findByIdAndDelete(req.params.id);
      if (!service) {
        res.status(404).json({ error: 'Service not found' });
        return;
      }

      // Clear cache
      cache.flushAll();
      
      res.json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to delete service',
        message: error.message 
      });
    }
  }

  // GET /api/services/categories
  public async getServiceCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await Service.distinct('category', { status: 'active' });
      
      res.json({
        success: true,
        categories
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch categories',
        message: error.message 
      });
    }
  }

  // GET /api/services/districts
  public async getServiceDistricts(req: Request, res: Response): Promise<void> {
    try {
      const districts = await Service.distinct('district', { status: 'active' });
      
      res.json({
        success: true,
        districts
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch districts',
        message: error.message 
      });
    }
  }

  // GET /api/services/stats
  public async getServiceStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await Service.aggregate([
        {
          $group: {
            _id: null,
            totalServices: { $sum: 1 },
            activeServices: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            inactiveServices: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
            maintenanceServices: { $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] } },
            onlineServices: { $sum: { $cond: ['$onlineAvailable', 1, 0] } },
            byCategory: {
              $addToSet: '$category'
            },
            byDistrict: {
              $addToSet: '$district'
            }
          }
        }
      ]);
      
      const categoryStats = await Service.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      const districtStats = await Service.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$district', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      
      res.json({
        success: true,
        stats: {
          ...stats[0],
          categoryStats,
          districtStats
        }
      });
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Failed to fetch service statistics',
        message: error.message 
      });
    }
  }
}

export const servicesController = new ServicesController();