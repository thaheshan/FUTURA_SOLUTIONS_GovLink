import { createClient, RedisClientType } from 'redis';
import { config } from './environment';

export class RedisClient {
  private static instance: RedisClient;
  private client: RedisClientType;

  private constructor() {
    this.client = createClient({
      url: config.redis.url,
      password: config.redis.password || undefined
    });

    this.client.on('error', (error) => {
      console.error('❌ Redis Client Error:', error);
    });

    this.client.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    this.client.on('disconnect', () => {
      console.log('⚠️  Redis disconnected');
    });
  }

  public static getInstance(): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient();
    }
    return RedisClient.instance;
  }

  public async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  // Utility methods
  public async set(key: string, value: string, expirationInSeconds?: number): Promise<void> {
    if (expirationInSeconds) {
      await this.client.setEx(key, expirationInSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  public async get(key: string): Promise<string | null> {
    const value = await this.client.get(key);
    if (typeof value === 'string') {
      return value;
    }
    return null;
  }

  public async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  public async exists(key: string): Promise<number> {
    return await this.client.exists(key);
  }
}