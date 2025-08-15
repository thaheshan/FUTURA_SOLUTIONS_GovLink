import App from './app';
import { database } from './config/database';
import { redisClient } from './config/redis';
import config from './config/environment';
import { trackingSocket } from './websocket/trackingSocket';

class Server {
  private app: App;

  constructor() {
    this.app = new App();
  }

  public async start(): Promise<void> {
    try {
      // Initialize database connection
      console.log('🔌 Connecting to database...');
      await database.connect();

      // Initialize Redis connection
      console.log('🔌 Connecting to Redis...');
      await redisClient.connect();

      // Start background job processors (TODO: Implement when ready)
      console.log('🚀 Background processors ready for implementation...');

      // Start the server
      const server = this.app.getServer();
      
      server.listen(config.PORT, () => {
        console.log('\n🎉 ================================');
        console.log('🚀 Shakthi Government Services API');
        console.log('🎉 ================================');
        console.log(`📍 Server running on port: ${config.PORT}`);
        console.log(`🌍 Environment: ${config.NODE_ENV}`);
        console.log(`📊 Health check: http://localhost:${config.PORT}/health`);
        console.log(`🔗 API Base URL: http://localhost:${config.PORT}/api/${config.API_VERSION}`);
        console.log(`🔌 WebSocket: Active`);
        console.log(`📨 Notifications: Processing`);
        console.log(`⏰ Reminders: Scheduled`);
        console.log('================================\n');
      });

      // Graceful shutdown handlers
      this.setupGracefulShutdown(server);

      // Log WebSocket connections periodically
      if (config.NODE_ENV === 'development') {
        setInterval(() => {
          const clientsCount = trackingSocket?.getConnectedClientsCount() || 0;
          const roomInfo = trackingSocket?.getRoomInfo() || {};
          console.log(`📊 WebSocket Status - Connected: ${clientsCount}, Rooms: ${JSON.stringify(roomInfo)}`);
        }, 300000); // Every 5 minutes
      }

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(server: any): void {
    const shutdown = async (signal: string) => {
      console.log(`\n📴 Received ${signal}. Starting graceful shutdown...`);
      
      // Stop accepting new connections
      server.close(async () => {
        console.log('🔒 HTTP server closed');
        
        try {
          // Close database connection
          await database.disconnect();
          
          // Close Redis connection
          await redisClient.getClient()?.quit();
          console.log('📴 Redis connection closed');
          
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force close after 30 seconds
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    // Handle different termination signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      shutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      shutdown('UNHANDLED_REJECTION');
    });
  }
}

// Start the server
const server = new Server();
server.start().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});