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
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.asyncHandler = exports.globalErrorHandler = exports.createError = void 0;
var winston = require('winston');
// Configure Winston logger
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.errors({ stack: true }), winston.format.json()),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});
var createError = function (message, statusCode, code) {
    if (statusCode === void 0) { statusCode = 500; }
    var error = new Error(message);
    error.statusCode = statusCode;
    error.isOperational = true;
    error.code = code;
    return error;
};
exports.createError = createError;
var globalErrorHandler = function (error, req, res, next) {
    var _a;
    // Log error
    logger.error({
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId
    });
    // Default error response
    var statusCode = error.statusCode || 500;
    var message = error.message || 'Internal server error';
    var code = error.code || 'INTERNAL_ERROR';
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid resource ID';
        code = 'INVALID_ID';
    }
    else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation error';
        code = 'VALIDATION_ERROR';
    }
    else if (error.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value';
        code = 'DUPLICATE_FIELD';
    }
    // Handle Multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
        statusCode = 400;
        message = 'File size too large';
        code = 'FILE_TOO_LARGE';
    }
    else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        statusCode = 400;
        message = 'Too many files';
        code = 'TOO_MANY_FILES';
    }
    // Don't expose internal errors in production
    if (!error.isOperational && process.env.NODE_ENV === 'production') {
        message = 'Something went wrong';
        code = 'INTERNAL_ERROR';
    }
    res.status(statusCode).json(__assign({ error: message, code: code }, (process.env.NODE_ENV === 'development' && { stack: error.stack })));
};
exports.globalErrorHandler = globalErrorHandler;
// Async error wrapper
var asyncHandler = function (fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
// 404 handler
var notFoundHandler = function (req, res) {
    res.status(404).json({
        error: 'Endpoint not found',
        code: 'NOT_FOUND',
        path: req.path,
        method: req.method
    });
};
exports.notFoundHandler = notFoundHandler;
