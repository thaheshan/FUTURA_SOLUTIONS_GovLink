"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
var mongoose_1 = require("mongoose");
var appointmentSchema = new mongoose_1.Schema({
    applicationId: {
        type: String,
        required: true,
        index: true
    },
    applicationType: {
        type: String,
        enum: ['nic', 'passport', 'other'],
        required: true,
        index: true
    },
    applicantInfo: {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        phone: { type: String, required: true, trim: true },
        nicNumber: { type: String, trim: true }
    },
    officerInfo: {
        officerId: { type: String, required: true, index: true },
        officerName: { type: String, required: true, trim: true },
        department: { type: String, required: true, trim: true }
    },
    appointmentDetails: {
        date: { type: Date, required: true, index: true },
        timeSlot: { type: String, required: true },
        duration: { type: Number, default: 30 },
        venue: {
            name: { type: String, required: true },
            address: { type: String, required: true },
            roomNumber: String
        }
    },
    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled', 'no_show'],
        default: 'scheduled',
        index: true
    },
    purpose: {
        type: String,
        required: true,
        trim: true
    },
    notes: { type: String, trim: true },
    remindersSent: {
        twentyFourHour: { type: Boolean, default: false },
        twoHour: { type: Boolean, default: false },
        thirtyMinute: { type: Boolean, default: false }
    },
    rescheduleHistory: [{
            previousDate: Date,
            previousTimeSlot: String,
            reason: String,
            rescheduledBy: String,
            rescheduledAt: { type: Date, default: Date.now }
        }],
    checkInTime: Date,
    checkOutTime: Date,
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        submittedAt: Date
    },
    cancellationReason: String,
    cancelledBy: String,
    cancelledAt: Date
}, { timestamps: true });
// Compound indexes for performance
appointmentSchema.index({ 'appointmentDetails.date': 1, 'appointmentDetails.timeSlot': 1 });
appointmentSchema.index({ 'officerInfo.officerId': 1, 'appointmentDetails.date': 1 });
appointmentSchema.index({ status: 1, 'appointmentDetails.date': 1 });
appointmentSchema.index({ applicationType: 1, status: 1 });
exports.Appointment = (0, mongoose_1.model)('Appointment', appointmentSchema);
