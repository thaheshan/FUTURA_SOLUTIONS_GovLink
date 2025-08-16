class ReplicaSetHealthMonitor {
  getHealthHistory(hours = 24) {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.healthHistory.filter(h => h.timestamp >= cutoffTime);
  }

  async storeHealthCheck(healthCheck) {
    try {
      await db.replica_set_health.insertOne(healthCheck);
      // Cleanup old health checks
      const cutoffTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      await db.replica_set_health.deleteMany({ timestamp: { $lt: cutoffTime } });
    } catch (error) {
      console.error('Failed to store health check:', error.message);
    }
  }

generateHealthRecommendations(healthCheck) {
  for (const issue of healthCheck.issues) {
    switch (issue.type) {
      case 'primary_count':
        healthCheck.recommendations.push({
          priority: 'high',
          action: 'Investigate replica set configuration',
          details: 'Ensure replica set has proper configuration and members are communicating'
        });
        break;
      case 'member_down':
        healthCheck.recommendations.push({
          priority: 'critical',
          action: 'Restart downed member or investigate network',
          details: 'Check server status, network connectivity, and MongoDB logs'
        });
        break;
      case 'high_replication_lag':
        healthCheck.recommendations.push({
          priority: 'high',
          action: 'Optimize network and disk I/O',
          details: 'Consider increasing oplog size or optimizing network'
        });
        break;
    }
  }
}
}

// ============================================================================
// AUTO-SCALING MANAGER
// ============================================================================

class AutoScalingManager {
  constructor(config = {}) {
    this.rules = config.rules || [
      {
        metric: 'server.connections.current',
        threshold: 800,
        action: 'scale_up',
        sustainedFor: 300000, // 5 minutes
        cooldown: 1800000 // 30 minutes
      },
      {
        metric: 'server.connections.current',
        threshold: 300,
        action: 'scale_down',
        sustainedFor: 600000, // 10 minutes
        cooldown: 3600000 // 1 hour
      }
    ];
    this.lastScalingAction = null;
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('🔄 Auto-scaling manager started');

    this.monitorInterval = setInterval(async () => {
      await this.evaluateScalingTriggers();
    }, 60000); // Check every minute
  }

  async stop() {
    if (this.isRunning) {
      clearInterval(this.monitorInterval);
      this.isRunning = false;
      console.log('🛑 Auto-scaling manager stopped');
    }
  }

  async evaluateScalingTriggers() {
    try {
      const currentMetrics = await this.orchestrator.collectMetrics();
      const now = Date.now();

      // Cooldown check
      if (this.lastScalingAction && (now - this.lastScalingAction.timestamp) < 1800000) {
        return;
      }

      for (const rule of this.rules) {
        const currentValue = this.extractMetricValue(currentMetrics, rule.metric);
        const direction = rule.action === 'scale_up' ? 'up' : 'down';

        if (await this.shouldTriggerScaling(rule, currentMetrics, direction)) {
          await this.executeScalingAction(rule, currentMetrics, direction);
          return; // Only one scaling action at a time
        }
      }
    } catch (error) {
      console.error('Failed to evaluate scaling triggers:', error.message);
    }
  }

  extractMetricValue(metrics, metricPath) {
    return metricPath.split('.').reduce((obj, key) => obj?.[key], metrics) || 0;
  }

  async shouldTriggerScaling(rule, currentMetrics, direction) {
    const currentValue = this.extractMetricValue(currentMetrics, rule.metric);
    
    if (direction === 'up') {
      if (currentValue <= rule.threshold) return false;
    } else {
      if (currentValue >= rule.threshold) return false;
    }

    // Check sustained duration
    const sustainedMs = await this.checkSustainedCondition(
      rule.metric, rule.threshold, rule.sustainedFor, direction
    );
    
    return sustainedMs >= rule.sustainedFor;
  }

  async checkSustainedCondition(metricName, threshold, duration, direction) {
    try {
      const fromTime = new Date(Date.now() - duration);
      const recentMetrics = await db.monitoring_metrics.find({ timestamp: { $gte: fromTime } })
        .sort({ timestamp: 1 }).toArray();

      if (recentMetrics.length === 0) return 0;

      let sustainedDuration = 0;
      let conditionStartTime = null;

      for (const metric of recentMetrics) {
        const value = this.extractMetricValue(metric, metricName);
        const conditionMet = direction === 'up' ? value > threshold : value < threshold;

        if (conditionMet) {
          if (!conditionStartTime) {
            conditionStartTime = metric.timestamp;
          }
          sustainedDuration = Date.now() - conditionStartTime;
        } else {
          conditionStartTime = null;
          sustainedDuration = 0;
        }
      }
      return sustainedDuration;
    } catch (error) {
      console.error('Failed to check sustained condition:', error.message);
      return 0;
    }
  }

  async executeScalingAction(rule, metrics, direction) {
    const scalingAction = {
      timestamp: Date.now(),
      rule: rule,
      direction: direction,
      triggeredBy: rule.metric,
      currentValue: this.extractMetricValue(metrics, rule.metric),
      status: 'in_progress'
    };

    try {
      console.log(`⚡ Executing scaling action: ${rule.action}`);
      
      switch (rule.action) {
        case 'scale_up':
          await this.scaleUp();
          break;
        case 'scale_down':
          await this.scaleDown();
          break;
        default:
          throw new Error(`Unknown scaling action: ${rule.action}`);
      }

      scalingAction.status = 'completed';
      scalingAction.completedAt = Date.now();
      console.log(`✅ Scaling action completed: ${rule.action}`);
    } catch (error) {
      scalingAction.status = 'failed';
      scalingAction.error = error.message;
      scalingAction.completedAt = Date.now();
      console.error(`❌ Scaling action failed: ${error.message}`);
    }

    await this.storeScalingAction(scalingAction);
    this.lastScalingAction = scalingAction;
  }

  async scaleUp() {
    // In production: call cloud API to add nodes
    console.log('📈 Simulating scale-up: Add replica set member');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  async scaleDown() {
    // In production: safely remove node
    console.log('📉 Simulating scale-down: Remove replica set member');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  async storeScalingAction(action) {
    try {
      await db.scaling_actions.insertOne(action);
    } catch (error) {
      console.error('Failed to store scaling action:', error.message);
    }
  }
}

// ============================================================================
// LOG ANALYZER
// ============================================================================

class LogAnalyzer {
  constructor() {
    this.slowQueryThreshold = 1000; // ms
  }

  async analyzeLogs(hours = 24) {
    const fromTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    const logEntries = await db.system_profile.find({ ts: { $gte: fromTime } }).toArray();

    const analysis = {
      totalEntries: logEntries.length,
      slowQueries: logEntries.filter(e => e.millis > this.slowQueryThreshold),
      blockedOperations: logEntries.filter(e => e.locks && e.locks['Global']?.acquireWaitCount > 0),
      highMemoryOperations: logEntries.filter(e => e.nreturned > 1000 && e.nscanned > 10000)
    };

    analysis.slowCollections = this.groupSlowOpsByCollection(analysis.slowQueries);
    analysis.slowOperations = this.groupSlowOpsByOperation(analysis.slowQueries);

    return analysis;
  }

  groupSlowOpsByCollection(slowOps) {
    const grouped = new Map();
    for (const op of slowOps) {
      const collection = op.ns || 'unknown';
      grouped.set(collection, (grouped.get(collection) || 0) + 1);
    }
    return Object.fromEntries(grouped);
  }

  groupSlowOpsByOperation(slowOps) {
    const grouped = new Map();
    for (const op of slowOps) {
      const operation = op.op || 'unknown';
      grouped.set(operation, (grouped.get(operation) || 0) + 1);
    }
    return Object.fromEntries(grouped);
  }
}

// ============================================================================
// WEBHOOK DELIVERY SYSTEM
// ============================================================================

class WebhookManager {
  constructor() {
    this.webhooks = new Map();
    this.deliveryQueue = [];
    this.isProcessing = false;
  }

  addWebhook(id, config) {
    this.webhooks.set(id, {
      ...config,
      lastDelivery: null,
      deliveryCount: 0
    });
  }

  async sendAlert(alert) {
    this.deliveryQueue.push(alert);
    if (!this.isProcessing) {
      await this.processDeliveryQueue();
    }
  }

  async processDeliveryQueue() {
    this.isProcessing = true;
    while (this.deliveryQueue.length > 0) {
      const alert = this.deliveryQueue.shift();
      await this.deliverAlert(alert);
    }
    this.isProcessing = false;
  }

  async deliverAlert(alert) {
    for (const [id, config] of this.webhooks) {
      if (config.events.includes(alert.eventType)) {
        try {
          const response = await fetch(config.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alert)
          });
          if (response.ok) {
            config.deliveryCount++;
            config.lastDelivery = new Date();
          }
        } catch (error) {
          console.error(`Failed to deliver webhook ${id}:`, error.message);
        }
      }
    }
  }
}

// ============================================================================
// HTTP API SERVER
// ============================================================================

class APIServer {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.endpoints = new Map();
    this.setupEndpoints();
  }

  setupEndpoints() {
    this.endpoints.set('/api/health', async (req) => {
      try {
        const health = await this.orchestrator.getHealth();
        return { success: true, data: health };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    this.endpoints.set('/api/dashboard', async (req) => {
      try {
        const dashboardData = await this.orchestrator.getDashboardData();
        return { success: true, data: dashboardData };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    this.endpoints.set('/metrics', async (req) => {
      try {
        const prometheusMetrics = await this.orchestrator.generatePrometheusMetrics();
        return prometheusMetrics;
      } catch (error) {
        return `# Error generating metrics: ${error.message}`;
      }
    });
  }

  async handleRequest(path, query = {}) {
    const endpoint = this.endpoints.get(path);
    if (endpoint) {
      const req = { query };
      return await endpoint(req);
    }
    return { success: false, error: 'Endpoint not found' };
  }
}

// ============================================================================
// ORCHESTRATOR
// ============================================================================

class MonitoringOrchestrator {
  constructor() {
    this.performanceMonitor = new MongoPerformanceMonitor();
    this.kpiManager = new KPICalculator();
    this.replicaSetMonitor = new ReplicaSetHealthMonitor();
    this.autoScalingManager = new AutoScalingManager();
    this.logAnalyzer = new LogAnalyzer();
    this.webhookManager = new WebhookManager();
    this.apiServer = new APIServer(this);
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;

    await this.performanceMonitor.startCollection();
    this.replicaSetMonitor.startMonitoring();
    await this.autoScalingManager.start();

    console.log('📊 MongoDB Monitoring System is now active');
  }

  async stop() {
    if (!this.isRunning) return;
    this.isRunning = false;

    await this.performanceMonitor.stopCollection();
    this.replicaSetMonitor.stopMonitoring();
    await this.autoScalingManager.stop();

    console.log('🛑 MongoDB Monitoring System stopped');
  }

  async getDashboardData() {
    const [metrics, kpis, health] = await Promise.all([
      this.performanceMonitor.collectMetrics(),
      this.kpiManager.getAllKPIs(),
      this.replicaSetMonitor.getHealth()
    ]);

    return { metrics, kpis, health };
  }

  async getHealth() {
    const health = await this.replicaSetMonitor.getHealth();
    return health;
  }

  async generatePrometheusMetrics() {
    const metrics = await this.performanceMonitor.collectMetrics();
    const timestamp = Date.now();
    let prometheusOutput = '# HELP mongodb_connections_current Current database connections\n';
    prometheusOutput += '# TYPE mongodb_connections_current gauge\n';
    prometheusOutput += `mongodb_connections_current ${metrics.server.connections.current} ${timestamp}\n`;

    prometheusOutput += '# HELP mongodb_connections_available Available connections\n';
    prometheusOutput += '# TYPE mongodb_connections_available gauge\n';
    prometheusOutput += `mongodb_connections_available ${metrics.server.connections.available} ${timestamp}\n`;

    prometheusOutput += '# HELP mongodb_memory_resident_bytes Resident memory in bytes\n';
    prometheusOutput += '# TYPE mongodb_memory_resident_bytes gauge\n';
    prometheusOutput += `mongodb_memory_resident_bytes ${metrics.server.memory.resident * 1024 * 1024} ${timestamp}\n`;

    prometheusOutput += '# HELP mongodb_memory_virtual_bytes Virtual memory in bytes\n';
    prometheusOutput += '# TYPE mongodb_memory_virtual_bytes gauge\n';
    prometheusOutput += `mongodb_memory_virtual_bytes ${metrics.server.memory.virtual * 1024 * 1024} ${timestamp}\n`;

    for (const [op, count] of Object.entries(metrics.server.opcounters)) {
      prometheusOutput += `mongodb_operations_total{type="${op}"} ${count} ${timestamp}\n`;
    }

    return prometheusOutput;
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

async function initializeMonitoringSystem(config = {}) {
  const orchestrator = new MonitoringOrchestrator();
  await orchestrator.start();
  console.log('✅ Monitoring System initialized');
  return orchestrator;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MongoPerformanceMonitor,
    KPICalculator,
    ReplicaSetHealthMonitor,
    AutoScalingManager,
    LogAnalyzer,
    WebhookManager,
    APIServer,
    MonitoringOrchestrator,
    initializeMonitoringSystem
  };
}

print('✅ MongoDB Monitoring and Alerting System setup completed!\n');