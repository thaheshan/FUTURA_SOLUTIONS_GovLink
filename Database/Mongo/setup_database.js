// File: Database/Mongo/setup_database.js
// Main database setup script

use('gov_db');

print('🚀 Starting Government Services Database Setup...\n');

// Load other scripts
load('/tmp/Mongo/create_collections.js');
load('/tmp/Mongo/create_indexes.js');
load('/tmp/Mongo/validation_rules.js');
load('/tmp/Mongo/insert_seed_data.js');

print('\n✅ Database setup completed successfully!');
print('\nNext steps:');
print('1. Verify setup: load("/tmp/Mongo/verify_setup.js")');
print('2. Check collections: db.getCollectionNames()');
print('3. View services: db.services.find().pretty()');