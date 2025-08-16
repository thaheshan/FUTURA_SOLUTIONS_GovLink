// File: Database/Mongo/aggregations/dashboard_pipelines.js
// Advanced aggregation pipelines for dashboard and reporting

use('gov_db');

print('📊 Creating Advanced Aggregation Pipelines...\n');

// ============================================================================
// DASHBOARD STATISTICS AGGREGATIONS
// ============================================================================

// Comprehensive dashboard statistics
function getDashboardStatistics(district = null, dateRange = null) {
  const matchStage = {};
  
  if (district) {
    matchStage["citizen_info.address.district"] = district;
  }
  
  if (dateRange) {
    matchStage["submitted_at"] = {
      $gte: new Date(dateRange.from),
      $lte: new Date(dateRange.to)
    };
  }

  return db.applications.aggregate([
    ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
    
    {
      $facet: {
        // Application status distribution
        statusDistribution: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
              avgProcessingDays: {
                $avg: {
                  $divide: [
                    { $subtract: [new Date(), "$submitted_at"] },
                    1000 * 60 * 60 * 24
                  ]
                }
              }
            }
          },
          { $sort: { count: -1 } }
        ],
        
        // Service popularity
        servicePopularity: [
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
              _id: "$service_info.name",
              count: { $sum: 1 },
              category: { $first: "$service_info.category" },
              avgFee: { $first: "$service_info.fee.amount" },
              totalRevenue: { $sum: "$payment_info.amount" }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        
        // District-wise distribution
        districtDistribution: [
          {
            $group: {
              _id: "$citizen_info.address.district",
              count: { $sum: 1 },
              completedCount: {
                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
              },
              avgProcessingTime: {
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
          },
          {
            $project: {
              _id: 1,
              count: 1,
              completedCount: 1,
              completionRate: {
                $multiply: [
                  { $divide: ["$completedCount", "$count"] },
                  100
                ]
              },
              avgProcessingTime: 1
            }
          },
          { $sort: { count: -1 } }
        ],
        
        // Monthly trends
        monthlyTrends: [
          {
            $group: {
              _id: {
                year: { $year: "$submitted_at" },
                month: { $month: "$submitted_at" }
              },
              applications: { $sum: 1 },
              completed: {
                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
              },
              rejected: {
                $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
              },
              totalFees: {
                $sum: "$payment_info.amount"
              }
            }
          },
          {
            $project: {
              _id: 1,
              applications: 1,
              completed: 1,
              rejected: 1,
              totalFees: 1,
              completionRate: {
                $multiply: [
                  { $divide: ["$completed", "$applications"] },
                  100
                ]
              }
            }
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } }
        ],
        
        // Officer workload analysis
        officerWorkload: [
          {
            $match: { assigned_officer: { $exists: true } }
          },
          {
            $lookup: {
              from: "officers",
              localField: "assigned_officer",
              foreignField: "_id",
              as: "officer_info"
            }
          },
          { $unwind: "$officer_info" },
          {
            $group: {
              _id: "$assigned_officer",
              officer_name: { $first: "$officer_info.name" },
              designation: { $first: "$officer_info.designation" },
              department: { $first: "$officer_info.department" },
              totalAssigned: { $sum: 1 },
              completed: {
                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
              },
              pending: {
                $sum: { 
                  $cond: [
                    { $in: ["$status", ["under_review", "additional_info_required"]] },
                    1, 0
                  ]
                }
              },
              avgProcessingTime: {
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
          },
          {
            $project: {
              _id: 1,
              officer_name: 1,
              designation: 1,
              department: 1,
              totalAssigned: 1,
              completed: 1,
              pending: 1,
              completionRate: {
                $multiply: [
                  { $divide: ["$completed", "$totalAssigned"] },
                  100
                ]
              },
              avgProcessingTime: 1
            }
          },
          { $sort: { totalAssigned: -1 } }
        ]
      }
    }
  ]).toArray()[0];
}

// ============================================================================
// TIME-BASED AGGREGATIONS FOR TREND ANALYSIS
// ============================================================================

function getApplicationTrends(period = 'daily', days = 30) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  
  const groupFormat = {
    'daily': { $dateToString: { format: "%Y-%m-%d", date: "$submitted_at" } },
    'weekly': { $dateToString: { format: "%Y-W%V", date: "$submitted_at" } },
    'monthly': { $dateToString: { format: "%Y-%m", date: "$submitted_at" } }
  };

  return db.applications.aggregate([
    {
      $match: {
        submitted_at: { $gte: fromDate }
      }
    },
    {
      $group: {
        _id: groupFormat[period],
        totalApplications: { $sum: 1 },
        completedApplications: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
        },
        rejectedApplications: {
          $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
        },
        pendingApplications: {
          $sum: { 
            $cond: [
              { $in: ["$status", ["submitted", "under_review", "additional_info_required"]] },
              1, 0
            ]
          }
        },
        totalRevenue: { $sum: "$payment_info.amount" },
        uniqueUsers: { $addToSet: "$user_id" }
      }
    },
    {
      $project: {
        _id: 1,
        totalApplications: 1,
        completedApplications: 1,
        rejectedApplications: 1,
        pendingApplications: 1,
        totalRevenue: 1,
        uniqueUserCount: { $size: "$uniqueUsers" },
        completionRate: {
          $multiply: [
            { $divide: ["$completedApplications", "$totalApplications"] },
            100
          ]
        },
        avgRevenuePerApplication: {
          $divide: ["$totalRevenue", "$totalApplications"]
        }
      }
    },
    { $sort: { _id: 1 } }
  ]).toArray();
}

// ============================================================================
// GEOSPATIAL AGGREGATIONS FOR LOCATION ANALYTICS
// ============================================================================

function getGeospatialAnalytics(centerPoint, radiusKm = 50) {
  return db.applications.aggregate([
    {
      $match: {
        "citizen_info.address.location": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: centerPoint // [longitude, latitude]
            },
            $maxDistance: radiusKm * 1000 // Convert km to meters
          }
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
      $group: {
        _id: {
          district: "$citizen_info.address.district",
          service: "$service_info.name"
        },
        count: { $sum: 1 },
        avgDistance: {
          $avg: {
            $let: {
              vars: {
                coords: "$citizen_info.address.location.coordinates",
                lat1: { $degreesToRadians: centerPoint[1] },
                lon1: { $degreesToRadians: centerPoint[0] },
                lat2: { $degreesToRadians: { $arrayElemAt: ["$citizen_info.address.location.coordinates", 1] } },
                lon2: { $degreesToRadians: { $arrayElemAt: ["$citizen_info.address.location.coordinates", 0] } }
              },
              in: {
                // Haversine formula for distance calculation
                $multiply: [
                  6371, // Earth's radius in km
                  {
                    $multiply: [
                      2,
                      {
                        $asin: {
                          $sqrt: {
                            $add: [
                              {
                                $pow: [
                                  { $sin: { $divide: [{ $subtract: ["$$lat2", "$$lat1"] }, 2] } },
                                  2
                                ]
                              },
                              {
                                $multiply: [
                                  { $cos: "$$lat1" },
                                  { $cos: "$$lat2" },
                                  {
                                    $pow: [
                                      { $sin: { $divide: [{ $subtract: ["$$lon2", "$$lon1"] }, 2] } },
                                      2
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        totalRevenue: { $sum: "$payment_info.amount" },
        completionRate: {
          $avg: { $cond: [{ $eq: ["$status", "completed"] }, 100, 0] }
        }
      }
    },
    {
      $project: {
        _id: 1,
        count: 1,
        avgDistance: { $round: ["$avgDistance", 2] },
        totalRevenue: 1,
        completionRate: { $round: ["$completionRate", 1] }
      }
    },
    { $sort: { count: -1 } }
  ]).toArray();
}

// ============================================================================
// PERFORMANCE ANALYTICS FOR SLA MONITORING
// ============================================================================

function getPerformanceAnalytics(department = null, timeframe = 30) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - timeframe);
  
  const matchStage = {
    submitted_at: { $gte: fromDate },
    status: { $ne: "draft" }
  };
  
  if (department) {
    matchStage["service_info.department"] = department;
  }

  return db.applications.aggregate([
    {
      $lookup: {
        from: "services",
        localField: "service_id",
        foreignField: "_id",
        as: "service_info"
      }
    },
    { $unwind: "$service_info" },
    { $match: matchStage },
    {
      $addFields: {
        processingDays: {
          $divide: [
            {
              $subtract: [
                { $ifNull: ["$completed_at", new Date()] },
                "$submitted_at"
              ]
            },
            1000 * 60 * 60 * 24
          ]
        },
        slaTarget: "$service_info.sla_days",
        isSLAMet: {
          $cond: [
            { $and: [{ $ne: ["$status", "completed"] }, { $ne: ["$status", "rejected"] }] },
            null,
            {
              $lte: [
                {
                  $divide: [
                    { $subtract: [{ $ifNull: ["$completed_at", new Date()] }, "$submitted_at"] },
                    1000 * 60 * 60 * 24
                  ]
                },
                "$service_info.sla_days"
              ]
            }
          ]
        }
      }
    },
    {
      $group: {
        _id: {
          department: "$service_info.department",
          service: "$service_info.name"
        },
        totalApplications: { $sum: 1 },
        completedApplications: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
        },
        avgProcessingTime: { $avg: "$processingDays" },
        slaTarget: { $first: "$slaTarget" },
        slaMetCount: {
          $sum: { $cond: [{ $eq: ["$isSLAMet", true] }, 1, 0] }
        },
        slaViolations: {
          $sum: { $cond: [{ $eq: ["$isSLAMet", false] }, 1, 0] }
        },
        pendingOverSLA: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $in: ["$status", ["submitted", "under_review", "additional_info_required"]] },
                  { $gt: ["$processingDays", "$slaTarget"] }
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
        _id: 1,
        totalApplications: 1,
        completedApplications: 1,
        avgProcessingTime: { $round: ["$avgProcessingTime", 1] },
        slaTarget: 1,
        slaMetCount: 1,
        slaViolations: 1,
        pendingOverSLA: 1,
        slaComplianceRate: {
          $multiply: [
            {
              $divide: [
                "$slaMetCount",
                { $add: ["$slaMetCount", "$slaViolations"] }
              ]
            },
            100
          ]
        },
        completionRate: {
          $multiply: [
            { $divide: ["$completedApplications", "$totalApplications"] },
            100
          ]
        }
      }
    },
    { $sort: { slaComplianceRate: 1 } } // Show worst performers first
  ]).toArray();
}

// ============================================================================
// CITIZEN SATISFACTION AND FEEDBACK ANALYTICS
// ============================================================================

function getCitizenSatisfactionAnalytics(timeframe = 90) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - timeframe);

  return db.applications.aggregate([
    {
      $match: {
        submitted_at: { $gte: fromDate },
        "feedback.rating": { $exists: true }
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
      $group: {
        _id: {
          service: "$service_info.name",
          department: "$service_info.department"
        },
        totalRatings: { $sum: 1 },
        avgRating: { $avg: "$feedback.rating" },
        ratingDistribution: {
          $push: "$feedback.rating"
        },
        positiveComments: {
          $sum: {
            $cond: [
              { $gte: ["$feedback.rating", 4] },
              1, 0
            ]
          }
        },
        negativeComments: {
          $sum: {
            $cond: [
              { $lte: ["$feedback.rating", 2] },
              1, 0
            ]
          }
        },
        commonIssues: {
          $push: {
            $cond: [
              { $lte: ["$feedback.rating", 2] },
              "$feedback.comments",
              null
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        totalRatings: 1,
        avgRating: { $round: ["$avgRating", 2] },
        positiveComments: 1,
        negativeComments: 1,
        satisfactionRate: {
          $multiply: [
            { $divide: ["$positiveComments", "$totalRatings"] },
            100
          ]
        },
        dissatisfactionRate: {
          $multiply: [
            { $divide: ["$negativeComments", "$totalRatings"] },
            100
          ]
        },
        commonIssues: {
          $filter: {
            input: "$commonIssues",
            cond: { $ne: ["$$this", null] }
          }
        }
      }
    },
    { $sort: { avgRating: -1 } }
  ]).toArray();
}

// ============================================================================
// REVENUE ANALYTICS FOR FINANCIAL REPORTING
// ============================================================================

function getRevenueAnalytics(period = 'monthly', months = 12) {
  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - months);

  const groupFormat = {
    'daily': {
      year: { $year: "$payment_info.paid_at" },
      month: { $month: "$payment_info.paid_at" },
      day: { $dayOfMonth: "$payment_info.paid_at" }
    },
    'weekly': {
      year: { $year: "$payment_info.paid_at" },
      week: { $week: "$payment_info.paid_at" }
    },
    'monthly': {
      year: { $year: "$payment_info.paid_at" },
      month: { $month: "$payment_info.paid_at" }
    }
  };

  return db.applications.aggregate([
    {
      $match: {
        "payment_info.paid_at": { $gte: fromDate },
        "payment_info.status": "completed"
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
      $group: {
        _id: {
          period: groupFormat[period],
          department: "$service_info.department"
        },
        totalRevenue: { $sum: "$payment_info.amount" },
        totalTransactions: { $sum: 1 },
        avgTransactionValue: { $avg: "$payment_info.amount" },
        serviceBreakdown: {
          $push: {
            service: "$service_info.name",
            amount: "$payment_info.amount",
            fee: "$service_info.fee.amount"
          }
        }
      }
    },
    {
      $group: {
        _id: "$_id.period",
        totalRevenue: { $sum: "$totalRevenue" },
        totalTransactions: { $sum: "$totalTransactions" },
        departmentBreakdown: {
          $push: {
            department: "$_id.department",
            revenue: "$totalRevenue",
            transactions: "$totalTransactions",
            avgValue: "$avgTransactionValue"
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        totalRevenue: 1,
        totalTransactions: 1,
        avgTransactionValue: {
          $divide: ["$totalRevenue", "$totalTransactions"]
        },
        departmentBreakdown: 1
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
  ]).toArray();
}

// ============================================================================
// PREDICTIVE ANALYTICS FOR WORKLOAD FORECASTING
// ============================================================================

function getPredictiveWorkloadAnalytics() {
  return db.applications.aggregate([
    {
      $match: {
        submitted_at: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      }
    },
    {
      $addFields: {
        dayOfWeek: { $dayOfWeek: "$submitted_at" },
        hourOfDay: { $hour: "$submitted_at" },
        monthOfYear: { $month: "$submitted_at" },
        weekOfYear: { $week: "$submitted_at" }
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
      $facet: {
        // Daily patterns
        dailyPatterns: [
          {
            $group: {
              _id: "$dayOfWeek",
              avgApplications: { $avg: 1 },
              totalApplications: { $sum: 1 },
              peakHours: {
                $push: "$hourOfDay"
              }
            }
          },
          {
            $project: {
              _id: 1,
              dayName: {
                $switch: {
                  branches: [
                    { case: { $eq: ["$_id", 1] }, then: "Sunday" },
                    { case: { $eq: ["$_id", 2] }, then: "Monday" },
                    { case: { $eq: ["$_id", 3] }, then: "Tuesday" },
                    { case: { $eq: ["$_id", 4] }, then: "Wednesday" },
                    { case: { $eq: ["$_id", 5] }, then: "Thursday" },
                    { case: { $eq: ["$_id", 6] }, then: "Friday" },
                    { case: { $eq: ["$_id", 7] }, then: "Saturday" }
                  ]
                }
              },
              totalApplications: 1,
              avgDailyApplications: { $divide: ["$totalApplications", 52] }
            }
          },
          { $sort: { _id: 1 } }
        ],
        
        // Monthly seasonality
        monthlyPatterns: [
          {
            $group: {
              _id: "$monthOfYear",
              totalApplications: { $sum: 1 },
              uniqueServices: { $addToSet: "$service_id" },
              avgProcessingTime: {
                $avg: {
                  $divide: [
                    { $subtract: [{ $ifNull: ["$completed_at", new Date()] }, "$submitted_at"] },
                    1000 * 60 * 60 * 24
                  ]
                }
              }
            }
          },
          {
            $project: {
              _id: 1,
              monthName: {
                $switch: {
                  branches: [
                    { case: { $eq: ["$_id", 1] }, then: "January" },
                    { case: { $eq: ["$_id", 2] }, then: "February" },
                    { case: { $eq: ["$_id", 3] }, then: "March" },
                    { case: { $eq: ["$_id", 4] }, then: "April" },
                    { case: { $eq: ["$_id", 5] }, then: "May" },
                    { case: { $eq: ["$_id", 6] }, then: "June" },
                    { case: { $eq: ["$_id", 7] }, then: "July" },
                    { case: { $eq: ["$_id", 8] }, then: "August" },
                    { case: { $eq: ["$_id", 9] }, then: "September" },
                    { case: { $eq: ["$_id", 10] }, then: "October" },
                    { case: { $eq: ["$_id", 11] }, then: "November" },
                    { case: { $eq: ["$_id", 12] }, then: "December" }
                  ]
                }
              },
              totalApplications: 1,
              serviceVariety: { $size: "$uniqueServices" },
              avgProcessingTime: { $round: ["$avgProcessingTime", 1] }
            }
          },
          { $sort: { _id: 1 } }
        ],
        
        // Service demand forecast
        serviceDemandForecast: [
          {
            $group: {
              _id: {
                service: "$service_info.name",
                month: "$monthOfYear"
              },
              applications: { $sum: 1 }
            }
          },
          {
            $group: {
              _id: "$_id.service",
              monthlyData: {
                $push: {
                  month: "$_id.month",
                  applications: "$applications"
                }
              },
              totalApplications: { $sum: "$applications" },
              avgMonthlyApplications: { $avg: "$applications" }
            }
          },
          {
            $project: {
              _id: 1,
              totalApplications: 1,
              avgMonthlyApplications: { $round: ["$avgMonthlyApplications", 0] },
              growthTrend: {
                $let: {
                  vars: {
                    sortedData: {
                      $sortArray: {
                        input: "$monthlyData",
                        sortBy: { month: 1 }
                      }
                    }
                  },
                  in: {
                    $cond: [
                      { $gt: [{ $size: "$$sortedData" }, 6] },
                      {
                        $subtract: [
                          { $arrayElemAt: [{ $arrayElemAt: ["$$sortedData", -1] }, 1] },
                          { $arrayElemAt: [{ $arrayElemAt: ["$$sortedData", 0] }, 1] }
                        ]
                      },
                      0
                    ]
                  }
                }
              }
            }
          },
          { $sort: { totalApplications: -1 } }
        ]
      }
    }
  ]).toArray()[0];
}

// ============================================================================
// INTEGRATION FUNCTIONS FOR CACHING
// ============================================================================

// Cache-optimized dashboard data fetcher
async function getCachedDashboardData(cacheManager, filters = {}) {
  const cacheKey = `dashboard:stats:${JSON.stringify(filters)}`;
  
  let data = await cacheManager.get(cacheKey);
  
  if (!data) {
    data = getDashboardStatistics(filters.district, filters.dateRange);
    
    // Cache for 5 minutes for dashboard data
    await cacheManager.set(cacheKey, data, 300);
  }
  
  return data;
}

// Cache-optimized trends data
async function getCachedTrendsData(cacheManager, period = 'daily', days = 30) {
  const cacheKey = `trends:${period}:${days}`;
  
  let data = await cacheManager.get(cacheKey);
  
  if (!data) {
    data = getApplicationTrends(period, days);
    
    // Cache for 10 minutes for trend data
    await cacheManager.set(cacheKey, data, 600);
  }
  
  return data;
}

// Cache invalidation triggers for dashboard data
function setupDashboardCacheInvalidation(invalidationManager) {
  // Invalidate dashboard cache when applications are updated
  invalidationManager.registerTrigger('application_status_updated', async (data) => {
    await invalidationManager.cache.invalidatePattern('dashboard:*');
    await invalidationManager.cache.invalidatePattern('trends:*');
    console.log(`Dashboard cache invalidated for application: ${data.applicationId}`);
  });
  
  // Invalidate when new applications are submitted
  invalidationManager.registerTrigger('application_submitted', async (data) => {
    await invalidationManager.cache.invalidatePattern('dashboard:*');
    await invalidationManager.cache.invalidatePattern('trends:*');
  });
  
  // Invalidate performance data when officers are reassigned
  invalidationManager.registerTrigger('officer_reassigned', async (data) => {
    await invalidationManager.cache.invalidatePattern('performance:*');
    await invalidationManager.cache.invalidatePattern('dashboard:*');
  });
}

// Export functions for use in Node.js applications
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getDashboardStatistics,
    getApplicationTrends,
    getGeospatialAnalytics,
    getPerformanceAnalytics,
    getCitizenSatisfactionAnalytics,
    getRevenueAnalytics,
    getPredictiveWorkloadAnalytics,
    getCachedDashboardData,
    getCachedTrendsData,
    setupDashboardCacheInvalidation
  };
};