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
exports.authController = exports.AuthController = void 0;
var User_1 = require("../../models/User");
var jwtService_1 = require("../../services/auth/jwtService");
var otpService_1 = require("../../services/auth/otpService");
var notificationService_1 = require("../../services/notification/notificationService");
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    // POST /api/auth/register
    AuthController.prototype.register = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, phoneNumber, fullName, existingUser, user, emailOTP, phoneOTP, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        _a = req.body, email = _a.email, password = _a.password, phoneNumber = _a.phoneNumber, fullName = _a.fullName;
                        return [4 /*yield*/, User_1.User.findOne({
                                $or: [{ email: email }, { phoneNumber: phoneNumber }]
                            })];
                    case 1:
                        existingUser = _b.sent();
                        if (existingUser) {
                            res.status(400).json({
                                error: 'User already exists with this email or phone number'
                            });
                            return [2 /*return*/];
                        }
                        user = new User_1.User({
                            email: email,
                            password: password,
                            mobile: phoneNumber,
                            firstName: fullName.split(' ')[0],
                            lastName: fullName.split(' ').slice(1).join(' ') || fullName.split(' ')[0],
                            role: 'citizen'
                        });
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, otpService_1.otpService.generateOTP(email, 'email_verification')];
                    case 3:
                        emailOTP = _b.sent();
                        return [4 /*yield*/, otpService_1.otpService.generateOTP(phoneNumber, 'phone_verification')];
                    case 4:
                        phoneOTP = _b.sent();
                        // Send verification notifications
                        return [4 /*yield*/, Promise.all([
                                notificationService_1.notificationService.scheduleNotification({
                                    userId: user._id.toString(),
                                    userType: 'citizen',
                                    type: 'email',
                                    channel: email,
                                    priority: 'high',
                                    category: 'system',
                                    subject: 'Email Verification Required',
                                    message: "Your verification code is: ".concat(emailOTP),
                                    metadata: { source: 'auth_service' }
                                }),
                                notificationService_1.notificationService.scheduleNotification({
                                    userId: user._id.toString(),
                                    userType: 'citizen',
                                    type: 'sms',
                                    channel: phoneNumber,
                                    priority: 'high',
                                    category: 'system',
                                    message: "Your phone verification code is: ".concat(phoneOTP),
                                    metadata: { source: 'auth_service' }
                                })
                            ])];
                    case 5:
                        // Send verification notifications
                        _b.sent();
                        return [4 /*yield*/, notificationService_1.notificationService.processNotificationQueue()];
                    case 6:
                        _b.sent();
                        res.status(201).json({
                            success: true,
                            message: 'User registered successfully. Please verify your email and phone number.',
                            userId: user._id,
                            verificationRequired: {
                                email: true,
                                phone: true
                            }
                        });
                        return [3 /*break*/, 8];
                    case 7:
                        error_1 = _b.sent();
                        res.status(400).json({
                            error: 'Registration failed',
                            message: error_1.message
                        });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/auth/login
    AuthController.prototype.login = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, user, _b, tokens, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        _a = req.body, email = _a.email, password = _a.password;
                        return [4 /*yield*/, User_1.User.findOne({ email: email }).select('+password')];
                    case 1:
                        user = _c.sent();
                        _b = !user;
                        if (_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, user.comparePassword(password)];
                    case 2:
                        _b = !(_c.sent());
                        _c.label = 3;
                    case 3:
                        if (_b) {
                            res.status(401).json({
                                error: 'Invalid credentials'
                            });
                            return [2 /*return*/];
                        }
                        if (!user.isActive) {
                            res.status(401).json({
                                error: 'Account is deactivated'
                            });
                            return [2 /*return*/];
                        }
                        tokens = jwtService_1.jwtService.generateTokens({
                            userId: user._id.toString(),
                            email: user.email,
                            role: user.role
                        });
                        // Store refresh token
                        return [4 /*yield*/, jwtService_1.jwtService.storeRefreshToken(user._id.toString(), tokens.refreshToken)];
                    case 4:
                        // Store refresh token
                        _c.sent();
                        // Update last login
                        user.lastLogin = new Date();
                        return [4 /*yield*/, user.save()];
                    case 5:
                        _c.sent();
                        res.json({
                            success: true,
                            message: 'Login successful',
                            user: {
                                id: user._id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                role: user.role,
                                isEmailVerified: user.isEmailVerified,
                                isMobileVerified: user.isMobileVerified
                            },
                            tokens: tokens
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _c.sent();
                        res.status(500).json({
                            error: 'Login failed',
                            message: error_2.message
                        });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/auth/verify-otp
    AuthController.prototype.verifyOTP = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, identifier, otp, purpose, isValid, user, isFullyVerified, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        _a = req.body, identifier = _a.identifier, otp = _a.otp, purpose = _a.purpose;
                        return [4 /*yield*/, otpService_1.otpService.verifyOTP(identifier, purpose, otp)];
                    case 1:
                        isValid = _b.sent();
                        if (!isValid) {
                            res.status(400).json({
                                error: 'Invalid or expired OTP'
                            });
                            return [2 /*return*/];
                        }
                        if (!(purpose === 'email_verification')) return [3 /*break*/, 3];
                        return [4 /*yield*/, User_1.User.findOneAndUpdate({ email: identifier }, { isEmailVerified: true })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!(purpose === 'phone_verification')) return [3 /*break*/, 5];
                        return [4 /*yield*/, User_1.User.findOneAndUpdate({ mobile: identifier }, { isMobileVerified: true })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [4 /*yield*/, User_1.User.findOne({
                            $or: [{ email: identifier }, { mobile: identifier }]
                        })];
                    case 6:
                        user = _b.sent();
                        isFullyVerified = user && user.isEmailVerified && user.isMobileVerified;
                        res.json({
                            success: true,
                            message: 'OTP verified successfully',
                            verified: isFullyVerified || false
                        });
                        return [3 /*break*/, 8];
                    case 7:
                        error_3 = _b.sent();
                        res.status(400).json({
                            error: 'OTP verification failed',
                            message: error_3.message
                        });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/auth/logout
    AuthController.prototype.logout = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, token, userId, error_4;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        userInfo = req.user;
                        token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.substring(7);
                        if (!token) return [3 /*break*/, 2];
                        // Blacklist the access token
                        return [4 /*yield*/, jwtService_1.jwtService.blacklistToken(token)];
                    case 1:
                        // Blacklist the access token
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        userId = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId) || ((_b = userInfo === null || userInfo === void 0 ? void 0 : userInfo._id) === null || _b === void 0 ? void 0 : _b.toString());
                        if (!userId) return [3 /*break*/, 4];
                        return [4 /*yield*/, jwtService_1.jwtService.removeRefreshToken(userId)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        res.json({
                            success: true,
                            message: 'Logged out successfully'
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_4 = _c.sent();
                        res.status(500).json({
                            error: 'Logout failed',
                            message: error_4.message
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/auth/refresh-token
    AuthController.prototype.refreshToken = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var refreshToken, decoded, isValidStored, user, tokens, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        refreshToken = req.body.refreshToken;
                        if (!refreshToken) {
                            res.status(401).json({
                                error: 'Refresh token is required'
                            });
                            return [2 /*return*/];
                        }
                        decoded = jwtService_1.jwtService.verifyRefreshToken(refreshToken);
                        return [4 /*yield*/, jwtService_1.jwtService.validateRefreshToken(decoded.userId, refreshToken)];
                    case 1:
                        isValidStored = _a.sent();
                        if (!isValidStored) {
                            res.status(401).json({
                                error: 'Invalid refresh token'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, User_1.User.findById(decoded.userId)];
                    case 2:
                        user = _a.sent();
                        if (!user || !user.isActive) {
                            res.status(401).json({
                                error: 'User not found or inactive'
                            });
                            return [2 /*return*/];
                        }
                        tokens = jwtService_1.jwtService.generateTokens({
                            userId: user._id.toString(),
                            email: user.email,
                            role: user.role
                        });
                        // Store new refresh token
                        return [4 /*yield*/, jwtService_1.jwtService.storeRefreshToken(user._id.toString(), tokens.refreshToken)];
                    case 3:
                        // Store new refresh token
                        _a.sent();
                        res.json({
                            success: true,
                            tokens: tokens
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_5 = _a.sent();
                        res.status(401).json({
                            error: 'Token refresh failed',
                            message: error_5.message
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // GET /api/auth/profile
    AuthController.prototype.getProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, userId, userProfile, error_6;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userInfo = req.user;
                        userId = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId) || ((_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo._id) === null || _a === void 0 ? void 0 : _a.toString());
                        return [4 /*yield*/, User_1.User.findById(userId)];
                    case 1:
                        userProfile = _b.sent();
                        if (!userProfile) {
                            res.status(404).json({
                                error: 'User not found'
                            });
                            return [2 /*return*/];
                        }
                        res.json({
                            success: true,
                            user: userProfile
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _b.sent();
                        res.status(500).json({
                            error: 'Failed to fetch profile',
                            message: error_6.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // PUT /api/auth/profile
    AuthController.prototype.updateProfile = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, userId, updateData, updatedUser, error_7;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userInfo = req.user;
                        userId = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId) || ((_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo._id) === null || _a === void 0 ? void 0 : _a.toString());
                        updateData = req.body;
                        // Remove sensitive fields that shouldn't be updated via this endpoint
                        delete updateData.password;
                        delete updateData.email;
                        delete updateData.role;
                        delete updateData.isActive;
                        delete updateData.isEmailVerified;
                        delete updateData.isMobileVerified;
                        return [4 /*yield*/, User_1.User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })];
                    case 1:
                        updatedUser = _b.sent();
                        res.json({
                            success: true,
                            message: 'Profile updated successfully',
                            user: updatedUser
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _b.sent();
                        res.status(400).json({
                            error: 'Profile update failed',
                            message: error_7.message
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/auth/change-password
    AuthController.prototype.changePassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, userId, _a, currentPassword, newPassword, userDoc, _b, error_8;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, , 6]);
                        userInfo = req.user;
                        userId = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.userId) || ((_c = userInfo === null || userInfo === void 0 ? void 0 : userInfo._id) === null || _c === void 0 ? void 0 : _c.toString());
                        _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                        return [4 /*yield*/, User_1.User.findById(userId).select('+password')];
                    case 1:
                        userDoc = _d.sent();
                        _b = !userDoc;
                        if (_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, userDoc.comparePassword(currentPassword)];
                    case 2:
                        _b = !(_d.sent());
                        _d.label = 3;
                    case 3:
                        if (_b) {
                            res.status(400).json({
                                error: 'Current password is incorrect'
                            });
                            return [2 /*return*/];
                        }
                        userDoc.password = newPassword;
                        return [4 /*yield*/, userDoc.save()];
                    case 4:
                        _d.sent();
                        res.json({
                            success: true,
                            message: 'Password changed successfully'
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_8 = _d.sent();
                        res.status(400).json({
                            error: 'Password change failed',
                            message: error_8.message
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/auth/forgot-password
    AuthController.prototype.forgotPassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var email, user, resetToken, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        email = req.body.email;
                        return [4 /*yield*/, User_1.User.findOne({ email: email })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            // Don't reveal if user exists
                            res.json({
                                success: true,
                                message: 'If the email exists, a reset link has been sent'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, otpService_1.otpService.generateSecureToken()];
                    case 2:
                        resetToken = _a.sent();
                        return [4 /*yield*/, otpService_1.otpService.storeSecureToken("password_reset_".concat(email), resetToken, 3600)];
                    case 3:
                        _a.sent(); // 1 hour
                        // Send reset email
                        return [4 /*yield*/, notificationService_1.notificationService.scheduleNotification({
                                userId: user._id.toString(),
                                userType: 'citizen',
                                type: 'email',
                                channel: email,
                                priority: 'high',
                                category: 'system',
                                subject: 'Password Reset Request',
                                message: "Click here to reset your password: ".concat(process.env.FRONTEND_URL, "/reset-password?token=").concat(resetToken, "&email=").concat(email),
                                metadata: { source: 'auth_service' }
                            })];
                    case 4:
                        // Send reset email
                        _a.sent();
                        return [4 /*yield*/, notificationService_1.notificationService.processNotificationQueue()];
                    case 5:
                        _a.sent();
                        res.json({
                            success: true,
                            message: 'If the email exists, a reset link has been sent'
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        error_9 = _a.sent();
                        res.status(500).json({
                            error: 'Password reset request failed',
                            message: error_9.message
                        });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // POST /api/auth/reset-password
    AuthController.prototype.resetPassword = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, token, newPassword, isValidToken, user, error_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = req.body, email = _a.email, token = _a.token, newPassword = _a.newPassword;
                        return [4 /*yield*/, otpService_1.otpService.verifySecureToken("password_reset_".concat(email), token)];
                    case 1:
                        isValidToken = _b.sent();
                        if (!isValidToken) {
                            res.status(400).json({
                                error: 'Invalid or expired reset token'
                            });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, User_1.User.findOne({ email: email })];
                    case 2:
                        user = _b.sent();
                        if (!user) {
                            res.status(404).json({
                                error: 'User not found'
                            });
                            return [2 /*return*/];
                        }
                        user.password = newPassword;
                        return [4 /*yield*/, user.save()];
                    case 3:
                        _b.sent();
                        res.json({
                            success: true,
                            message: 'Password reset successfully'
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_10 = _b.sent();
                        res.status(400).json({
                            error: 'Password reset failed',
                            message: error_10.message
                        });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return AuthController;
}());
exports.AuthController = AuthController;
exports.authController = new AuthController();
