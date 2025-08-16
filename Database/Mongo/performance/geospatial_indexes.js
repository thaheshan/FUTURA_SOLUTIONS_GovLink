// File: Database/Mongo/performance/geospatial_indexes.js
// Geospatial indexes for location-based queries

use('gov_db');

print('🌍 Creating Geospatial Indexes...\n');

// ============================================================================
// GEOSPATIAL INDEXES FOR LOCATION-BASED QUERIES
// ============================================================================

try {
  // Citizen Profiles - Location-based services
  db.citizen_profiles.createIndex({
    "address.location": "2dsphere"
  }, {
    name: "idx_profiles_geospatial",
    background: true
  });

  // Applications - Geographic distribution
  db.applications.createIndex({
    "citizen_info.address.location": "2dsphere"
  }, {
    name: "idx_apps_geospatial",
    background: true
  });

  // Officers - Office locations
  db.officers.createIndex({
    "office_location.coordinates": "2dsphere"
  }, {
    name: "idx_officers_geospatial",
    background: true
  });

  // District-based compound geospatial index
  db.applications.createIndex({
    "citizen_info.address.district": 1,
    "citizen_info.address.location": "2dsphere",
    "status": 1
  }, {
    name: "idx_apps_district_geo_status",
    background: true
  });

  print('✅ Geospatial indexes created successfully!');
} catch (e) {
  print('❌ Geospatial indexes error:', e.message);
}

// ============================================================================
// SAMPLE GEOSPATIAL QUERIES
// ============================================================================

print('\n📋 Sample Geospatial Query Examples:');
print(`
// Find citizens within 5km of a location
db.citizen_profiles.find({
  "address.location": {
    $near: {
      $geometry: { type: "Point", coordinates: [79.8612, 6.9271] },
      $maxDistance: 5000
    }
  }
});

// Find applications within a district boundary
db.applications.find({
  "citizen_info.address.location": {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [[
          [79.8, 6.9], [79.9, 6.9], [79.9, 7.0], [79.8, 7.0], [79.8, 6.9]
        ]]
      }
    }
  }
});
`);