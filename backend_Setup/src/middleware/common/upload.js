"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleImageUpload = exports.documentUpload = void 0;
var multer = require('multer');
var environment_1 = require("../../config/environment");
var storage = multer.memoryStorage();
exports.documentUpload = multer({
    storage: storage,
    limits: {
        fileSize: environment_1.config.MAX_FILE_SIZE, // 5MB
        files: 10 // maximum 10 files
    },
    fileFilter: function (req, file, cb) {
        if (environment_1.config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Allowed types: ".concat(environment_1.config.ALLOWED_FILE_TYPES.join(', '))));
        }
    }
});
exports.singleImageUpload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB for images
        files: 1
    },
    fileFilter: function (req, file, cb) {
        var allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only JPEG, PNG images are allowed'));
        }
    }
});
