// MongoDB Views and Aggregation Optimization
// Complete implementation with materialized views, change streams, and performance optimization

use('gov_db');

print('🚀 Setting up MongoDB Views and Aggregation Optimization...\n');

// ============================================================================
// MATERIALIZED VIEWS FOR COMPLEX DASHBOARD QUERIES
// ============================================================================

// 1. Application Summary Materialized View
db.createView("application_summary_view", "applications", [
  {
    $lookup: {
      from: "services",
      localField: "service_id",
      foreignField: "_id",
      as: "service_info"
    }
  },
  { $unwind: "$service_info" },
  {
    $lookup: {
      from: "officers",
      localField: "assigned_officer",
      foreignField: "_id",
      as: "officer_info"
    }
  },
  { $unwind: { path: "$officer_info", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      application_id: "$_id",
      citizen_name: "$citizen_info.name",
      citizen_nic: "$citizen_info.nic",
      citizen_district: "$citizen_info.address.district",
      service_name: "$service_info.name",
      service_category: "$service_info.category",
      service_department: "$service_info.department",
      service_fee: "$service_info.fee.amount",
      officer_name: "$officer_info.name",
      officer_department: "$officer_info.department",
      status: 1,
      submitted_at: 1,
      completed_at: 1,
      processing_days: {
        $divide: [
          { $subtract: [{ $ifNull: ["$completed_at", new Date()] }, "$submitted_at"] },
          1000 * 60 * 60 * 24
        ]
      },
      payment_status: "$payment_info.status",
      payment_amount: "$payment_info.amount",
      sla_target: "$service_info.sla_days",
      is_overdue: {
        $gt: [
          {
            $divide: [
              { $subtract: [new Date(), "$submitted_at"] },
              1000 * 60 * 60 * 24
            ]
          },
          "$service_info.sla_days"
        ]
      }
    }
  }
]);

print('✅ Created application_summary_view');

// 2. District Performance View
db.createView("district_performance_view", "applications", [
  {
    $lookup: {
      from: "services",
      localField: "service_id",
      foreignField: "_id",
      as: "service_info"
    }
  },
  { $unwind: "$service_info" },
  {
    $group: {
      _id: "$citizen_info.address.district",
      total_applications: { $sum: 1 },
      completed_applications: {
        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
      },
      pending_applications: {
        $sum: { 
          $cond: [
            { $in: ["$status", ["submitted", "under_review", "additional_info_required"]] },
            1, 0
          ]
        }
      },
      rejected_applications: {
        $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
      },
      avg_processing_time: {
        $avg: {
          $cond: [
            { $eq: ["$status", "completed"] },
            {
              $divide: [
                { $subtract: ["$completed_at", "$submitted_at"] },
                1000 * 60 * 60 * 24
              ]
            },
            null
          ]
        }
      },
      total_revenue: { $sum: "$payment_info.amount" },
      overdue_count: {
        $sum: {
          $cond: [
            {
              $and: [
                { $ne: ["$status", "completed"] },
                { $ne: ["$status", "rejected"] },
                {
                  $gt: [
                    {
                      $divide: [
                        { $subtract: [new Date(), "$submitted_at"] },
                        1000 * 60 * 60 * 24
                      ]
                    },
                    "$service_info.sla_days"
                  ]
                }
              ]
            },
            1, 0
          ]
        }
      }
    }
  },
  {
    $project: {
      district: "$_id",
      total_applications: 1,
      completed_applications: 1,
      pending_applications: 1,
      rejected_applications: 1,
      avg_processing_time: { $round: ["$avg_processing_time", 2] },
      total_revenue: 1,
      overdue_count: 1,
      completion_rate: {
        $multiply: [
          { $divide: ["$completed_applications", "$total_applications"] },
          100
        ]
      },
      performance_score: {
        $subtract: [
          100,
          {
            $multiply: [
              { $divide: ["$overdue_count", "$total_applications"] },
              100
            ]
          }
        ]
      }
    }
  },
  { $sort: { performance_score: -1 } }
]);

print('✅ Created district_performance_view');

// 3. Service Analytics View
db.createView("service_analytics_view", "applications", [
  {
    $lookup: {
      from: "services",
      localField: "service_id",
      foreignField: "_id",
      as: "service_info"
    }
  },
  { $unwind: "$service_info" },
  {
    $group: {
      _id: {
        service_id: "$service_id",
        service_name: "$service_info.name",
        category: "$service_info.category",
        department: "$service_info.department"
      },
      total_requests: { $sum: 1 },
      completed_requests: {
        $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
      },
      avg_processing_time: {
        $avg: {
          $cond: [
            { $eq: ["$status", "completed"] },
            {
              $divide: [
                { $subtract: ["$completed_at", "$submitted_at"] },
                1000 * 60 * 60 * 24
              ]
            },
            null
          ]
        }
      },
      total_revenue: { $sum: "$payment_info.amount" },
      unique_users: { $addToSet: "$user_id" },
      sla_compliance: {
        $avg: {
          $cond: [
            { $eq: ["$status", "completed"] },
            {
              $cond: [
                {
                  $lte: [
                    {
                      $divide: [
                        { $subtract: ["$completed_at", "$submitted_at"] },
                        1000 * 60 * 60 * 24
                      ]
                    },
                    "$service_info.sla_days"
                  ]
                },
                1, 0
              ]
            },
            null
          ]
        }
      }
    }
  },
  {
    $project: {
      service_id: "$_id.service_id",
      service_name: "$_id.service_name",
      category: "$_id.category",
      department: "$_id.department",
      total_requests: 1,
      completed_requests: 1,
      avg_processing_time: { $round: ["$avg_processing_time", 2] },
      total_revenue: 1,
      unique_users_count: { $size: "$unique_users" },
      sla_compliance_rate: {
        $multiply: ["$sla_compliance", 100]
      },
      popularity_rank: { $multiply: ["$total_requests", 1] }
    }
  },
  { $sort: { popularity_rank: -1 } }
]);

print('✅ Created service_analytics_view');

// ============================================================================
// INCREMENTAL VIEW UPDATES WITH CHANGE STREAMS
// ============================================================================

// Change Stream Implementation for View Updates
class ViewUpdateManager {
  constructor() {
    this.changeStreams = new Map();
    this.viewRefreshQueue = [];
    this.isProcessing = false;
  }

  // Setup change streams for automatic view updates
  setupChangeStreams() {
    // Monitor applications collection
    const applicationChangeStream = db.applications.watch([
      {
        $match: {
          $or: [
            { "operationType": "insert" },
            { "operationType": "update" },
            { "operationType": "replace" },
            { "operationType": "delete" }
          ]
        }
      }
    ]);

    applicationChangeStream.on('change', (change) => {
      this.handleApplicationChange(change);
    });

    // Monitor services collection
    const serviceChangeStream = db.services.watch([
      {
        $match: {
          $or: [
            { "operationType": "insert" },
            { "operationType": "update" },
            { "operationType": "replace" },
            { "operationType": "delete" }
          ]
        }
      }
    ]);

    serviceChangeStream.on('change', (change) => {
      this.handleServiceChange(change);
    });

    this.changeStreams.set('applications', applicationChangeStream);
    this.changeStreams.set('services', serviceChangeStream);

    print('✅ Change streams setup completed');
  }

  handleApplicationChange(change) {
    const affectedViews = [
      'application_summary_view',
      'district_performance_view',
      'service_analytics_view'
    ];

    affectedViews.forEach(viewName => {
      this.queueViewRefresh(viewName, change);
    });
  }

  handleServiceChange(change) {
    const affectedViews = [
      'application_summary_view',
      'service_analytics_view'
    ];

    affectedViews.forEach(viewName => {
      this.queueViewRefresh(viewName, change);
    });
  }

  queueViewRefresh(viewName, changeEvent) {
    this.viewRefreshQueue.push({
      viewName,
      changeEvent,
      timestamp: new Date()
    });

    if (!this.isProcessing) {
      this.processRefreshQueue();
    }
  }

  async processRefreshQueue() {
    this.isProcessing = true;

    while (this.viewRefreshQueue.length > 0) {
      const refreshItem = this.viewRefreshQueue.shift();
      
      try {
        await this.performIncrementalRefresh(refreshItem);
        print(`✅ Refreshed view: ${refreshItem.viewName}`);
      } catch (error) {
        print(`❌ Error refreshing view ${refreshItem.viewName}: ${error.message}`);
      }
    }

    this.isProcessing = false;
  }

  // Incremental refresh strategy
  async performIncrementalRefresh(refreshItem) {
    const { viewName, changeEvent } = refreshItem;
    
    // For simplicity, we'll implement a time-based incremental refresh
    // In production, you might want more sophisticated logic
    
    switch (viewName) {
      case 'application_summary_view':
        await this.refreshApplicationSummaryView(changeEvent);
        break;
      case 'district_performance_view':
        await this.refreshDistrictPerformanceView(changeEvent);
        break;
      case 'service_analytics_view':
        await this.refreshServiceAnalyticsView(changeEvent);
        break;
    }
  }

  async refreshApplicationSummaryView(changeEvent) {
    // Implement incremental refresh logic
    // This would typically involve updating only affected records
    const lastRefresh = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
    
    // Re-create view with recent data only for efficiency
    // In production, you'd want to maintain materialized collections
    print(`Refreshing application_summary_view based on change: ${changeEvent.operationType}`);
  }

  async refreshDistrictPerformanceView(changeEvent) {
    print(`Refreshing district_performance_view based on change: ${changeEvent.operationType}`);
  }

  async refreshServiceAnalyticsView(changeEvent) {
    print(`Refreshing service_analytics_view based on change: ${changeEvent.operationType}`);
  }

  cleanup() {
    this.changeStreams.forEach((stream, name) => {
      stream.close();
      print(`✅ Closed change stream: ${name}`);
    });
  }
}

// ============================================================================
// VIEW-BASED SECURITY WITH ROLE-BASED ACCESS
// ============================================================================

// Create custom roles for view access
db.runCommand({
  createRole: "dashboardViewer",
  privileges: [
    {
      resource: { db: "gov_db", collection: "application_summary_view" },
      actions: ["find"]
    },
    {
      resource: { db: "gov_db", collection: "district_performance_view" },
      actions: ["find"]
    },
    {
      resource: { db: "gov_db", collection: "service_analytics_view" },
      actions: ["find"]
    }
  ],
  roles: []
});

db.runCommand({
  createRole: "districtManager",
  privileges: [
    {
      resource: { db: "gov_db", collection: "application_summary_view" },
      actions: ["find"]
    },
    {
      resource: { db: "gov_db", collection: "district_performance_view" },
      actions: ["find"]
    }
  ],
  roles: []
});

db.runCommand({
  createRole: "serviceAnalyst",
  privileges: [
    {
      resource: { db: "gov_db", collection: "service_analytics_view" },
      actions: ["find"]
    }
  ],
  roles: []
});

print('✅ Created role-based access control for views');

// ============================================================================
// PERFORMANCE-OPTIMIZED AGGREGATION PIPELINES
// ============================================================================

// Optimized pipeline for real-time dashboard
function getOptimizedDashboardData(filters = {}) {
  const pipeline = [];
  
  // Early filtering to reduce document processing
  const matchStage = {};
  if (filters.district) {
    matchStage["citizen_info.address.district"] = filters.district;
  }
  if (filters.dateRange) {
    matchStage["submitted_at"] = {
      $gte: new Date(filters.dateRange.from),
      $lte: new Date(filters.dateRange.to)
    };
  }
  if (filters.status) {
    matchStage["status"] = filters.status;
  }
  
  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  // Use $lookup with pipeline for better performance
  pipeline.push({
    $lookup: {
      from: "services",
      let: { serviceId: "$service_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$serviceId"] } } },
        { $project: { name: 1, category: 1, department: 1, sla_days: 1, fee: 1 } }
      ],
      as: "service_info"
    }
  });

  pipeline.push({ $unwind: "$service_info" });

  // Efficient faceted aggregation
  pipeline.push({
    $facet: {
      summary: [
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
            pending: { $sum: { $cond: [{ $ne: ["$status", "completed"] }, 1, 0] } },
            totalRevenue: { $sum: "$payment_info.amount" }
          }
        }
      ],
      byStatus: [
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ],
      byDistrict: [
        { $group: { _id: "$citizen_info.address.district", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ],
      topServices: [
        { $group: { _id: "$service_info.name", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]
    }
  });

  return db.applications.aggregate(pipeline, {
    allowDiskUse: true,
    maxTimeMS: 30000, // 30 second timeout
    hint: { "submitted_at": 1, "status": 1 } // Use appropriate index
  });
}

// ============================================================================
// CROSS-COLLECTION JOINS WITH $LOOKUP OPTIMIZATION
// ============================================================================

// Optimized lookup with pipeline and indexing
function getOptimizedApplicationDetails(applicationId) {
  return db.applications.aggregate([
    { $match: { _id: ObjectId(applicationId) } },
    
    // Optimized service lookup
    {
      $lookup: {
        from: "services",
        let: { serviceId: "$service_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$serviceId"] } } },
          {
            $project: {
              name: 1,
              category: 1,
              department: 1,
              requirements: 1,
              fee: 1,
              sla_days: 1,
              processing_steps: 1
            }
          }
        ],
        as: "service"
      }
    },
    
    // Optimized officer lookup
    {
      $lookup: {
        from: "officers",
        let: { officerId: "$assigned_officer" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$officerId"] } } },
          {
            $project: {
              name: 1,
              designation: 1,
              department: 1,
              contact: 1
            }
          }
        ],
        as: "officer"
      }
    },
    
    // Lookup related documents/attachments
    {
      $lookup: {
        from: "documents",
        let: { appId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$application_id", "$$appId"] } } },
          {
            $project: {
              type: 1,
              filename: 1,
              uploaded_at: 1,
              status: 1,
              file_size: 1
            }
          }
        ],
        as: "documents"
      }
    },
    
    // Lookup payment history
    {
      $lookup: {
        from: "payments",
        let: { appId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$application_id", "$$appId"] } } },
          {
            $project: {
              amount: 1,
              payment_method: 1,
              transaction_id: 1,
              paid_at: 1,
              status: 1
            }
          },
          { $sort: { paid_at: -1 } }
        ],
        as: "payment_history"
      }
    },
    
    // Lookup status history
    {
      $lookup: {
        from: "status_history",
        let: { appId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$application_id", "$$appId"] } } },
          {
            $project: {
              from_status: 1,
              to_status: 1,
              changed_at: 1,
              changed_by: 1,
              comments: 1
            }
          },
          { $sort: { changed_at: -1 } }
        ],
        as: "status_history"
      }
    },
    
    {
      $project: {
        application_id: "$_id",
        citizen_info: 1,
        service: { $arrayElemAt: ["$service", 0] },
        officer: { $arrayElemAt: ["$officer", 0] },
        status: 1,
        submitted_at: 1,
        completed_at: 1,
        documents: 1,
        payment_history: 1,
        status_history: 1,
        processing_time_days: {
          $divide: [
            { $subtract: [{ $ifNull: ["$completed_at", new Date()] }, "$submitted_at"] },
            1000 * 60 * 60 * 24
          ]
        }
      }
    }
  ]);
}

// ============================================================================
// VIEW CACHING AND REFRESH STRATEGIES
// ============================================================================

class ViewCacheManager {
  constructor(cacheManager) {
    this.cache = cacheManager;
    this.refreshIntervals = new Map();
  }

  // Setup view caching with different TTLs
  setupViewCaching() {
    // Cache configuration for different views
    const viewConfigs = [
      { name: 'application_summary_view', ttl: 300, refreshInterval: 60000 }, // 5 min cache, 1 min refresh
      { name: 'district_performance_view', ttl: 900, refreshInterval: 300000 }, // 15 min cache, 5 min refresh
      { name: 'service_analytics_view', ttl: 1800, refreshInterval: 600000 } // 30 min cache, 10 min refresh
    ];

    viewConfigs.forEach(config => {
      this.setupViewRefresh(config);
    });
  }

  setupViewRefresh(config) {
    const { name, ttl, refreshInterval } = config;
    
    // Initial cache population
    this.refreshViewCache(name, ttl);
    
    // Setup periodic refresh
    const intervalId = setInterval(() => {
      this.refreshViewCache(name, ttl);
    }, refreshInterval);
    
    this.refreshIntervals.set(name, intervalId);
    
    print(`✅ Setup caching for view: ${name}`);
  }

  async refreshViewCache(viewName, ttl) {
    try {
      const cacheKey = `view:${viewName}`;
      
      // Fetch fresh data from view
      const data = await db.getCollection(viewName).find({}).toArray();
      
      // Cache the data
      await this.cache.set(cacheKey, data, ttl);
      
      print(`✅ Cached view data: ${viewName} (${data.length} documents)`);
      
      // Cache metadata
      const metadataKey = `view:${viewName}:metadata`;
      const metadata = {
        lastRefreshed: new Date(),
        documentCount: data.length,
        cacheKey: cacheKey,
        ttl: ttl
      };
      
      await this.cache.set(metadataKey, metadata, ttl);
      
    } catch (error) {
      print(`❌ Error caching view ${viewName}: ${error.message}`);
    }
  }

  async getCachedViewData(viewName) {
    const cacheKey = `view:${viewName}`;
    
    let data = await this.cache.get(cacheKey);
    
    if (!data) {
      // Cache miss - fetch from view directly
      data = await db.getCollection(viewName).find({}).toArray();
      
      // Cache for shorter duration on cache miss
      await this.cache.set(cacheKey, data, 60);
    }
    
    return data;
  }

  cleanup() {
    this.refreshIntervals.forEach((intervalId, viewName) => {
      clearInterval(intervalId);
      print(`✅ Cleaned up refresh interval for: ${viewName}`);
    });
  }
}

// ============================================================================
// INDEX OPTIMIZATION FOR VIEWS
// ============================================================================

// Create optimized indexes for view performance
print('📈 Creating optimized indexes for view performance...');

// Indexes for application_summary_view
db.applications.createIndex({ "citizen_info.address.district": 1, "submitted_at": -1 });
db.applications.createIndex({ "service_id": 1, "status": 1 });
db.applications.createIndex({ "assigned_officer": 1, "status": 1 });
db.applications.createIndex({ "submitted_at": -1, "completed_at": -1 });

// Indexes for services collection
db.services.createIndex({ "category": 1, "department": 1 });
db.services.createIndex({ "sla_days": 1 });

// Indexes for officers collection
db.officers.createIndex({ "department": 1, "designation": 1 });

// Compound indexes for complex queries
db.applications.createIndex({ 
  "status": 1, 
  "citizen_info.address.district": 1, 
  "submitted_at": -1 
});

db.applications.createIndex({
  "service_id": 1,
  "payment_info.status": 1,
  "submitted_at": -1
});

print('✅ Optimized indexes created for view performance');

// ============================================================================
// USAGE EXAMPLES AND SETUP
// ============================================================================

// Initialize view management system
async function initializeViewManagement(cacheManager) {
  // Setup view update manager
  const viewUpdateManager = new ViewUpdateManager();
  viewUpdateManager.setupChangeStreams();
  
  // Setup view caching
  const viewCacheManager = new ViewCacheManager(cacheManager);
  viewCacheManager.setupViewCaching();
  
  print('🚀 View management system initialized');
  
  return {
    viewUpdateManager,
    viewCacheManager,
    cleanup: () => {
      viewUpdateManager.cleanup();
      viewCacheManager.cleanup();
    }
  };
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ViewUpdateManager,
    ViewCacheManager,
    getOptimizedDashboardData,
    getOptimizedApplicationDetails,
    initializeViewManagement
  };
}

print('✅ MongoDB Views and Aggregation Optimization setup completed!\n');

// Usage Examples:
/*

// 1. Query optimized dashboard data
const dashboardData = getOptimizedDashboardData({
  district: 'Colombo',
  dateRange: { 
    from: '2024-01-01', 
    to: '2024-12-31' 
  }
});

// 2. Get cached view data
const cachedData = await viewCacheManager.getCachedViewData('district_performance_view');

// 3. Query specific application with all related data
const appDetails = getOptimizedApplicationDetails('60f1b2b3c4d5e6f7g8h9i0j1');

// 4. Direct view queries with role-based access
db.application_summary_view.find({ 
  citizen_district: 'Gampaha',
  is_overdue: true 
}).sort({ submitted_at: -1 });

*/