type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
  component?: string;
}

class LoggingService {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  
  public debug(message: string, data?: any, component?: string): void {
    this.log('debug', message, data, component);
  }
  
  public info(message: string, data?: any, component?: string): void {
    this.log('info', message, data, component);
  }
  
  public warn(message: string, data?: any, component?: string): void {
    this.log('warn', message, data, component);
  }
  
  public error(message: string, data?: any, component?: string): void {
    this.log('error', message, data, component);
    
    // In a production app, we would send errors to a monitoring service like Sentry
    console.error(`[${component || 'Unknown'}]`, message, data);
  }
  
  private log(level: LogLevel, message: string, data?: any, component?: string): void {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      component,
      data
    };
    
    this.logs.unshift(logEntry);
    
    // Keep logs manageable
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
    
    // Output to console during development
    if (process.env.NODE_ENV !== 'production') {
      const consoleMethod = {
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error
      }[level] || console.log;
      
      consoleMethod(`[${level.toUpperCase()}] [${component || 'Unknown'}]`, message, data || '');
    }
  }
  
  public getLogs(level?: LogLevel, component?: string, limit?: number): LogEntry[] {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    if (component) {
      filteredLogs = filteredLogs.filter(log => log.component === component);
    }
    
    return filteredLogs.slice(0, limit || filteredLogs.length);
  }
  
  public clearLogs(): void {
    this.logs = [];
  }
}

// Singleton instance
export const logger = new LoggingService();
