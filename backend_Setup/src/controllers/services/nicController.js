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
exports.nicController = exports.NICController = void 0;
var nicService_1 = require("../../services/registry/nicService");
var NICController = /** @class */ (function () {
    function NICController() {
    }
    // POST /api/nic/applications
    NICController.prototype.submitApplication = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var files, userId, applicationData, application, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        files = req.files;
                        userId = req.user.userId;
                        if (!files || files.length === 0) {
                            res.status(400).json({
                                error: 'At least one document is required'
                            });
                            return [2 /*return*/];
                        }
                        applicationData = __assign(__assign({}, req.body), { userId: userId, documents: files.map(function (file) { return ({
                                originalName: file.originalname,
                                mimeType: file.mimetype,
                                size: file.size
                            }); }) });
                        return [4 /*yield*/, nicService_1.nicService.submitApplication(applicationData)];
                    case 1:
                        application = _a.sent();
                        res.status(201).json({
                            success: true,
                            referenceNumber: application.referenceNumber,
                            expectedCompletionDate: application.expectedCompletionDate,
                            message: 'Application submitted successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        res.status(400).json({
                            error: 'Failed to submit application',
                            message: error_1.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/nic/applications/:referenceNumber
    NICController.prototype.getApplication = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var application, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, nicService_1.nicService.getApplicationByReference(req.params.referenceNumber)];
                    case 1:
                        application = _a.sent();
                        if (!application) {
                            res.status(404).json({ error: 'Application not found' });
                            return [2 /*return*/];
                        }
                        res.json({
                            success: true,
                            application: application
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        res.status(500).json({
                            error: 'Failed to fetch application',
                            message: error_2.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/nic/applications/:referenceNumber/status
    NICController.prototype.updateStatus = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, status_1, officerNotes, officerId, officerName, application, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, status_1 = _a.status, officerNotes = _a.officerNotes;
                        officerId = req.user.userId;
                        officerName = req.user.fullName;
                        return [4 /*yield*/, nicService_1.nicService.updateApplicationStatus(req.params.referenceNumber, status_1, officerNotes, officerId, officerName)];
                    case 1:
                        application = _b.sent();
                        res.json({
                            success: true,
                            application: application,
                            message: 'Status updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        res.status(400).json({
                            error: 'Failed to update status',
                            message: error_3.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/nic/applications
    NICController.prototype.searchApplications = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, nicService_1.nicService.searchApplications(req.query, Number(req.query.page) || 1, Number(req.query.limit) || 20)];
                    case 1:
                        result = _a.sent();
                        res.json(__assign({ success: true }, result));
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res.status(500).json({
                            error: 'Failed to search applications',
                            message: error_4.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/nic/applications/:referenceNumber/assign
    NICController.prototype.assignOfficer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, officerId, officerName, department, application, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, officerId = _a.officerId, officerName = _a.officerName, department = _a.department;
                        return [4 /*yield*/, nicService_1.nicService.assignOfficer(req.params.referenceNumber, officerId, officerName, department)];
                    case 1:
                        application = _b.sent();
                        res.json({
                            success: true,
                            application: application,
                            message: 'Officer assigned successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _b.sent();
                        res.status(400).json({
                            error: 'Failed to assign officer',
                            message: error_5.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/nic/applications/bulk-update
    NICController.prototype.bulkUpdateStatus = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, applicationIds, status_2, notes, officerId, officerName, updatedCount, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.body, applicationIds = _a.applicationIds, status_2 = _a.status, notes = _a.notes;
                        officerId = req.user.userId;
                        officerName = req.user.fullName;
                        return [4 /*yield*/, nicService_1.nicService.bulkUpdateStatus(applicationIds, status_2, officerId, officerName, notes)];
                    case 1:
                        updatedCount = _b.sent();
                        res.json({
                            success: true,
                            updatedCount: updatedCount,
                            message: "".concat(updatedCount, " applications updated successfully")
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _b.sent();
                        res.status(400).json({
                            error: 'Failed to bulk update applications',
                            message: error_6.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/nic/applications/stats
    NICController.prototype.getApplicationStats = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var dateRange, stats, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        dateRange = void 0;
                        if (req.query.dateFrom || req.query.dateTo) {
                            dateRange = {
                                from: req.query.dateFrom ? new Date(req.query.dateFrom) : new Date(0),
                                to: req.query.dateTo ? new Date(req.query.dateTo) : new Date()
                            };
                        }
                        return [4 /*yield*/, nicService_1.nicService.getApplicationStats(dateRange)];
                    case 1:
                        stats = _a.sent();
                        res.json({
                            success: true,
                            stats: stats,
                            dateRange: dateRange
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        res.status(500).json({
                            error: 'Failed to fetch application statistics',
                            message: error_7.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/nic/track/:referenceNumber
    NICController.prototype.trackApplication = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var application, trackingInfo, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, nicService_1.nicService.getApplicationByReference(req.params.referenceNumber)];
                    case 1:
                        application = _a.sent();
                        if (!application) {
                            res.status(404).json({ error: 'Application not found' });
                            return [2 /*return*/];
                        }
                        trackingInfo = {
                            referenceNumber: application.referenceNumber,
                            applicationType: application.applicationType,
                            status: application.status,
                            statusHistory: application.statusHistory,
                            submissionDate: application.submissionDate,
                            expectedCompletionDate: application.expectedCompletionDate,
                            actualCompletionDate: application.actualCompletionDate,
                            qrCode: application.qrCode
                        };
                        res.json({
                            success: true,
                            trackingInfo: trackingInfo
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        res.status(500).json({
                            error: 'Failed to track application',
                            message: error_8.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return NICController;
}());
exports.NICController = NICController;
exports.nicController = new NICController();
