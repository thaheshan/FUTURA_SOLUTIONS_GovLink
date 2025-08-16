// File: Database/Mongo/audit/audit_system.js
// Comprehensive audit system implementation

use('gov_db');

print('🛡️ Implementing Audit System...\n');

// ============================================================================
// CREATE AUDIT LOGS COLLECTION WITH ADVANCED SCHEMA
// ============================================================================

try {
  db.createCollection("audit_logs", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["user_id", "action", "resource_type", "timestamp", "ip_address"],
        properties: {
          user_id: { bsonType: "objectId" },
          session_id: { bsonType: "string" },
          action: { enum: ["create", "read", "update", "delete", "login", "logout", "approve", "reject"] },
          resource_type: { enum: ["application", "user", "service", "document", "appointment"] },
          resource_id: { bsonType: "objectId" },
          old_values: { bsonType: "object" },
          new_values: { bsonType: "object" },
          ip_address: { bsonType: "string" },
          user_agent: { bsonType: "string" },
          timestamp: { bsonType: "date" },
          success: { bsonType: "bool" },
          error_message: { bsonType: "string" }
        }
      }
    }
  });

  // Create indexes for audit logs
  db.audit_logs.createIndex({ "user_id": 1, "timestamp": -1 });
  db.audit_logs.createIndex({ "resource_type": 1, "action": 1, "timestamp": -1 });
  db.audit_logs.createIndex({ "resource_id": 1, "timestamp": -1 });
  db.audit_logs.createIndex({ "timestamp": -1 });
  db.audit_logs.createIndex({ "ip_address": 1, "timestamp": -1 });
  
  // TTL index for automatic cleanup (keep logs for 2 years)
  db.audit_logs.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 63072000 });

  print('✅ Audit logs collection created with indexes');
} catch (e) {
  print('⚠️ Audit logs collection already exists or error:', e.message);
}

// ============================================================================
// AUDIT LOGGING FUNCTIONS
// ============================================================================

function logUserAction(userId, action, resourceType, resourceId, details = {}) {
  const auditEntry = {
    user_id: ObjectId(userId),
    session_id: details.sessionId || "unknown",
    action: action,
    resource_type: resourceType,
    resource_id: resourceId ? ObjectId(resourceId) : null,
    description: details.description || `User performed ${action} on ${resourceType}`,
    old_values: details.oldValues || null,
    new_values: details.newValues || null,
    ip_address: details.ipAddress || "127.0.0.1",
    user_agent: details.userAgent || "Unknown",
    success: details.success !== false,
    error_message: details.errorMessage || null,
    timestamp: new Date(),
    metadata: details.metadata || {}
  };

  try {
    db.audit_logs.insertOne(auditEntry);
    return true;
  } catch (e) {
    print('❌ Audit log insertion failed:', e.message);
    return false;
  }
}

// Application-specific audit functions
function auditApplicationCreate(userId, applicationId, applicationData, clientInfo) {
  return logUserAction(userId, "create", "application", applicationId, {
    description: `Created new application ${applicationData.application_number}`,
    newValues: applicationData,
    sessionId: clientInfo.sessionId,
    ipAddress: clientInfo.ipAddress,
    userAgent: clientInfo.userAgent,
    metadata: {
      service_id: applicationData.service_id,
      priority: applicationData.priority
    }
  });
}

function auditApplicationUpdate(userId, applicationId, oldData, newData, clientInfo) {
  return logUserAction(userId, "update", "application", applicationId, {
    description: `Updated application ${oldData.application_number}`,
    oldValues: oldData,
    newValues: newData,
    sessionId: clientInfo.sessionId,
    ipAddress: clientInfo.ipAddress,
    userAgent: clientInfo.userAgent,
    metadata: {
      status_changed: oldData.status !== newData.status,
      officer_assigned: oldData.assigned_officer !== newData.assigned_officer
    }
  });
}

function auditApplicationStatusChange(userId, applicationId, oldStatus, newStatus, clientInfo) {
  return logUserAction(userId, "update", "application", applicationId, {
    description: `Changed application status from ${oldStatus} to ${newStatus}`,
    oldValues: { status: oldStatus },
    newValues: { status: newStatus },
    sessionId: clientInfo.sessionId,
    ipAddress: clientInfo.ipAddress,
    userAgent: clientInfo.userAgent,
    metadata: {
      status_change: true,
      workflow_step: getWorkflowStep(newStatus)
    }
  });
}

// Helper function for workflow tracking
function getWorkflowStep(status) {
  const workflow = {
    "draft": 1,
    "submitted": 2,
    "under_review": 3,
    "additional_info_required": 4,
    "approved": 5,
    "rejected": 5,
    "completed": 6
  };
  return workflow[status] || 0;
}

// ============================================================================
// CHANGE STREAMS FOR REAL-TIME AUDIT LOGGING
// ============================================================================

function setupChangeStreams() {
  print('🔄 Setting up change streams for real-time audit logging...');

  // Applications change stream
  const applicationsChangeStream = db.applications.watch([
    { $match: { 'fullDocument.user_id': { $exists: true } } }
  ]);

  // Users change stream
  const usersChangeStream = db.users.watch([
    { $match: { 'operationType': { $in: ['insert', 'update', 'delete'] } } }
  ]);

  print('✅ Change streams configured (implement in application layer)');
  
  // Note: Change streams need to be implemented in your Node.js application
  print(`
  // Example Node.js implementation:
  const changeStream = db.collection('applications').watch();
  changeStream.on('change', (change) => {
    if (change.operationType === 'update') {
      auditApplicationUpdate(
        change.fullDocument.user_id,
        change.fullDocument._id,
        change.updateDescription.removedFields,
        change.updateDescription.updatedFields,
        getClientInfo()
      );
    }
  });
  `);
}

// ============================================================================
// AUDIT REPORT GENERATION
// ============================================================================

function generateUserActivityReport(userId, startDate, endDate) {
  const pipeline = [
    {
      $match: {
        user_id: ObjectId(userId),
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          action: "$action",
          resource_type: "$resource_type"
        },
        count: { $sum: 1 },
        successful: { $sum: { $cond: ["$success", 1, 0] } },
        failed: { $sum: { $cond: ["$success", 0, 1] } }
      }
    },
    {
      $sort: { "_id.date": -1, count: -1 }
    }
  ];

  return db.audit_logs.aggregate(pipeline).toArray();
}

function generateSystemAuditReport(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const pipeline = [
    { $match: { timestamp: { $gte: startDate } } },
    {
      $facet: {
        actionSummary: [
          {
            $group: {
              _id: "$action",
              count: { $sum: 1 },
              successful: { $sum: { $cond: ["$success", 1, 0] } },
              failed: { $sum: { $cond: ["$success", 0, 1] } }
            }
          },
          { $sort: { count: -1 } }
        ],
        resourceSummary: [
          {
            $group: {
              _id: "$resource_type",
              count: { $sum: 1 },
              uniqueUsers: { $addToSet: "$user_id" }
            }
          },
          {
            $project: {
              _id: 1,
              count: 1,
              uniqueUserCount: { $size: "$uniqueUsers" }
            }
          },
          { $sort: { count: -1 } }
        ],
        dailyActivity: [
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
              totalActions: { $sum: 1 },
              uniqueUsers: { $addToSet: "$user_id" },
              failedActions: { $sum: { $cond: ["$success", 0, 1] } }
            }
          },
          {
            $project: {
              _id: 1,
              totalActions: 1,
              uniqueUserCount: { $size: "$uniqueUsers" },
              failedActions: 1,
              successRate: {
                $multiply: [
                  { $divide: [{ $subtract: ["$totalActions", "$failedActions"] }, "$totalActions"] },
                  100
                ]
              }
            }
          },
          { $sort: { _id: -1 } }
        ]
      }
    }
  ];

  return db.audit_logs.aggregate(pipeline).toArray()[0];
}

// ============================================================================
// DATA RETENTION AND COMPLIANCE
// ============================================================================

function implementDataRetentionPolicy() {
  print('📋 Implementing data retention policies...');

  // Archive old audit logs (older than 1 year) to separate collection
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Create archived audit logs collection
  try {
    db.createCollection("audit_logs_archived");
    db.audit_logs_archived.createIndex({ "timestamp": -1 });
    
    // Move old records to archive
    const oldRecords = db.audit_logs.find({ timestamp: { $lt: oneYearAgo } });
    if (oldRecords.count() > 0) {
      db.audit_logs_archived.insertMany(oldRecords.toArray());
      db.audit_logs.deleteMany({ timestamp: { $lt: oneYearAgo } });
      print(`✅ Archived ${oldRecords.count()} old audit records`);
    }
  } catch (e) {
    print('⚠️ Archive collection setup:', e.message);
  }

  print('✅ Data retention policy implemented');
}

// Export all audit functions
print('✅ Audit system functions created:');
print('• logUserAction(userId, action, resourceType, resourceId, details)');
print('• auditApplicationCreate(userId, applicationId, applicationData, clientInfo)');
print('• auditApplicationUpdate(userId, applicationId, oldData, newData, clientInfo)');
print('• generateUserActivityReport(userId, startDate, endDate)');
print('• generateSystemAuditReport(days)');
print('• implementDataRetentionPolicy()');

setupChangeStreams();