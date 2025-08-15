"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceQueryLimiter = exports.uploadLimiter = exports.authLimiter = exports.generalLimiter = void 0;
var rateLimit = require('express-rate-limit');
var environment_1 = require("../../config/environment");
// General API rate limiter
exports.generalLimiter = rateLimit({
    windowMs: environment_1.config.RATE_LIMIT_WINDOW, // 15 minutes
    max: environment_1.config.RATE_LIMIT_MAX_REQUESTS, // 100 requests per windowMs
    message: {
        error: 'Too many requests',
        message: 'Please try again later',
        retryAfter: Math.ceil(environment_1.config.RATE_LIMIT_WINDOW / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: function (req) {
        var _a;
        // Use user ID if authenticated, otherwise IP
        return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) || req.ip;
    }
});
// Strict limiter for authentication endpoints
exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per windowMs
    message: {
        error: 'Too many authentication attempts',
        message: 'Please try again after 15 minutes',
        retryAfter: 900
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
});
// File upload limiter
exports.uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 uploads per hour
    message: {
        error: 'Too many file uploads',
        message: 'Please try again later',
        retryAfter: 3600
    }
});
// Service query limiter
exports.serviceQueryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 service queries per windowMs
    message: {
        error: 'Too many service queries',
        message: 'Please try again later'
    }
});
