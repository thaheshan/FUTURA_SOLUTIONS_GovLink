"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
var environment_1 = require("./environment");
exports.jwtConfig = {
    secret: environment_1.default.JWT_SECRET,
    refreshSecret: environment_1.default.JWT_REFRESH_SECRET,
    expiresIn: environment_1.default.JWT_EXPIRE,
    refreshExpiresIn: environment_1.default.JWT_REFRESH_EXPIRE,
    // Token prefixes for Redis storage
    tokenBlacklistPrefix: 'blacklist:token:',
    refreshTokenPrefix: 'refresh:token:',
    // Algorithm
    algorithm: 'HS256'
};
