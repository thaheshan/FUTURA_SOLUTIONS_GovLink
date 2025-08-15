import { GridFSBucket, ObjectId } from 'mongodb';
import { getGridFSBucket } from '../../config/database';
import * as crypto from 'crypto';
import config from '../../config/environment';

// Optional imports with fallbacks
let sharp: any;
let uuidv4: any;

try {
  sharp = require('sharp');
} catch (error) {
  console.warn('Sharp not available - image compression disabled');
}

try {
  const uuid = require('uuid');
  uuidv4 = uuid.v4;
} catch (error) {
  // Fallback UUID generator
  uuidv4 = () => 'xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Define Multer file interface
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface FileMetadata {
  originalName: string;
  mimeType: string;
  size: number;
  hash: string;
  uploadDate: Date;
  uploadedBy: string;
  applicationId?: string;
  documentType?: string;
  isPublic: boolean;
}

export class FileService {
  private static instance: FileService;
  private bucket: GridFSBucket;
  
  public static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }
  
  constructor() {
    this.bucket = getGridFSBucket();
  }
  
  public validateFileType(mimeType: string): boolean {
    return config.ALLOWED_FILE_TYPES.includes(mimeType);
  }
  
  public validateFileSize(size: number): boolean {
    return size <= config.MAX_FILE_SIZE;
  }
  
  public async compressImage(buffer: Buffer, quality: number = 85): Promise<Buffer> {
    if (!sharp) {
      console.warn('Sharp not available - returning original image');
      return buffer;
    }
    
    try {
      return await sharp(buffer)
        .resize(1920, 1080, { 
          fit: 'inside', 
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality,
          progressive: true,
          mozjpeg: true
        })
        .toBuffer();
    } catch (error) {
      console.error('Image compression failed:', error);
      return buffer; // Return original if compression fails
    }
  }
  
  public async uploadDocument(
    file: MulterFile,
    uploadedBy: string,
    metadata: Partial<FileMetadata> = {}
  ): Promise<string> {
    // Validate file type
    if (!this.validateFileType(file.mimetype)) {
      throw new Error(`Invalid file type. Allowed types: ${config.ALLOWED_FILE_TYPES.join(', ')}`);
    }
    
    // Validate file size
    if (!this.validateFileSize(file.size)) {
      throw new Error(`File size exceeds ${config.MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }
    
    // Process file buffer
    let processedBuffer = file.buffer;
    
    // Compress images
    if (file.mimetype.startsWith('image/')) {
      processedBuffer = await this.compressImage(file.buffer);
    }
    
    // Generate unique filename
    const filename = `${uuidv4()}-${file.originalname}`;
    
    // Calculate file hash for integrity
    const fileHash = crypto.createHash('sha256').update(processedBuffer).digest('hex');
    
    // Prepare metadata
    const fileMetadata: FileMetadata = {
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: processedBuffer.length,
      hash: fileHash,
      uploadDate: new Date(),
      uploadedBy,
      isPublic: false,
      ...metadata
    };
    
    // Upload to GridFS
    const uploadStream = this.bucket.openUploadStream(filename, {
      metadata: fileMetadata
    });
    
    return new Promise((resolve, reject) => {
      uploadStream.end(processedBuffer);
      
      uploadStream.on('finish', () => {
        resolve(uploadStream.id.toString());
      });
      
      uploadStream.on('error', (error) => {
        reject(new Error(`File upload failed: ${error.message}`));
      });
    });
  }
  
  public async downloadFile(fileId: string, userId?: string): Promise<{
    stream: NodeJS.ReadableStream;
    metadata: any;
  }> {
    try {
      const objectId = new ObjectId(fileId);
      
      // Get file metadata first
      const file = await this.bucket.find({ _id: objectId }).next();
      
      if (!file) {
        throw new Error('File not found');
      }
      
      // Check access permissions
      if (!file.metadata.isPublic && userId && file.metadata.uploadedBy !== userId) {
        // Additional permission checks can be implemented here
        // For now, allow access if user is provided
      }
      
      const downloadStream = this.bucket.openDownloadStream(objectId);
      
      return {
        stream: downloadStream,
        metadata: file.metadata
      };
      
    } catch (error) {
      throw new Error(`File download failed: ${error.message}`);
    }
  }
  
  public async getFileMetadata(fileId: string): Promise<any> {
    try {
      const objectId = new ObjectId(fileId);
      const file = await this.bucket.find({ _id: objectId }).next();
      
      if (!file) {
        throw new Error('File not found');
      }
      
      return {
        id: file._id,
        filename: file.filename,
        ...file.metadata
      };
      
    } catch (error) {
      throw new Error(`Failed to get file metadata: ${error.message}`);
    }
  }
  
  public async deleteFile(fileId: string): Promise<void> {
    try {
      const objectId = new ObjectId(fileId);
      await this.bucket.delete(objectId);
    } catch (error) {
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }
  
  public async verifyFileIntegrity(fileId: string): Promise<boolean> {
    try {
      const { stream, metadata } = await this.downloadFile(fileId);
      
      const chunks: Buffer[] = [];
      
      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        stream.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const currentHash = crypto.createHash('sha256').update(buffer).digest('hex');
          resolve(currentHash === metadata.hash);
        });
        
        stream.on('error', reject);
      });
      
    } catch (error) {
      console.error('File integrity verification failed:', error);
      return false;
    }
  }
  
  public async listUserFiles(userId: string, page: number = 1, limit: number = 20): Promise<{
    files: any[];
    pagination: any;
  }> {
    const skip = (page - 1) * limit;
    
    const cursor = this.bucket.find({ 'metadata.uploadedBy': userId })
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit + 1); // Get one extra to check if there's a next page
    
    const files = await cursor.toArray();
    const hasNext = files.length > limit;
    
    if (hasNext) {
      files.pop(); // Remove the extra file
    }
    
    return {
      files: files.map(file => ({
        id: file._id,
        filename: file.filename,
        ...file.metadata
      })),
      pagination: {
        current: page,
        hasNext,
        hasPrev: page > 1
      }
    };
  }
}

export const fileService = FileService.getInstance();