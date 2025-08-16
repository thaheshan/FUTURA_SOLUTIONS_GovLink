// File: Database/Redis/caching_strategy.js
// Redis caching implementation for Node.js application

const redis = require('redis');
const client = redis.createClient({
  host: 'sri_gov_redis',
  port: 6379,
  password: process.env.REDIS_PASSWORD
});

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

const CACHE_KEYS = {
  USER_PROFILE: 'user:profile:',
  USER_APPLICATIONS: 'user:applications:',
  SERVICE_LIST: 'services:all',
  SERVICE_DETAILS: 'service:',
  DISTRICT_SERVICES: 'district:services:',
  OFFICER_WORKLOAD: 'officer:workload:',
  APPLICATION_DETAILS: 'application:',
  DASHBOARD_STATS: 'dashboard:stats',
  SEARCH_RESULTS: 'search:results:'
};

const CACHE_TTL = {
  USER_PROFILE: 3600,        // 1 hour
  USER_APPLICATIONS: 1800,   // 30 minutes
  SERVICE_LIST: 7200,        // 2 hours
  SERVICE_DETAILS: 3600,     // 1 hour
  DISTRICT_SERVICES: 3600,   // 1 hour
  OFFICER_WORKLOAD: 900,     // 15 minutes
  APPLICATION_DETAILS: 1800, // 30 minutes
  DASHBOARD_STATS: 300,      // 5 minutes
  SEARCH_RESULTS: 600        // 10 minutes
};

// ============================================================================
// CACHE-ASIDE PATTERN IMPLEMENTATION
// ============================================================================

class CacheService {
  constructor() {
    this.client = client;
    this.hitCount = 0;
    this.missCount = 0;
  }

  // Generic cache get with fallback
  async getCachedData(key, fallbackFunction, ttl = 3600) {
    try {
      // Try to get from cache first
      const cachedData = await this.client.get(key);
      
      if (cachedData) {
        this.hitCount++;
        return JSON.parse(cachedData);
      }

      // Cache miss - get from database
      this.missCount++;
      const data = await fallbackFunction();
      
      if (data) {
        // Store in cache
        await this.client.setex(key, ttl, JSON.stringify(data));
      }
      
      return data;
    } catch (error) {
      console.error('Cache error:', error);
      // Fallback to database on cache error
      return await fallbackFunction();
    }
  }

  // User profile caching
  async getUserProfile(userId) {
    const cacheKey = CACHE_KEYS.USER_PROFILE + userId;
    
    return await this.getCachedData(cacheKey, async () => {
      const user = await db.users.findOne(
        { _id: ObjectId(userId) },
        { projection: { password: 0 } }
      );
      
      if (user) {
        const profile = await db.citizen_profiles.findOne({ user_id: ObjectId(userId) });
        return { ...user, profile };
      }
      return null;
    }, CACHE_TTL.USER_PROFILE);
  }

  // User applications caching
  async getUserApplications(userId, status = null) {
    const cacheKey = CACHE_KEYS.USER_APPLICATIONS + userId + (status ? ':' + status : '');
    
    return await this.getCachedData(cacheKey, async () => {
      const query = { user_id: ObjectId(userId) };
      if (status) query.status = status;
      
      return await db.applications.find(query)
        .sort({ submitted_at: -1 })
        .limit(50)
        .toArray();
    }, CACHE_TTL.USER_APPLICATIONS);
  }

  // Services caching
  async getActiveServices(district = null) {
    const cacheKey = district ? 
      CACHE_KEYS.DISTRICT_SERVICES + district : 
      CACHE_KEYS.SERVICE_LIST;
    
    return await this.getCachedData(cacheKey, async () => {
      const query = { status: 'active' };
      if (district) {
        query.eligible_districts = district;
      }
      
      return await db.services.find(query)
        .sort({ name: 1 })
        .toArray();
    }, CACHE_TTL.SERVICE_LIST);
  }

  // Service details caching
  async getServiceDetails(serviceId) {
    const cacheKey = CACHE_KEYS.SERVICE_DETAILS + serviceId;
    
    return await this.getCachedData(cacheKey, async () => {
      return await db.services.findOne({ _id: ObjectId(serviceId) });
    }, CACHE_TTL.SERVICE_DETAILS);
  }

  // Officer workload caching
  async getOfficerWorkload(officerId) {
    const cacheKey = CACHE_KEYS.OFFICER_WORKLOAD + officerId;
    
    return await this.getCachedData(cacheKey, async () => {
      const activeApplications = await db.applications.countDocuments({
        assigned_officer: ObjectId(officerId),
        status: { $in: ['under_review', 'additional_info_required'] }
      });
      
      const pendingApplications = await db.applications.find({
        assigned_officer: ObjectId(officerId),
        status: 'under_review'
      }).sort({ priority: 1, submitted_at: 1 }).limit(10).toArray();
      
      return {
        activeCount: activeApplications,
        pendingApplications: pendingApplications
      };
    }, CACHE_TTL.OFFICER_WORKLOAD);
  }

  // Dashboard statistics caching
  async getDashboardStats() {
    const cacheKey = CACHE_KEYS.DASHBOARD_STATS;
    
    return await this.getCachedData(cacheKey, async () => {
      const stats = await db.applications.aggregate([
        {
          $facet: {
            statusCounts: [
              {
                $group: {
                  _id: "$status",
                  count: { $sum: 1 }
                }
              }
            ],
            todaySubmissions: [
              {
                $match: {
                  submitted_at: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0))
                  }
                }
              },
              { $count: "today" }
            ],
            averageProcessingTime: [
              {
                $match: {
                  status: "completed",
                  completed_at: { $exists: true }
                }
              },
              {
                $project: {
                  processingDays: {
                    $divide: [
                      { $subtract: ["$completed_at", "$submitted_at"] },
                      1000 * 60 * 60 * 24
                    ]
                  }
                }
              },
              {
                $group: {
                  _id: null,
                  avgDays: { $avg: "$processingDays" }
                }
              }
            ]
          }
        }
      ]).toArray();
      
      return stats[0];
    }, CACHE_TTL.DASHBOARD_STATS);
  }

  // ============================================================================
  // CACHE INVALIDATION
  // ============================================================================

  async invalidateUserCache(userId) {
    const keys = [
      CACHE_KEYS.USER_PROFILE + userId,
      CACHE_KEYS.USER_APPLICATIONS + userId,
      CACHE_KEYS.USER_APPLICATIONS + userId + ':*'
    ];
    
    for (const key of keys) {
      if (key.includes('*')) {
        const matchingKeys = await this.client.keys(key);
        if (matchingKeys.length > 0) {
          await this.client.del(matchingKeys);
        }
      } else {
        await this.client.del(key);
      }
    }
  }

  async invalidateApplicationCache(applicationId, userId) {
    await this.invalidateUserCache(userId);
    await this.client.del(CACHE_KEYS.APPLICATION_DETAILS + applicationId);
    await this.client.del(CACHE_KEYS.DASHBOARD_STATS);
  }

  async invalidateServiceCache(district = null) {
    await this.client.del(CACHE_KEYS.SERVICE_LIST);
    if (district) {
      await this.client.del(CACHE_KEYS.DISTRICT_SERVICES + district);
    }
  }

  // ============================================================================
  // CACHE WARMING STRATEGIES
  // ============================================================================

  async warmUpCache() {
    console.log('🔥 Starting cache warm-up...');
    
    try {
      // Warm up services cache
      await this.getActiveServices();
      
      // Warm up dashboard stats
      await this.getDashboardStats();
      
      // Warm up frequently accessed services
      const popularServices = await db.services.find({ status: 'active' })
        .sort({ 'usage_stats.monthly_applications': -1 })
        .limit(10)
        .toArray();
      
      for (const service of popularServices) {
        await this.getServiceDetails(service._id.toString());
      }
      
      console.log('✅ Cache warm-up completed');
    } catch (error) {
      console.error('❌ Cache warm-up failed:', error);
    }
  }

  // ============================================================================
  // CACHE ANALYTICS
  // ============================================================================

  getCacheStats() {
    const total = this.hitCount + this.missCount;
    const hitRate = total > 0 ? (this.hitCount / total * 100).toFixed(2) : 0;
    
    return {
      hits: this.hitCount,
      misses: this.missCount,
      total: total,
      hitRate: hitRate + '%'
    };
  }

  async getCacheInfo() {
    const info = await this.client.info('memory');
    const keyCount = await this.client.dbsize();
    
    return {
      keyCount: keyCount,
      memoryInfo: info,
      stats: this.getCacheStats()
    };
  }
}

// ============================================================================
// DISTRIBUTED CACHING FOR MULTI-INSTANCE
// ============================================================================

class DistributedCacheService extends CacheService {
  constructor() {
    super();
    this.instanceId = process.env.INSTANCE_ID || 'default';
  }

  // Cache invalidation with pub/sub
  async invalidateDistributed(pattern) {
    // Publish invalidation message to other instances
    await this.client.publish('cache-invalidation', JSON.stringify({
      pattern: pattern,
      instanceId: this.instanceId,
      timestamp: new Date().toISOString()
    }));
    
    // Invalidate local cache
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(keys);
    }
  }

  // Subscribe to cache invalidation messages
  setupInvalidationSubscriber() {
    const subscriber = redis.createClient({
      host: 'sri_gov_redis',
      port: 6379
    });
    
    subscriber.subscribe('cache-invalidation');
    subscriber.on('message', async (channel, message) => {
      try {
        const { pattern, instanceId, timestamp } = JSON.parse(message);
        
        // Don't invalidate if message is from this instance
        if (instanceId !== this.instanceId) {
          const keys = await this.client.keys(pattern);
          if (keys.length > 0) {
            await this.client.del(keys);
            console.log(`Cache invalidated: ${keys.length} keys matching ${pattern}`);
          }
        }
      } catch (error) {
        console.error('Cache invalidation error:', error);
      }
    });
  }
}

module.exports = {
  CacheService,
  DistributedCacheService,
  CACHE_KEYS,
  CACHE_TTL
};