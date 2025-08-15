const multer = require('multer');
import { config } from '../../config/environment';

const storage = multer.memoryStorage();

export const documentUpload = multer({
  storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE, // 5MB
    files: 10 // maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    if (config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${config.ALLOWED_FILE_TYPES.join(', ')}`));
    }
  }
});

export const singleImageUpload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB for images
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG images are allowed'));
    }
  }
});