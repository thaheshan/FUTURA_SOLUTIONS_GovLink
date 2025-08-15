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
exports.servicesController = exports.ServicesController = void 0;
var Service_1 = require("../../models/Service");
// Optional node-cache with fallback
var NodeCache;
var cache;
try {
    NodeCache = require('node-cache');
    cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache
}
catch (error) {
    // Fallback cache implementation
    cache = {
        data: new Map(),
        get: function (key) { return cache.data.get(key); },
        set: function (key, value, ttl) {
            cache.data.set(key, value);
            if (ttl) {
                setTimeout(function () { return cache.data.delete(key); }, ttl * 1000);
            }
        }
    };
}
var ServicesController = /** @class */ (function () {
    function ServicesController() {
    }
    // GET /api/services
    ServicesController.prototype.getAllServices = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, page, _c, limit, district, category, status_1, search, departmentCode, onlineAvailable, cacheKey, cachedResult, skip, query, _d, services, total, result, error_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 3]);
                        _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 20 : _c, district = _a.district, category = _a.category, status_1 = _a.status, search = _a.search, departmentCode = _a.departmentCode, onlineAvailable = _a.onlineAvailable;
                        cacheKey = "services:".concat(JSON.stringify(req.query));
                        cachedResult = cache.get(cacheKey);
                        if (cachedResult) {
                            res.json(cachedResult);
                            return [2 /*return*/];
                        }
                        skip = (Number(page) - 1) * Number(limit);
                        query = {};
                        // Apply filters
                        if (district)
                            query.district = district;
                        if (category)
                            query.category = category;
                        if (status_1)
                            query.status = status_1;
                        if (departmentCode)
                            query.departmentCode = departmentCode;
                        if (onlineAvailable !== undefined)
                            query.onlineAvailable = onlineAvailable === 'true';
                        // Apply search
                        if (search) {
                            query.$text = { $search: search };
                        }
                        return [4 /*yield*/, Promise.all([
                                Service_1.Service.find(query)
                                    .sort(search ? { score: { $meta: 'textScore' } } : { name: 1 })
                                    .skip(skip)
                                    .limit(Number(limit))
                                    .lean(),
                                Service_1.Service.countDocuments(query)
                            ])];
                    case 1:
                        _d = _e.sent(), services = _d[0], total = _d[1];
                        result = {
                            services: services,
                            pagination: {
                                current: Number(page),
                                total: Math.ceil(total / Number(limit)),
                                hasNext: Number(page) < Math.ceil(total / Number(limit)),
                                hasPrev: Number(page) > 1,
                                totalItems: total
                            }
                        };
                        // Cache the result
                        cache.set(cacheKey, result);
                        res.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _e.sent();
                        res.status(500).json({
                            error: 'Failed to fetch services',
                            message: error_1.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/services/:id
    ServicesController.prototype.getService = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var service, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Service_1.Service.findById(req.params.id)];
                    case 1:
                        service = _a.sent();
                        if (!service) {
                            res.status(404).json({ error: 'Service not found' });
                            return [2 /*return*/];
                        }
                        res.json({
                            success: true,
                            service: service
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        res.status(500).json({
                            error: 'Failed to fetch service',
                            message: error_2.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/services
    ServicesController.prototype.createService = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var serviceData, service, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        serviceData = __assign(__assign({}, req.body), { lastUpdated: new Date() });
                        service = new Service_1.Service(serviceData);
                        return [4 /*yield*/, service.save()];
                    case 1:
                        _a.sent();
                        // Clear cache
                        cache.flushAll();
                        res.status(201).json({
                            success: true,
                            service: service,
                            message: 'Service created successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(400).json({
                            error: 'Failed to create service',
                            message: error_3.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/services/:id
    ServicesController.prototype.updateService = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var updateData, service, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        updateData = __assign(__assign({}, req.body), { lastUpdated: new Date() });
                        return [4 /*yield*/, Service_1.Service.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })];
                    case 1:
                        service = _a.sent();
                        if (!service) {
                            res.status(404).json({ error: 'Service not found' });
                            return [2 /*return*/];
                        }
                        // Clear cache
                        cache.flushAll();
                        res.json({
                            success: true,
                            service: service,
                            message: 'Service updated successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res.status(400).json({
                            error: 'Failed to update service',
                            message: error_4.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // DELETE /api/services/:id
    ServicesController.prototype.deleteService = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var service, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Service_1.Service.findByIdAndDelete(req.params.id)];
                    case 1:
                        service = _a.sent();
                        if (!service) {
                            res.status(404).json({ error: 'Service not found' });
                            return [2 /*return*/];
                        }
                        // Clear cache
                        cache.flushAll();
                        res.json({
                            success: true,
                            message: 'Service deleted successfully'
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        res.status(500).json({
                            error: 'Failed to delete service',
                            message: error_5.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/services/categories
    ServicesController.prototype.getServiceCategories = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var categories, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Service_1.Service.distinct('category', { status: 'active' })];
                    case 1:
                        categories = _a.sent();
                        res.json({
                            success: true,
                            categories: categories
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        res.status(500).json({
                            error: 'Failed to fetch categories',
                            message: error_6.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/services/districts
    ServicesController.prototype.getServiceDistricts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var districts, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Service_1.Service.distinct('district', { status: 'active' })];
                    case 1:
                        districts = _a.sent();
                        res.json({
                            success: true,
                            districts: districts
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        res.status(500).json({
                            error: 'Failed to fetch districts',
                            message: error_7.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/services/stats
    ServicesController.prototype.getServiceStats = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var stats, categoryStats, districtStats, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, Service_1.Service.aggregate([
                                {
                                    $group: {
                                        _id: null,
                                        totalServices: { $sum: 1 },
                                        activeServices: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
                                        inactiveServices: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
                                        maintenanceServices: { $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] } },
                                        onlineServices: { $sum: { $cond: ['$onlineAvailable', 1, 0] } },
                                        byCategory: {
                                            $addToSet: '$category'
                                        },
                                        byDistrict: {
                                            $addToSet: '$district'
                                        }
                                    }
                                }
                            ])];
                    case 1:
                        stats = _a.sent();
                        return [4 /*yield*/, Service_1.Service.aggregate([
                                { $match: { status: 'active' } },
                                { $group: { _id: '$category', count: { $sum: 1 } } },
                                { $sort: { count: -1 } }
                            ])];
                    case 2:
                        categoryStats = _a.sent();
                        return [4 /*yield*/, Service_1.Service.aggregate([
                                { $match: { status: 'active' } },
                                { $group: { _id: '$district', count: { $sum: 1 } } },
                                { $sort: { count: -1 } }
                            ])];
                    case 3:
                        districtStats = _a.sent();
                        res.json({
                            success: true,
                            stats: __assign(__assign({}, stats[0]), { categoryStats: categoryStats, districtStats: districtStats })
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_8 = _a.sent();
                        res.status(500).json({
                            error: 'Failed to fetch service statistics',
                            message: error_8.message
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return ServicesController;
}());
exports.ServicesController = ServicesController;
exports.servicesController = new ServicesController();
