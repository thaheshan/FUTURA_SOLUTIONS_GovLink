"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
var mongoose_1 = require("mongoose");
var auth_1 = require("../types/auth");
var OTPSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId, // 👈 bypass strict type
        ref: 'User',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(auth_1.OTPType),
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 } // MongoDB TTL
    }
}, {
    timestamps: true
});
// Index for faster queries
OTPSchema.index({ userId: 1, type: 1 });
exports.OTP = (0, mongoose_1.model)('OTP', OTPSchema);
