// File: Database/Mongo/insert_seed_data.js
// Inserts initial seed data

print('🌱 Inserting seed data...\n');

// Insert Government Services
const governmentServices = [
  {
    service_code: "GS001",
    name: "Birth Certificate",
    description: "Apply for official birth certificate",
    category: "certificate",
    department: "Department of Civil Registration",
    processing_time: { min_days: 5, max_days: 7, description: "5-7 working days" },
    fee: { amount: 500, currency: "LKR" },
    requirements: [
      { name: "Hospital birth certificate", type: "document", mandatory: true },
      { name: "Parents' ID copies", type: "document", mandatory: true },
      { name: "Marriage certificate (if applicable)", type: "document", mandatory: false }
    ],
    eligible_districts: ["Colombo", "Gampaha", "Kalutara", "Kandy", "Matale"],
    status: "active",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    service_code: "GS002",
    name: "Passport Application",
    description: "Apply for new Sri Lankan passport",
    category: "certificate",
    department: "Department of Immigration",
    processing_time: { min_days: 21, max_days: 21, description: "21 working days" },
    fee: { amount: 3500, currency: "LKR" },
    requirements: [
      { name: "Birth certificate", type: "document", mandatory: true },
      { name: "National ID copy", type: "document", mandatory: true },
      { name: "Current passport (if renewal)", type: "document", mandatory: false },
      { name: "2 passport size photos", type: "document", mandatory: true }
    ],
    eligible_districts: ["Colombo", "Gampaha", "Kalutara", "Kandy", "Galle"],
    status: "active",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    service_code: "GS003",
    name: "Police Clearance Certificate",
    description: "Obtain police clearance certificate",
    category: "certificate",
    department: "Sri Lanka Police",
    processing_time: { min_days: 14, max_days: 21, description: "14-21 working days" },
    fee: { amount: 1000, currency: "LKR" },
    requirements: [
      { name: "National ID copy", type: "document", mandatory: true },
      { name: "Passport copy (if for overseas)", type: "document", mandatory: false },
      { name: "Reason letter", type: "document", mandatory: true }
    ],
    eligible_districts: ["Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Galle"],
    status: "active",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    service_code: "GS004",
    name: "Marriage Certificate",
    description: "Register marriage and obtain certificate",
    category: "registration",
    department: "Department of Civil Registration",
    processing_time: { min_days: 7, max_days: 14, description: "7-14 working days" },
    fee: { amount: 750, currency: "LKR" },
    requirements: [
      { name: "Both parties' birth certificates", type: "document", mandatory: true },
      { name: "Both parties' ID copies", type: "document", mandatory: true },
      { name: "Divorce decree (if applicable)", type: "document", mandatory: false },
      { name: "Death certificate of spouse (if widowed)", type: "document", mandatory: false }
    ],
    eligible_districts: ["Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Galle", "Matara"],
    status: "active",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    service_code: "GS005",
    name: "Business Registration",
    description: "Register new business entity",
    category: "registration",
    department: "Department of Registrar of Companies",
    processing_time: { min_days: 10, max_days: 15, description: "10-15 working days" },
    fee: { amount: 2500, currency: "LKR" },
    requirements: [
      { name: "Business registration form", type: "document", mandatory: true },
      { name: "Owner's ID copy", type: "document", mandatory: true },
      { name: "Business plan", type: "document", mandatory: true },
      { name: "Location certificate", type: "document", mandatory: true }
    ],
    eligible_districts: ["Colombo", "Gampaha", "Kalutara", "Kandy", "Galle"],
    status: "active",
    created_at: new Date(),
    updated_at: new Date()
  }
];

try {
  const serviceResult = db.services.insertMany(governmentServices);
  print(`✅ Inserted ${serviceResult.insertedCount} government services`);
} catch (e) {
  print('❌ Services insertion error:', e.message);
}

// Insert Default Admin User
const defaultUsers = [
  {
    email: "admin@govlink.lk",
    password: "$2a$10$X9Z.hash.placeholder", // Replace with actual hashed password
    role: "admin",
    nic: "199012345678",
    phone: "+94771234567",
    status: "active",
    email_verified: true,
    phone_verified: true,
    last_login: new Date(),
    failed_login_attempts: 0,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    email: "officer@govlink.lk",
    password: "$2a$10$Y9Z.hash.placeholder", // Replace with actual hashed password
    role: "officer",
    nic: "199087654321",
    phone: "+94772345678",
    status: "active",
    email_verified: true,
    phone_verified: true,
    last_login: new Date(),
    failed_login_attempts: 0,
    created_at: new Date(),
    updated_at: new Date()
  }
];

try {
  const userResult = db.users.insertMany(defaultUsers);
  print(`✅ Inserted ${userResult.insertedCount} default users`);
} catch (e) {
  print('❌ Users insertion error:', e.message);
}

// Insert Sample Districts Data
const districts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Moneragala", "Ratnapura", "Kegalle"
];

// Create a districts reference collection
try {
  const districtDocs = districts.map(district => ({
    name: district,
    province: getProvinceForDistrict(district),
    active: true,
    created_at: new Date()
  }));
  
  db.createCollection("districts");
  const districtResult = db.districts.insertMany(districtDocs);
  print(`✅ Inserted ${districtResult.insertedCount} districts`);
} catch (e) {
  print('❌ Districts insertion error:', e.message);
}

function getProvinceForDistrict(district) {
  const provinceMapping = {
    "Colombo": "Western", "Gampaha": "Western", "Kalutara": "Western",
    "Kandy": "Central", "Matale": "Central", "Nuwara Eliya": "Central",
    "Galle": "Southern", "Matara": "Southern", "Hambantota": "Southern",
    "Jaffna": "Northern", "Kilinochchi": "Northern", "Mannar": "Northern", "Vavuniya": "Northern", "Mullaitivu": "Northern",
    "Batticaloa": "Eastern", "Ampara": "Eastern", "Trincomalee": "Eastern",
    "Kurunegala": "North Western", "Puttalam": "North Western",
    "Anuradhapura": "North Central", "Polonnaruwa": "North Central",
    "Badulla": "Uva", "Moneragala": "Uva",
    "Ratnapura": "Sabaragamuwa", "Kegalle": "Sabaragamuwa"
  };
  return provinceMapping[district] || "Unknown";
}

print('\n🌱 All seed data inserted successfully!');