"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireOfficer = exports.requireCitizen = exports.requireRole = void 0;
var user_1 = require("../../types/user");
var requireRole = function (role) {
    return function (req, res, next) {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (req.user.role !== role) {
            return res.status(403).json({
                success: false,
                message: "".concat(role, " role required")
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireCitizen = (0, exports.requireRole)(user_1.UserRole.CITIZEN);
exports.requireOfficer = (0, exports.requireRole)(user_1.UserRole.OFFICER);
exports.requireAdmin = (0, exports.requireRole)(user_1.UserRole.ADMIN);
