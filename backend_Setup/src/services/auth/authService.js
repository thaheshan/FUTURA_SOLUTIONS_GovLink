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
exports.AuthService = void 0;
var User_1 = require("../../models/User");
// import { RefreshToken } from '../../models/RefreshToken';
var refresh_1 = require("../../models/refresh");
var auth_1 = require("../../types/auth");
var jwtService_1 = require("./jwtService");
var otpService_1 = require("./otpService");
var passwordService_1 = require("./passwordService");
var user_1 = require("../../types/user");
var notificationService_1 = require("../notification/notificationService");
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    AuthService.prototype.register = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var email, mobile, password, firstName, lastName, role, existingUser, passwordValidation, user, emailOTP, mobileOTP;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = data.email, mobile = data.mobile, password = data.password, firstName = data.firstName, lastName = data.lastName, role = data.role;
                        return [4 /*yield*/, User_1.User.findOne({
                                $or: [{ email: email }, { mobile: mobile }]
                            })];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new Error('User already exists with this email or mobile');
                        }
                        passwordValidation = passwordService_1.PasswordService.validatePasswordStrength(password);
                        if (!passwordValidation.isValid) {
                            throw new Error(passwordValidation.errors.join(', '));
                        }
                        return [4 /*yield*/, User_1.User.create({
                                email: email,
                                mobile: mobile,
                                password: password,
                                firstName: firstName,
                                lastName: lastName,
                                role: role || user_1.UserRole.CITIZEN
                            })];
                    case 2:
                        user = _a.sent();
                        return [4 /*yield*/, otpService_1.otpService.generateOTP(user._id.toString(), 'EMAIL_VERIFICATION')];
                    case 3:
                        emailOTP = _a.sent();
                        return [4 /*yield*/, otpService_1.otpService.generateOTP(user._id.toString(), 'MOBILE_VERIFICATION')];
                    case 4:
                        mobileOTP = _a.sent();
                        // Send OTPs (in parallel)
                        return [4 /*yield*/, Promise.all([
                                this.sendEmailOTP(email, emailOTP),
                                this.sendSMSOTP(mobile, mobileOTP)
                            ])];
                    case 5:
                        // Send OTPs (in parallel)
                        _a.sent();
                        return [2 /*return*/, {
                                user: {
                                    id: user._id,
                                    email: user.email,
                                    mobile: user.mobile,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    role: user.role
                                },
                                message: 'Registration successful. Please verify your email and mobile number.'
                            }];
                }
            });
        });
    };
    AuthService.prototype.login = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var identifier, password, user, isPasswordValid, tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        identifier = data.identifier, password = data.password;
                        return [4 /*yield*/, User_1.User.findOne({
                                $or: [
                                    { email: identifier },
                                    { mobile: identifier }
                                ],
                                isActive: true
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('Invalid credentials');
                        }
                        return [4 /*yield*/, user.comparePassword(password)];
                    case 2:
                        isPasswordValid = _a.sent();
                        if (!isPasswordValid) {
                            throw new Error('Invalid credentials');
                        }
                        // Update last login
                        user.lastLogin = new Date();
                        return [4 /*yield*/, user.save()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.generateAuthTokens()];
                    case 4:
                        tokens = _a.sent();
                        // Store refresh token
                        return [4 /*yield*/, refresh_1.RefreshToken.create({
                                userId: user._id,
                                token: tokens.refreshToken,
                                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
                            })];
                    case 5:
                        // Store refresh token
                        _a.sent();
                        return [2 /*return*/, {
                                user: {
                                    id: user._id.toString(),
                                    email: user.email,
                                    mobile: user.mobile,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    role: user.role,
                                    isEmailVerified: user.isEmailVerified,
                                    isMobileVerified: user.isMobileVerified
                                },
                                tokens: tokens
                            }];
                }
            });
        });
    };
    AuthService.prototype.refreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var decoded, tokenDoc, user, newTokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, jwtService_1.jwtService.verifyRefreshToken(refreshToken)];
                    case 1:
                        decoded = _a.sent();
                        return [4 /*yield*/, refresh_1.RefreshToken.findOne({
                                token: refreshToken,
                                userId: decoded.userId,
                                isRevoked: false,
                                expiresAt: { $gt: new Date() }
                            })];
                    case 2:
                        tokenDoc = _a.sent();
                        if (!tokenDoc) {
                            throw new Error('Invalid refresh token');
                        }
                        return [4 /*yield*/, User_1.User.findById(decoded.userId)];
                    case 3:
                        user = _a.sent();
                        if (!user || !user.isActive) {
                            throw new Error('User not found or inactive');
                        }
                        return [4 /*yield*/, user.generateAuthTokens()];
                    case 4:
                        newTokens = _a.sent();
                        // Revoke old refresh token and create new one
                        tokenDoc.isRevoked = true;
                        return [4 /*yield*/, tokenDoc.save()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, refresh_1.RefreshToken.create({
                                userId: user._id,
                                token: newTokens.refreshToken,
                                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, newTokens];
                }
            });
        });
    };
    AuthService.prototype.logout = function (accessToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Blacklist access token
                    return [4 /*yield*/, jwtService_1.jwtService.blacklistToken(accessToken)];
                    case 1:
                        // Blacklist access token
                        _a.sent();
                        if (!refreshToken) return [3 /*break*/, 3];
                        return [4 /*yield*/, refresh_1.RefreshToken.updateOne({ token: refreshToken }, { isRevoked: true })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.verifyOTP = function (userId, code, type) {
        return __awaiter(this, void 0, void 0, function () {
            var isValid, updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, otpService_1.otpService.verifyOTP(userId, type, code)];
                    case 1:
                        isValid = _a.sent();
                        if (!isValid) {
                            throw new Error('Invalid or expired OTP');
                        }
                        updateData = {};
                        if (type === auth_1.OTPType.EMAIL_VERIFICATION) {
                            updateData.isEmailVerified = true;
                        }
                        else if (type === auth_1.OTPType.MOBILE_VERIFICATION) {
                            updateData.isMobileVerified = true;
                        }
                        return [4 /*yield*/, User_1.User.findByIdAndUpdate(userId, updateData)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.resendOTP = function (userId, type) {
        return __awaiter(this, void 0, void 0, function () {
            var user, otp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_1.User.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('User not found');
                        }
                        return [4 /*yield*/, otpService_1.otpService.generateOTP(userId, type)];
                    case 2:
                        otp = _a.sent();
                        if (!(type === auth_1.OTPType.EMAIL_VERIFICATION)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.sendEmailOTP(user.email, otp)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (!(type === auth_1.OTPType.MOBILE_VERIFICATION)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.sendSMSOTP(user.mobile, otp)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.forgotPassword = function (identifier) {
        return __awaiter(this, void 0, void 0, function () {
            var user, otp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_1.User.findOne({
                            $or: [
                                { email: identifier },
                                { mobile: identifier }
                            ],
                            isActive: true
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            // Don't reveal if user exists or not
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, otpService_1.otpService.generateOTP(user._id.toString(), 'PASSWORD_RESET')];
                    case 2:
                        otp = _a.sent();
                        return [4 /*yield*/, this.sendEmailOTP(user.email, otp)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.resetPassword = function (identifier, otp, newPassword) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isValidOTP, passwordValidation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_1.User.findOne({
                            $or: [
                                { email: identifier },
                                { mobile: identifier }
                            ],
                            isActive: true
                        })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('User not found');
                        }
                        return [4 /*yield*/, otpService_1.otpService.verifyOTP(user._id.toString(), 'PASSWORD_RESET', otp)];
                    case 2:
                        isValidOTP = _a.sent();
                        if (!isValidOTP) {
                            throw new Error('Invalid or expired OTP');
                        }
                        passwordValidation = passwordService_1.PasswordService.validatePasswordStrength(newPassword);
                        if (!passwordValidation.isValid) {
                            throw new Error(passwordValidation.errors.join(', '));
                        }
                        // Update password
                        user.password = newPassword;
                        return [4 /*yield*/, user.save()];
                    case 3:
                        _a.sent();
                        // Revoke all refresh tokens for this user
                        return [4 /*yield*/, refresh_1.RefreshToken.updateMany({ userId: user._id }, { isRevoked: true })];
                    case 4:
                        // Revoke all refresh tokens for this user
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.sendEmailOTP = function (email, otp) {
        return __awaiter(this, void 0, void 0, function () {
            var notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notification = {
                            userId: 'temp',
                            userType: 'citizen',
                            type: 'email',
                            channel: email,
                            priority: 'high',
                            category: 'system',
                            subject: 'OTP Verification Code',
                            message: "<h2>Your OTP Verification Code</h2>\n                <p>Your verification code is: <strong>".concat(otp, "</strong></p>\n                <p>This code will expire in 10 minutes.</p>\n                <p>If you did not request this code, please ignore this email.</p>"),
                            status: 'pending',
                            metadata: { source: 'auth_service' }
                        };
                        return [4 /*yield*/, notificationService_1.notificationService.scheduleNotification(notification)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, notificationService_1.notificationService.processNotificationQueue()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.sendSMSOTP = function (mobile, otp) {
        return __awaiter(this, void 0, void 0, function () {
            var notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        notification = {
                            userId: 'temp',
                            userType: 'citizen',
                            type: 'sms',
                            channel: mobile,
                            priority: 'high',
                            category: 'system',
                            message: "Your verification code is: ".concat(otp, ". This code will expire in 10 minutes."),
                            status: 'pending',
                            metadata: { source: 'auth_service' }
                        };
                        return [4 /*yield*/, notificationService_1.notificationService.scheduleNotification(notification)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, notificationService_1.notificationService.processNotificationQueue()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AuthService;
}());
exports.AuthService = AuthService;
