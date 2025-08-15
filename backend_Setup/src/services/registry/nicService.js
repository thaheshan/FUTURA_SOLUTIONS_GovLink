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
exports.nicService = exports.NICService = void 0;
var NICApplication_1 = require("../../models/NICApplication");
var notificationService_1 = require("../notification/notificationService");
var NICService = /** @class */ (function () {
    function NICService() {
    }
    NICService.getInstance = function () {
        if (!NICService.instance) {
            NICService.instance = new NICService();
        }
        return NICService.instance;
    };
    NICService.prototype.submitApplication = function (applicationData) {
        return __awaiter(this, void 0, void 0, function () {
            var referenceNumber, application, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        referenceNumber = this.generateReferenceNumber();
                        application = new NICApplication_1.NICApplication(__assign(__assign({}, applicationData), { referenceNumber: referenceNumber, status: 'submitted', submissionDate: new Date(), expectedCompletionDate: this.calculateExpectedCompletion() }));
                        return [4 /*yield*/, application.save()];
                    case 1:
                        _a.sent();
                        // Send confirmation notification
                        return [4 /*yield*/, notificationService_1.notificationService.sendApplicationConfirmation(application)];
                    case 2:
                        // Send confirmation notification
                        _a.sent();
                        return [2 /*return*/, application];
                    case 3:
                        error_1 = _a.sent();
                        throw new Error("Failed to submit application: ".concat(error_1.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    NICService.prototype.updateApplicationStatus = function (referenceNumber, newStatus, officerId, officerName, notes) {
        return __awaiter(this, void 0, void 0, function () {
            var application, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, NICApplication_1.NICApplication.findOne({ referenceNumber: referenceNumber })];
                    case 1:
                        application = _a.sent();
                        if (!application) {
                            throw new Error('Application not found');
                        }
                        // Update status
                        application.status = newStatus;
                        // Add to status history
                        application.statusHistory.push({
                            status: newStatus,
                            timestamp: new Date(),
                            officerId: officerId,
                            officerName: officerName,
                            officerNotes: notes
                        });
                        // Set completion date if approved
                        if (newStatus === 'approved' || newStatus === 'completed') {
                            application.actualCompletionDate = new Date();
                        }
                        return [4 /*yield*/, application.save()];
                    case 2:
                        _a.sent();
                        // Send status update notification
                        return [4 /*yield*/, notificationService_1.notificationService.sendStatusUpdate(application, newStatus)];
                    case 3:
                        // Send status update notification
                        _a.sent();
                        return [2 /*return*/, application];
                    case 4:
                        error_2 = _a.sent();
                        throw new Error("Failed to update application status: ".concat(error_2.message));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NICService.prototype.assignOfficer = function (referenceNumber, officerId, officerName, department) {
        return __awaiter(this, void 0, void 0, function () {
            var application, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, NICApplication_1.NICApplication.findOne({ referenceNumber: referenceNumber })];
                    case 1:
                        application = _a.sent();
                        if (!application) {
                            throw new Error('Application not found');
                        }
                        application.assignedOfficer = {
                            officerId: officerId,
                            officerName: officerName,
                            assignedDate: new Date()
                        };
                        application.status = 'under_review';
                        // Add to status history
                        application.statusHistory.push({
                            status: 'under_review',
                            timestamp: new Date(),
                            officerId: officerId,
                            officerName: officerName,
                            officerNotes: "Application assigned to ".concat(officerName)
                        });
                        return [4 /*yield*/, application.save()];
                    case 2:
                        _a.sent();
                        // Notify officer about assignment
                        return [4 /*yield*/, notificationService_1.notificationService.sendOfficerAssignment(application, officerId)];
                    case 3:
                        // Notify officer about assignment
                        _a.sent();
                        return [2 /*return*/, application];
                    case 4:
                        error_3 = _a.sent();
                        throw new Error("Failed to assign officer: ".concat(error_3.message));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NICService.prototype.getApplicationByReference = function (referenceNumber) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, NICApplication_1.NICApplication.findOne({ referenceNumber: referenceNumber })
                            .populate('assignedOfficer.officerId', 'fullName department')
                            .lean()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NICService.prototype.searchApplications = function (filters_1) {
        return __awaiter(this, arguments, void 0, function (filters, page, limit) {
            var skip, query, _a, applications, total;
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        skip = (page - 1) * limit;
                        query = {};
                        // Apply filters
                        if (filters.status)
                            query.status = filters.status;
                        if (filters.applicationType)
                            query.applicationType = filters.applicationType;
                        if (filters.priority)
                            query.priority = filters.priority;
                        if (filters.district)
                            query['personalInfo.address.district'] = filters.district;
                        if (filters.assignedOfficer)
                            query['assignedOfficer.officerId'] = filters.assignedOfficer;
                        // Date range filter
                        if (filters.dateFrom || filters.dateTo) {
                            query.submissionDate = {};
                            if (filters.dateFrom)
                                query.submissionDate.$gte = new Date(filters.dateFrom);
                            if (filters.dateTo)
                                query.submissionDate.$lte = new Date(filters.dateTo);
                        }
                        // Search by reference number or name
                        if (filters.search) {
                            query.$or = [
                                { referenceNumber: new RegExp(filters.search, 'i') },
                                { 'personalInfo.fullName': new RegExp(filters.search, 'i') }
                            ];
                        }
                        return [4 /*yield*/, Promise.all([
                                NICApplication_1.NICApplication.find(query)
                                    .sort({ submissionDate: -1 })
                                    .skip(skip)
                                    .limit(limit)
                                    .populate('assignedOfficer.officerId', 'fullName department')
                                    .lean(),
                                NICApplication_1.NICApplication.countDocuments(query)
                            ])];
                    case 1:
                        _a = _b.sent(), applications = _a[0], total = _a[1];
                        return [2 /*return*/, {
                                applications: applications,
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
    NICService.prototype.bulkUpdateStatus = function (applicationIds, newStatus, officerId, officerName, notes) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, NICApplication_1.NICApplication.updateMany({ _id: { $in: applicationIds } }, {
                            $set: { status: newStatus },
                            $push: {
                                statusHistory: {
                                    status: newStatus,
                                    timestamp: new Date(),
                                    officerId: officerId,
                                    officerName: officerName,
                                    officerNotes: notes
                                }
                            }
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.modifiedCount];
                }
            });
        });
    };
    NICService.prototype.getApplicationStats = function (dateRange) {
        return __awaiter(this, void 0, void 0, function () {
            var matchStage, stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        matchStage = {};
                        if (dateRange) {
                            matchStage.submissionDate = {
                                $gte: dateRange.from,
                                $lte: dateRange.to
                            };
                        }
                        return [4 /*yield*/, NICApplication_1.NICApplication.aggregate([
                                { $match: matchStage },
                                {
                                    $group: {
                                        _id: null,
                                        totalApplications: { $sum: 1 },
                                        submitted: { $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] } },
                                        underReview: { $sum: { $cond: [{ $eq: ['$status', 'under_review'] }, 1, 0] } },
                                        approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
                                        rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
                                        avgProcessingTime: {
                                            $avg: {
                                                $cond: [
                                                    { $ne: ['$actualCompletionDate', null] },
                                                    { $subtract: ['$actualCompletionDate', '$submissionDate'] },
                                                    null
                                                ]
                                            }
                                        }
                                    }
                                }
                            ])];
                    case 1:
                        stats = _a.sent();
                        return [2 /*return*/, stats[0] || {
                                totalApplications: 0,
                                submitted: 0,
                                underReview: 0,
                                approved: 0,
                                rejected: 0,
                                avgProcessingTime: 0
                            }];
                }
            });
        });
    };
    NICService.prototype.generateReferenceNumber = function () {
        var timestamp = Date.now().toString();
        var random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return "NIC-".concat(timestamp.slice(-6), "-").concat(random);
    };
    NICService.prototype.calculateExpectedCompletion = function () {
        var completionDate = new Date();
        completionDate.setDate(completionDate.getDate() + 14); // 14 days processing time
        return completionDate;
    };
    NICService.prototype.getApplicationsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, NICApplication_1.NICApplication.find({ userId: userId })
                            .sort({ submissionDate: -1 })
                            .lean()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    NICService.prototype.validateApplication = function (referenceNumber, validationNotes) {
        return __awaiter(this, void 0, void 0, function () {
            var application, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, NICApplication_1.NICApplication.findOne({ referenceNumber: referenceNumber })];
                    case 1:
                        application = _a.sent();
                        if (!application) {
                            throw new Error('Application not found');
                        }
                        application.validationStatus = 'validated';
                        application.validationNotes = validationNotes;
                        application.validatedDate = new Date();
                        return [4 /*yield*/, application.save()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, application];
                    case 3:
                        error_4 = _a.sent();
                        throw new Error("Failed to validate application: ".concat(error_4.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return NICService;
}());
exports.NICService = NICService;
exports.nicService = NICService.getInstance();
