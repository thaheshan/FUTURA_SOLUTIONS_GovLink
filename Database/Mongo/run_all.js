// File: Database/Mongo/run_all.js
// Master script to run entire database setup

print('🚀 GOVERNMENT SERVICES DATABASE SETUP');
print('=====================================\n');

use('gov_db');

print('📍 Using database: gov_db');
print('🕐 Started at:', new Date().toISOString());
print('\n🔄 Running complete database setup...\n');

try {
  // Step 1: Create Collections
  print('STEP 1: Creating Collections');
  print('-----------------------------');
  load('/tmp/Mongo/create_collections.js');
  
  // Step 2: Create Indexes
  print('\nSTEP 2: Creating Indexes');
  print('-------------------------');
  load('/tmp/Mongo/create_indexes.js');
  
  // Step 3: Apply Validation
  print('\nSTEP 3: Applying Validation Rules');
  print('----------------------------------');
  load('/tmp/Mongo/validation_rules.js');
  
  // Step 4: Insert Seed Data
  print('\nSTEP 4: Inserting Seed Data');
  print('---------------------------');
  load('/tmp/Mongo/insert_seed_data.js');
  
  // Step 5: Verify Setup
  print('\nSTEP 5: Verifying Setup');
  print('-----------------------');
  load('/tmp/Mongo/verify_setup.js');
  
  print('\n🎉 SETUP COMPLETED SUCCESSFULLY!');
  print('=================================');
  print('🕐 Completed at:', new Date().toISOString());
  
} catch (error) {
  print('\n❌ SETUP FAILED!');
  print('=================');
  print('Error:', error.message);
  print('Please check the logs above for details.');
}