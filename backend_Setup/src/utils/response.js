"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
var sendSuccess = function (res, message, data, statusCode, meta) {
    if (statusCode === void 0) { statusCode = 200; }
    var response = __assign(__assign({ success: true, message: message }, (data && { data: data })), (meta && { meta: meta }));
    res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
var sendError = function (res, message, statusCode, error) {
    if (statusCode === void 0) { statusCode = 400; }
    var response = __assign({ success: false, message: message }, (error && { error: error }));
    res.status(statusCode).json(response);
};
exports.sendError = sendError;
