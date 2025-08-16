// File: Database/Mongo/performance/text_search_indexes.js
// Full-text search indexes with weighted fields

use('gov_db');

print('🔎 Creating Text Search Indexes...\n');

// ============================================================================
// TEXT SEARCH INDEXES WITH WEIGHTED FIELDS
// ============================================================================

try {
  // Applications - Multi-field text search with weights
  db.applications.createIndex({
    "application_number": "text",
    "form_data.personal_info.full_name": "text",
    "form_data.personal_info.name_with_initials": "text",
    "form_data.service_name": "text",
    "review_notes.note": "text"
  }, {
    weights: {
      "application_number": 10,
      "form_data.personal_info.full_name": 8,
      "form_data.personal_info.name_with_initials": 6,
      "form_data.service_name": 5,
      "review_notes.note": 2
    },
    name: "idx_apps_text_search",
    background: true
  });

  print('✅ Applications text search index created');
} catch (e) {
  print('❌ Applications text search error:', e.message);
}

try {
  // Services - Service discovery text search
  db.services.createIndex({
    "name": "text",
    "description": "text",
    "service_code": "text",
    "category": "text",
    "department": "text"
  }, {
    weights: {
      "name": 10,
      "service_code": 8,
      "category": 6,
      "description": 4,
      "department": 3
    },
    name: "idx_services_text_search",
    background: true
  });

  print('✅ Services text search index created');
} catch (e) {
  print('❌ Services text search error:', e.message);
}

try {
  // Citizen Profiles - People search
  db.citizen_profiles.createIndex({
    "full_name": "text",
    "name_with_initials": "text",
    "nic": "text",
    "occupation": "text",
    "employer": "text"
  }, {
    weights: {
      "full_name": 10,
      "name_with_initials": 8,
      "nic": 9,
      "occupation": 3,
      "employer": 2
    },
    name: "idx_profiles_text_search",
    background: true
  });

  print('✅ Citizen profiles text search index created');
} catch (e) {
  print('❌ Citizen profiles text search error:', e.message);
}

try {
  // Officers - Staff search
  db.officers.createIndex({
    "employee_id": "text",
    "designation": "text",
    "department": "text",
    "office_location.name": "text",
    "specializations": "text"
  }, {
    weights: {
      "employee_id": 10,
      "designation": 6,
      "department": 5,
      "office_location.name": 4,
      "specializations": 3
    },
    name: "idx_officers_text_search",
    background: true
  });

  print('✅ Officers text search index created');
} catch (e) {
  print('❌ Officers text search error:', e.message);
}

print('\n✅ All text search indexes created successfully!');