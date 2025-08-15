"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var environment_1 = require("../config/environment");
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.formatMessage = function (level, message, meta) {
        var timestamp = new Date().toISOString();
        var metaString = meta ? " | ".concat(JSON.stringify(meta)) : '';
        return "[".concat(timestamp, "] [").concat(level.toUpperCase(), "]: ").concat(message).concat(metaString);
    };
    Logger.info = function (message, meta) {
        console.log(this.formatMessage('info', message, meta));
    };
    Logger.error = function (message, error) {
        var errorMeta = error instanceof Error
            ? { message: error.message, stack: error.stack }
            : error;
        console.error(this.formatMessage('error', message, errorMeta));
    };
    Logger.warn = function (message, meta) {
        console.warn(this.formatMessage('warn', message, meta));
    };
    Logger.debug = function (message, meta) {
        if (environment_1.config.nodeEnv === 'development') {
            console.debug(this.formatMessage('debug', message, meta));
        }
    };
    return Logger;
}());
exports.Logger = Logger;
