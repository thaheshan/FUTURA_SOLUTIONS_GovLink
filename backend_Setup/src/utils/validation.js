"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.validationSchemas = void 0;
var Joi = require("joi");
exports.validationSchemas = {
    register: Joi.object({
        email: Joi.string().email().required(),
        mobile: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
        password: Joi.string().min(8).required(),
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        role: Joi.string().valid('citizen', 'officer', 'admin').optional()
    }),
    login: Joi.object({
        identifier: Joi.string().required(),
        password: Joi.string().required()
    }),
    verifyOTP: Joi.object({
        userId: Joi.string().required(),
        code: Joi.string().length(6).required(),
        type: Joi.string().valid('email_verification', 'mobile_verification', 'password_reset').required()
    }),
    refreshToken: Joi.object({
        refreshToken: Joi.string().required()
    }),
    forgotPassword: Joi.object({
        identifier: Joi.string().required()
    }),
    resetPassword: Joi.object({
        identifier: Joi.string().required(),
        otp: Joi.string().length(6).required(),
        newPassword: Joi.string().min(8).required()
    })
};
var validateRequest = function (schema) {
    return function (req, res, next) {
        var error = schema.validate(req.body).error;
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                details: error.details.map(function (detail) { return detail.message; })
            });
        }
        next();
    };
};
exports.validateRequest = validateRequest;
