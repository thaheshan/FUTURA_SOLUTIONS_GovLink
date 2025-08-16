// File: Database/Mongo/create_collections.js
// Creates all required collections

print('📁 Creating collections...\n');

const collections = [
  'users',
  'citizen_profiles',
  'services', 
  'applications',
  'appointments',
  'officers',
  'assignments',
  'documents',
  'notifications',
  'audit_logs',
  'otp_tokens'
];

collections.forEach(collectionName => {
  try {
    // Drop if exists (for clean setup)
    try {
      db.getCollection(collectionName).drop();
      print(`🗑️  Dropped existing collection: ${collectionName}`);
    } catch (e) {
      // Collection doesn't exist, continue
    }

    // Create collection
    db.createCollection(collectionName);
    print(`✅ Created collection: ${collectionName}`);
  } catch (error) {
    print(`❌ Error creating ${collectionName}: ${error.message}`);
  }
});

print(`\n📊 Total collections created: ${collections.length}`);