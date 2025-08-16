// Advanced Analytics and Reporting System
// Time-series collections, complex analytics pipelines, and predictive analytics

use('gov_db');

print('📊 Setting up Advanced Analytics and Reporting System...\n');

// ============================================================================
// TIME-SERIES COLLECTIONS FOR PERFORMANCE METRICS
// ============================================================================

// Create time-series collection for application metrics
db.createCollection("application_metrics", {
  timeseries: {
    timeField: "timestamp",
    metaField: "metadata",
    granularity: "minutes"
  },
  expireAfterSeconds: 31536000 // 1 year retention
});

print('✅ Advanced Analytics and Reporting System setup completed!\n');

// Usage Examples:
/*

// 1. Initialize the analytics system
const analytics = await initializeAdvancedAnalytics();

// 2. Get trend analysis
const monthlyTrends = getTrendAnalysis('monthly', 12);

// 3. Perform geo-analytics
const performanceByDistrict = getGeoAnalytics('performance');

// 4. Generate demand forecast
const demandForecast = getDemandForecast('certificates', 30);

// 5. Get resource optimization recommendations
const resourceRecommendations = getResourceOptimizationRecommendations();

// 6. OLAP cube analysis
const cubeData = getOLAPCube(
  ['service_category', 'district'],
  ['avg_processing_time', 'completion_rate'],
  { submitted_year: 2024 }
);

// 7. Real-time metrics
const currentMetrics = await analytics.realTimeAnalytics.getCurrentMetrics();
const alerts = await analytics.realTimeAnalytics.getPerformanceAlerts();

*/

print('✅ Created time-series collection: application_metrics');

// Create time-series collection for system performance
db.createCollection("system_performance", {
  timeseries: {
    timeField: "timestamp",
    metaField: "component",
    granularity: "seconds"
  },
  expireAfterSeconds: 2592000 // 30 days retention
});

print('✅ Created time-series collection: system_performance');

// Create time-series collection for user activity
db.createCollection("user_activity", {
  timeseries: {
    timeField: "timestamp",
    metaField: "user_info",
    granularity: "minutes"
  },
  expireAfterSeconds: 7776000 // 90 days retention
});

print('✅ Created time-series collection: user_activity');

// ============================================================================
// AUTOMATED METRIC COLLECTION SYSTEM
// ============================================================================

class MetricsCollector {
  constructor() {
    this.collectInterval = 60000; // 1 minute
    this.intervals = new Map();
  }

  startCollection() {
    // Application metrics collection
    this.intervals.set('application_metrics', setInterval(() => {
      this.collectApplicationMetrics();
    }, this.collectInterval));

    // System performance metrics
    this.intervals.set('system_performance', setInterval(() => {
      this.collectSystemMetrics();
    }, 30000)); // 30 seconds

    // User activity metrics
    this.intervals.set('user_activity', setInterval(() => {
      this.collectUserActivityMetrics();
    }, this.collectInterval));

    print('✅ Started automated metrics collection');
  }

  async collectApplicationMetrics() {
    try {
      const timestamp = new Date();
      
      // Collect current application statistics
      const stats = await db.applications.aggregate([
        {
          $group: {
            _id: null,
            total_applications: { $sum: 1 },
            submitted_today: {
              $sum: {
                $cond: [
                  {
                    $gte: ["$submitted_at", new Date(Date.now() - 24 * 60 * 60 * 1000)]
                  },
                  1, 0
                ]
              }
            },
            completed_today: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$status", "completed"] },
                      { $gte: ["$completed_at", new Date(Date.now() - 24 * 60 * 60 * 1000)] }
                    ]
                  },
                  1, 0
                ]
              }
            },
            pending_applications: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["submitted", "under_review", "additional_info_required"]] },
                  1, 0
                ]
              }
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
            }
          }
        }
      ]).toArray();

      const metric = stats[0];
      if (metric) {
        // Insert into time-series collection
        await db.application_metrics.insertOne({
          timestamp: timestamp,
          metadata: {
            type: "application_summary",
            source: "automated_collection"
          },
          total_applications: metric.total_applications,
          submitted_today: metric.submitted_today,
          completed_today: metric.completed_today,
          pending_applications: metric.pending_applications,
          avg_processing_time: metric.avg_processing_time || 0,
          throughput_rate: metric.completed_today / Math.max(metric.submitted_today, 1)
        });
      }

    } catch (error) {
      print(`❌ Error collecting application metrics: ${error.message}`);
    }
  }

  async collectSystemMetrics() {
    try {
      const timestamp = new Date();
      
      // Database performance metrics
      const dbStats = await db.runCommand({ dbStats: 1 });
      const serverStatus = await db.runCommand({ serverStatus: 1 });
      
      // Insert system performance metrics
      await db.system_performance.insertOne({
        timestamp: timestamp,
        component: {
          type: "database",
          name: "mongodb"
        },
        metrics: {
          database_size: dbStats.dataSize,
          storage_size: dbStats.storageSize,
          index_size: dbStats.indexSize,
          collections: dbStats.collections,
          objects: dbStats.objects,
          connections_current: serverStatus.connections?.current || 0,
          connections_available: serverStatus.connections?.available || 0,
          operations_per_second: {
            insert: serverStatus.opcounters?.insert || 0,
            query: serverStatus.opcounters?.query || 0,
            update: serverStatus.opcounters?.update || 0,
            delete: serverStatus.opcounters?.delete || 0
          },
          memory_usage: {
            resident: serverStatus.mem?.resident || 0,
            virtual: serverStatus.mem?.virtual || 0
          }
        }
      });

    } catch (error) {
      print(`❌ Error collecting system metrics: ${error.message}`);
    }
  }

  async collectUserActivityMetrics() {
    try {
      const timestamp = new Date();
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      // Collect user activity statistics
      const activityStats = await db.applications.aggregate([
        {
          $match: {
            submitted_at: { $gte: last24Hours }
          }
        },
        {
          $group: {
            _id: "$citizen_info.address.district",
            unique_users: { $addToSet: "$user_id" },
            total_applications: { $sum: 1 },
            completed_applications: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            district: "$_id",
            unique_users_count: { $size: "$unique_users" },
            total_applications: 1,
            completed_applications: 1,
            completion_rate: {
              $multiply: [
                { $divide: ["$completed_applications", "$total_applications"] },
                100
              ]
            }
          }
        }
      ]).toArray();

      // Insert activity metrics for each district
      for (const stat of activityStats) {
        await db.user_activity.insertOne({
          timestamp: timestamp,
          user_info: {
            district: stat.district,
            period: "24h"
          },
          unique_users: stat.unique_users_count,
          total_applications: stat.total_applications,
          completed_applications: stat.completed_applications,
          completion_rate: stat.completion_rate
        });
      }

    } catch (error) {
      print(`❌ Error collecting user activity metrics: ${error.message}`);
    }
  }

  stopCollection() {
    this.intervals.forEach((intervalId, name) => {
      clearInterval(intervalId);
      print(`✅ Stopped ${name} collection`);
    });
    this.intervals.clear();
  }
}

// ============================================================================
// COMPLEX ANALYTICS PIPELINES FOR TREND ANALYSIS
// ============================================================================

// Advanced trend analysis with statistical functions
function getTrendAnalysis(timeframe = 'monthly', months = 12) {
  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - months);

  return db.application_metrics.aggregate([
    {
      $match: {
        timestamp: { $gte: fromDate },
        "metadata.type": "application_summary"
      }
    },
    {
      $addFields: {
        period: {
          $switch: {
            branches: [
              {
                case: { $eq: [timeframe, "daily"] },
                then: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
              },
              {
                case: { $eq: [timeframe, "weekly"] },
                then: { $dateToString: { format: "%Y-W%V", date: "$timestamp" } }
              },
              {
                case: { $eq: [timeframe, "monthly"] },
                then: { $dateToString: { format: "%Y-%m", date: "$timestamp" } }
              }
            ],
            default: { $dateToString: { format: "%Y-%m", date: "$timestamp" } }
          }
        }
      }
    },
    {
      $group: {
        _id: "$period",
        avg_daily_applications: { $avg: "$submitted_today" },
        avg_completion_rate: { $avg: "$throughput_rate" },
        avg_processing_time: { $avg: "$avg_processing_time" },
        max_daily_applications: { $max: "$submitted_today" },
        min_daily_applications: { $min: "$submitted_today" },
        data_points: { $sum: 1 },
        application_variance: { $stdDevPop: "$submitted_today" }
      }
    },
    {
      $sort: { _id: 1 }
    },
    {
      $setWindowFields: {
        sortBy: { _id: 1 },
        output: {
          moving_average: {
            $avg: "$avg_daily_applications",
            window: {
              range: [-2, 2],
              unit: "position"
            }
          },
          trend_direction: {
            $derivative: {
              input: "$avg_daily_applications",
              unit: "position"
            }
          },
          rank: {
            $rank: {}
          }
        }
      }
    },
    {
      $addFields: {
        trend_classification: {
          $cond: [
            { $gt: ["$trend_direction", 5] }, "increasing",
            {
              $cond: [
                { $lt: ["$trend_direction", -5] }, "decreasing",
                "stable"
              ]
            }
          ]
        },
        seasonality_index: {
          $divide: ["$avg_daily_applications", "$moving_average"]
        }
      }
    }
  ]);
}

// Geo-analytics for district-wise analysis
function getGeoAnalytics(analysisType = 'performance') {
  const pipeline = [];

  // Base aggregation for different analysis types
  switch (analysisType) {
    case 'performance':
      pipeline.push(
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
              district: "$citizen_info.address.district",
              coordinates: "$citizen_info.address.location"
            },
            total_applications: { $sum: 1 },
            completed_applications: {
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
            unique_services: { $addToSet: "$service_info.category" },
            sla_violations: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$status", "completed"] },
                      {
                        $gt: [
                          {
                            $divide: [
                              { $subtract: ["$completed_at", "$submitted_at"] },
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
        }
      );
      break;

    case 'demand_patterns':
      pipeline.push(
        {
          $addFields: {
            hour_of_day: { $hour: "$submitted_at" },
            day_of_week: { $dayOfWeek: "$submitted_at" },
            month_of_year: { $month: "$submitted_at" }
          }
        },
        {
          $group: {
            _id: {
              district: "$citizen_info.address.district",
              hour: "$hour_of_day",
              day: "$day_of_week"
            },
            application_count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: "$_id.district",
            peak_hours: {
              $push: {
                hour: "$_id.hour",
                day: "$_id.day",
                count: "$application_count"
              }
            },
            total_applications: { $sum: "$application_count" }
          }
        }
      );
      break;

    case 'service_accessibility':
      pipeline.push(
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
              district: "$citizen_info.address.district",
              service_category: "$service_info.category"
            },
            application_count: { $sum: 1 },
            avg_fee: { $avg: "$service_info.fee.amount" },
            completion_rate: {
              $avg: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
            }
          }
        },
        {
          $group: {
            _id: "$_id.district",
            service_diversity: {
              $push: {
                category: "$_id.service_category",
                demand: "$application_count",
                avg_fee: "$avg_fee",
                completion_rate: "$completion_rate"
              }
            },
            total_services_accessed: { $sum: 1 },
            district_total_applications: { $sum: "$application_count" }
          }
        }
      );
      break;
  }

  // Add common geo-processing stages
  pipeline.push(
    {
      $addFields: {
        performance_score: {
          $multiply: [
            {
              $divide: ["$completed_applications", "$total_applications"]
            },
            {
              $subtract: [
                100,
                {
                  $multiply: [
                    { $divide: ["$sla_violations", "$completed_applications"] },
                    100
                  ]
                }
              ]
            }
          ]
        }
      }
    },
    { $sort: { performance_score: -1 } }
  );

  return db.applications.aggregate(pipeline);
}

// ============================================================================
// PREDICTIVE ANALYTICS USING HISTORICAL DATA
// ============================================================================

// Demand forecasting model
function getDemandForecast(service_category = null, forecast_days = 30) {
  const pipeline = [
    {
      $match: {
        submitted_at: {
          $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
        }
      }
    }
  ];

  // Add service filter if specified
  if (service_category) {
    pipeline.push({
      $lookup: {
        from: "services",
        localField: "service_id",
        foreignField: "_id",
        as: "service_info"
      }
    });
    pipeline.push({ $unwind: "$service_info" });
    pipeline.push({
      $match: {
        "service_info.category": service_category
      }
    });
  }

  pipeline.push(
    // Group by day to get historical patterns
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$submitted_at" } },
          day_of_week: { $dayOfWeek: "$submitted_at" },
          day_of_month: { $dayOfMonth: "$submitted_at" },
          month: { $month: "$submitted_at" }
        },
        daily_applications: { $sum: 1 },
        unique_users: { $addToSet: "$user_id" }
      }
    },
    {
      $addFields: {
        unique_user_count: { $size: "$unique_users" }
      }
    },
    // Calculate seasonal patterns
    {
      $group: {
        _id: {
          day_of_week: "$_id.day_of_week",
          month: "$_id.month"
        },
        avg_daily_applications: { $avg: "$daily_applications" },
        avg_unique_users: { $avg: "$unique_user_count" },
        max_applications: { $max: "$daily_applications" },
        min_applications: { $min: "$daily_applications" },
        variance: { $stdDevPop: "$daily_applications" },
        data_points: { $sum: 1 }
      }
    },
    // Create forecast model
    {
      $addFields: {
        confidence_level: {
          $cond: [
            { $gte: ["$data_points", 10] }, "high",
            {
              $cond: [
                { $gte: ["$data_points", 5] }, "medium",
                "low"
              ]
            }
          ]
        },
        forecast_range: {
          lower_bound: { $subtract: ["$avg_daily_applications", "$variance"] },
          upper_bound: { $add: ["$avg_daily_applications", "$variance"] },
          most_likely: "$avg_daily_applications"
        },
        seasonal_multiplier: {
          $cond: [
            { $gte: ["$_id.month", 6] }, 1.2, // Higher demand in mid-year
            {
              $cond: [
                { $lte: ["$_id.month", 2] }, 0.8, // Lower demand in early year
                1.0
              ]
            }
          ]
        }
      }
    },
    {
      $sort: { "_id.month": 1, "_id.day_of_week": 1 }
    }
  );

  return db.applications.aggregate(pipeline);
}

// Resource optimization recommendations
function getResourceOptimizationRecommendations() {
  return db.applications.aggregate([
    {
      $match: {
        submitted_at: {
          $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 3 months
        }
      }
    },
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
      $addFields: {
        processing_time_days: {
          $cond: [
            { $eq: ["$status", "completed"] },
            {
              $divide: [
                { $subtract: ["$completed_at", "$submitted_at"] },
                1000 * 60 * 60 * 24
              ]
            },
            {
              $divide: [
                { $subtract: [new Date(), "$submitted_at"] },
                1000 * 60 * 60 * 24
              ]
            }
          ]
        },
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
    },
    {
      $facet: {
        // Department workload analysis
        department_analysis: [
          {
            $group: {
              _id: "$service_info.department",
              total_applications: { $sum: 1 },
              avg_processing_time: { $avg: "$processing_time_days" },
              overdue_count: { $sum: { $cond: ["$is_overdue", 1, 0] } },
              unique_officers: { $addToSet: "$assigned_officer" },
              completion_rate: {
                $avg: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
              }
            }
          },
          {
            $addFields: {
              officer_count: { $size: "$unique_officers" },
              workload_per_officer: {
                $divide: ["$total_applications", { $size: "$unique_officers" }]
              },
              efficiency_score: {
                $multiply: [
                  "$completion_rate",
                  {
                    $subtract: [
                      1,
                      { $divide: ["$overdue_count", "$total_applications"] }
                    ]
                  }
                ]
              }
            }
          },
          {
            $addFields: {
              recommendation: {
                $cond: [
                  { $gt: ["$workload_per_officer", 50] },
                  "Consider hiring more officers",
                  {
                    $cond: [
                      { $lt: ["$efficiency_score", 0.7] },
                      "Focus on process improvement",
                      "Performance is adequate"
                    ]
                  }
                ]
              }
            }
          }
        ],
        
        // Service optimization opportunities
        service_optimization: [
          {
            $group: {
              _id: "$service_info.name",
              avg_processing_time: { $avg: "$processing_time_days" },
              sla_target: { $first: "$service_info.sla_days" },
              total_requests: { $sum: 1 },
              overdue_requests: { $sum: { $cond: ["$is_overdue", 1, 0] } },
              completion_rate: {
                $avg: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
              }
            }
          },
          {
            $addFields: {
              sla_compliance_rate: {
                $multiply: [
                  {
                    $subtract: [
                      1,
                      { $divide: ["$overdue_requests", "$total_requests"] }
                    ]
                  },
                  100
                ]
              },
              optimization_priority: {
                $cond: [
                  { $and: [
                    { $gt: ["$avg_processing_time", "$sla_target"] },
                    { $gt: ["$total_requests", 20] }
                  ]},
                  "high",
                  {
                    $cond: [
                      { $gt: ["$overdue_requests", 5] },
                      "medium",
                      "low"
                    ]
                  }
                ]
              }
            }
          },
          { $sort: { optimization_priority: -1, total_requests: -1 } }
        ],
        
        // Peak time analysis
        peak_time_analysis: [
          {
            $addFields: {
              hour_of_day: { $hour: "$submitted_at" },
              day_of_week: { $dayOfWeek: "$submitted_at" }
            }
          },
          {
            $group: {
              _id: {
                hour: "$hour_of_day",
                day: "$day_of_week"
              },
              application_count: { $sum: 1 }
            }
          },
          { $sort: { application_count: -1 } },
          { $limit: 10 }
        ]
      }
    }
  ]);
}

// ============================================================================
// DATA WAREHOUSE-STYLE AGGREGATIONS
// ============================================================================

// Create fact table for OLAP-style analysis
db.createView("application_fact_table", "applications", [
  {
    $lookup: {
      from: "services",
      localField: "service_id",
      foreignField: "_id",
      as: "service_dim"
    }
  },
  { $unwind: "$service_dim" },
  {
    $lookup: {
      from: "officers",
      localField: "assigned_officer",
      foreignField: "_id",
      as: "officer_dim"
    }
  },
  { $unwind: { path: "$officer_dim", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      // Fact measures
      application_id: "$_id",
      processing_time_hours: {
        $divide: [
          { $subtract: [{ $ifNull: ["$completed_at", new Date()] }, "$submitted_at"] },
          1000 * 60 * 60
        ]
      },
      fee_amount: "$payment_info.amount",
      
      // Time dimensions
      submitted_year: { $year: "$submitted_at" },
      submitted_month: { $month: "$submitted_at" },
      submitted_day: { $dayOfMonth: "$submitted_at" },
      submitted_hour: { $hour: "$submitted_at" },
      submitted_day_of_week: { $dayOfWeek: "$submitted_at" },
      
      // Geographic dimensions
      district: "$citizen_info.address.district",
      location_coordinates: "$citizen_info.address.location",
      
      // Service dimensions
      service_id: "$service_id",
      service_name: "$service_dim.name",
      service_category: "$service_dim.category",
      service_department: "$service_dim.department",
      service_sla_days: "$service_dim.sla_days",
      
      // Officer dimensions
      officer_id: "$assigned_officer",
      officer_department: "$officer_dim.department",
      officer_designation: "$officer_dim.designation",
      
      // Status dimensions
      current_status: "$status",
      is_completed: { $eq: ["$status", "completed"] },
      is_overdue: {
        $gt: [
          {
            $divide: [
              { $subtract: [new Date(), "$submitted_at"] },
              1000 * 60 * 60 * 24
            ]
          },
          "$service_dim.sla_days"
        ]
      }
    }
  }
]);

print('✅ Created application_fact_table view for OLAP analysis');

// OLAP cube operations
function getOLAPCube(dimensions = [], measures = [], filters = {}) {
  const pipeline = [];
  
  // Apply filters
  if (Object.keys(filters).length > 0) {
    pipeline.push({ $match: filters });
  }
  
  // Group by specified dimensions
  const groupId = {};
  dimensions.forEach(dim => {
    groupId[dim] = `${dim}`;
  });
  
  const groupStage = {
    _id: groupId,
    count: { $sum: 1 }
  };
  
  // Add specified measures
  measures.forEach(measure => {
    switch (measure) {
      case 'avg_processing_time':
        groupStage.avg_processing_time = { $avg: "$processing_time_hours" };
        break;
      case 'total_revenue':
        groupStage.total_revenue = { $sum: "$fee_amount" };
        break;
      case 'completion_rate':
        groupStage.completion_rate = { $avg: { $cond: ["$is_completed", 1, 0] } };
        break;
      case 'sla_compliance_rate':
        groupStage.sla_compliance_rate = { $avg: { $cond: ["$is_overdue", 0, 1] } };
        break;
    }
  });
  
  pipeline.push({ $group: groupStage });
  pipeline.push({ $sort: { count: -1 } });
  
  return db.application_fact_table.aggregate(pipeline);
}

// ============================================================================
// REAL-TIME ANALYTICS DASHBOARD
// ============================================================================

class RealTimeAnalytics {
  constructor(metricsCollector) {
    this.metricsCollector = metricsCollector;
    this.dashboardData = new Map();
  }

  async getCurrentMetrics() {
    const currentTime = new Date();
    
    // Get latest application metrics
    const latestAppMetrics = await db.application_metrics.findOne(
      { "metadata.type": "application_summary" },
      { sort: { timestamp: -1 } }
    );
    
    // Get system performance
    const latestSysMetrics = await db.system_performance.findOne(
      { "component.type": "database" },
      { sort: { timestamp: -1 } }
    );
    
    // Get user activity by district
    const userActivity = await db.user_activity.find(
      {
        timestamp: {
          $gte: new Date(currentTime.getTime() - 24 * 60 * 60 * 1000)
        }
      }
    ).sort({ timestamp: -1 }).limit(25).toArray();
    
    return {
      timestamp: currentTime,
      application_metrics: latestAppMetrics,
      system_performance: latestSysMetrics,
      user_activity: userActivity,
      status: "active"
    };
  }

  async getPerformanceAlerts() {
    const alerts = [];
    const currentTime = new Date();
    const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
    
    // Check for performance degradation
    const recentMetrics = await db.application_metrics.find({
      timestamp: { $gte: oneHourAgo },
      "metadata.type": "application_summary"
    }).toArray();
    
    if (recentMetrics.length > 0) {
      const avgThroughput = recentMetrics.reduce((sum, m) => sum + (m.throughput_rate || 0), 0) / recentMetrics.length;
      const avgProcessingTime = recentMetrics.reduce((sum, m) => sum + (m.avg_processing_time || 0), 0) / recentMetrics.length;
      
      if (avgThroughput < 0.5) {
        alerts.push({
          type: "performance",
          severity: "warning",
          message: "Application throughput below 50%",
          value: avgThroughput,
          threshold: 0.5
        });
      }
      
      if (avgProcessingTime > 7) { // More than a week
        alerts.push({
          type: "sla",
          severity: "critical",
          message: "Average processing time exceeds 7 days",
          value: avgProcessingTime,
          threshold: 7
        });
      }
    }
    
    return alerts;
  }
}

// ============================================================================
// INITIALIZATION AND SETUP
// ============================================================================

async function initializeAdvancedAnalytics() {
  // Initialize metrics collector
  const metricsCollector = new MetricsCollector();
  metricsCollector.startCollection();
  
  // Initialize real-time analytics
  const realTimeAnalytics = new RealTimeAnalytics(metricsCollector);
  
  // Create indexes for time-series collections
  await db.application_metrics.createIndex({ "timestamp": 1, "metadata.type": 1 });
  await db.system_performance.createIndex({ "timestamp": 1, "component.type": 1 });
  await db.user_activity.createIndex({ "timestamp": 1, "user_info.district": 1 });
  
  print('✅ Advanced Analytics System initialized');
  
  return {
    metricsCollector,
    realTimeAnalytics,
    getTrendAnalysis,
    getGeoAnalytics,
    getDemandForecast,
    getResourceOptimizationRecommendations,
    getOLAPCube,
    cleanup: () => {
      metricsCollector.stopCollection();
    }
  };
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MetricsCollector,
    RealTimeAnalytics,
    getTrendAnalysis,
    getGeoAnalytics,
    getDemandForecast,
    getResourceOptimizationRecommendations,
    getOLAPCube,
    initializeAdvancedAnalytics
  };
}

try {
    const sampleUser = db.users.findOne({ role: "admin" });
    if (sampleUser) {
      print(`📋 Sample User Verification: User ID ${sampleUser._id} exists with role ${sampleUser.role}`);
    } else {
      print('❌ Sample User Verification: No admin user found');
    }
  } catch (e) {
    print(`❌ Sample User Verification Error: ${e.message}`);
  }