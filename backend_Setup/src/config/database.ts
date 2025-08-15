import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import config from './environment';

let bucket: GridFSBucket;

class Database {
  private static instance: Database;
  
  private constructor() {}
  
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  
  public async connect(): Promise<void> {
    try {
      const mongoOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0,
      };
      
      const connection = await mongoose.connect(config.MONGODB_URI, mongoOptions);
      
      // Initialize GridFS bucket for file storage
      bucket = new GridFSBucket(connection.connection.db as any, { 
        bucketName: 'documents' 
      });
      
      console.log('✅ Database connected successfully');
      console.log('✅ GridFS bucket initialized');
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ Database connection error:', error);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('⚠️  Database disconnected');
      });
      
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }
  
  public getGridFSBucket(): GridFSBucket {
    if (!bucket) {
      throw new Error('GridFS bucket not initialized. Call connect() first.');
    }
    return bucket;
  }
  
  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log('📴 Database disconnected');
  }
}

export const database = Database.getInstance();
export const getGridFSBucket = () => database.getGridFSBucket();