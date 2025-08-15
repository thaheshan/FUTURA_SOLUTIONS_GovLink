import * as express from 'express';
import { Application } from 'express';
import * as cors from 'cors';
const helmet = require('helmet');
import * as compression from 'compression';
import * as morgan from 'morgan';
import { createServer, Server as HTTPServer } from 'http';
import config from './config/environment';

// Middleware imports
import { globalErrorHandler, notFoundHandler } from './middleware/common/errorHandler';
import { generalLimiter } from './middleware/security/rateLimit';

// Route imports
import authRoutes from './routes/api/v1/auth';
import serviceRoutes from './routes/api/v1/services';
import nicRoutes from './routes/api/v1/nic';
import appointmentRoutes from './routes/api/v1/appointments';
import officerRoutes from './routes/api/v1/officers';
import adminRoutes from './routes/api/v1/admin';
import fileRoutes from './routes/api/v1/files';

// WebSocket
import { initializeWebSocket } from './websocket/trackingSocket';

class App {
  public app: Application;
  public server: HTTPServer;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeWebSocket();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "ws:", "wss:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
          config.FRONTEND_URL,
          'http://localhost:3000',
          'http://localhost:3001'
        ];
        
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    this.app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev'));

    // Body parsing middleware
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    // Rate limiting
    this.app.use('/api/', generalLimiter);

    // Request logging middleware for debugging
    if (config.NODE_ENV === 'development') {
      this.app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
      });
    }
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: config.NODE_ENV,
        services: {
          database: 'connected', // This should be dynamic based on actual connection status
          redis: 'connected',
          websocket: 'active',
          notifications: 'active'
        }
      });
    });

    // API routes
    this.app.use(`/api/${config.API_VERSION}/auth`, authRoutes);
    this.app.use(`/api/${config.API_VERSION}/services`, serviceRoutes);
    this.app.use(`/api/${config.API_VERSION}/nic`, nicRoutes);
    this.app.use(`/api/${config.API_VERSION}/appointments`, appointmentRoutes);
    this.app.use(`/api/${config.API_VERSION}/officers`, officerRoutes);
    this.app.use(`/api/${config.API_VERSION}/admin`, adminRoutes);
    this.app.use(`/api/${config.API_VERSION}/files`, fileRoutes);

    // API info endpoint
    this.app.get(`/api/${config.API_VERSION}`, (req, res) => {
      res.json({
        name: 'Shakthi Government Services API',
        version: config.API_VERSION,
        description: 'Complete backend system for Sri Lankan government services',
        documentation: `/api/${config.API_VERSION}/docs`,
        endpoints: {
          auth: `/api/${config.API_VERSION}/auth`,
          services: `/api/${config.API_VERSION}/services`,
          nic: `/api/${config.API_VERSION}/nic`,
          appointments: `/api/${config.API_VERSION}/appointments`,
          officers: `/api/${config.API_VERSION}/officers`,
          admin: `/api/${config.API_VERSION}/admin`,
          files: `/api/${config.API_VERSION}/files`
        }
      });
    });
  }

  private initializeWebSocket(): void {
    initializeWebSocket(this.server);
  }

  private initializeErrorHandling(): void {
    // 404 handler - must be after all routes
    this.app.use('*', notFoundHandler);

    // Global error handler - must be last
    this.app.use(globalErrorHandler);
  }

  public getServer(): HTTPServer {
    return this.server;
  }

  public getApp(): Application {
    return this.app;
  }
}

export default App;