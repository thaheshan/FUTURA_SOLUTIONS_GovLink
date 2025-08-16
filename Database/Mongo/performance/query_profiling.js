// File: Database/Mongo/performance/query_profiling.js
// Query profiling and performance monitoring

use('gov_db');

print('📊 Setting up Query Profiling and Performance Monitoring...\n');

// ============================================================================
// ENABLE QUERY PROFILING
// ============================================================================

try {
  // Enable profiling for slow operations (>100ms)
  db.setProfilingLevel(1, { slowms: 100 });
  print('✅ Query profiling enabled for operations >100ms');
} catch (e) {
  print('❌ Profiling setup error:', e.message);
}

// ============================================================================
// PERFORMANCE MONITORING FUNCTIONS
// ============================================================================

// Function to analyze slow queries
function analyzeSlowQueries() {
  print('\n📈 Analyzing slow queries from last hour...');
  
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const slowQueries = db.system.profile.aggregate([
    { $match: { ts: { $gte: oneHourAgo } } },
    { $group: {
        _id: "$command",
        count: { $sum: 1 },
        avgDuration: { $avg: "$millis" },
        maxDuration: { $max: "$millis" },
        totalDuration: { $sum: "$millis" }
    }},
    { $sort: { avgDuration: -1 } },
    { $limit: 10 }
  ]).toArray();
  
  print('Top slow query patterns:');
  slowQueries.forEach(query => {
    print(`  • Avg: ${query.avgDuration.toFixed(2)}ms, Max: ${query.maxDuration}ms, Count: ${query.count}`);
  });
}

// Function to check index usage
function checkIndexUsage() {
  print('\n📊 Checking index usage statistics...');
  
  const collections = ['applications', 'users', 'services', 'citizen_profiles'];
  
  collections.forEach(collName => {
    const stats = db[collName].aggregate([
      { $indexStats: {} }
    ]).toArray();
    
    print(`\n${collName.toUpperCase()} Index Usage:`);
    stats.forEach(stat => {
      print(`  • ${stat.name}: ${stat.accesses.ops} operations`);
    });
  });
}

// Function to identify unused indexes
function findUnusedIndexes() {
  print('\n🔍 Finding unused indexes...');
  
  const collections = ['applications', 'users', 'services', 'citizen_profiles'];
  
  collections.forEach(collName => {
    const stats = db[collName].aggregate([
      { $indexStats: {} },
      { $match: { "accesses.ops": 0 } }
    ]).toArray();
    
    if (stats.length > 0) {
      print(`\n${collName.toUpperCase()} - Unused indexes:`);
      stats.forEach(stat => {
        print(`  • ${stat.name} - Consider dropping if not needed`);
      });
    }
  });
}

// ============================================================================
// PERFORMANCE OPTIMIZATION RECOMMENDATIONS
// ============================================================================

function generatePerformanceReport() {
  print('\n📋 Performance Optimization Report');
  print('==================================');
  
  analyzeSlowQueries();
  checkIndexUsage();
  findUnusedIndexes();
  
  print('\n💡 Optimization Recommendations:');
  print('1. Monitor slow queries regularly');
  print('2. Drop unused indexes to save space');
  print('3. Consider compound indexes for frequent query patterns');
  print('4. Use explain() to verify index usage');
  print('5. Monitor index selectivity and cardinality');
}

// Export functions for external use
print('\n✅ Query profiling setup completed!');
print('\nAvailable functions:');
print('• analyzeSlowQueries()');
print('• checkIndexUsage()');
print('• findUnusedIndexes()');
print('• generatePerformanceReport()');

// Run initial report
generatePerformanceReport();