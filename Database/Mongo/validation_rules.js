// File: Database/Mongo/validation_rules.js
// Applies schema validation rules to collections

print('🔒 Applying schema validation rules...\n');

// Users Collection Validation
try {
  db.runCommand({
    collMod: "users",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "password", "role", "nic", "phone", "status"],
        properties: {
          email: {
            bsonType: "string",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
          },
          password: {
            bsonType: "string",
            minLength: 8
          },
          role: {
            enum: ["citizen", "officer", "admin"]
          },
          nic: {
            bsonType: "string",
            pattern: "^([0-9]{9}[vVxX]|[0-9]{12})$"
          },
          phone: {
            bsonType: "string",
            pattern: "^(\\+94|0)[0-9]{9}$"
          },
          status: {
            enum: ["active", "inactive", "suspended", "pending_verification"]
          }
        }
      }
    },
    validationAction: "warn"
  });
  print('✅ Users validation applied');
} catch (e) {
  print('❌ Users validation error:', e.message);
}

// Services Collection Validation
try {
  db.runCommand({
    collMod: "services",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["service_code", "name", "description", "category", "status"],
        properties: {
          service_code: {
            bsonType: "string",
            pattern: "^[A-Z]{2}[0-9]{3}$"
          },
          name: {
            bsonType: "string",
            minLength: 5,
            maxLength: 100
          },
          category: {
            enum: ["certificate", "license", "permit", "registration", "verification"]
          },
          status: {
            enum: ["active", "inactive", "under_maintenance"]
          }
        }
      }
    },
    validationAction: "warn"
  });
  print('✅ Services validation applied');
} catch (e) {
  print('❌ Services validation error:', e.message);
}

// Applications Collection Validation
try {
  db.runCommand({
    collMod: "applications",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["user_id", "service_id", "application_number", "status"],
        properties: {
          application_number: {
            bsonType: "string",
            pattern: "^APP[0-9]{10}$"
          },
          status: {
            enum: ["draft", "submitted", "under_review", "additional_info_required", 
                   "approved", "rejected", "completed", "cancelled"]
          },
          priority: {
            enum: ["normal", "urgent", "emergency"]
          }
        }
      }
    },
    validationAction: "warn"
  });
  print('✅ Applications validation applied');
} catch (e) {
  print('❌ Applications validation error:', e.message);
}

print('\n🔒 Schema validation rules applied successfully!');