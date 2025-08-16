// File: Database/Mongo/performance/compound_indexes.js
// Advanced compound indexes for optimal query performance

use('gov_db');

print('🚀 Creating Advanced Compound Indexes...\n');

// ============================================================================
// COMPOUND INDEXES FOR FREQUENT QUERY PATTERNS
// ============================================================================

// Applications - Complex compound indexes
try {
  // Most common query pattern: user + status + date
  db.applications.createIndex(
    { "user_id": 1, "status": 1, "submitted_at": -1 },
    { name: "idx_apps_user_status_date", background: true }
  );

  // Officer workload queries
  db.applications.createIndex(
    { "assigned_officer": 1, "status": 1, "priority": 1, "estimated_completion": 1 },
    { name: "idx_apps_officer_workload", background: true }
  );

  // Service-based filtering with date range
  db.applications.createIndex(
    { "service_id": 1, "status": 1, "submitted_at": -1, "priority": 1 },
    { name: "idx_apps_service_status_date_priority", background: true }
  );

  // District-based queries with status
  db.applications.createIndex(
    { "citizen_info.address.district": 1, "status": 1, "submitted_at": -1 },
    { name: "idx_apps_district_status_date", background: true }
  );

  // Payment status with service
  db.applications.createIndex(
    { "payment_info.payment_status": 1, "service_id": 1, "submitted_at": -1 },
    { name: "idx_apps_payment_service_date", background: true }
  );

  print('✅ Applications compound indexes created');
} catch (e) {
  print('❌ Applications compound indexes error:', e.message);
}

// Users - Performance indexes
try {
  // Login performance
  db.users.createIndex(
    { "email": 1, "status": 1, "email_verified": 1 },
    { name: "idx_users_login_performance", background: true }
  );

  // Role-based queries with activity
  db.users.createIndex(
    { "role": 1, "status": 1, "last_login": -1 },
    { name: "idx_users_role_activity", background: true }
  );

  print('✅ Users compound indexes created');
} catch (e) {
  print('❌ Users compound indexes error:', e.message);
}

// Appointments - Time-based compound indexes
try {
  // Officer schedule management
  db.appointments.createIndex(
    { "officer_id": 1, "appointment_date": 1, "status": 1 },
    { name: "idx_appointments_officer_schedule", background: true }
  );

  // User appointment history
  db.appointments.createIndex(
    { "user_id": 1, "appointment_date": -1, "status": 1 },
    { name: "idx_appointments_user_history", background: true }
  );

  // Daily schedule queries
  db.appointments.createIndex(
    { "appointment_date": 1, "location.type": 1, "status": 1 },
    { name: "idx_appointments_daily_schedule", background: true }
  );

  print('✅ Appointments compound indexes created');
} catch (e) {
  print('❌ Appointments compound indexes error:', e.message);
}

print('\n✅ All compound indexes created successfully!');