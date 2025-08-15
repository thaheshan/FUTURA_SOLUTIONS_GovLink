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
exports.reminderProcessor = exports.ReminderProcessor = void 0;
var cron = require('node-cron');
var Appointment_1 = require("../models/Appointment");
var notificationService_1 = require("../services/notification/notificationService");
var ReminderProcessor = /** @class */ (function () {
    function ReminderProcessor() {
    }
    ReminderProcessor.prototype.start = function () {
        var _this = this;
        // Process appointment reminders every 30 minutes
        cron.schedule('*/30 * * * *', function () { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.processAppointmentReminders()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error processing appointment reminders:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        console.log('✅ Reminder processor started - runs every 30 minutes');
    };
    ReminderProcessor.prototype.processAppointmentReminders = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        // Process 24-hour reminders
                        return [4 /*yield*/, this.process24HourReminders(now)];
                    case 1:
                        // Process 24-hour reminders
                        _a.sent();
                        // Process 2-hour reminders
                        return [4 /*yield*/, this.process2HourReminders(now)];
                    case 2:
                        // Process 2-hour reminders
                        _a.sent();
                        // Process 30-minute reminders
                        return [4 /*yield*/, this.process30MinuteReminders(now)];
                    case 3:
                        // Process 30-minute reminders
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ReminderProcessor.prototype.process24HourReminders = function (now) {
        return __awaiter(this, void 0, void 0, function () {
            var twentyFourHoursFromNow, appointments, _i, appointments_1, appointment, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                        return [4 /*yield*/, Appointment_1.Appointment.find({
                                'appointmentDetails.date': {
                                    $gte: new Date(twentyFourHoursFromNow.getTime() - 15 * 60 * 1000), // 15 min before
                                    $lte: new Date(twentyFourHoursFromNow.getTime() + 15 * 60 * 1000) // 15 min after
                                },
                                status: { $in: ['scheduled', 'confirmed'] },
                                'remindersSent.twentyFourHour': false
                            })];
                    case 1:
                        appointments = _a.sent();
                        _i = 0, appointments_1 = appointments;
                        _a.label = 2;
                    case 2:
                        if (!(_i < appointments_1.length)) return [3 /*break*/, 8];
                        appointment = appointments_1[_i];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        // Send email reminder
                        return [4 /*yield*/, notificationService_1.notificationService.scheduleNotification({
                                userId: appointment.applicationId,
                                userType: 'citizen',
                                type: 'email',
                                channel: appointment.applicantInfo.email,
                                priority: 'high',
                                category: 'reminder',
                                subject: 'Appointment Reminder - Tomorrow',
                                message: "Dear ".concat(appointment.applicantInfo.name, ",\n\nThis is a reminder that you have an appointment tomorrow at ").concat(appointment.appointmentDetails.timeSlot, ".\n\nVenue: ").concat(appointment.appointmentDetails.venue.name, "\nAddress: ").concat(appointment.appointmentDetails.venue.address, "\n\nPlease arrive 15 minutes early.\n\nThank you."),
                                metadata: {
                                    appointmentId: appointment._id.toString(),
                                    reminderType: '24h',
                                    source: 'reminder_processor'
                                }
                            })];
                    case 4:
                        // Send email reminder
                        _a.sent();
                        // Mark as sent
                        appointment.remindersSent.twentyFourHour = true;
                        return [4 /*yield*/, appointment.save()];
                    case 5:
                        _a.sent();
                        console.log("24h reminder sent for appointment ".concat(appointment._id));
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.error("Failed to send 24h reminder for appointment ".concat(appointment._id, ":"), error_2);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ReminderProcessor.prototype.process2HourReminders = function (now) {
        return __awaiter(this, void 0, void 0, function () {
            var twoHoursFromNow, appointments, _i, appointments_2, appointment, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                        return [4 /*yield*/, Appointment_1.Appointment.find({
                                'appointmentDetails.date': {
                                    $gte: new Date(twoHoursFromNow.getTime() - 15 * 60 * 1000),
                                    $lte: new Date(twoHoursFromNow.getTime() + 15 * 60 * 1000)
                                },
                                status: { $in: ['scheduled', 'confirmed'] },
                                'remindersSent.twoHour': false
                            })];
                    case 1:
                        appointments = _a.sent();
                        _i = 0, appointments_2 = appointments;
                        _a.label = 2;
                    case 2:
                        if (!(_i < appointments_2.length)) return [3 /*break*/, 8];
                        appointment = appointments_2[_i];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        // Send SMS reminder
                        return [4 /*yield*/, notificationService_1.notificationService.scheduleNotification({
                                userId: appointment.applicationId,
                                userType: 'citizen',
                                type: 'sms',
                                channel: appointment.applicantInfo.phone,
                                priority: 'high',
                                category: 'reminder',
                                message: "Reminder: Your appointment starts in 2 hours at ".concat(appointment.appointmentDetails.timeSlot, ". Venue: ").concat(appointment.appointmentDetails.venue.name, ". Please arrive 15 minutes early."),
                                metadata: {
                                    appointmentId: appointment._id.toString(),
                                    reminderType: '2h',
                                    source: 'reminder_processor'
                                }
                            })];
                    case 4:
                        // Send SMS reminder
                        _a.sent();
                        appointment.remindersSent.twoHour = true;
                        return [4 /*yield*/, appointment.save()];
                    case 5:
                        _a.sent();
                        console.log("2h reminder sent for appointment ".concat(appointment._id));
                        return [3 /*break*/, 7];
                    case 6:
                        error_3 = _a.sent();
                        console.error("Failed to send 2h reminder for appointment ".concat(appointment._id, ":"), error_3);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ReminderProcessor.prototype.process30MinuteReminders = function (now) {
        return __awaiter(this, void 0, void 0, function () {
            var thirtyMinutesFromNow, appointments, _i, appointments_3, appointment, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
                        return [4 /*yield*/, Appointment_1.Appointment.find({
                                'appointmentDetails.date': {
                                    $gte: new Date(thirtyMinutesFromNow.getTime() - 5 * 60 * 1000),
                                    $lte: new Date(thirtyMinutesFromNow.getTime() + 5 * 60 * 1000)
                                },
                                status: { $in: ['scheduled', 'confirmed'] },
                                'remindersSent.thirtyMinute': false
                            })];
                    case 1:
                        appointments = _a.sent();
                        _i = 0, appointments_3 = appointments;
                        _a.label = 2;
                    case 2:
                        if (!(_i < appointments_3.length)) return [3 /*break*/, 8];
                        appointment = appointments_3[_i];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        // Send push notification
                        return [4 /*yield*/, notificationService_1.notificationService.scheduleNotification({
                                userId: appointment.applicationId,
                                userType: 'citizen',
                                type: 'push',
                                channel: appointment.applicantInfo.email, // In real implementation, this would be device token
                                priority: 'urgent',
                                category: 'reminder',
                                subject: 'Appointment Starting Soon',
                                message: "Your appointment starts in 30 minutes. Please head to ".concat(appointment.appointmentDetails.venue.name, " now."),
                                metadata: {
                                    appointmentId: appointment._id.toString(),
                                    reminderType: '30min',
                                    source: 'reminder_processor'
                                }
                            })];
                    case 4:
                        // Send push notification
                        _a.sent();
                        appointment.remindersSent.thirtyMinute = true;
                        return [4 /*yield*/, appointment.save()];
                    case 5:
                        _a.sent();
                        console.log("30min reminder sent for appointment ".concat(appointment._id));
                        return [3 /*break*/, 7];
                    case 6:
                        error_4 = _a.sent();
                        console.error("Failed to send 30min reminder for appointment ".concat(appointment._id, ":"), error_4);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ReminderProcessor.prototype.processOverdueAppointments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var now, thirtyMinutesAgo, overdueAppointments, _i, overdueAppointments_1, appointment, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date();
                        thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
                        return [4 /*yield*/, Appointment_1.Appointment.find({
                                'appointmentDetails.date': { $lte: thirtyMinutesAgo },
                                status: { $in: ['scheduled', 'confirmed'] }
                            })];
                    case 1:
                        overdueAppointments = _a.sent();
                        _i = 0, overdueAppointments_1 = overdueAppointments;
                        _a.label = 2;
                    case 2:
                        if (!(_i < overdueAppointments_1.length)) return [3 /*break*/, 8];
                        appointment = overdueAppointments_1[_i];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        appointment.status = 'no_show';
                        return [4 /*yield*/, appointment.save()];
                    case 4:
                        _a.sent();
                        // Notify officer
                        return [4 /*yield*/, notificationService_1.notificationService.scheduleNotification({
                                userId: appointment.officerInfo.officerId,
                                userType: 'officer',
                                type: 'system',
                                channel: 'system',
                                priority: 'medium',
                                category: 'alert',
                                subject: 'No-show Appointment',
                                message: "Appointment ".concat(appointment._id, " marked as no-show. Applicant: ").concat(appointment.applicantInfo.name),
                                metadata: {
                                    appointmentId: appointment._id.toString(),
                                    source: 'reminder_processor'
                                }
                            })];
                    case 5:
                        // Notify officer
                        _a.sent();
                        console.log("Marked appointment ".concat(appointment._id, " as no-show"));
                        return [3 /*break*/, 7];
                    case 6:
                        error_5 = _a.sent();
                        console.error("Failed to process overdue appointment ".concat(appointment._id, ":"), error_5);
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return ReminderProcessor;
}());
exports.ReminderProcessor = ReminderProcessor;
exports.reminderProcessor = new ReminderProcessor();
