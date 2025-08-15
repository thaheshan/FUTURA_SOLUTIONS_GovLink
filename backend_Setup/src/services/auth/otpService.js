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
exports.otpService = exports.OTPService = void 0;
var redis_1 = require("../../config/redis");
var crypto = require("crypto");
var OTPService = /** @class */ (function () {
    function OTPService() {
    }
    OTPService.getInstance = function () {
        if (!OTPService.instance) {
            OTPService.instance = new OTPService();
        }
        return OTPService.instance;
    };
    OTPService.prototype.generateOTP = function (identifier, purpose) {
        return __awaiter(this, void 0, void 0, function () {
            var otp, key, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        otp = Math.floor(100000 + Math.random() * 900000).toString();
                        key = "otp_".concat(purpose, "_").concat(identifier);
                        data = JSON.stringify({
                            otp: otp,
                            attempts: 0,
                            generatedAt: new Date().toISOString()
                        });
                        return [4 /*yield*/, redis_1.redisClient.set(key, data, 600)];
                    case 1:
                        _a.sent(); // 10 minutes
                        return [2 /*return*/, otp];
                }
            });
        });
    };
    OTPService.prototype.verifyOTP = function (identifier, purpose, otp) {
        return __awaiter(this, void 0, void 0, function () {
            var key, storedData, _a, storedOTP, attempts, updatedData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        key = "otp_".concat(purpose, "_").concat(identifier);
                        return [4 /*yield*/, redis_1.redisClient.get(key)];
                    case 1:
                        storedData = _b.sent();
                        if (!storedData) {
                            return [2 /*return*/, false]; // OTP expired or doesn't exist
                        }
                        _a = JSON.parse(storedData), storedOTP = _a.otp, attempts = _a.attempts;
                        if (!(attempts >= 3)) return [3 /*break*/, 3];
                        return [4 /*yield*/, redis_1.redisClient.del(key)];
                    case 2:
                        _b.sent(); // Remove OTP after too many attempts
                        return [2 /*return*/, false];
                    case 3:
                        if (!(storedOTP === otp)) return [3 /*break*/, 5];
                        return [4 /*yield*/, redis_1.redisClient.del(key)];
                    case 4:
                        _b.sent(); // Remove OTP after successful verification
                        return [2 /*return*/, true];
                    case 5:
                        updatedData = JSON.stringify({
                            otp: storedOTP,
                            attempts: attempts + 1,
                            generatedAt: JSON.parse(storedData).generatedAt
                        });
                        return [4 /*yield*/, redis_1.redisClient.set(key, updatedData, 600)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, false];
                }
            });
        });
    };
    OTPService.prototype.generateSecureToken = function () {
        return __awaiter(this, arguments, void 0, function (length) {
            if (length === void 0) { length = 32; }
            return __generator(this, function (_a) {
                return [2 /*return*/, crypto.randomBytes(length).toString('hex')];
            });
        });
    };
    OTPService.prototype.storeSecureToken = function (identifier_1, token_1) {
        return __awaiter(this, arguments, void 0, function (identifier, token, ttlSeconds) {
            var key;
            if (ttlSeconds === void 0) { ttlSeconds = 3600; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = "secure_token_".concat(identifier);
                        return [4 /*yield*/, redis_1.redisClient.set(key, token, ttlSeconds)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    OTPService.prototype.verifySecureToken = function (identifier, token) {
        return __awaiter(this, void 0, void 0, function () {
            var key, storedToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = "secure_token_".concat(identifier);
                        return [4 /*yield*/, redis_1.redisClient.get(key)];
                    case 1:
                        storedToken = _a.sent();
                        if (!(storedToken === token)) return [3 /*break*/, 3];
                        return [4 /*yield*/, redis_1.redisClient.del(key)];
                    case 2:
                        _a.sent(); // Remove token after use
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    return OTPService;
}());
exports.OTPService = OTPService;
exports.otpService = OTPService.getInstance();
