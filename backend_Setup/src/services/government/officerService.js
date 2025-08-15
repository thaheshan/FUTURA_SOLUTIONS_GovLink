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
exports.officerService = exports.OfficerService = void 0;
var Officer = require('../../models/Officer').Officer;
var User_1 = require("../../models/User");
var NICApplication_1 = require("../../models/NICApplication");
var Appointment_1 = require("../../models/Appointment");
var OfficerService = /** @class */ (function () {
    function OfficerService() {
    }
    OfficerService.getInstance = function () {
        if (!OfficerService.instance) {
            OfficerService.instance = new OfficerService();
        }
        return OfficerService.instance;
    };
    OfficerService.prototype.createOfficer = function (userId, officerData) {
        return __awaiter(this, void 0, void 0, function () {
            var user, officer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_1.User.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user || user.role !== 'officer') {
                            throw new Error('User not found or not authorized to be an officer');
                        }
                        officer = new Officer(__assign({ userId: userId }, officerData));
                        return [4 /*yield*/, officer.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, officer];
                }
            });
        });
    };
    OfficerService.prototype.getOfficerById = function (officerId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Officer.findOne({ userId: officerId })
                            .populate('userId', 'fullName email phoneNumber')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OfficerService.prototype.updateOfficer = function (officerId, updateData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Officer.findOneAndUpdate({ userId: officerId }, updateData, { new: true, runValidators: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OfficerService.prototype.getOfficersByDepartment = function (department_1) {
        return __awaiter(this, arguments, void 0, function (department, filters, page, limit) {
            var skip, query, _a, officers, total;
            if (filters === void 0) { filters = {}; }
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        skip = (page - 1) * limit;
                        query = { department: department };
                        if (filters.status)
                            query.status = filters.status;
                        if (filters.specialization)
                            query.specializations = { $in: [filters.specialization] };
                        return [4 /*yield*/, Promise.all([
                                Officer.find(query)
                                    .populate('userId', 'fullName email phoneNumber')
                                    .sort({ 'performance.rating': -1 })
                                    .skip(skip)
                                    .limit(limit)
                                    .lean(),
                                Officer.countDocuments(query)
                            ])];
                    case 1:
                        _a = _b.sent(), officers = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                officers: officers,
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
    OfficerService.prototype.assignApplicationsAutomatically = function () {
        return __awaiter(this, void 0, void 0, function () {
            var unassignedApplications, availableOfficers, officerIndex, _i, unassignedApplications_1, application, officer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, NICApplication_1.NICApplication.find({
                            'assignedOfficer.officerId': { $exists: false },
                            status: { $in: ['submitted', 'under_review'] }
                        }).sort({ priority: -1, submissionDate: 1 })];
                    case 1:
                        unassignedApplications = _a.sent();
                        return [4 /*yield*/, Officer.find({
                                status: 'active',
                                $expr: { $lt: ['$workload.current', '$workload.maximum'] }
                            }).sort({ 'workload.current': 1 })];
                    case 2:
                        availableOfficers = _a.sent();
                        if (availableOfficers.length === 0)
                            return [2 /*return*/];
                        officerIndex = 0;
                        _i = 0, unassignedApplications_1 = unassignedApplications;
                        _a.label = 3;
                    case 3:
                        if (!(_i < unassignedApplications_1.length)) return [3 /*break*/, 7];
                        application = unassignedApplications_1[_i];
                        officer = availableOfficers[officerIndex];
                        // Assign application to officer
                        return [4 /*yield*/, NICApplication_1.NICApplication.findByIdAndUpdate(application._id, {
                                'assignedOfficer': {
                                    officerId: officer.userId,
                                    officerName: "".concat(officer.employeeId), // You might want to get actual name from User
                                    assignedDate: new Date()
                                }
                            })];
                    case 4:
                        // Assign application to officer
                        _a.sent();
                        // Update officer workload
                        return [4 /*yield*/, Officer.findByIdAndUpdate(officer._id, {
                                $inc: { 'workload.current': 1 }
                            })];
                    case 5:
                        // Update officer workload
                        _a.sent();
                        // Move to next officer (round-robin)
                        officerIndex = (officerIndex + 1) % availableOfficers.length;
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 3];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    OfficerService.prototype.getOfficerWorkload = function (officerId) {
        return __awaiter(this, void 0, void 0, function () {
            var officer, _a, applications, appointments, completedToday;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Officer.findOne({ userId: officerId })];
                    case 1:
                        officer = _b.sent();
                        if (!officer) {
                            throw new Error('Officer not found');
                        }
                        return [4 /*yield*/, Promise.all([
                                NICApplication_1.NICApplication.find({ 'assignedOfficer.officerId': officerId })
                                    .sort({ submissionDate: -1 })
                                    .limit(10),
                                Appointment_1.Appointment.find({
                                    'officerInfo.officerId': officerId,
                                    'appointmentDetails.date': {
                                        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                                        $lte: new Date(new Date().setHours(23, 59, 59, 999))
                                    }
                                }),
                                NICApplication_1.NICApplication.countDocuments({
                                    'assignedOfficer.officerId': officerId,
                                    actualCompletionDate: {
                                        $gte: new Date(new Date().setHours(0, 0, 0, 0))
                                    }
                                })
                            ])];
                    case 2:
                        _a = _b.sent(), applications = _a[0], appointments = _a[1], completedToday = _a[2];
                        return [2 /*return*/, {
                                officer: officer,
                                currentWorkload: {
                                    applications: applications.length,
                                    todayAppointments: appointments.length,
                                    completedToday: completedToday
                                },
                                recentApplications: applications,
                                todayAppointments: appointments
                            }];
                }
            });
        });
    };
    OfficerService.prototype.getOfficerPerformanceReport = function (officerId, dateRange) {
        return __awaiter(this, void 0, void 0, function () {
            var officer, _a, applicationsStats, appointmentsStats;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Officer.findOne({ userId: officerId })];
                    case 1:
                        officer = _b.sent();
                        if (!officer) {
                            throw new Error('Officer not found');
                        }
                        return [4 /*yield*/, Promise.all([
                                NICApplication_1.NICApplication.aggregate([
                                    {
                                        $match: {
                                            'assignedOfficer.officerId': officerId,
                                            submissionDate: { $gte: dateRange.from, $lte: dateRange.to }
                                        }
                                    },
                                    {
                                        $group: {
                                            _id: null,
                                            totalApplications: { $sum: 1 },
                                            completed: { $sum: { $cond: [{ $ne: ['$actualCompletionDate', null] }, 1, 0] } },
                                            avgProcessingTime: {
                                                $avg: {
                                                    $cond: [
                                                        { $ne: ['$actualCompletionDate', null] },
                                                        { $subtract: ['$actualCompletionDate', '$submissionDate'] },
                                                        null
                                                    ]
                                                }
                                            },
                                            statusBreakdown: {
                                                $push: '$status'
                                            }
                                        }
                                    }
                                ]),
                                Appointment_1.Appointment.aggregate([
                                    {
                                        $match: {
                                            'officerInfo.officerId': officerId,
                                            'appointmentDetails.date': { $gte: dateRange.from, $lte: dateRange.to }
                                        }
                                    },
                                    {
                                        $group: {
                                            _id: null,
                                            totalAppointments: { $sum: 1 },
                                            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                                            avgRating: { $avg: '$feedback.rating' }
                                        }
                                    }
                                ])
                            ])];
                    case 2:
                        _a = _b.sent(), applicationsStats = _a[0], appointmentsStats = _a[1];
                        return [2 /*return*/, {
                                officer: officer,
                                dateRange: dateRange,
                                applications: applicationsStats[0] || { totalApplications: 0, completed: 0, avgProcessingTime: 0 },
                                appointments: appointmentsStats[0] || { totalAppointments: 0, completed: 0, avgRating: 0 }
                            }];
                }
            });
        });
    };
    OfficerService.prototype.updateOfficerAvailability = function (officerId, availability) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Officer.findOneAndUpdate({ userId: officerId }, { availability: availability }, { new: true })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OfficerService.prototype.getTopPerformingOfficers = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Officer.find({ status: 'active' })
                            .populate('userId', 'fullName email')
                            .sort({
                            'performance.rating': -1,
                            'performance.applicationsProcessed': -1
                        })
                            .limit(limit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return OfficerService;
}());
exports.OfficerService = OfficerService;
exports.officerService = OfficerService.getInstance();
