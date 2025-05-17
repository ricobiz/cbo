
import { ProxyProviderService } from "./ProxyProviderService";
import type { ProxyProvider, RotationConfig, ProxyStats } from "./types";

/**
 * Main proxy service that implements real proxy rotation functionality
 */
class ProxyService extends ProxyProviderService {
  private proxyRotationInterval: any = null;
  private activeProxies: Map<string, string> = new Map(); // botId -> proxyString
  
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
  public async assignProxyToBot(botId: string, provider?: string, region?: string): Promise<string | null> {
    try {
      const proxy = await this.getHealthyProxy(provider, region);
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
      // Get the current provider and region if possible
      const currentProxy = this.getBotProxy(botId);
      let provider: string | undefined;
      let region: string | undefined;
      
      // In a real implementation, we would parse the current proxy to extract provider and region
      // For now, we'll just get a new proxy
      
      const newProxy = await this.getHealthyProxy(provider, region);
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
   * Clean up resources when service is no longer needed
   */
  public dispose(): void {
    if (this.proxyRotationInterval) {
      clearInterval(this.proxyRotationInterval);
      this.proxyRotationInterval = null;
    }
    
    this.activeProxies.clear();
  }
}

// Create a singleton instance
export const proxyService = new ProxyService();

// Re-export types for convenience
export type { ProxyProvider, RotationConfig, ProxyStats };
