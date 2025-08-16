// File: Database/Mongo/search/advanced_search.js
// Advanced search implementation with aggregation pipelines

use('gov_db');

print('🔎 Implementing Advanced Search Features...\n');

// ============================================================================
// FUZZY SEARCH IMPLEMENTATION
// ============================================================================

function fuzzySearchApplications(searchTerm, options = {}) {
  const {
    limit = 20,
    skip = 0,
    status = null,
    district = null,
    dateFrom = null,
    dateTo = null
  } = options;

  const pipeline = [
    // Text search stage
    {
      $match: {
        $text: { $search: searchTerm }
      }
    },
    
    // Add relevance score
    {
      $addFields: {
        searchScore: { $meta: "textScore" }
      }
    },
    
    // Additional filtering
    {
      $match: {
        ...(status && { status: status }),
        ...(district && { "citizen_info.address.district": district }),
        ...(dateFrom || dateTo) && {
          submitted_at: {
            ...(dateFrom && { $gte: new Date(dateFrom) }),
            ...(dateTo && { $lte: new Date(dateTo) })
          }
        }
      }
    },
    
    // Lookup service details
    {
      $lookup: {
        from: "services",
        localField: "service_id",
        foreignField: "_id",
        as: "service_info"
      }
    },
    
    // Lookup user details
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_info"
      }
    },
    
    // Project relevant fields
    {
      $project: {
        application_number: 1,
        status: 1,
        priority: 1,
        submitted_at: 1,
        estimated_completion: 1,
        searchScore: 1,
        "service_info.name": 1,
        "service_info.category": 1,
        "user_info.email": 1,
        "form_data.personal_info.full_name": 1,
        "citizen_info.address.district": 1
      }
    },
    
    // Sort by relevance and date
    {
      $sort: {
        searchScore: -1,
        submitted_at: -1
      }
    },
    
    // Pagination
    { $skip: skip },
    { $limit: limit }
  ];

  return db.applications.aggregate(pipeline).toArray();
}

// ============================================================================
// FACETED SEARCH IMPLEMENTATION
// ============================================================================

function facetedSearch(searchTerm = "", filters = {}) {
  const pipeline = [
    // Initial match stage
    {
      $match: {
        ...(searchTerm && { $text: { $search: searchTerm } }),
        ...filters
      }
    },
    
    // Faceted aggregation
    {
      $facet: {
        // Main results
        results: [
          {
            $lookup: {
              from: "services",
              localField: "service_id",
              foreignField: "_id",
              as: "service_info"
            }
          },
          {
            $project: {
              application_number: 1,
              status: 1,
              priority: 1,
              submitted_at: 1,
              "service_info.name": 1,
              "service_info.category": 1,
              "citizen_info.address.district": 1
            }
          },
          { $limit: 50 }
        ],
        
        // Status facets
        statusFacets: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ],
        
        // District facets
        districtFacets: [
          {
            $group: {
              _id: "$citizen_info.address.district",
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ],
        
        // Service category facets
        categoryFacets: [
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
              _id: "$service_info.category",
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ],
        
        // Priority facets
        priorityFacets: [
          {
            $group: {
              _id: "$priority",
              count: { $sum: 1 }
            }
          }
        ],
        
        // Total count
        totalCount: [
          { $count: "total" }
        ]
      }
    }
  ];

  return db.applications.aggregate(pipeline).toArray()[0];
}

// ============================================================================
// SEARCH ANALYTICS IMPLEMENTATION
// ============================================================================

function trackSearchQuery(query, userId, resultCount, responseTime) {
  db.search_analytics.insertOne({
    query: query,
    user_id: userId,
    result_count: resultCount,
    response_time_ms: responseTime,
    timestamp: new Date(),
    date: new Date().toISOString().split('T')[0]
  });
}

function getSearchAnalytics(days = 7) {
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);
  
  return db.search_analytics.aggregate([
    { $match: { timestamp: { $gte: fromDate } } },
    {
      $facet: {
        topQueries: [
          {
            $group: {
              _id: "$query",
              count: { $sum: 1 },
              avgResponseTime: { $avg: "$response_time_ms" },
              avgResultCount: { $avg: "$result_count" }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        dailyStats: [
          {
            $group: {
              _id: "$date",
              totalQueries: { $sum: 1 },
              avgResponseTime: { $avg: "$response_time_ms" },
              uniqueUsers: { $addToSet: "$user_id" }
            }
          },
          {
            $project: {
              _id: 1,
              totalQueries: 1,
              avgResponseTime: 1,
              uniqueUserCount: { $size: "$uniqueUsers" }
            }
          },
          { $sort: { _id: 1 } }
        ]
      }
    }
  ]).toArray()[0];
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

print('✅ Advanced search functions created:');
print('• fuzzySearchApplications(searchTerm, options)');
print('• facetedSearch(searchTerm, filters)');
print('• trackSearchQuery(query, userId, resultCount, responseTime)');
print('• getSearchAnalytics(days)');

// Create search analytics collection
try {
  db.createCollection("search_analytics");
  db.search_analytics.createIndex({ "timestamp": -1 });
  db.search_analytics.createIndex({ "query": "text" });
  db.search_analytics.createIndex({ "user_id": 1, "timestamp": -1 });
  print('✅ Search analytics collection created');
} catch (e) {
  print('⚠️ Search analytics collection already exists');
}