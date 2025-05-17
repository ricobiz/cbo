
import { ProxyProviderService } from "./ProxyProviderService";
import type { ProxyProvider, RotationConfig, ProxyStats } from "./types";

/**
 * Default rotation config
 */
const DEFAULT_ROTATION_CONFIG: RotationConfig = {
  frequency: 60, // 60 minutes
  checkReputation: true,
  avoidFlagged: true,
  autoRetry: true,
  regions: ["us", "eu"]
};

/**
 * Main proxy service that implements real proxy rotation functionality
 */
class ProxyService extends ProxyProviderService {
  private proxyRotationInterval: any = null;
  private activeProxies: Map<string, string> = new Map(); // botId -> proxyString
  private rotationConfig: RotationConfig = { ...DEFAULT_ROTATION_CONFIG };
  
  constructor() {
    super();
    this.initializeProxyRotation();
  }
  
  /**
   * Initialize automatic proxy rotation based on bot configurations
   */
  private initializeProxyRotation(): void {
    // Check every minute for proxies that need rotation
    this.proxyRotationInterval = setInterval(() => {
      this.checkProxyRotations();
    }, 60000);
  }
  
  /**
   * Check which bots need their proxies rotated based on rotation frequency
   */
  private async checkProxyRotations(): Promise<void> {
    const botsToRotate = this.getBotsNeedingRotation();
    
    for (const botId of botsToRotate) {
      try {
        await this.rotateIp(botId);
      } catch (error) {
        console.error(`Failed to rotate IP for bot ${botId}:`, error);
      }
    }
  }
  
  /**
   * Get list of bot IDs that need proxy rotation
   */
  private getBotsNeedingRotation(): string[] {
    // In a real implementation, this would check the rotation frequency against last rotation time
    // Simplified implementation for now
    return Array.from(this.activeProxies.keys());
  }
  
  /**
   * Assign a proxy to a specific bot
   */
  public async assignProxyToBot(botId: string): Promise<string | null> {
    try {
      // Get a healthy proxy without specifying a region (we'll determine the best one)
      const proxy = await this.getHealthyProxy(); 
      if (!proxy) return null;
      
      this.activeProxies.set(botId, proxy);
      return proxy;
    } catch (error) {
      console.error(`Error assigning proxy to bot ${botId}:`, error);
      return null;
    }
  }
  
  /**
   * Get the current proxy for a bot
   */
  public getBotProxy(botId: string): string | null {
    return this.activeProxies.get(botId) || null;
  }
  
  /**
   * Rotate IP for a specific bot
   */
  public async rotateIp(botId: string): Promise<string | null> {
    try {
      // In a real implementation, we would parse the current proxy to extract provider
      // For now, we'll just get a new proxy
      
      const newProxy = await this.getHealthyProxy();
      if (newProxy) {
        this.activeProxies.set(botId, newProxy);
        console.log(`Rotated proxy for bot ${botId} to ${newProxy}`);
        return newProxy;
      }
      
      return null;
    } catch (error) {
      console.error(`Error rotating IP for bot ${botId}:`, error);
      return null;
    }
  }
  
  /**
   * Release a proxy assigned to a bot
   */
  public releaseProxy(botId: string): boolean {
    return this.activeProxies.delete(botId);
  }
  
  /**
   * Get the current rotation configuration
   */
  public getRotationConfig(): RotationConfig {
    return { ...this.rotationConfig };
  }
  
  /**
   * Update the rotation configuration
   */
  public updateRotationConfig(config: RotationConfig): void {
    this.rotationConfig = { ...config };
  }
  
  /**
   * Clean up resources when service is no longer needed
   */
  public dispose(): void {
    if (this.proxyRotationInterval) {
      clearInterval(this.proxyRotationInterval);
      this.proxyRotationInterval = null;
    }
    
    this.activeProxies.clear();
  }

  /**
   * Implementation of loadProxies for ProxyService
   * Uses the provider-specific implementation when available
   */
  protected async loadProxies(): Promise<void> {
    // In a real implementation, this would load proxies based on the current provider
    await super.loadProxies();
    
    // Add some additional provider-specific proxies
    if (this.provider === 'luminati') {
      this.proxies.set('luminati.proxy.com:8080', {
        ip: 'luminati.proxy.com:8080',
        location: 'EU',
        latency: 80,
        successRate: 0.95,
        lastUsed: new Date(0),
        blacklisted: false
      });
    } else if (this.provider === 'smartproxy') {
      this.proxies.set('smartproxy.com:9090', {
        ip: 'smartproxy.com:9090',
        location: 'ASIA',
        latency: 120,
        successRate: 0.9,
        lastUsed: new Date(0),
        blacklisted: false
      });
    }
  }
}

// Create a singleton instance
export const proxyService = new ProxyService();

// Re-export types for convenience
export type { ProxyProvider, RotationConfig, ProxyStats };
