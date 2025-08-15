const { body, param, query, validationResult } = require('express-validator');
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User Registration Validation
export const validateUserRegistration = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phoneNumber').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Valid phone number is required'),
  body('fullName').isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),
  handleValidationErrors
];

// NIC Application Validation
export const validateNICApplication = [
  body('applicationType').isIn(['new', 'renewal', 'replacement', 'correction']).withMessage('Invalid application type'),
  body('personalInfo.fullName').isLength({ min: 2, max: 100 }).withMessage('Full name is required'),
  body('personalInfo.dateOfBirth').isISO8601().toDate().withMessage('Valid date of birth is required'),
  body('personalInfo.placeOfBirth').notEmpty().withMessage('Place of birth is required'),
  body('personalInfo.gender').isIn(['male', 'female']).withMessage('Valid gender is required'),
  body('personalInfo.address.permanent').isLength({ min: 10, max: 500 }).withMessage('Permanent address is required'),
  body('personalInfo.address.current').isLength({ min: 10, max: 500 }).withMessage('Current address is required'),
  body('personalInfo.address.district').notEmpty().withMessage('District is required'),
  body('personalInfo.phoneNumber').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Valid phone number is required'),
  body('personalInfo.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('personalInfo.emergencyContact.name').notEmpty().withMessage('Emergency contact name is required'),
  body('personalInfo.emergencyContact.phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Valid emergency contact phone is required'),
  handleValidationErrors
];

// Appointment Booking Validation
export const validateAppointmentBooking = [
  body('applicationId').notEmpty().withMessage('Application ID is required'),
  body('applicationType').isIn(['nic', 'passport', 'other']).withMessage('Valid application type is required'),
  body('applicantInfo.name').isLength({ min: 2, max: 100 }).withMessage('Applicant name is required'),
  body('applicantInfo.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('applicantInfo.phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Valid phone number is required'),
  body('officerInfo.officerId').notEmpty().withMessage('Officer ID is required'),
  body('appointmentDetails.date').isISO8601().toDate().withMessage('Valid appointment date is required'),
  body('appointmentDetails.timeSlot').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time slot is required'),
  body('purpose').isLength({ min: 5, max: 200 }).withMessage('Purpose must be 5-200 characters'),
  handleValidationErrors
];

// Service Creation Validation
export const validateServiceCreation = [
  body('name').isLength({ min: 2, max: 200 }).withMessage('Service name must be 2-200 characters'),
  body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('category').notEmpty().withMessage('Category is required'),
  body('district').notEmpty().withMessage('District is required'),
  body('processingTime').notEmpty().withMessage('Processing time is required'),
  body('fees').isNumeric().isFloat({ min: 0 }).withMessage('Fees must be a non-negative number'),
  body('requirements').isArray().withMessage('Requirements must be an array'),
  body('documents').isArray().withMessage('Documents must be an array'),
  body('departmentCode').notEmpty().withMessage('Department code is required'),
  handleValidationErrors
];

// Officer Creation Validation
export const validateOfficerCreation = [
  body('employeeId').isLength({ min: 3, max: 20 }).withMessage('Employee ID must be 3-20 characters'),
  body('department').notEmpty().withMessage('Department is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('specializations').isArray().withMessage('Specializations must be an array'),
  handleValidationErrors
];