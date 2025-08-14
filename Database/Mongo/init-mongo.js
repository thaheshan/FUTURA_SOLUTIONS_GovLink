// Initialize Sri Lankan Government Services Database
print('Starting database initialization...');

// Switch to application database
db = db.getSiblingDB('srilanka_gov_db');

// Create collections with indexes
db.createCollection('users');
db.createCollection('services');
db.createCollection('applications');
db.createCollection('documents');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "isActive": 1 });

db.services.createIndex({ "name": 1 });
db.services.createIndex({ "category": 1 });
db.services.createIndex({ "isActive": 1 });

db.applications.createIndex({ "userId": 1 });
db.applications.createIndex({ "serviceId": 1 });
db.applications.createIndex({ "status": 1 });
db.applications.createIndex({ "createdAt": 1 });

// Insert initial admin user
db.users.insertOne({
  name: "System Administrator",
  email: "admin@gov.lk",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6CXFzOVQBG", // password: admin123
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Insert sample services
db.services.insertMany([
  {
    name: "Birth Certificate",
    description: "Apply for official birth certificate",
    category: "Civil Registration",
    department: "Department of Civil Registration",
    processingTime: "5-7 working days",
    fees: 500,
    requirements: [
      "Hospital birth certificate",
      "Parents' ID copies",
      "Marriage certificate (if applicable)"
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Passport Application",
    description: "Apply for new Sri Lankan passport",
    category: "Immigration",
    department: "Department of Immigration",
    processingTime: "21 working days",
    fees: 3500,
    requirements: [
      "Birth certificate",
      "National ID copy",
      "Current passport (if renewal)",
      "2 passport size photos"
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Business Registration",
    description: "Register new business entity",
    category: "Business Services",
    department: "Registrar of Companies",
    processingTime: "3-5 working days",
    fees: 2000,
    requirements: [
      "Business name reservation",
      "Articles of incorporation",
      "Director details",
      "Registered office address"
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Insert sample applications
db.applications.insertMany([
  {
    applicationId: "APP-2024-001",
    userId: ObjectId(),
    serviceId: ObjectId(),
    status: "pending",
    applicantDetails: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+94771234567",
      address: "123 Main Street, Colombo"
    },
    documents: [],
    submittedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    applicationId: "APP-2024-002",
    userId: ObjectId(),
    serviceId: ObjectId(),
    status: "approved",
    applicantDetails: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+94777654321",
      address: "456 Park Avenue, Kandy"
    },
    documents: [],
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('Database initialization completed successfully!');
print('Created collections: users, services, applications, documents');
print('Inserted sample data');
print('Admin user created with email: admin@gov.lk, password: admin123');