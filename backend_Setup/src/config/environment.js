"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var dotenv = require("dotenv");
dotenv.config();
exports.config = {
    // Server Configuration
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000'),
    // Database Configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/shakthi_gov',
    // Redis Configuration
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379'),
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d',
    // Email Configuration
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    // SMS Configuration (Twilio)
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
    // Frontend Configuration
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    // File Upload Configuration
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    ALLOWED_FILE_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
    // Rate Limiting
    RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    // API Configuration
    API_VERSION: process.env.API_VERSION || 'v1'
};
exports.default = exports.config;
