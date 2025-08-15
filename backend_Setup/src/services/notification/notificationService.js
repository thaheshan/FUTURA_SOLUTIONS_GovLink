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
exports.notificationService = exports.NotificationService = void 0;
var Notification_1 = require("../../models/Notification");
var nodemailer = require("nodemailer");
var twilio = require("twilio");
var environment_1 = require("../../config/environment");
var NotificationService = /** @class */ (function () {
    function NotificationService() {
        this.initializeEmailService();
        this.initializeSMSService();
    }
    NotificationService.getInstance = function () {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    };
    NotificationService.prototype.initializeEmailService = function () {
        this.emailTransporter = nodemailer.createTransport({
            host: environment_1.config.SMTP_HOST,
            port: environment_1.config.SMTP_PORT,
            secure: environment_1.config.SMTP_PORT === 465,
            auth: {
                user: environment_1.config.SMTP_USER,
                pass: environment_1.config.SMTP_PASS
            }
        });
    };
    NotificationService.prototype.initializeSMSService = function () {
        if (environment_1.config.TWILIO_ACCOUNT_SID && environment_1.config.TWILIO_AUTH_TOKEN) {
            this.smsClient = twilio(environment_1.config.TWILIO_ACCOUNT_SID, environment_1.config.TWILIO_AUTH_TOKEN);
        }
    };
    NotificationService.prototype.sendApplicationConfirmation = function (application) {
        return __awaiter(this, void 0, void 0, function () {
            var emailNotification, smsNotification;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        emailNotification = new Notification_1.Notification({
                            userId: application.referenceNumber,
                            userType: 'citizen',
                            type: 'email',
                            channel: application.personalInfo.email,
                            priority: 'high',
                            category: 'application',
                            subject: "NIC Application Submitted Successfully - ".concat(application.referenceNumber),
                            message: this.generateEmailTemplate('application_confirmation', {
                                referenceNumber: application.referenceNumber,
                                applicantName: application.personalInfo.fullName,
                                trackingUrl: "".concat(environment_1.config.FRONTEND_URL, "/track/").concat(application.referenceNumber),
                                expectedCompletion: (_a = application.expectedCompletionDate) === null || _a === void 0 ? void 0 : _a.toDateString()
                            }),
                            status: 'pending',
                            metadata: {
                                applicationType: 'nic',
                                applicationId: application.referenceNumber,
                                source: 'nic_service'
                            }
                        });
                        smsNotification = new Notification_1.Notification({
                            userId: application.referenceNumber,
                            userType: 'citizen',
                            type: 'sms',
                            channel: application.personalInfo.phoneNumber,
                            priority: 'high',
                            category: 'application',
                            message: "NIC application submitted successfully. Reference: ".concat(application.referenceNumber, ". Track at: ").concat(environment_1.config.FRONTEND_URL, "/track/").concat(application.referenceNumber),
                            status: 'pending',
                            metadata: {
                                applicationType: 'nic',
                                applicationId: application.referenceNumber,
                                source: 'nic_service'
                            }
                        });
                        return [4 /*yield*/, Promise.all([emailNotification.save(), smsNotification.save()])];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.processNotificationQueue()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.sendStatusUpdate = function (application, newStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var statusMessages, statusInfo, emailNotification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        statusMessages = {
                            'under_review': {
                                subject: 'Application Under Review',
                                message: 'Your NIC application is now under review by our team.'
                            },
                            'document_verification': {
                                subject: 'Document Verification in Progress',
                                message: 'We are verifying the documents submitted with your application.'
                            },
                            'approved': {
                                subject: 'Application Approved - Ready for Collection',
                                message: 'Congratulations! Your NIC application has been approved and is ready for collection.'
                            },
                            'rejected': {
                                subject: 'Application Requires Additional Information',
                                message: 'Your application needs additional documentation or correction.'
                            },
                            'ready_for_collection': {
                                subject: 'NIC Ready for Collection',
                                message: 'Your National Identity Card is ready for collection.'
                            }
                        };
                        statusInfo = statusMessages[newStatus];
                        if (!statusInfo)
                            return [2 /*return*/];
                        emailNotification = new Notification_1.Notification({
                            userId: application.referenceNumber,
                            userType: 'citizen',
                            type: 'email',
                            channel: application.personalInfo.email,
                            priority: newStatus === 'approved' ? 'high' : 'medium',
                            category: 'application',
                            subject: "".concat(statusInfo.subject, " - ").concat(application.referenceNumber),
                            message: this.generateEmailTemplate('status_update', {
                                referenceNumber: application.referenceNumber,
                                applicantName: application.personalInfo.fullName,
                                status: newStatus,
                                statusMessage: statusInfo.message,
                                trackingUrl: "".concat(environment_1.config.FRONTEND_URL, "/track/").concat(application.referenceNumber)
                            }),
                            status: 'pending',
                            metadata: {
                                applicationType: 'nic',
                                applicationId: application.referenceNumber,
                                status: newStatus,
                                source: 'nic_service'
                            }
                        });
                        return [4 /*yield*/, emailNotification.save()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.processNotificationQueue()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.sendAppointmentConfirmation = function (appointment) {
        return __awaiter(this, void 0, void 0, function () {
            var notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notification = new Notification_1.Notification({
                            userId: appointment.applicationId,
                            userType: 'citizen',
                            type: 'email',
                            channel: appointment.applicantInfo.email,
                            priority: 'high',
                            category: 'appointment',
                            subject: 'Appointment Confirmed',
                            message: this.generateEmailTemplate('appointment_confirmation', {
                                applicantName: appointment.applicantInfo.name,
                                appointmentDate: appointment.appointmentDetails.date.toDateString(),
                                appointmentTime: appointment.appointmentDetails.timeSlot,
                                venue: appointment.appointmentDetails.venue.name,
                                address: appointment.appointmentDetails.venue.address,
                                officerName: appointment.officerInfo.officerName
                            }),
                            status: 'pending',
                            metadata: {
                                appointmentId: appointment._id,
                                source: 'appointment_service'
                            }
                        });
                        return [4 /*yield*/, notification.save()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.processNotificationQueue()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.sendAppointmentRescheduled = function (appointment) {
        return __awaiter(this, void 0, void 0, function () {
            var notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notification = new Notification_1.Notification({
                            userId: appointment.applicationId,
                            userType: 'citizen',
                            type: 'email',
                            channel: appointment.applicantInfo.email,
                            priority: 'high',
                            category: 'appointment',
                            subject: 'Appointment Rescheduled',
                            message: this.generateEmailTemplate('appointment_rescheduled', {
                                applicantName: appointment.applicantInfo.name,
                                newDate: appointment.appointmentDetails.date.toDateString(),
                                newTime: appointment.appointmentDetails.timeSlot,
                                venue: appointment.appointmentDetails.venue.name
                            }),
                            status: 'pending',
                            metadata: {
                                appointmentId: appointment._id,
                                source: 'appointment_service'
                            }
                        });
                        return [4 /*yield*/, notification.save()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.processNotificationQueue()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.sendAppointmentCancelled = function (appointment) {
        return __awaiter(this, void 0, void 0, function () {
            var notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notification = new Notification_1.Notification({
                            userId: appointment.applicationId,
                            userType: 'citizen',
                            type: 'email',
                            channel: appointment.applicantInfo.email,
                            priority: 'medium',
                            category: 'appointment',
                            subject: 'Appointment Cancelled',
                            message: this.generateEmailTemplate('appointment_cancelled', {
                                applicantName: appointment.applicantInfo.name,
                                originalDate: appointment.appointmentDetails.date.toDateString(),
                                originalTime: appointment.appointmentDetails.timeSlot,
                                reason: appointment.cancellationReason
                            }),
                            status: 'pending',
                            metadata: {
                                appointmentId: appointment._id,
                                source: 'appointment_service'
                            }
                        });
                        return [4 /*yield*/, notification.save()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.processNotificationQueue()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.sendOfficerAssignment = function (application, officerId) {
        return __awaiter(this, void 0, void 0, function () {
            var notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notification = new Notification_1.Notification({
                            userId: officerId,
                            userType: 'officer',
                            type: 'system',
                            channel: 'system',
                            priority: 'medium',
                            category: 'application',
                            subject: 'New Application Assigned',
                            message: "New ".concat(application.applicationType, " application assigned: ").concat(application.referenceNumber),
                            status: 'pending',
                            actionRequired: true,
                            actionUrl: "/admin/applications/".concat(application.referenceNumber),
                            metadata: {
                                applicationId: application.referenceNumber,
                                source: 'nic_service'
                            }
                        });
                        return [4 /*yield*/, notification.save()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.processNotificationQueue()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.scheduleNotification = function (notificationData) {
        return __awaiter(this, void 0, void 0, function () {
            var notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notification = new Notification_1.Notification(__assign(__assign({}, notificationData), { status: 'pending' }));
                        return [4 /*yield*/, notification.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.processNotificationQueue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pendingNotifications, promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Notification_1.Notification.find({
                            status: 'pending',
                            $or: [
                                { scheduledAt: { $exists: false } },
                                { scheduledAt: { $lte: new Date() } }
                            ]
                        })
                            .sort({ priority: -1, createdAt: 1 })
                            .limit(100)];
                    case 1:
                        pendingNotifications = _a.sent();
                        promises = pendingNotifications.map(function (notification) { return __awaiter(_this, void 0, void 0, function () {
                            var error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, this.sendNotification(notification)];
                                    case 1:
                                        _a.sent();
                                        notification.status = 'sent';
                                        notification.sentAt = new Date();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_1 = _a.sent();
                                        notification.retryCount += 1;
                                        if (notification.retryCount >= notification.maxRetries) {
                                            notification.status = 'failed';
                                            notification.failureReason = error_1.message;
                                        }
                                        else {
                                            // Schedule retry in 5 minutes
                                            notification.scheduledAt = new Date(Date.now() + 5 * 60 * 1000);
                                        }
                                        console.error("Failed to send notification ".concat(notification._id, ":"), error_1);
                                        return [3 /*break*/, 3];
                                    case 3: return [4 /*yield*/, notification.save()];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.sendNotification = function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = notification.type;
                        switch (_a) {
                            case 'email': return [3 /*break*/, 1];
                            case 'sms': return [3 /*break*/, 3];
                            case 'push': return [3 /*break*/, 5];
                            case 'system': return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 8];
                    case 1: return [4 /*yield*/, this.sendEmail(notification)];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 3: return [4 /*yield*/, this.sendSMS(notification)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, this.sendPushNotification(notification)];
                    case 6:
                        _b.sent();
                        return [3 /*break*/, 8];
                    case 7: 
                    // System notifications are stored in database only
                    return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.sendEmail = function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            var mailOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mailOptions = {
                            from: "\"Government Services\" <".concat(environment_1.config.SMTP_USER, ">"),
                            to: notification.channel,
                            subject: notification.subject || 'Government Services Notification',
                            html: notification.message,
                            priority: (notification.priority === 'urgent' ? 'high' : 'normal')
                        };
                        return [4 /*yield*/, this.emailTransporter.sendMail(mailOptions)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.sendSMS = function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.smsClient) {
                            throw new Error('SMS service not configured');
                        }
                        return [4 /*yield*/, this.smsClient.messages.create({
                                body: notification.message,
                                from: environment_1.config.TWILIO_PHONE_NUMBER,
                                to: notification.channel
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.sendPushNotification = function (notification) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Push notification implementation would depend on the service used
                // (Firebase, OneSignal, etc.)
                console.log("Push notification sent: ".concat(notification.message));
                return [2 /*return*/];
            });
        });
    };
    NotificationService.prototype.generateEmailTemplate = function (templateType, variables) {
        var templates = {
            'application_confirmation': "\n        <h2>Application Submitted Successfully</h2>\n        <p>Dear ".concat(variables.applicantName, ",</p>\n        <p>Your NIC application has been submitted successfully.</p>\n        <p><strong>Reference Number:</strong> ").concat(variables.referenceNumber, "</p>\n        <p><strong>Expected Completion:</strong> ").concat(variables.expectedCompletion, "</p>\n        <p>You can track your application status at: <a href=\"").concat(variables.trackingUrl, "\">").concat(variables.trackingUrl, "</a></p>\n        <p>Thank you for using our services.</p>\n      "),
            'status_update': "\n        <h2>Application Status Update</h2>\n        <p>Dear ".concat(variables.applicantName, ",</p>\n        <p><strong>Reference Number:</strong> ").concat(variables.referenceNumber, "</p>\n        <p><strong>Status:</strong> ").concat(variables.status.replace('_', ' ').toUpperCase(), "</p>\n        <p>").concat(variables.statusMessage, "</p>\n        <p>Track your application: <a href=\"").concat(variables.trackingUrl, "\">Click here</a></p>\n      "),
            'appointment_confirmation': "\n        <h2>Appointment Confirmed</h2>\n        <p>Dear ".concat(variables.applicantName, ",</p>\n        <p>Your appointment has been confirmed for:</p>\n        <p><strong>Date:</strong> ").concat(variables.appointmentDate, "</p>\n        <p><strong>Time:</strong> ").concat(variables.appointmentTime, "</p>\n        <p><strong>Venue:</strong> ").concat(variables.venue, "</p>\n        <p><strong>Address:</strong> ").concat(variables.address, "</p>\n        <p><strong>Officer:</strong> ").concat(variables.officerName, "</p>\n        <p>Please arrive 15 minutes early.</p>\n      "),
            'appointment_rescheduled': "\n        <h2>Appointment Rescheduled</h2>\n        <p>Dear ".concat(variables.applicantName, ",</p>\n        <p>Your appointment has been rescheduled to:</p>\n        <p><strong>New Date:</strong> ").concat(variables.newDate, "</p>\n        <p><strong>New Time:</strong> ").concat(variables.newTime, "</p>\n        <p><strong>Venue:</strong> ").concat(variables.venue, "</p>\n      "),
            'appointment_cancelled': "\n        <h2>Appointment Cancelled</h2>\n        <p>Dear ".concat(variables.applicantName, ",</p>\n        <p>Your appointment scheduled for ").concat(variables.originalDate, " at ").concat(variables.originalTime, " has been cancelled.</p>\n        <p><strong>Reason:</strong> ").concat(variables.reason, "</p>\n        <p>Please reschedule your appointment at your convenience.</p>\n      ")
        };
        return templates[templateType] || variables.message;
    };
    NotificationService.prototype.getNotificationsByUser = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, filters, page, limit) {
            var skip, query, _a, notifications, total;
            if (filters === void 0) { filters = {}; }
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        skip = (page - 1) * limit;
                        query = { userId: userId };
                        if (filters.type)
                            query.type = filters.type;
                        if (filters.category)
                            query.category = filters.category;
                        if (filters.status)
                            query.status = filters.status;
                        if (filters.read === 'true')
                            query.readAt = { $exists: true };
                        if (filters.read === 'false')
                            query.readAt = { $exists: false };
                        return [4 /*yield*/, Promise.all([
                                Notification_1.Notification.find(query)
                                    .sort({ createdAt: -1 })
                                    .skip(skip)
                                    .limit(limit)
                                    .lean(),
                                Notification_1.Notification.countDocuments(query)
                            ])];
                    case 1:
                        _a = _b.sent(), notifications = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                notifications: notifications,
                                pagination: {
                                    current: page,
                                    total: Math.ceil(total / limit),
                                    hasNext: page < Math.ceil(total / limit),
                                    hasPrev: page > 1,
                                    totalItems: total
                                }
                            }];
                }
            });
        });
    };
    NotificationService.prototype.markAsRead = function (notificationId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Notification_1.Notification.findOneAndUpdate({ _id: notificationId, userId: userId }, { readAt: new Date() })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationService.prototype.getNotificationStats = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Notification_1.Notification.aggregate([
                            { $match: { userId: userId } },
                            {
                                $group: {
                                    _id: null,
                                    total: { $sum: 1 },
                                    unread: { $sum: { $cond: [{ $exists: ['$readAt', false] }, 1, 0] } },
                                    byType: {
                                        $push: {
                                            type: '$type',
                                            status: '$status'
                                        }
                                    }
                                }
                            }
                        ])];
                    case 1:
                        stats = _a.sent();
                        return [2 /*return*/, stats[0] || { total: 0, unread: 0, byType: [] }];
                }
            });
        });
    };
    return NotificationService;
}());
exports.NotificationService = NotificationService;
exports.notificationService = NotificationService.getInstance();
