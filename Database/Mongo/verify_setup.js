// File: database/Mongo/verify_setup.js
// Node.js version for verifying database setup

const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017"; // replace with your Mongo URI
const client = new MongoClient(uri);
const dbName = "yourDatabaseName"; // replace with your DB name

async function verifySetup() {
  try {
    await client.connect();
    const db = client.db(dbName);

    console.log('🔍 Verifying database setup...\n');

    const expectedCollections = [
      'users', 'citizen_profiles', 'services', 'applications',
      'appointments', 'officers', 'assignments', 'documents',
      'notifications', 'audit_logs', 'otp_tokens', 'districts'
    ];

    const actualCollections = await db.listCollections().toArray();
    const collectionNames = actualCollections.map(c => c.name);

    console.log('📊 Collection Verification:');
    expectedCollections.forEach(c => {
      const exists = collectionNames.includes(c);
      console.log(`${exists ? '✅' : '❌'} ${c}: ${exists ? 'EXISTS' : 'MISSING'}`);
    });
    console.log(`\nTotal collections: ${collectionNames.length}`);

    console.log('\n📈 Data Count Verification:');
    for (const c of expectedCollections) {
      try {
        const count = await db.collection(c).countDocuments();
        console.log(`📄 ${c}: ${count} documents`);
      } catch {
        console.log(`❌ ${c}: Error counting documents`);
      }
    }

    console.log('\n🏷️ Index Verification:');
    console.log('Users indexes:', (await db.collection('users').indexes()).length);
    console.log('Services indexes:', (await db.collection('services').indexes()).length);
    console.log('Applications indexes:', (await db.collection('applications').indexes()).length);

    console.log('\n🧪 Basic Query Tests:');
    try {
      const serviceCount = await db.collection('services').countDocuments({ status: "active" });
      console.log(`✅ Active services query: ${serviceCount} results`);
    } catch (e) {
      console.log('❌ Services query failed:', e.message);
    }

    try {
      const adminCount = await db.collection('users').countDocuments({ role: "admin" });
      console.log(`✅ Admin users query: ${adminCount} results`);
    } catch (e) {
      console.log('❌ Users query failed:', e.message);
    }

    console.log('\n📋 Sample Data Verification:');
    try {
      const sampleService = await db.collection('services').findOne({ service_code: "GS001" });
      if (sampleService) console.log('✅ Sample service found:', sampleService.name);
      else console.log('❌ Sample service not found');
    } catch (e) {
      console.log('❌ Sample service query error:', e.message);
    }

    console.log('\n🎉 Database verification completed!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  } finally {
    await client.close();
  }
}

verifySetup();
