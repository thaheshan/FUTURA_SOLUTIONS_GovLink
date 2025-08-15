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
exports.appointmentService = exports.AppointmentService = void 0;
var Appointment_1 = require("../../models/Appointment");
var notificationService_1 = require("../notification/notificationService");
// Mock Officer model
var Officer = {
    find: function (query) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); },
    findOne: function (query) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, null];
    }); }); },
    findOneAndUpdate: function (query, update) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, null];
    }); }); }
};
var AppointmentService = /** @class */ (function () {
    function AppointmentService() {
    }
    AppointmentService.getInstance = function () {
        if (!AppointmentService.instance) {
            AppointmentService.instance = new AppointmentService();
        }
        return AppointmentService.instance;
    };
    AppointmentService.prototype.getAvailableSlots = function (date_1, officerId_1) {
        return __awaiter(this, arguments, void 0, function (date, officerId, duration) {
            var targetDate, dayOfWeek, officers, availableSlots, _loop_1, this_1, _i, officers_1, officer;
            var _a, _b;
            if (duration === void 0) { duration = 30; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        targetDate = new Date(date);
                        dayOfWeek = targetDate.toLocaleString('en-US', { weekday: 'short' }).toLowerCase();
                        if (!officerId) return [3 /*break*/, 2];
                        return [4 /*yield*/, Officer.find((_a = {
                                    userId: officerId,
                                    status: 'active'
                                },
                                _a["availability.".concat(this.getDayName(targetDate), ".available")] = true,
                                _a))];
                    case 1:
                        officers = _c.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, Officer.find((_b = {
                                status: 'active'
                            },
                            _b["availability.".concat(this.getDayName(targetDate), ".available")] = true,
                            _b))];
                    case 3:
                        officers = _c.sent();
                        _c.label = 4;
                    case 4:
                        availableSlots = {};
                        _loop_1 = function (officer) {
                            var dayAvailability, allSlots, bookedAppointments, bookedSlots, freeSlots;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        dayAvailability = officer.availability[this_1.getDayName(targetDate)];
                                        if (!dayAvailability.available)
                                            return [2 /*return*/, "continue"];
                                        allSlots = this_1.generateTimeSlots(dayAvailability.start, dayAvailability.end, duration);
                                        return [4 /*yield*/, Appointment_1.Appointment.find({
                                                'officerInfo.officerId': officer.userId,
                                                'appointmentDetails.date': {
                                                    $gte: new Date(date + 'T00:00:00'),
                                                    $lte: new Date(date + 'T23:59:59')
                                                },
                                                status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
                                            }, 'appointmentDetails.timeSlot')];
                                    case 1:
                                        bookedAppointments = _d.sent();
                                        bookedSlots = bookedAppointments.map(function (apt) { return apt.appointmentDetails.timeSlot; });
                                        freeSlots = allSlots.filter(function (slot) { return !bookedSlots.includes(slot); });
                                        availableSlots[officer.userId] = freeSlots;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, officers_1 = officers;
                        _c.label = 5;
                    case 5:
                        if (!(_i < officers_1.length)) return [3 /*break*/, 8];
                        officer = officers_1[_i];
                        return [5 /*yield**/, _loop_1(officer)];
                    case 6:
                        _c.sent();
                        _c.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/, availableSlots];
                }
            });
        });
    };
    AppointmentService.prototype.getDayName = function (date) {
        var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[date.getDay()];
    };
    AppointmentService.prototype.generateTimeSlots = function (startTime, endTime, duration) {
        var slots = [];
        var _a = startTime.split(':').map(Number), startHour = _a[0], startMinute = _a[1];
        var _b = endTime.split(':').map(Number), endHour = _b[0], endMinute = _b[1];
        var startDate = new Date();
        startDate.setHours(startHour, startMinute, 0, 0);
        var endDate = new Date();
        endDate.setHours(endHour, endMinute, 0, 0);
        var current = new Date(startDate);
        while (current < endDate) {
            slots.push(current.toTimeString().slice(0, 5));
            current.setMinutes(current.getMinutes() + duration);
        }
        return slots;
    };
    AppointmentService.prototype.bookAppointment = function (appointmentData) {
        return __awaiter(this, void 0, void 0, function () {
            var conflictCheck, appointment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Appointment_1.Appointment.findOne({
                            'officerInfo.officerId': appointmentData.officerInfo.officerId,
                            'appointmentDetails.date': appointmentData.appointmentDetails.date,
                            'appointmentDetails.timeSlot': appointmentData.appointmentDetails.timeSlot,
                            status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
                        })];
                    case 1:
                        conflictCheck = _a.sent();
                        if (conflictCheck) {
                            throw new Error('Time slot is already booked');
                        }
                        appointment = new Appointment_1.Appointment(__assign(__assign({}, appointmentData), { status: 'scheduled' }));
                        return [4 /*yield*/, appointment.save()];
                    case 2:
                        _a.sent();
                        // Update officer workload
                        return [4 /*yield*/, this.updateOfficerWorkload(appointmentData.officerInfo.officerId, 1)];
                    case 3:
                        // Update officer workload
                        _a.sent();
                        // Schedule reminder notifications
                        return [4 /*yield*/, this.scheduleReminders(appointment)];
                    case 4:
                        // Schedule reminder notifications
                        _a.sent();
                        // Send confirmation notification
                        return [4 /*yield*/, notificationService_1.notificationService.sendAppointmentConfirmation(appointment)];
                    case 5:
                        // Send confirmation notification
                        _a.sent();
                        return [2 /*return*/, appointment];
                }
            });
        });
    };
    AppointmentService.prototype.rescheduleAppointment = function (appointmentId, newDate, newTimeSlot, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var appointment, conflictCheck;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Appointment_1.Appointment.findById(appointmentId)];
                    case 1:
                        appointment = _a.sent();
                        if (!appointment) {
                            throw new Error('Appointment not found');
                        }
                        return [4 /*yield*/, Appointment_1.Appointment.findOne({
                                _id: { $ne: appointmentId },
                                'officerInfo.officerId': appointment.officerInfo.officerId,
                                'appointmentDetails.date': newDate,
                                'appointmentDetails.timeSlot': newTimeSlot,
                                status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
                            })];
                    case 2:
                        conflictCheck = _a.sent();
                        if (conflictCheck) {
                            throw new Error('New time slot is already booked');
                        }
                        // Store reschedule history
                        appointment.rescheduleHistory.push({
                            previousDate: appointment.appointmentDetails.date,
                            previousTimeSlot: appointment.appointmentDetails.timeSlot,
                            reason: reason || 'User requested',
                            rescheduledBy: 'user', // This should come from authentication context
                            rescheduledAt: new Date()
                        });
                        // Update appointment
                        appointment.appointmentDetails.date = newDate;
                        appointment.appointmentDetails.timeSlot = newTimeSlot;
                        appointment.status = 'rescheduled';
                        appointment.remindersSent = {
                            twentyFourHour: false,
                            twoHour: false,
                            thirtyMinute: false
                        };
                        return [4 /*yield*/, appointment.save()];
                    case 3:
                        _a.sent();
                        // Reschedule reminders
                        return [4 /*yield*/, this.scheduleReminders(appointment)];
                    case 4:
                        // Reschedule reminders
                        _a.sent();
                        // Send rescheduling notification
                        return [4 /*yield*/, notificationService_1.notificationService.sendAppointmentRescheduled(appointment)];
                    case 5:
                        // Send rescheduling notification
                        _a.sent();
                        return [2 /*return*/, appointment];
                }
            });
        });
    };
    AppointmentService.prototype.cancelAppointment = function (appointmentId, reason, cancelledBy) {
        return __awaiter(this, void 0, void 0, function () {
            var appointment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Appointment_1.Appointment.findById(appointmentId)];
                    case 1:
                        appointment = _a.sent();
                        if (!appointment) {
                            throw new Error('Appointment not found');
                        }
                        appointment.status = 'cancelled';
                        appointment.cancellationReason = reason;
                        appointment.cancelledBy = cancelledBy;
                        appointment.cancelledAt = new Date();
                        return [4 /*yield*/, appointment.save()];
                    case 2:
                        _a.sent();
                        // Update officer workload
                        return [4 /*yield*/, this.updateOfficerWorkload(appointment.officerInfo.officerId, -1)];
                    case 3:
                        // Update officer workload
                        _a.sent();
                        // Send cancellation notification
                        return [4 /*yield*/, notificationService_1.notificationService.sendAppointmentCancelled(appointment)];
                    case 4:
                        // Send cancellation notification
                        _a.sent();
                        return [2 /*return*/, appointment];
                }
            });
        });
    };
    AppointmentService.prototype.updateOfficerWorkload = function (officerId, increment) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Officer.findOneAndUpdate({ userId: officerId }, { $inc: { 'workload.current': increment } })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppointmentService.prototype.scheduleReminders = function (appointment) {
        return __awaiter(this, void 0, void 0, function () {
            var appointmentDateTime, _a, hours, minutes, twentyFourHoursBefore, twoHoursBefore, thirtyMinutesBefore;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        appointmentDateTime = new Date(appointment.appointmentDetails.date);
                        _a = appointment.appointmentDetails.timeSlot.split(':').map(Number), hours = _a[0], minutes = _a[1];
                        appointmentDateTime.setHours(hours, minutes);
                        twentyFourHoursBefore = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);
                        twoHoursBefore = new Date(appointmentDateTime.getTime() - 2 * 60 * 60 * 1000);
                        thirtyMinutesBefore = new Date(appointmentDateTime.getTime() - 30 * 60 * 1000);
                        // Schedule reminders
                        return [4 /*yield*/, Promise.all([
                                notificationService_1.notificationService.scheduleNotification({
                                    userId: appointment.applicationId,
                                    type: 'email',
                                    channel: appointment.applicantInfo.email,
                                    subject: 'Appointment Reminder - Tomorrow',
                                    message: "Your ".concat(appointment.applicationType.toUpperCase(), " appointment is scheduled for tomorrow at ").concat(appointment.appointmentDetails.timeSlot),
                                    scheduledAt: twentyFourHoursBefore,
                                    category: 'reminder',
                                    metadata: {
                                        appointmentId: appointment._id.toString(),
                                        reminderType: '24h',
                                        source: 'appointment_service'
                                    }
                                }),
                                notificationService_1.notificationService.scheduleNotification({
                                    userId: appointment.applicationId,
                                    type: 'sms',
                                    channel: appointment.applicantInfo.phone,
                                    message: "Reminder: Your ".concat(appointment.applicationType.toUpperCase(), " appointment starts in 2 hours at ").concat(appointment.appointmentDetails.timeSlot, ". Location: ").concat(appointment.appointmentDetails.venue.name),
                                    scheduledAt: twoHoursBefore,
                                    category: 'reminder',
                                    metadata: {
                                        appointmentId: appointment._id.toString(),
                                        reminderType: '2h',
                                        source: 'appointment_service'
                                    }
                                }),
                                notificationService_1.notificationService.scheduleNotification({
                                    userId: appointment.applicationId,
                                    type: 'push',
                                    channel: appointment.applicantInfo.email, // Push notifications would use device tokens
                                    message: "Your appointment starts in 30 minutes. Please arrive on time.",
                                    scheduledAt: thirtyMinutesBefore,
                                    category: 'reminder',
                                    metadata: {
                                        appointmentId: appointment._id.toString(),
                                        reminderType: '30min',
                                        source: 'appointment_service'
                                    }
                                })
                            ])];
                    case 1:
                        // Schedule reminders
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppointmentService.prototype.checkInAppointment = function (appointmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var appointment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Appointment_1.Appointment.findById(appointmentId)];
                    case 1:
                        appointment = _a.sent();
                        if (!appointment) {
                            throw new Error('Appointment not found');
                        }
                        appointment.status = 'in_progress';
                        appointment.checkInTime = new Date();
                        return [4 /*yield*/, appointment.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, appointment];
                }
            });
        });
    };
    AppointmentService.prototype.checkOutAppointment = function (appointmentId, feedback) {
        return __awaiter(this, void 0, void 0, function () {
            var appointment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Appointment_1.Appointment.findById(appointmentId)];
                    case 1:
                        appointment = _a.sent();
                        if (!appointment) {
                            throw new Error('Appointment not found');
                        }
                        appointment.status = 'completed';
                        appointment.checkOutTime = new Date();
                        if (feedback) {
                            appointment.feedback = __assign(__assign({}, feedback), { submittedAt: new Date() });
                        }
                        return [4 /*yield*/, appointment.save()];
                    case 2:
                        _a.sent();
                        // Update officer workload
                        return [4 /*yield*/, this.updateOfficerWorkload(appointment.officerInfo.officerId, -1)];
                    case 3:
                        // Update officer workload
                        _a.sent();
                        // Update officer performance metrics
                        return [4 /*yield*/, this.updateOfficerPerformance(appointment)];
                    case 4:
                        // Update officer performance metrics
                        _a.sent();
                        return [2 /*return*/, appointment];
                }
            });
        });
    };
    AppointmentService.prototype.updateOfficerPerformance = function (appointment) {
        return __awaiter(this, void 0, void 0, function () {
            var processingTime, rating;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        processingTime = appointment.checkOutTime && appointment.checkInTime
                            ? (appointment.checkOutTime.getTime() - appointment.checkInTime.getTime()) / (1000 * 60) // minutes
                            : appointment.appointmentDetails.duration;
                        rating = ((_a = appointment.feedback) === null || _a === void 0 ? void 0 : _a.rating) || 5;
                        return [4 /*yield*/, Officer.findOneAndUpdate({ userId: appointment.officerInfo.officerId }, {
                                $inc: { 'performance.applicationsProcessed': 1 },
                                $set: {
                                    'performance.averageProcessingTime': processingTime,
                                    'performance.rating': rating
                                }
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppointmentService.prototype.getAppointmentsByOfficer = function (officerId_1) {
        return __awaiter(this, arguments, void 0, function (officerId, filters, page, limit) {
            var skip, query, _a, appointments, total;
            if (filters === void 0) { filters = {}; }
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        skip = (page - 1) * limit;
                        query = { 'officerInfo.officerId': officerId };
                        // Apply filters
                        if (filters.status)
                            query.status = filters.status;
                        if (filters.date) {
                            query['appointmentDetails.date'] = {
                                $gte: new Date(filters.date + 'T00:00:00'),
                                $lte: new Date(filters.date + 'T23:59:59')
                            };
                        }
                        return [4 /*yield*/, Promise.all([
                                Appointment_1.Appointment.find(query)
                                    .sort({ 'appointmentDetails.date': 1, 'appointmentDetails.timeSlot': 1 })
                                    .skip(skip)
                                    .limit(limit)
                                    .lean(),
                                Appointment_1.Appointment.countDocuments(query)
                            ])];
                    case 1:
                        _a = _b.sent(), appointments = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                appointments: appointments,
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
    return AppointmentService;
}());
exports.AppointmentService = AppointmentService;
exports.appointmentService = AppointmentService.getInstance();
