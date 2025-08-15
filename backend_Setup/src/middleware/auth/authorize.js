"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = exports.authorize = void 0;
var authorize = function (allowedRoles) {
    return function (req, res, next) {
        var user = req.user;
        if (!user) {
            return res.status(401).json({
                error: 'Authentication required',
                code: 'NOT_AUTHENTICATED'
            });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                code: 'INSUFFICIENT_PERMISSIONS',
                required: allowedRoles,
                current: user.role
            });
        }
        next();
    };
};
exports.authorize = authorize;
var requirePermission = function (permission) {
    return function (req, res, next) {
        var user = req.user;
        if (!user) {
            return res.status(401).json({
                error: 'Authentication required',
                code: 'NOT_AUTHENTICATED'
            });
        }
        if (!user.permissions || !user.permissions.includes(permission)) {
            return res.status(403).json({
                error: 'Permission denied',
                code: 'PERMISSION_DENIED',
                required: permission
            });
        }
        next();
    };
};
exports.requirePermission = requirePermission;
