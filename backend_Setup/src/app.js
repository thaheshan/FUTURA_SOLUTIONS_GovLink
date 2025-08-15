"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var helmet = require("helmet");
var compression = require("compression");
var morgan = require("morgan");
var http_1 = require("http");
var environment_1 = require("./config/environment");
// Middleware imports
var errorHandler_1 = require("./middleware/common/errorHandler");
var rateLimit_1 = require("./middleware/security/rateLimit");
// Route imports
var auth_1 = require("./routes/api/v1/auth");
var services_1 = require("./routes/api/v1/services");
var nic_1 = require("./routes/api/v1/nic");
var appointments_1 = require("./routes/api/v1/appointments");
var officers_1 = require("./routes/api/v1/officers");
var admin_1 = require("./routes/api/v1/admin");
var files_1 = require("./routes/api/v1/files");
// WebSocket
var trackingSocket_1 = require("./websocket/trackingSocket");
var App = /** @class */ (function () {
    function App() {
        this.app = express();
        this.server = (0, http_1.createServer)(this.app);
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeWebSocket();
        this.initializeErrorHandling();
    }
    App.prototype.initializeMiddleware = function () {
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
                if (!origin)
                    return callback(null, true);
                var allowedOrigins = [
                    environment_1.default.FRONTEND_URL,
                    'http://localhost:3000',
                    'http://localhost:3001'
                ];
                if (allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
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
        this.app.use(morgan(environment_1.default.NODE_ENV === 'production' ? 'combined' : 'dev'));
        // Body parsing middleware
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        // Rate limiting
        this.app.use('/api/', rateLimit_1.generalLimiter);
        // Request logging middleware for debugging
        if (environment_1.default.NODE_ENV === 'development') {
            this.app.use(function (req, res, next) {
                console.log("".concat(new Date().toISOString(), " - ").concat(req.method, " ").concat(req.path));
                next();
            });
        }
    };
    App.prototype.initializeRoutes = function () {
        // Health check endpoint
        this.app.get('/health', function (req, res) {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                environment: environment_1.default.NODE_ENV,
                services: {
                    database: 'connected', // This should be dynamic based on actual connection status
                    redis: 'connected',
                    websocket: 'active',
                    notifications: 'active'
                }
            });
        });
        // API routes
        this.app.use("/api/".concat(environment_1.default.API_VERSION, "/auth"), auth_1.default);
        this.app.use("/api/".concat(environment_1.default.API_VERSION, "/services"), services_1.default);
        this.app.use("/api/".concat(environment_1.default.API_VERSION, "/nic"), nic_1.default);
        this.app.use("/api/".concat(environment_1.default.API_VERSION, "/appointments"), appointments_1.default);
        this.app.use("/api/".concat(environment_1.default.API_VERSION, "/officers"), officers_1.default);
        this.app.use("/api/".concat(environment_1.default.API_VERSION, "/admin"), admin_1.default);
        this.app.use("/api/".concat(environment_1.default.API_VERSION, "/files"), files_1.default);
        // API info endpoint
        this.app.get("/api/".concat(environment_1.default.API_VERSION), function (req, res) {
            res.json({
                name: 'Shakthi Government Services API',
                version: environment_1.default.API_VERSION,
                description: 'Complete backend system for Sri Lankan government services',
                documentation: "/api/".concat(environment_1.default.API_VERSION, "/docs"),
                endpoints: {
                    auth: "/api/".concat(environment_1.default.API_VERSION, "/auth"),
                    services: "/api/".concat(environment_1.default.API_VERSION, "/services"),
                    nic: "/api/".concat(environment_1.default.API_VERSION, "/nic"),
                    appointments: "/api/".concat(environment_1.default.API_VERSION, "/appointments"),
                    officers: "/api/".concat(environment_1.default.API_VERSION, "/officers"),
                    admin: "/api/".concat(environment_1.default.API_VERSION, "/admin"),
                    files: "/api/".concat(environment_1.default.API_VERSION, "/files")
                }
            });
        });
    };
    App.prototype.initializeWebSocket = function () {
        (0, trackingSocket_1.initializeWebSocket)(this.server);
    };
    App.prototype.initializeErrorHandling = function () {
        // 404 handler - must be after all routes
        this.app.use('*', errorHandler_1.notFoundHandler);
        // Global error handler - must be last
        this.app.use(errorHandler_1.globalErrorHandler);
    };
    App.prototype.getServer = function () {
        return this.server;
    };
    App.prototype.getApp = function () {
        return this.app;
    };
    return App;
}());
exports.default = App;
