"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
var mongoose_1 = require("mongoose");
var refreshTokenSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 }
    },
    isRevoked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
exports.RefreshToken = (0, mongoose_1.model)('RefreshToken', refreshTokenSchema);
