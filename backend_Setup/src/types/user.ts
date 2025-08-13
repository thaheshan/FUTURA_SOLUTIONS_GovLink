export interface IUser {
  _id?: string;
  email: string;
  mobile: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserRole {
  CITIZEN = 'citizen',
  OFFICER = 'officer',
  ADMIN = 'admin'
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthTokens(): Promise<{ accessToken: string; refreshToken: string }>;
}

export type UserDocument = IUser & IUserMethods;


