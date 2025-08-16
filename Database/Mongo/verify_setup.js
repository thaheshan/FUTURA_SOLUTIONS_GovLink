// File: Database/Mongo/verify_setup.js
// Verifies database setup is correct

print('🔍 Verifying database setup...\n');

// Check collections
const expectedCollections = [
  'users', 'citizen_profiles', 'services', 'applications', 
  'appointments', 'officers', 'assignments', 'documents', 
  'notifications', 'audit_logs', 'otp_tokens', 'districts'
];

const actualCollections = db.getCollectionNames();
print('📊 Collection Verification:');
expectedCollections.forEach(collection => {
  const exists = actualCollections.includes(collection);
  print(`${exists ? '✅' : '❌'} ${collection}: ${exists ? 'EXISTS' : 'MISSING'}`);
});

print(`\nTotal collections: ${actualCollections.length}`);

// Check data counts
print('\n📈 Data Count Verification:');
expectedCollections.forEach(collection => {
  try {
    const count = db.getCollection(collection).countDocuments();
    print(`📄 ${collection}: ${count} documents`);
  } catch (e) {
    print(`❌ ${collection}: Error counting documents`);
  }
});

// Check indexes
print('\n🏷️  Index Verification:');
print('Users indexes:', db.users.getIndexes().length);
print('Services indexes:', db.services.getIndexes().length);
print('Applications indexes:', db.applications.getIndexes().length);

// Test basic queries
print('\n🧪 Basic Query Tests:');

// Test services query
try {
  const serviceCount = db.services.find({ status: "active" }).count();
  print(`✅ Active services query: ${serviceCount} results`);
} catch (e) {
  print('❌ Services query failed:', e.message);
}

// Test user query
try {
  const adminCount = db.users.find({ role: "admin" }).count();
  print(`✅ Admin users query: ${adminCount} results`);
} catch (e) {
  print('❌ Users query failed:', e.message);
}

// Sample data verification
print('\n📋 Sample Data Verification:');
try {
  const sampleService = db.services.findOne({ service_code: "GS001" });
  if (sampleService) {
    print('✅ Sample service found:', sampleService.name);
  } else {
    print('❌ Sample service not found');
  }
} catch (e) {
  print('❌ Sample service query error:', e.message);
}

print('\n🎉 Database verification completed!');
print('\nQuick Start Commands:');
print('• View all collections: db.getCollectionNames()');
print('• Check services: db.services.find().pretty()');
print('• Check users: db.users.find({}, {password: 0}).pretty()');
print('• View indexes: db.users.getIndexes()');