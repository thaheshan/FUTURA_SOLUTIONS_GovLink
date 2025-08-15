"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var database_1 = require("./config/database");
var redis_1 = require("./config/redis");
var environment_1 = require("./config/environment");
var trackingSocket_1 = require("./websocket/trackingSocket");
var Server = /** @class */ (function () {
    function Server() {
        this.app = new app_1.default();
    }
    Server.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var server_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // Initialize database connection
                        console.log('🔌 Connecting to database...');
                        return [4 /*yield*/, database_1.database.connect()];
                    case 1:
                        _a.sent();
                        // Initialize Redis connection
                        console.log('🔌 Connecting to Redis...');
                        return [4 /*yield*/, redis_1.redisClient.connect()];
                    case 2:
                        _a.sent();
                        // Start background job processors (TODO: Implement when ready)
                        console.log('🚀 Background processors ready for implementation...');
                        server_1 = this.app.getServer();
                        server_1.listen(environment_1.default.PORT, function () {
                            console.log('\n🎉 ================================');
                            console.log('🚀 Shakthi Government Services API');
                            console.log('🎉 ================================');
                            console.log("\uD83D\uDCCD Server running on port: ".concat(environment_1.default.PORT));
                            console.log("\uD83C\uDF0D Environment: ".concat(environment_1.default.NODE_ENV));
                            console.log("\uD83D\uDCCA Health check: http://localhost:".concat(environment_1.default.PORT, "/health"));
                            console.log("\uD83D\uDD17 API Base URL: http://localhost:".concat(environment_1.default.PORT, "/api/").concat(environment_1.default.API_VERSION));
                            console.log("\uD83D\uDD0C WebSocket: Active");
                            console.log("\uD83D\uDCE8 Notifications: Processing");
                            console.log("\u23F0 Reminders: Scheduled");
                            console.log('================================\n');
                        });
                        // Graceful shutdown handlers
                        this.setupGracefulShutdown(server_1);
                        // Log WebSocket connections periodically
                        if (environment_1.default.NODE_ENV === 'development') {
                            setInterval(function () {
                                var clientsCount = (trackingSocket_1.trackingSocket === null || trackingSocket_1.trackingSocket === void 0 ? void 0 : trackingSocket_1.trackingSocket.getConnectedClientsCount()) || 0;
                                var roomInfo = (trackingSocket_1.trackingSocket === null || trackingSocket_1.trackingSocket === void 0 ? void 0 : trackingSocket_1.trackingSocket.getRoomInfo()) || {};
                                console.log("\uD83D\uDCCA WebSocket Status - Connected: ".concat(clientsCount, ", Rooms: ").concat(JSON.stringify(roomInfo)));
                            }, 300000); // Every 5 minutes
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('❌ Failed to start server:', error_1);
                        process.exit(1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.setupGracefulShutdown = function (server) {
        var _this = this;
        var shutdown = function (signal) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log("\n\uD83D\uDCF4 Received ".concat(signal, ". Starting graceful shutdown..."));
                // Stop accepting new connections
                server.close(function () { return __awaiter(_this, void 0, void 0, function () {
                    var error_2;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                console.log('🔒 HTTP server closed');
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 4, , 5]);
                                // Close database connection
                                return [4 /*yield*/, database_1.database.disconnect()];
                            case 2:
                                // Close database connection
                                _b.sent();
                                // Close Redis connection
                                return [4 /*yield*/, ((_a = redis_1.redisClient.getClient()) === null || _a === void 0 ? void 0 : _a.quit())];
                            case 3:
                                // Close Redis connection
                                _b.sent();
                                console.log('📴 Redis connection closed');
                                console.log('✅ Graceful shutdown completed');
                                process.exit(0);
                                return [3 /*break*/, 5];
                            case 4:
                                error_2 = _b.sent();
                                console.error('❌ Error during shutdown:', error_2);
                                process.exit(1);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                // Force close after 30 seconds
                setTimeout(function () {
                    console.error('⚠️  Forced shutdown after timeout');
                    process.exit(1);
                }, 30000);
                return [2 /*return*/];
            });
        }); };
        // Handle different termination signals
        process.on('SIGTERM', function () { return shutdown('SIGTERM'); });
        process.on('SIGINT', function () { return shutdown('SIGINT'); });
        // Handle uncaught exceptions
        process.on('uncaughtException', function (error) {
            console.error('❌ Uncaught Exception:', error);
            shutdown('UNCAUGHT_EXCEPTION');
        });
        // Handle unhandled rejections
        process.on('unhandledRejection', function (reason, promise) {
            console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
            shutdown('UNHANDLED_REJECTION');
        });
    };
    return Server;
}());
// Start the server
var server = new Server();
server.start().catch(function (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});
