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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentController = exports.AppointmentController = void 0;
var appointmentService_1 = require("../../services/citizen/appointmentService");
var Appointment_1 = require("../../models/Appointment");
var AppointmentController = /** @class */ (function () {
    function AppointmentController() {
    }
    // GET /api/appointments/available-slots
    AppointmentController.prototype.getAvailableSlots = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, date, officerId, _b, duration, slots, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = req.query, date = _a.date, officerId = _a.officerId, _b = _a.duration, duration = _b === void 0 ? 30 : _b;
                        if (!date) {
                            res.status(400).json({ error: 'Date is required' });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, appointmentService_1.appointmentService.getAvailableSlots(date, officerId, Number(duration))];
                    case 1:
                        slots = _c.sent();
                        res.json({
                            success: true,
                            date: date,
                            availableSlots: slots
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _c.sent();
                        res.status(500).json({
                            error: 'Failed to fetch available slots',
                            message: error_1.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/appointments
    AppointmentController.prototype.bookAppointment = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var appointment, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, appointmentService_1.appointmentService.bookAppointment(req.body)];
                    case 1:
                        appointment = _a.sent();
                        res.status(201).json({
                            success: true,
                            appointment: appointment,
                            message: 'Appointment booked successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        res.status(400).json({
                            error: 'Failed to book appointment',
                            message: error_2.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/appointments/:id
    AppointmentController.prototype.getAppointment = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var appointment, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Appointment_1.Appointment.findById(req.params.id)];
                    case 1:
                        appointment = _a.sent();
                        if (!appointment) {
                            res.status(404).json({ error: 'Appointment not found' });
                            return [2 /*return*/];
                        }
                        res.json({
                            success: true,
                            appointment: appointment
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(500).json({
                            error: 'Failed to fetch appointment',
                            message: error_3.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/appointments/:id/reschedule
    AppointmentController.prototype.rescheduleAppointment = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, newDate, newTimeSlot, reason, appointment, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, newDate = _a.newDate, newTimeSlot = _a.newTimeSlot, reason = _a.reason;
                        return [4 /*yield*/, appointmentService_1.appointmentService.rescheduleAppointment(req.params.id, new Date(newDate), newTimeSlot, reason)];
                    case 1:
                        appointment = _b.sent();
                        res.json({
                            success: true,
                            appointment: appointment,
                            message: 'Appointment rescheduled successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _b.sent();
                        res.status(400).json({
                            error: 'Failed to reschedule appointment',
                            message: error_4.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/appointments/:id/cancel
    AppointmentController.prototype.cancelAppointment = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var reason, user, appointment, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        reason = req.body.reason;
                        user = req.user;
                        return [4 /*yield*/, appointmentService_1.appointmentService.cancelAppointment(req.params.id, reason, user.userId)];
                    case 1:
                        appointment = _a.sent();
                        res.json({
                            success: true,
                            appointment: appointment,
                            message: 'Appointment cancelled successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        res.status(400).json({
                            error: 'Failed to cancel appointment',
                            message: error_5.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/appointments/:id/check-in
    AppointmentController.prototype.checkInAppointment = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var appointment, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, appointmentService_1.appointmentService.checkInAppointment(req.params.id)];
                    case 1:
                        appointment = _a.sent();
                        res.json({
                            success: true,
                            appointment: appointment,
                            message: 'Checked in successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        res.status(400).json({
                            error: 'Failed to check in',
                            message: error_6.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/appointments/:id/check-out
    AppointmentController.prototype.checkOutAppointment = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var feedback, appointment, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        feedback = req.body.feedback;
                        return [4 /*yield*/, appointmentService_1.appointmentService.checkOutAppointment(req.params.id, feedback)];
                    case 1:
                        appointment = _a.sent();
                        res.json({
                            success: true,
                            appointment: appointment,
                            message: 'Checked out successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        res.status(400).json({
                            error: 'Failed to check out',
                            message: error_7.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/appointments/officer/:officerId
    AppointmentController.prototype.getAppointmentsByOfficer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var officerId, _a, _b, page, _c, limit, filters, result, error_8;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        officerId = req.params.officerId;
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c, filters = __rest(_a, ["page", "limit"]);
                        return [4 /*yield*/, appointmentService_1.appointmentService.getAppointmentsByOfficer(officerId, filters, Number(page), Number(limit))];
                    case 1:
                        result = _d.sent();
                        res.json(__assign({ success: true }, result));
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _d.sent();
                        res.status(500).json({
                            error: 'Failed to fetch appointments',
                            message: error_8.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/appointments
    AppointmentController.prototype.getAppointments = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, _b, page, _c, limit, status_1, date, filters, result, query, skip, _d, appointments, total, error_9;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 5, , 6]);
                        user = req.user;
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c, status_1 = _a.status, date = _a.date;
                        filters = { status: status_1, date: date };
                        result = void 0;
                        if (!(user.role === 'officer')) return [3 /*break*/, 2];
                        return [4 /*yield*/, appointmentService_1.appointmentService.getAppointmentsByOfficer(user.userId, filters, Number(page), Number(limit))];
                    case 1:
                        result = _e.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        query = { 'applicantInfo.email': user.email };
                        if (filters.status)
                            query.status = filters.status;
                        if (filters.date) {
                            query['appointmentDetails.date'] = {
                                $gte: new Date(filters.date + 'T00:00:00'),
                                $lte: new Date(filters.date + 'T23:59:59')
                            };
                        }
                        skip = (Number(page) - 1) * Number(limit);
                        return [4 /*yield*/, Promise.all([
                                Appointment_1.Appointment.find(query)
                                    .sort({ 'appointmentDetails.date': -1 })
                                    .skip(skip)
                                    .limit(Number(limit))
                                    .lean(),
                                Appointment_1.Appointment.countDocuments(query)
                            ])];
                    case 3:
                        _d = _e.sent(), appointments = _d[0], total = _d[1];
                        result = {
                            appointments: appointments,
                            pagination: {
                                current: Number(page),
                                total: Math.ceil(total / Number(limit)),
                                hasNext: Number(page) < Math.ceil(total / Number(limit)),
                                hasPrev: Number(page) > 1,
                                totalItems: total
                            }
                        };
                        _e.label = 4;
                    case 4:
                        res.json(__assign({ success: true }, result));
                        return [3 /*break*/, 6];
                    case 5:
                        error_9 = _e.sent();
                        res.status(500).json({
                            error: 'Failed to fetch appointments',
                            message: error_9.message
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return AppointmentController;
}());
exports.AppointmentController = AppointmentController;
exports.appointmentController = new AppointmentController();
