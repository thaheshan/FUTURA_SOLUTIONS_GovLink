// ============================================================================
// MONGODB SCHEMA IMPLEMENTATION SCRIPT
// File: Database/Mongo/implement_schemas.js
// ============================================================================

// Import your existing schema file
const schemas = require('./mongodb_schema.js');

// Database connection
const dbName = 'government_services_db';

// ============================================================================
// 1. CREATE COLLECTIONS WITH VALIDATION
// ============================================================================

async function createCollectionsWithValidation() {
  console.log('Creating collections with validation...');
  
  const collections = [
    { name: 'users', schema: schemas.usersSchema },
    { name: 'citizen_profiles', schema: schemas.citizenProfilesSchema },
    { name: 'services', schema: schemas.servicesSchema },
    { name: 'applications', schema: schemas.applicationsSchema },
    { name: 'appointments', schema: schemas.appointmentsSchema },
    { name: 'officers', schema: schemas.officersSchema },
    { name: 'assignments', schema: schemas.assignmentsSchema },
    { name: 'documents', schema: schemas.documentsSchema },
    { name: 'notifications', schema: schemas.notificationsSchema },
    { name: 'audit_logs', schema: schemas.auditLogsSchema },
    { name: 'otp_tokens', schema: schemas.otpTokensSchema }
  ];

  for (const collection of collections) {
    try {
      // Drop collection if exists (for fresh start)
      try {
        await db.getCollection(collection.name).drop();
        console.log(`Dropped existing collection: ${collection.name}`);
      } catch (e) {
        // Collection doesn't exist, continue
      }

      // Create collection with validation
      await db.createCollection(collection.name, collection.schema);
      console.log(`✅ Created collection: ${collection.name}`);
    } catch (error) {
      console.error(`❌ Error creating ${collection.name}:`, error.message);
    }
  }
}

// ============================================================================
// 2. CREATE INDEXES FOR PERFORMANCE
// ============================================================================

async function createIndexes() {
  console.log('\nCreating indexes...');

  const indexOperations = [
    // Users Collection Indexes
    {
      collection: 'users',
      indexes: [
        { key: { email: 1 }, options: { unique: true, name: 'idx_users_email' } },
        { key: { nic: 1 }, options: { unique: true, name: 'idx_users_nic' } },
        { key: { phone: 1 }, options: { name: 'idx_users_phone' } },
        { key: { role: 1, status: 1 }, options: { name: 'idx_users_role_status' } },
        { key: { last_login: -1 }, options: { name: 'idx_users_last_login' } }
      ]
    },

    // Citizen Profiles Indexes
    {
      collection: 'citizen_profiles',
      indexes: [
        { key: { user_id: 1 }, options: { unique: true, name: 'idx_profiles_user' } },
        { key: { nic: 1 }, options: { unique: true, name: 'idx_profiles_nic' } },
        { key: { 'address.district': 1 }, options: { name: 'idx_profiles_district' } },
        { key: { verification_status: 1 }, options: { name: 'idx_profiles_verification' } }
      ]
    },

    // Services Collection Indexes
    {
      collection: 'services',
      indexes: [
        { key: { service_code: 1 }, options: { unique: true, name: 'idx_services_code' } },
        { key: { category: 1, status: 1 }, options: { name: 'idx_services_category_status' } },
        { key: { name: "text", description: "text" }, options: { name: 'idx_services_search' } }
      ]
    },

    // Applications Collection Indexes
    {
      collection: 'applications',
      indexes: [
        { key: { application_number: 1 }, options: { unique: true, name: 'idx_apps_number' } },
        { key: { user_id: 1, status: 1 }, options: { name: 'idx_apps_user_status' } },
        { key: { service_id: 1 }, options: { name: 'idx_apps_service' } },
        { key: { assigned_officer: 1, status: 1 }, options: { name: 'idx_apps_officer_status' } },
        { key: { submitted_at: -1 }, options: { name: 'idx_apps_submitted' } },
        { key: { estimated_completion: 1 }, options: { name: 'idx_apps_completion' } }
      ]
    },

    // Appointments Collection Indexes
    {
      collection: 'appointments',
      indexes: [
        { key: { user_id: 1, appointment_date: 1 }, options: { name: 'idx_appointments_user_date' } },
        { key: { officer_id: 1, appointment_date: 1 }, options: { name: 'idx_appointments_officer_date' } },
        { key: { application_id: 1 }, options: { name: 'idx_appointments_application' } },
        { key: { appointment_date: 1, status: 1 }, options: { name: 'idx_appointments_date_status' } }
      ]
    },

    // Officers Collection Indexes
    {
      collection: 'officers',
      indexes: [
        { key: { user_id: 1 }, options: { unique: true, name: 'idx_officers_user' } },
        { key: { employee_id: 1 }, options: { unique: true, name: 'idx_officers_employee' } },
        { key: { department: 1, status: 1 }, options: { name: 'idx_officers_dept_status' } },
        { key: { 'office_location.district': 1 }, options: { name: 'idx_officers_district' } }
      ]
    },

    // Assignments Collection Indexes
    {
      collection: 'assignments',
      indexes: [
        { key: { application_id: 1, status: 1 }, options: { name: 'idx_assignments_app_status' } },
        { key: { officer_id: 1, status: 1 }, options: { name: 'idx_assignments_officer_status' } },
        { key: { assigned_at: -1 }, options: { name: 'idx_assignments_assigned' } },
        { key: { expected_completion: 1 }, options: { name: 'idx_assignments_completion' } }
      ]
    },

    // Documents Collection Indexes
    {
      collection: 'documents',
      indexes: [
        { key: { application_id: 1 }, options: { name: 'idx_documents_application' } },
        { key: { uploaded_by: 1 }, options: { name: 'idx_documents_uploader' } },
        { key: { document_type: 1 }, options: { name: 'idx_documents_type' } },
        { key: { verification_status: 1 }, options: { name: 'idx_documents_verification' } },
        { key: { upload_date: -1 }, options: { name: 'idx_documents_upload_date' } }
      ]
    },

    // Notifications Collection Indexes
    {
      collection: 'notifications',
      indexes: [
        { key: { recipient_id: 1, created_at: -1 }, options: { name: 'idx_notifications_recipient' } },
        { key: { type: 1, category: 1 }, options: { name: 'idx_notifications_type_category' } },
        { key: { read_at: 1 }, options: { name: 'idx_notifications_read' } },
        { key: { expires_at: 1 }, options: { expireAfterSeconds: 0, name: 'idx_notifications_ttl' } }
      ]
    },

    // Audit Logs Collection Indexes
    {
      collection: 'audit_logs',
      indexes: [
        { key: { user_id: 1, timestamp: -1 }, options: { name: 'idx_audit_user_time' } },
        { key: { resource_type: 1, action: 1 }, options: { name: 'idx_audit_resource_action' } },
        { key: { timestamp: -1 }, options: { name: 'idx_audit_timestamp' } },
        { key: { resource_id: 1 }, options: { name: 'idx_audit_resource' } }
      ]
    },

    // OTP Tokens Collection Indexes (with TTL)
    {
      collection: 'otp_tokens',
      indexes: [
        { key: { identifier: 1, purpose: 1 }, options: { name: 'idx_otp_identifier_purpose' } },
        { key: { expires_at: 1 }, options: { expireAfterSeconds: 0, name: 'idx_otp_ttl' } }
      ]
    }
  ];

  for (const operation of indexOperations) {
    try {
      const collection = db.getCollection(operation.collection);
      for (const index of operation.indexes) {
        await collection.createIndex(index.key, index.options);
        console.log(`✅ Created index ${index.options.name} on ${operation.collection}`);
      }
    } catch (error) {
      console.error(`❌ Error creating indexes for ${operation.collection}:`, error.message);
    }
  }
}

// ============================================================================
// 3. INSERT INITIAL DATA
// ============================================================================

async function insertInitialData() {
  console.log('\nInserting initial data...');

  // Insert default services (from your existing init-mongo.js)
  const defaultServices = [
    {
      service_code: "GS001",
      name: "Birth Certificate",
      description: "Apply for official birth certificate",
      category: "certificate",
      requirements: [
        { name: "Hospital birth certificate", type: "document", mandatory: true },
        { name: "Parents' ID copies", type: "document", mandatory: true },
        { name: "Marriage certificate (if applicable)", type: "document", mandatory: false }
      ],
      processing_time: { min_days: 5, max_days: 7 },
      fee: { amount: 500, currency: "LKR" },
      eligible_districts: ["Colombo", "Gampaha", "Kalutara"],
      status: "active",
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      service_code: "GS002",
      name: "Passport Application",
      description: "Apply for new Sri Lankan passport",
      category: "certificate",
      requirements: [
        { name: "Birth certificate", type: "document", mandatory: true },
        { name: "National ID copy", type: "document", mandatory: true },
        { name: "Current passport (if renewal)", type: "document", mandatory: false },
        { name: "2 passport size photos", type: "document", mandatory: true }
      ],
      processing_time: { min_days: 21, max_days: 21 },
      fee: { amount: 3500, currency: "LKR" },
      eligible_districts: ["Colombo", "Gampaha", "Kalutara"],
      status: "active",
      created_at: new Date(),
      updated_at: new Date()
    }
    // Add more services as needed
  ];

  try {
    const result = await db.services.insertMany(defaultServices);
    console.log(`✅ Inserted ${result.insertedCount} default services`);
  } catch (error) {
    console.error('❌ Error inserting services:', error.message);
  }

  // Create default admin user
  const defaultAdmin = {
    email: "admin@govlink.lk",
    password: "$2a$10$hash", // Replace with actual hashed password
    role: "admin",
    nic: "199012345678",
    phone: "+94771234567",
    status: "active",
    email_verified: true,
    phone_verified: true,
    created_at: new Date(),
    updated_at: new Date()
  };

  try {
    await db.users.insertOne(defaultAdmin);
    console.log('✅ Created default admin user');
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
}

// ============================================================================
// 4. MAIN EXECUTION FUNCTION
// ============================================================================

async function implementSchemas() {
  console.log('🚀 Starting MongoDB Schema Implementation...\n');
  
  try {
    // Switch to your database
    use(dbName);
    console.log(`Connected to database: ${dbName}\n`);

    // Execute implementation steps
    await createCollectionsWithValidation();
    await createIndexes();
    await insertInitialData();

    console.log('\n✅ Schema implementation completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Test your collections: db.getCollectionNames()');
    console.log('2. Verify indexes: db.users.getIndexes()');
    console.log('3. Check sample data: db.services.find()');
    
  } catch (error) {
    console.error('❌ Schema implementation failed:', error);
  }
}

// Run the implementation
implementSchemas();