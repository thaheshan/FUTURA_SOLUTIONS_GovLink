"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGridFSBucket = exports.database = void 0;
var mongoose_1 = require("mongoose");
var mongodb_1 = require("mongodb");
var environment_1 = require("./environment");
var bucket;
var Database = /** @class */ (function () {
    function Database() {
    }
    Database.getInstance = function () {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    };
    Database.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mongoOptions, connection, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        mongoOptions = {
                            maxPoolSize: 10,
                            serverSelectionTimeoutMS: 5000,
                            socketTimeoutMS: 45000,
                            bufferCommands: false,
                            bufferMaxEntries: 0,
                        };
                        return [4 /*yield*/, mongoose_1.default.connect(environment_1.default.MONGODB_URI, mongoOptions)];
                    case 1:
                        connection = _a.sent();
                        // Initialize GridFS bucket for file storage
                        bucket = new mongodb_1.GridFSBucket(connection.connection.db, {
                            bucketName: 'documents'
                        });
                        console.log('✅ Database connected successfully');
                        console.log('✅ GridFS bucket initialized');
                        // Handle connection events
                        mongoose_1.default.connection.on('error', function (error) {
                            console.error('❌ Database connection error:', error);
                        });
                        mongoose_1.default.connection.on('disconnected', function () {
                            console.log('⚠️  Database disconnected');
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('❌ Database connection failed:', error_1);
                        process.exit(1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Database.prototype.getGridFSBucket = function () {
        if (!bucket) {
            throw new Error('GridFS bucket not initialized. Call connect() first.');
        }
        return bucket;
    };
    Database.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mongoose_1.default.disconnect()];
                    case 1:
                        _a.sent();
                        console.log('📴 Database disconnected');
                        return [2 /*return*/];
                }
            });
        });
    };
    return Database;
}());
exports.database = Database.getInstance();
var getGridFSBucket = function () { return exports.database.getGridFSBucket(); };
exports.getGridFSBucket = getGridFSBucket;
