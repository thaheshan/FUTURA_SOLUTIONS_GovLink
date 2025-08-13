import { config } from '../config/environment';

export class Logger {
  private static formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaString}`;
  }

  public static info(message: string, meta?: any): void {
    console.log(this.formatMessage('info', message, meta));
  }

  public static error(message: string, error?: any): void {
    const errorMeta = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    console.error(this.formatMessage('error', message, errorMeta));
  }

  public static warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('warn', message, meta));
  }

  public static debug(message: string, meta?: any): void {
    if (config.nodeEnv === 'development') {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
}