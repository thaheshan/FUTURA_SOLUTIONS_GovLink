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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportingController = exports.ReportingController = void 0;
var NICApplication_1 = require("../../models/NICApplication");
var Appointment_1 = require("../../models/Appointment");
var office_1 = require("../../models/office");
var Service_1 = require("../../models/Service");
var ReportingController = /** @class */ (function () {
    function ReportingController() {
    }
    // GET /api/reports/dashboard
    ReportingController.prototype.getDashboardStats = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, dateFrom, dateTo, dateRange, _b, applicationStats, appointmentStats, officerStats, serviceStats, recentActivities, stats, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = req.query, dateFrom = _a.dateFrom, dateTo = _a.dateTo;
                        dateRange = {
                            $gte: dateFrom ? new Date(dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                            $lte: dateTo ? new Date(dateTo) : new Date()
                        };
                        return [4 /*yield*/, Promise.all([
                                // Application statistics
                                NICApplication_1.NICApplication.aggregate([
                                    { $match: { submissionDate: dateRange } },
                                    {
                                        $group: {
                                            _id: null,
                                            totalApplications: { $sum: 1 },
                                            pending: { $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] } },
                                            processing: { $sum: { $cond: [{ $eq: ['$status', 'under_review'] }, 1, 0] } },
                                            approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                                            rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
                                            avgProcessingTime: {
                                                $avg: {
                                                    $cond: [
                                                        { $ne: ['$actualCompletionDate', null] },
                                                        { $divide: [{ $subtract: ['$actualCompletionDate', '$submissionDate'] }, 86400000] },
                                                        null
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]),
                                // Appointment statistics
                                Appointment_1.Appointment.aggregate([
                                    { $match: { 'appointmentDetails.date': dateRange } },
                                    {
                                        $group: {
                                            _id: null,
                                            totalAppointments: { $sum: 1 },
                                            completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
                                            cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
                                            noShow: { $sum: { $cond: [{ $eq: ['$status', 'no_show'] }, 1, 0] } },
                                            avgRating: { $avg: '$feedback.rating' }
                                        }
                                    }
                                ]),
                                // Officer statistics
                                office_1.Officer.aggregate([
                                    { $match: { status: 'active' } },
                                    {
                                        $group: {
                                            _id: null,
                                            totalOfficers: { $sum: 1 },
                                            avgWorkload: { $avg: '$workload.current' },
                                            avgRating: { $avg: '$performance.rating' },
                                            totalProcessed: { $sum: '$performance.applicationsProcessed' }
                                        }
                                    }
                                ]),
                                // Service statistics
                                Service_1.Service.aggregate([
                                    {
                                        $group: {
                                            _id: null,
                                            totalServices: { $sum: 1 },
                                            activeServices: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                                            onlineServices: { $sum: { $cond: ['$onlineAvailable', 1, 0] } }
                                        }
                                    }
                                ]),
                                // Recent activities
                                NICApplication_1.NICApplication.find({ submissionDate: dateRange })
                                    .sort({ submissionDate: -1 })
                                    .limit(10)
                                    .select('referenceNumber personalInfo.fullName status submissionDate')
                            ])];
                    case 1:
                        _b = _c.sent(), applicationStats = _b[0], appointmentStats = _b[1], officerStats = _b[2], serviceStats = _b[3], recentActivities = _b[4];
                        stats = {
                            applications: applicationStats[0] || { totalApplications: 0, pending: 0, processing: 0, approved: 0, rejected: 0, avgProcessingTime: 0 },
                            appointments: appointmentStats[0] || { totalAppointments: 0, completed: 0, cancelled: 0, noShow: 0, avgRating: 0 },
                            officers: officerStats[0] || { totalOfficers: 0, avgWorkload: 0, avgRating: 0, totalProcessed: 0 },
                            services: serviceStats[0] || { totalServices: 0, activeServices: 0, onlineServices: 0 },
                            recentActivities: recentActivities
                        };
                        res.json({
                            success: true,
                            stats: stats,
                            dateRange: { from: dateRange.$gte, to: dateRange.$lte }
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _c.sent();
                        res.status(500).json({
                            error: 'Failed to fetch dashboard statistics',
                            message: error_1.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/reports/applications
    ReportingController.prototype.getApplicationReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, dateFrom, dateTo, _b, groupBy, matchStage, groupStage, report, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        _a = req.query, dateFrom = _a.dateFrom, dateTo = _a.dateTo, _b = _a.groupBy, groupBy = _b === void 0 ? 'day' : _b;
                        matchStage = {};
                        if (dateFrom || dateTo) {
                            matchStage.submissionDate = {};
                            if (dateFrom)
                                matchStage.submissionDate.$gte = new Date(dateFrom);
                            if (dateTo)
                                matchStage.submissionDate.$lte = new Date(dateTo);
                        }
                        groupStage = {};
                        if (groupBy === 'day') {
                            groupStage._id = {
                                year: { $year: '$submissionDate' },
                                month: { $month: '$submissionDate' },
                                day: { $dayOfMonth: '$submissionDate' }
                            };
                        }
                        else if (groupBy === 'month') {
                            groupStage._id = {
                                year: { $year: '$submissionDate' },
                                month: { $month: '$submissionDate' }
                            };
                        }
                        else if (groupBy === 'status') {
                            groupStage._id = '$status';
                        }
                        return [4 /*yield*/, NICApplication_1.NICApplication.aggregate([
                                { $match: matchStage },
                                {
                                    $group: __assign(__assign({}, groupStage), { count: { $sum: 1 }, newApplications: { $sum: { $cond: [{ $eq: ['$applicationType', 'new'] }, 1, 0] } }, renewals: { $sum: { $cond: [{ $eq: ['$applicationType', 'renewal'] }, 1, 0] } }, replacements: { $sum: { $cond: [{ $eq: ['$applicationType', 'replacement'] }, 1, 0] } }, corrections: { $sum: { $cond: [{ $eq: ['$applicationType', 'correction'] }, 1, 0] } } })
                                },
                                { $sort: { '_id': 1 } }
                            ])];
                    case 1:
                        report = _c.sent();
                        res.json({
                            success: true,
                            report: report,
                            groupBy: groupBy
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _c.sent();
                        res.status(500).json({
                            error: 'Failed to generate application report',
                            message: error_2.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/reports/performance
    ReportingController.prototype.getPerformanceReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, dateFrom, dateTo, departmentCode, matchStage, performanceReport, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, dateFrom = _a.dateFrom, dateTo = _a.dateTo, departmentCode = _a.departmentCode;
                        matchStage = {};
                        if (dateFrom || dateTo) {
                            matchStage['assignedOfficer.assignedDate'] = {};
                            if (dateFrom)
                                matchStage['assignedOfficer.assignedDate'].$gte = new Date(dateFrom);
                            if (dateTo)
                                matchStage['assignedOfficer.assignedDate'].$lte = new Date(dateTo);
                        }
                        return [4 /*yield*/, NICApplication_1.NICApplication.aggregate(__spreadArray(__spreadArray([
                                { $match: matchStage },
                                {
                                    $lookup: {
                                        from: 'officers',
                                        localField: 'assignedOfficer.officerId',
                                        foreignField: 'userId',
                                        as: 'officer'
                                    }
                                },
                                { $unwind: { path: '$officer', preserveNullAndEmptyArrays: true } }
                            ], (departmentCode ? [{ $match: { 'officer.department': departmentCode } }] : []), true), [
                                {
                                    $group: {
                                        _id: {
                                            officerId: '$assignedOfficer.officerId',
                                            officerName: '$assignedOfficer.officerName',
                                            department: '$officer.department'
                                        },
                                        totalAssigned: { $sum: 1 },
                                        completed: {
                                            $sum: { $cond: [{ $ne: ['$actualCompletionDate', null] }, 1, 0] }
                                        },
                                        avgProcessingTime: {
                                            $avg: {
                                                $cond: [
                                                    { $ne: ['$actualCompletionDate', null] },
                                                    { $divide: [{ $subtract: ['$actualCompletionDate', '$submissionDate'] }, 86400000] },
                                                    null
                                                ]
                                            }
                                        },
                                        approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                                        rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
                                    }
                                },
                                {
                                    $addFields: {
                                        completionRate: { $divide: ['$completed', '$totalAssigned'] },
                                        approvalRate: { $divide: ['$approved', '$totalAssigned'] }
                                    }
                                },
                                { $sort: { completionRate: -1, avgProcessingTime: 1 } }
                            ], false))];
                    case 1:
                        performanceReport = _b.sent();
                        res.json({
                            success: true,
                            report: performanceReport
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        res.status(500).json({
                            error: 'Failed to generate performance report',
                            message: error_3.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/reports/export
    ReportingController.prototype.exportReport = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, reportType, format, filters, data, _b, csv, error_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 9, , 10]);
                        _a = req.body, reportType = _a.reportType, format = _a.format, filters = _a.filters;
                        data = [];
                        _b = reportType;
                        switch (_b) {
                            case 'applications': return [3 /*break*/, 1];
                            case 'appointments': return [3 /*break*/, 3];
                            case 'officers': return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 7];
                    case 1: return [4 /*yield*/, NICApplication_1.NICApplication.find(filters).lean()];
                    case 2:
                        data = _c.sent();
                        return [3 /*break*/, 8];
                    case 3: return [4 /*yield*/, Appointment_1.Appointment.find(filters).lean()];
                    case 4:
                        data = _c.sent();
                        return [3 /*break*/, 8];
                    case 5: return [4 /*yield*/, office_1.Officer.find(filters).populate('userId', 'fullName email').lean()];
                    case 6:
                        data = _c.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        res.status(400).json({ error: 'Invalid report type' });
                        return [2 /*return*/];
                    case 8:
                        if (format === 'csv') {
                            csv = this.generateCSV(data);
                            res.setHeader('Content-Type', 'text/csv');
                            res.setHeader('Content-Disposition', "attachment; filename=\"".concat(reportType, "-report.csv\""));
                            res.send(csv);
                        }
                        else if (format === 'json') {
                            res.json({
                                success: true,
                                data: data,
                                count: data.length
                            });
                        }
                        else {
                            res.status(400).json({ error: 'Unsupported format' });
                        }
                        return [3 /*break*/, 10];
                    case 9:
                        error_4 = _c.sent();
                        res.status(500).json({
                            error: 'Failed to export report',
                            message: error_4.message
                        });
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ReportingController.prototype.generateCSV = function (data) {
        if (data.length === 0)
            return '';
        var headers = Object.keys(data[0]).join(',');
        var rows = data.map(function (row) {
            return Object.values(row).map(function (value) {
                return typeof value === 'string' && value.includes(',') ? "\"".concat(value, "\"") : value;
            }).join(',');
        });
        return __spreadArray([headers], rows, true).join('\n');
    };
    return ReportingController;
}());
exports.ReportingController = ReportingController;
exports.reportingController = new ReportingController();
