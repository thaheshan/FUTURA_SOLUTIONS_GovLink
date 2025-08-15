import { createClient } from 'redis';
import config from './environment';

class RedisClient {
  private static instance: RedisClient;
  private client: any;
  
  private constructor() {}
  
  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }
  
  public async connect(): Promise<void> {
    try {
      this.client = createClient({
        socket: {
          host: config.REDIS_HOST,
          port: config.REDIS_PORT,
        },
        password: config.REDIS_PASSWORD || undefined,
        database: 0,
      });
      
      this.client.on('error', (error: any) => {
        console.error('❌ Redis connection error:', error);
      });
      
      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
      });
      
      this.client.on('ready', () => {
        console.log('✅ Redis ready for operations');
      });
      
      await this.client.connect();
      
    } catch (error) {
      console.error('❌ Redis connection failed:', error);
      // Don't exit process if Redis fails - continue without caching
    }
  }
  
  public getClient() {
    return this.client;
  }
  
  public async set(key: string, value: string, expireInSeconds?: number): Promise<void> {
    if (!this.client) return;
    
    try {
      if (expireInSeconds) {
        await this.client.setEx(key, expireInSeconds, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error('Redis SET error:', error);
    }
  }
  
  public async get(key: string): Promise<string | null> {
    if (!this.client) return null;
    
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }
  
  public async del(key: string): Promise<void> {
    if (!this.client) return;
    
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  }
  
  public async exists(key: string): Promise<boolean> {
    if (!this.client) return false;
    
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }
}

export const redisClient = RedisClient.getInstance();