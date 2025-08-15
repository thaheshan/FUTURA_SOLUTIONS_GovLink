"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.initializeWebSocket = exports.trackingSocket = exports.TrackingSocket = void 0;
var socket_io_1 = require("socket.io");
var jwtService_1 = require("../services/auth/jwtService");
var environment_1 = require("../config/environment");
var TrackingSocket = /** @class */ (function () {
    function TrackingSocket(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: environment_1.default.FRONTEND_URL,
                methods: ["GET", "POST"],
                credentials: true
            },
            transports: ['websocket', 'polling']
        });
        this.setupEventHandlers();
        console.log('✅ WebSocket server initialized');
    }
    TrackingSocket.prototype.setupEventHandlers = function () {
        var _this = this;
        this.io.on('connection', function (socket) {
            console.log("Client connected: ".concat(socket.id));
            // Authentication for protected rooms
            socket.on('authenticate', function (token) { return __awaiter(_this, void 0, void 0, function () {
                var decoded;
                return __generator(this, function (_a) {
                    try {
                        decoded = jwtService_1.jwtService.verifyAccessToken(token);
                        socket.data.user = decoded;
                        socket.emit('authenticated', { success: true });
                        console.log("Client ".concat(socket.id, " authenticated as ").concat(decoded.email));
                    }
                    catch (error) {
                        socket.emit('authentication_error', { error: 'Invalid token' });
                    }
                    return [2 /*return*/];
                });
            }); });
            // Join application tracking room (public)
            socket.on('track-application', function (referenceNumber) {
                if (referenceNumber) {
                    socket.join("application-".concat(referenceNumber));
                    socket.emit('tracking-started', { referenceNumber: referenceNumber });
                    console.log("Client ".concat(socket.id, " tracking application ").concat(referenceNumber));
                }
            });
            // Stop tracking application
            socket.on('stop-tracking', function (referenceNumber) {
                socket.leave("application-".concat(referenceNumber));
                socket.emit('tracking-stopped', { referenceNumber: referenceNumber });
            });
            // Join officer dashboard room (protected)
            socket.on('join-officer-dashboard', function (officerId) {
                if (socket.data.user && socket.data.user.role === 'officer') {
                    socket.join("officer-".concat(officerId));
                    socket.emit('dashboard-joined', { officerId: officerId });
                }
                else {
                    socket.emit('access-denied', { error: 'Officer access required' });
                }
            });
            // Join admin dashboard room (protected)
            socket.on('join-admin-dashboard', function () {
                if (socket.data.user && socket.data.user.role === 'admin') {
                    socket.join('admin-dashboard');
                    socket.emit('admin-dashboard-joined', { success: true });
                }
                else {
                    socket.emit('access-denied', { error: 'Admin access required' });
                }
            });
            // Handle disconnection
            socket.on('disconnect', function (reason) {
                console.log("Client ".concat(socket.id, " disconnected: ").concat(reason));
            });
            // Handle errors
            socket.on('error', function (error) {
                console.error("Socket error for ".concat(socket.id, ":"), error);
            });
        });
    };
    // Broadcast application status update
    TrackingSocket.prototype.broadcastApplicationStatusUpdate = function (referenceNumber, statusData) {
        this.io.to("application-".concat(referenceNumber)).emit('application-status-update', __assign(__assign({ referenceNumber: referenceNumber }, statusData), { timestamp: new Date().toISOString() }));
    };
    // Broadcast appointment updates
    TrackingSocket.prototype.broadcastAppointmentUpdate = function (applicationId, appointmentData) {
        this.io.to("application-".concat(applicationId)).emit('appointment-update', __assign(__assign({ applicationId: applicationId }, appointmentData), { timestamp: new Date().toISOString() }));
    };
    // Broadcast to officer dashboard
    TrackingSocket.prototype.broadcastToOfficer = function (officerId, event, data) {
        this.io.to("officer-".concat(officerId)).emit(event, __assign(__assign({}, data), { timestamp: new Date().toISOString() }));
    };
    // Broadcast to admin dashboard
    TrackingSocket.prototype.broadcastToAdmins = function (event, data) {
        this.io.to('admin-dashboard').emit(event, __assign(__assign({}, data), { timestamp: new Date().toISOString() }));
    };
    // Send notification to specific user
    TrackingSocket.prototype.sendNotificationToUser = function (userId, notification) {
        // This would require maintaining user-socket mapping
        this.io.emit('user-notification', {
            userId: userId,
            notification: notification,
            timestamp: new Date().toISOString()
        });
    };
    // Broadcast system-wide announcements
    TrackingSocket.prototype.broadcastSystemAnnouncement = function (message, priority) {
        if (priority === void 0) { priority = 'medium'; }
        this.io.emit('system-announcement', {
            message: message,
            priority: priority,
            timestamp: new Date().toISOString()
        });
    };
    // Get connected clients count
    TrackingSocket.prototype.getConnectedClientsCount = function () {
        return this.io.engine.clientsCount;
    };
    // Get room information
    TrackingSocket.prototype.getRoomInfo = function () {
        var rooms = this.io.sockets.adapter.rooms;
        var roomInfo = {};
        rooms.forEach(function (sockets, room) {
            if (!room.startsWith('/')) { // Filter out internal rooms
                roomInfo[room] = sockets.size;
            }
        });
        return roomInfo;
    };
    return TrackingSocket;
}());
exports.TrackingSocket = TrackingSocket;
var initializeWebSocket = function (server) {
    exports.trackingSocket = new TrackingSocket(server);
    return exports.trackingSocket;
};
exports.initializeWebSocket = initializeWebSocket;
