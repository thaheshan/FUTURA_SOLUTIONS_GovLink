import config from './environment';

export const jwtConfig = {
  secret: config.JWT_SECRET,
  refreshSecret: config.JWT_REFRESH_SECRET,
  expiresIn: config.JWT_EXPIRE,
  refreshExpiresIn: config.JWT_REFRESH_EXPIRE,
  
  // Token prefixes for Redis storage
  tokenBlacklistPrefix: 'blacklist:token:',
  refreshTokenPrefix: 'refresh:token:',
  
  // Algorithm
  algorithm: 'HS256' as const
};