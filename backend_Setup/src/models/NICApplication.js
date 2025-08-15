"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NICApplication = void 0;
var mongoose_1 = require("mongoose");
var nicApplicationSchema = new mongoose_1.Schema({
    referenceNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    applicationType: {
        type: String,
        enum: ['new', 'renewal', 'replacement', 'correction'],
        required: true,
        index: true
    },
    personalInfo: {
        fullName: { type: String, required: true, trim: true },
        dateOfBirth: { type: Date, required: true },
        placeOfBirth: { type: String, required: true, trim: true },
        gender: {
            type: String,
            enum: ['male', 'female'],
            required: true
        },
        civilStatus: {
            type: String,
            enum: ['single', 'married', 'divorced', 'widowed'],
            required: true
        },
        nationality: { type: String, required: true, default: 'Sri Lankan' },
        address: {
            permanent: { type: String, required: true, trim: true },
            current: { type: String, required: true, trim: true },
            district: { type: String, required: true, index: true },
            province: { type: String, required: true, index: true }
        },
        phoneNumber: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true },
        emergencyContact: {
            name: { type: String, required: true, trim: true },
            relationship: { type: String, required: true, trim: true },
            phone: { type: String, required: true, trim: true }
        }
    },
    documents: [{
            fileName: { type: String, required: true },
            fileId: { type: String, required: true },
            documentType: { type: String, required: true },
            uploadDate: { type: Date, default: Date.now },
            verified: { type: Boolean, default: false },
            verifiedBy: String,
            verificationDate: Date
        }],
    status: {
        type: String,
        enum: ['submitted', 'under_review', 'document_verification', 'approved', 'rejected', 'ready_for_collection'],
        default: 'submitted',
        index: true
    },
    statusHistory: [{
            status: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            officerNotes: String,
            officerId: String,
            officerName: String
        }],
    assignedOfficer: {
        officerId: { type: String, index: true },
        officerName: String,
        assignedDate: Date
    },
    qrCode: { type: String, required: true },
    appointmentId: { type: String, index: true },
    priority: {
        type: String,
        enum: ['normal', 'urgent', 'express'],
        default: 'normal',
        index: true
    },
    fees: {
        baseFee: { type: Number, required: true, default: 500 },
        urgentFee: { type: Number, default: 0 },
        totalFee: { type: Number, required: true },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'refunded'],
            default: 'pending',
            index: true
        },
        paymentReference: String,
        paymentDate: Date
    },
    submissionDate: { type: Date, default: Date.now, index: true },
    expectedCompletionDate: Date,
    actualCompletionDate: Date,
    rejectionReason: String,
    collectionInfo: {
        collectionCenter: String,
        collectionDate: Date,
        collectedBy: String,
        collectionReference: String
    }
}, { timestamps: true });
// Compound indexes for efficient queries
nicApplicationSchema.index({ status: 1, submissionDate: -1 });
nicApplicationSchema.index({ 'personalInfo.address.district': 1, status: 1 });
nicApplicationSchema.index({ 'assignedOfficer.officerId': 1, status: 1 });
nicApplicationSchema.index({ priority: 1, submissionDate: 1 });
nicApplicationSchema.index({ 'fees.paymentStatus': 1, submissionDate: -1 });
exports.NICApplication = (0, mongoose_1.model)('NICApplication', nicApplicationSchema);
