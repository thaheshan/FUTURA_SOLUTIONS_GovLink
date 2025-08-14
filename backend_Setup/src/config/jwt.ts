import { config } from './environment';

export const jwtConfig = {
  secret: config.jwt.secret,
  refreshSecret: config.jwt.refreshSecret,
  expiresIn: config.jwt.expiresIn,
  refreshExpiresIn: config.jwt.refreshExpiresIn,
  
  // Token prefixes for Redis storage
  tokenBlacklistPrefix: 'blacklist:token:',
  refreshTokenPrefix: 'refresh:token:',
  
  // Algorithm
  algorithm: 'HS256' as const
};