// File: Database/Mongo/performance/sparse_indexes.js
// Sparse indexes for optional fields

use('gov_db');

print('🔍 Creating Sparse Indexes for Optional Fields...\n');

// ============================================================================
// SPARSE INDEXES FOR OPTIONAL FIELDS
// ============================================================================

try {
  // Users - Optional fields
  db.users.createIndex(
    { "phone": 1 },
    { name: "idx_users_phone_sparse", sparse: true, background: true }
  );

  db.users.createIndex(
    { "last_login": -1 },
    { name: "idx_users_last_login_sparse", sparse: true, background: true }
  );

  db.users.createIndex(
    { "account_locked_until": 1 },
    { name: "idx_users_locked_until_sparse", sparse: true, background: true }
  );

  // Citizen Profiles - Optional fields
  db.citizen_profiles.createIndex(
    { "profile_photo_url": 1 },
    { name: "idx_profiles_photo_sparse", sparse: true, background: true }
  );

  db.citizen_profiles.createIndex(
    { "employer": 1 },
    { name: "idx_profiles_employer_sparse", sparse: true, background: true }
  );

  db.citizen_profiles.createIndex(
    { "emergency_contact.phone": 1 },
    { name: "idx_profiles_emergency_sparse", sparse: true, background: true }
  );

  // Applications - Optional fields
  db.applications.createIndex(
    { "assigned_officer": 1 },
    { name: "idx_apps_officer_sparse", sparse: true, background: true }
  );

  db.applications.createIndex(
    { "completed_at": -1 },
    { name: "idx_apps_completed_sparse", sparse: true, background: true }
  );

  db.applications.createIndex(
    { "payment_info.payment_reference": 1 },
    { name: "idx_apps_payment_ref_sparse", sparse: true, background: true }
  );

  // Officers - Optional fields
  db.officers.createIndex(
    { "supervisor_id": 1 },
    { name: "idx_officers_supervisor_sparse", sparse: true, background: true }
  );

  // Documents - Optional fields
  db.documents.createIndex(
    { "verified_by": 1 },
    { name: "idx_docs_verified_by_sparse", sparse: true, background: true }
  );

  db.documents.createIndex(
    { "expiry_date": 1 },
    { name: "idx_docs_expiry_sparse", sparse: true, background: true }
  );

  print('✅ All sparse indexes created successfully!');
} catch (e) {
  print('❌ Sparse indexes error:', e.message);
}