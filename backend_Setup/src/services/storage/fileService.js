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
exports.fileService = exports.FileService = void 0;
var mongodb_1 = require("mongodb");
var database_1 = require("../../config/database");
var crypto = require("crypto");
var environment_1 = require("../../config/environment");
// Optional imports with fallbacks
var sharp;
var uuidv4;
try {
    sharp = require('sharp');
}
catch (error) {
    console.warn('Sharp not available - image compression disabled');
}
try {
    var uuid = require('uuid');
    uuidv4 = uuid.v4;
}
catch (error) {
    // Fallback UUID generator
    uuidv4 = function () { return 'xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }); };
}
var FileService = /** @class */ (function () {
    function FileService() {
        this.bucket = (0, database_1.getGridFSBucket)();
    }
    FileService.getInstance = function () {
        if (!FileService.instance) {
            FileService.instance = new FileService();
        }
        return FileService.instance;
    };
    FileService.prototype.validateFileType = function (mimeType) {
        return environment_1.default.ALLOWED_FILE_TYPES.includes(mimeType);
    };
    FileService.prototype.validateFileSize = function (size) {
        return size <= environment_1.default.MAX_FILE_SIZE;
    };
    FileService.prototype.compressImage = function (buffer_1) {
        return __awaiter(this, arguments, void 0, function (buffer, quality) {
            var error_1;
            if (quality === void 0) { quality = 85; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!sharp) {
                            console.warn('Sharp not available - returning original image');
                            return [2 /*return*/, buffer];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, sharp(buffer)
                                .resize(1920, 1080, {
                                fit: 'inside',
                                withoutEnlargement: true
                            })
                                .jpeg({
                                quality: quality,
                                progressive: true,
                                mozjpeg: true
                            })
                                .toBuffer()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Image compression failed:', error_1);
                        return [2 /*return*/, buffer]; // Return original if compression fails
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FileService.prototype.uploadDocument = function (file_1, uploadedBy_1) {
        return __awaiter(this, arguments, void 0, function (file, uploadedBy, metadata) {
            var processedBuffer, filename, fileHash, fileMetadata, uploadStream;
            if (metadata === void 0) { metadata = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Validate file type
                        if (!this.validateFileType(file.mimetype)) {
                            throw new Error("Invalid file type. Allowed types: ".concat(environment_1.default.ALLOWED_FILE_TYPES.join(', ')));
                        }
                        // Validate file size
                        if (!this.validateFileSize(file.size)) {
                            throw new Error("File size exceeds ".concat(environment_1.default.MAX_FILE_SIZE / 1024 / 1024, "MB limit"));
                        }
                        processedBuffer = file.buffer;
                        if (!file.mimetype.startsWith('image/')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.compressImage(file.buffer)];
                    case 1:
                        processedBuffer = _a.sent();
                        _a.label = 2;
                    case 2:
                        filename = "".concat(uuidv4(), "-").concat(file.originalname);
                        fileHash = crypto.createHash('sha256').update(processedBuffer).digest('hex');
                        fileMetadata = __assign({ originalName: file.originalname, mimeType: file.mimetype, size: processedBuffer.length, hash: fileHash, uploadDate: new Date(), uploadedBy: uploadedBy, isPublic: false }, metadata);
                        uploadStream = this.bucket.openUploadStream(filename, {
                            metadata: fileMetadata
                        });
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                uploadStream.end(processedBuffer);
                                uploadStream.on('finish', function () {
                                    resolve(uploadStream.id.toString());
                                });
                                uploadStream.on('error', function (error) {
                                    reject(new Error("File upload failed: ".concat(error.message)));
                                });
                            })];
                }
            });
        });
    };
    FileService.prototype.downloadFile = function (fileId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var objectId, file, downloadStream, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        objectId = new mongodb_1.ObjectId(fileId);
                        return [4 /*yield*/, this.bucket.find({ _id: objectId }).next()];
                    case 1:
                        file = _a.sent();
                        if (!file) {
                            throw new Error('File not found');
                        }
                        // Check access permissions
                        if (!file.metadata.isPublic && userId && file.metadata.uploadedBy !== userId) {
                            // Additional permission checks can be implemented here
                            // For now, allow access if user is provided
                        }
                        downloadStream = this.bucket.openDownloadStream(objectId);
                        return [2 /*return*/, {
                                stream: downloadStream,
                                metadata: file.metadata
                            }];
                    case 2:
                        error_2 = _a.sent();
                        throw new Error("File download failed: ".concat(error_2.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FileService.prototype.getFileMetadata = function (fileId) {
        return __awaiter(this, void 0, void 0, function () {
            var objectId, file, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        objectId = new mongodb_1.ObjectId(fileId);
                        return [4 /*yield*/, this.bucket.find({ _id: objectId }).next()];
                    case 1:
                        file = _a.sent();
                        if (!file) {
                            throw new Error('File not found');
                        }
                        return [2 /*return*/, __assign({ id: file._id, filename: file.filename }, file.metadata)];
                    case 2:
                        error_3 = _a.sent();
                        throw new Error("Failed to get file metadata: ".concat(error_3.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FileService.prototype.deleteFile = function (fileId) {
        return __awaiter(this, void 0, void 0, function () {
            var objectId, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        objectId = new mongodb_1.ObjectId(fileId);
                        return [4 /*yield*/, this.bucket.delete(objectId)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        throw new Error("File deletion failed: ".concat(error_4.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FileService.prototype.verifyFileIntegrity = function (fileId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, stream_1, metadata_1, chunks_1, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.downloadFile(fileId)];
                    case 1:
                        _a = _b.sent(), stream_1 = _a.stream, metadata_1 = _a.metadata;
                        chunks_1 = [];
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                stream_1.on('data', function (chunk) {
                                    chunks_1.push(chunk);
                                });
                                stream_1.on('end', function () {
                                    var buffer = Buffer.concat(chunks_1);
                                    var currentHash = crypto.createHash('sha256').update(buffer).digest('hex');
                                    resolve(currentHash === metadata_1.hash);
                                });
                                stream_1.on('error', reject);
                            })];
                    case 2:
                        error_5 = _b.sent();
                        console.error('File integrity verification failed:', error_5);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FileService.prototype.listUserFiles = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, page, limit) {
            var skip, cursor, files, hasNext;
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        skip = (page - 1) * limit;
                        cursor = this.bucket.find({ 'metadata.uploadedBy': userId })
                            .sort({ uploadDate: -1 })
                            .skip(skip)
                            .limit(limit + 1);
                        return [4 /*yield*/, cursor.toArray()];
                    case 1:
                        files = _a.sent();
                        hasNext = files.length > limit;
                        if (hasNext) {
                            files.pop(); // Remove the extra file
                        }
                        return [2 /*return*/, {
                                files: files.map(function (file) { return (__assign({ id: file._id, filename: file.filename }, file.metadata)); }),
                                pagination: {
                                    current: page,
                                    hasNext: hasNext,
                                    hasPrev: page > 1
                                }
                            }];
                }
            });
        });
    };
    return FileService;
}());
exports.FileService = FileService;
exports.fileService = FileService.getInstance();
