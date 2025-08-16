// File: Database/Mongo/create_indexes.js
// Creates all performance indexes

print('📈 Creating performance indexes...\n');

// Users Collection Indexes
try {
  db.users.createIndex({ "email": 1 }, { unique: true, name: "idx_users_email" });
  db.users.createIndex({ "nic": 1 }, { unique: true, name: "idx_users_nic" });
  db.users.createIndex({ "phone": 1 }, { name: "idx_users_phone" });
  db.users.createIndex({ "role": 1, "status": 1 }, { name: "idx_users_role_status" });
  db.users.createIndex({ "last_login": -1 }, { name: "idx_users_last_login" });
  db.users.createIndex({ "created_at": -1 }, { name: "idx_users_created" });
  print('✅ Users indexes created');
} catch (e) {
  print('❌ Users indexes error:', e.message);
}

// Citizen Profiles Indexes
try {
  db.citizen_profiles.createIndex({ "user_id": 1 }, { unique: true, name: "idx_profiles_user" });
  db.citizen_profiles.createIndex({ "nic": 1 }, { unique: true, name: "idx_profiles_nic" });
  db.citizen_profiles.createIndex({ "address.district": 1 }, { name: "idx_profiles_district" });
  db.citizen_profiles.createIndex({ "verification_status": 1 }, { name: "idx_profiles_verification" });
  db.citizen_profiles.createIndex({ "full_name": "text" }, { name: "idx_profiles_search" });
  print('✅ Citizen profiles indexes created');
} catch (e) {
  print('❌ Citizen profiles indexes error:', e.message);
}

// Services Indexes
try {
  db.services.createIndex({ "service_code": 1 }, { unique: true, name: "idx_services_code" });
  db.services.createIndex({ "category": 1, "status": 1 }, { name: "idx_services_category_status" });
  db.services.createIndex({ "name": "text", "description": "text" }, { name: "idx_services_search" });
  db.services.createIndex({ "eligible_districts": 1 }, { name: "idx_services_districts" });
  db.services.createIndex({ "fee.amount": 1 }, { name: "idx_services_fee" });
  print('✅ Services indexes created');
} catch (e) {
  print('❌ Services indexes error:', e.message);
}

// Applications Indexes
try {
  db.applications.createIndex({ "application_number": 1 }, { unique: true, name: "idx_apps_number" });
  db.applications.createIndex({ "user_id": 1, "status": 1 }, { name: "idx_apps_user_status" });
  db.applications.createIndex({ "service_id": 1 }, { name: "idx_apps_service" });
  db.applications.createIndex({ "assigned_officer": 1, "status": 1 }, { name: "idx_apps_officer_status" });
  db.applications.createIndex({ "submitted_at": -1 }, { name: "idx_apps_submitted" });
  db.applications.createIndex({ "estimated_completion": 1 }, { name: "idx_apps_completion" });
  db.applications.createIndex({ "priority": 1, "status": 1 }, { name: "idx_apps_priority_status" });
  db.applications.createIndex({ "payment_info.payment_status": 1 }, { name: "idx_apps_payment_status" });
  print('✅ Applications indexes created');
} catch (e) {
  print('❌ Applications indexes error:', e.message);
}

// Appointments Indexes
try {
  db.appointments.createIndex({ "user_id": 1, "appointment_date": 1 }, { name: "idx_appointments_user_date" });
  db.appointments.createIndex({ "officer_id": 1, "appointment_date": 1 }, { name: "idx_appointments_officer_date" });
  db.appointments.createIndex({ "application_id": 1 }, { name: "idx_appointments_application" });
  db.appointments.createIndex({ "appointment_date": 1, "status": 1 }, { name: "idx_appointments_date_status" });
  db.appointments.createIndex({ "status": 1 }, { name: "idx_appointments_status" });
  print('✅ Appointments indexes created');
} catch (e) {
  print('❌ Appointments indexes error:', e.message);
}

// Officers Indexes
try {
  db.officers.createIndex({ "user_id": 1 }, { unique: true, name: "idx_officers_user" });
  db.officers.createIndex({ "employee_id": 1 }, { unique: true, name: "idx_officers_employee" });
  db.officers.createIndex({ "department": 1, "status": 1 }, { name: "idx_officers_dept_status" });
  db.officers.createIndex({ "office_location.district": 1 }, { name: "idx_officers_district" });
  db.officers.createIndex({ "specializations": 1 }, { name: "idx_officers_specializations" });
  db.officers.createIndex({ "workload_capacity": 1 }, { name: "idx_officers_capacity" });
  print('✅ Officers indexes created');
} catch (e) {
  print('❌ Officers indexes error:', e.message);
}

// Assignments Indexes
try {
  db.assignments.createIndex({ "application_id": 1, "status": 1 }, { name: "idx_assignments_app_status" });
  db.assignments.createIndex({ "officer_id": 1, "status": 1 }, { name: "idx_assignments_officer_status" });
  db.assignments.createIndex({ "assigned_at": -1 }, { name: "idx_assignments_assigned" });
  db.assignments.createIndex({ "expected_completion": 1 }, { name: "idx_assignments_completion" });
  db.assignments.createIndex({ "assignment_type": 1 }, { name: "idx_assignments_type" });
  db.assignments.createIndex({ "priority": 1 }, { name: "idx_assignments_priority" });
  print('✅ Assignments indexes created');
} catch (e) {
  print('❌ Assignments indexes error:', e.message);
}

// Documents Indexes
try {
  db.documents.createIndex({ "application_id": 1 }, { name: "idx_documents_application" });
  db.documents.createIndex({ "uploaded_by": 1 }, { name: "idx_documents_uploader" });
  db.documents.createIndex({ "document_type": 1 }, { name: "idx_documents_type" });
  db.documents.createIndex({ "verification_status": 1 }, { name: "idx_documents_verification" });
  db.documents.createIndex({ "upload_date": -1 }, { name: "idx_documents_upload_date" });
  db.documents.createIndex({ "verified_by": 1 }, { name: "idx_documents_verifier" });
  print('✅ Documents indexes created');
} catch (e) {
  print('❌ Documents indexes error:', e.message);
}

// Notifications Indexes
try {
  db.notifications.createIndex({ "recipient_id": 1, "created_at": -1 }, { name: "idx_notifications_recipient" });
  db.notifications.createIndex({ "type": 1, "category": 1 }, { name: "idx_notifications_type_category" });
  db.notifications.createIndex({ "read_at": 1 }, { name: "idx_notifications_read" });
  db.notifications.createIndex({ "priority": 1 }, { name: "idx_notifications_priority" });
  db.notifications.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0, name: "idx_notifications_ttl" });
  print('✅ Notifications indexes created');
} catch (e) {
  print('❌ Notifications indexes error:', e.message);
}

// Audit Logs Indexes
try {
  db.audit_logs.createIndex({ "user_id": 1, "timestamp": -1 }, { name: "idx_audit_user_time" });
  db.audit_logs.createIndex({ "resource_type": 1, "action": 1 }, { name: "idx_audit_resource_action" });
  db.audit_logs.createIndex({ "timestamp": -1 }, { name: "idx_audit_timestamp" });
  db.audit_logs.createIndex({ "resource_id": 1 }, { name: "idx_audit_resource" });
  db.audit_logs.createIndex({ "success": 1 }, { name: "idx_audit_success" });
  print('✅ Audit logs indexes created');
} catch (e) {
  print('❌ Audit logs indexes error:', e.message);
}

// OTP Tokens Indexes (with TTL for auto-deletion)
try {
  db.otp_tokens.createIndex({ "identifier": 1, "purpose": 1 }, { name: "idx_otp_identifier_purpose" });
  db.otp_tokens.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0, name: "idx_otp_ttl" });
  db.otp_tokens.createIndex({ "verified": 1 }, { name: "idx_otp_verified" });
  print('✅ OTP tokens indexes created');
} catch (e) {
  print('❌ OTP tokens indexes error:', e.message);
}

print('\n📈 All performance indexes created successfully!');