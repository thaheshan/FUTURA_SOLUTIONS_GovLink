import { Schema, model, Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IUser, IUserMethods, UserRole } from '../types/user';
import { jwtService } from '../services/auth/jwtService';

const userSchema = new Schema<IUser & IUserMethods>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CITIZEN
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isMobileVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ mobile: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate auth tokens
userSchema.methods.generateAuthTokens = async function() {
  const accessToken = jwtService.generateAccessToken({
    userId: this._id.toString(),
    email: this.email,
    role: this.role
  });
  
  const refreshToken = jwtService.generateRefreshToken({
    userId: this._id.toString(),
    email: this.email,
    role: this.role
  });
  
  return { accessToken, refreshToken };
};

// Transform output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export const User = model<IUser & IUserMethods>('User', userSchema);