import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: any;
}

export const sendSuccess = <T>(
  res: Response, 
  message: string, 
  data?: T, 
  statusCode: number = 200,
  meta?: any
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    ...(data && { data }),
    ...(meta && { meta })
  };
  
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response, 
  message: string, 
  statusCode: number = 400,
  error?: string
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(error && { error })
  };
  
  res.status(statusCode).json(response);
};