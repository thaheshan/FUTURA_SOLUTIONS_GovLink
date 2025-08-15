"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Officer = void 0;
var mongoose_1 = require("mongoose");
var officerSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        ref: 'User'
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    specializations: [{
            type: String,
            required: true
        }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'on_leave'],
        default: 'active'
    },
    workload: {
        current: {
            type: Number,
            default: 0,
            min: 0
        },
        maximum: {
            type: Number,
            default: 50,
            min: 1
        }
    },
    performance: {
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        applicationsProcessed: {
            type: Number,
            default: 0,
            min: 0
        },
        averageProcessingTime: {
            type: Number,
            default: 0,
            min: 0
        },
        completionRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    availability: {
        monday: {
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' },
            available: { type: Boolean, default: true }
        },
        tuesday: {
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' },
            available: { type: Boolean, default: true }
        },
        wednesday: {
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' },
            available: { type: Boolean, default: true }
        },
        thursday: {
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' },
            available: { type: Boolean, default: true }
        },
        friday: {
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' },
            available: { type: Boolean, default: true }
        },
        saturday: {
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' },
            available: { type: Boolean, default: false }
        },
        sunday: {
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' },
            available: { type: Boolean, default: false }
        }
    }
}, {
    timestamps: true
});
// Create indexes for better performance
officerSchema.index({ userId: 1 });
officerSchema.index({ employeeId: 1 });
officerSchema.index({ department: 1 });
officerSchema.index({ status: 1 });
officerSchema.index({ 'performance.rating': -1 });
exports.Officer = (0, mongoose_1.model)('Officer', officerSchema);
