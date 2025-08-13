import { CorsOptions } from 'cors';
import { config } from './environment';

const allowedOrigins = config.nodeEnv === 'production' 
  ? ['https://yourapp.com', 'https://www.yourapp.com']
  : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400 // 24 hours
};