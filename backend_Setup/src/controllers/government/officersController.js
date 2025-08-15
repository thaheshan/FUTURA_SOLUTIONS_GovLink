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
exports.officerController = exports.OfficerController = void 0;
var officerService_1 = require("../../services/government/officerService");
var OfficerController = /** @class */ (function () {
    function OfficerController() {
    }
    // POST /api/officers
    OfficerController.prototype.createOfficer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var officerData, officer, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        officerData = req.body;
                        return [4 /*yield*/, officerService_1.officerService.createOfficer(officerData.userId, officerData)];
                    case 1:
                        officer = _a.sent();
                        res.status(201).json({
                            success: true,
                            officer: officer,
                            message: 'Officer created successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        res.status(400).json({
                            error: 'Failed to create officer',
                            message: error_1.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/officers/:id
    OfficerController.prototype.getOfficer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var officer, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, officerService_1.officerService.getOfficerById(req.params.id)];
                    case 1:
                        officer = _a.sent();
                        if (!officer) {
                            res.status(404).json({ error: 'Officer not found' });
                            return [2 /*return*/];
                        }
                        res.json({
                            success: true,
                            officer: officer
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        res.status(500).json({
                            error: 'Failed to fetch officer',
                            message: error_2.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/officers/:id
    OfficerController.prototype.updateOfficer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var officer, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, officerService_1.officerService.updateOfficer(req.params.id, req.body)];
                    case 1:
                        officer = _a.sent();
                        if (!officer) {
                            res.status(404).json({ error: 'Officer not found' });
                            return [2 /*return*/];
                        }
                        res.json({
                            success: true,
                            officer: officer,
                            message: 'Officer updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(400).json({
                            error: 'Failed to update officer',
                            message: error_3.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/officers/department/:department
    OfficerController.prototype.getOfficersByDepartment = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var department, _a, _b, page, _c, limit, filters, result, error_4;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        department = req.params.department;
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c, filters = __rest(_a, ["page", "limit"]);
                        return [4 /*yield*/, officerService_1.officerService.getOfficersByDepartment(department, filters, Number(page), Number(limit))];
                    case 1:
                        result = _d.sent();
                        res.json(__assign({ success: true }, result));
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _d.sent();
                        res.status(500).json({
                            error: 'Failed to fetch officers',
                            message: error_4.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/officers/:id/workload
    OfficerController.prototype.getOfficerWorkload = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var workload, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, officerService_1.officerService.getOfficerWorkload(req.params.id)];
                    case 1:
                        workload = _a.sent();
                        res.json({
                            success: true,
                            workload: workload
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        res.status(500).json({
                            error: 'Failed to fetch officer workload',
                            message: error_5.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/officers/:id/performance
    OfficerController.prototype.getOfficerPerformance = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, dateFrom, dateTo, dateRange, performance_1, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, dateFrom = _a.dateFrom, dateTo = _a.dateTo;
                        dateRange = {
                            from: dateFrom ? new Date(dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                            to: dateTo ? new Date(dateTo) : new Date()
                        };
                        return [4 /*yield*/, officerService_1.officerService.getOfficerPerformanceReport(req.params.id, dateRange)];
                    case 1:
                        performance_1 = _b.sent();
                        res.json({
                            success: true,
                            performance: performance_1
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _b.sent();
                        res.status(500).json({
                            error: 'Failed to fetch officer performance',
                            message: error_6.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/officers/:id/availability
    OfficerController.prototype.updateAvailability = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var availability, officer, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        availability = req.body.availability;
                        return [4 /*yield*/, officerService_1.officerService.updateOfficerAvailability(req.params.id, availability)];
                    case 1:
                        officer = _a.sent();
                        if (!officer) {
                            res.status(404).json({ error: 'Officer not found' });
                            return [2 /*return*/];
                        }
                        res.json({
                            success: true,
                            officer: officer,
                            message: 'Availability updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        res.status(400).json({
                            error: 'Failed to update availability',
                            message: error_7.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/officers/top-performers
    OfficerController.prototype.getTopPerformers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, limit, officers, error_8;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query.limit, limit = _a === void 0 ? 10 : _a;
                        return [4 /*yield*/, officerService_1.officerService.getTopPerformingOfficers(Number(limit))];
                    case 1:
                        officers = _b.sent();
                        res.json({
                            success: true,
                            officers: officers
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _b.sent();
                        res.status(500).json({
                            error: 'Failed to fetch top performers',
                            message: error_8.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/officers/auto-assign
    OfficerController.prototype.autoAssignApplications = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, officerService_1.officerService.assignApplicationsAutomatically()];
                    case 1:
                        _a.sent();
                        res.json({
                            success: true,
                            message: 'Applications assigned automatically'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_9 = _a.sent();
                        res.status(500).json({
                            error: 'Failed to auto-assign applications',
                            message: error_9.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return OfficerController;
}());
exports.OfficerController = OfficerController;
exports.officerController = new OfficerController();
