export interface IRegisterRequest {
  email: string;
  mobile: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface ILoginRequest {
  identifier: string; // email or mobile
  password: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    email: string;
    mobile: string;
    firstName: string;
    lastName: string;
    role: string;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface IOTP {
  _id?: string;
  userId: string;
  code: string;
  type: OTPType;
  isUsed: boolean;
  expiresAt: Date;
  createdAt?: Date;
}

export enum OTPType {
  EMAIL_VERIFICATION = 'email_verification',
  MOBILE_VERIFICATION = 'mobile_verification',
  PASSWORD_RESET = 'password_reset'
}

export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}