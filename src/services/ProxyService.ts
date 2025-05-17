
interface ProxyStats {
  ip: string;
  location: string;
  latency: number;
  successRate: number;
  lastUsed: Date;
  blacklisted: boolean;
}

export type ProxyProvider = 'luminati' | 'smartproxy' | 'oxylabs' | 'brightdata' | 'custom';

interface RotationConfig {
  frequency: number; // minutes
  checkReputation: boolean;
  avoidFlagged: boolean;
  autoRetry: boolean;
  regions: string[];
}

class ProxyService {
  private proxies: Map<string, ProxyStats> = new Map();
  private blacklistedIps: Set<string> = new Set();
  private currentProvider: ProxyProvider = 'luminati';
  private rotationConfig: RotationConfig = {
    frequency: 60,
    checkReputation: true,
    avoidFlagged: true,
    autoRetry: true,
    regions: ['us', 'ca', 'uk', 'au']
  };
  private apiKey: string | null = null;

  constructor() {
    // Initialize with real proxies later
  }
  
  public setApiKey(key: string): void {
    this.apiKey = key;
    this.loadProxies(); // Load proxies when API key is set
  }
  
  private async loadProxies(): Promise<void> {
    if (!this.apiKey) {
      console.error("API key not set");
      return;
    }
    
    try {
      // Call proxy provider API to get available proxies
      // This implementation will depend on the specific provider API
      
      switch (this.currentProvider) {
        case 'luminati':
          await this.fetchLuminatiProxies();
          break;
        case 'smartproxy':
          await this.fetchSmartproxyProxies();
          break;
        case 'oxylabs':
          await this.fetchOxylabsProxies();
          break;
        case 'brightdata':
          await this.fetchBrightdataProxies();
          break;
        case 'custom':
          // Custom proxies should be loaded manually
          break;
      }
    } catch (error) {
      console.error("Failed to load proxies:", error);
    }
  }
  
  private async fetchLuminatiProxies(): Promise<void> {
    if (!this.apiKey) return;
    
    try {
      // Example implementation - replace with actual API call to Luminati
      const response = await fetch('https://luminati.io/api/get_proxies', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Luminati proxies: ${response.status}`);
      }
      
      const proxiesData = await response.json();
      
      // Parse and store proxies
      if (proxiesData.proxies && Array.isArray(proxiesData.proxies)) {
        proxiesData.proxies.forEach((proxy: any) => {
          this.proxies.set(proxy.ip, {
            ip: proxy.ip,
            location: proxy.country + (proxy.city ? ` (${proxy.city})` : ''),
            latency: proxy.response_time || 100,
            successRate: proxy.success_rate || 0.9,
            lastUsed: new Date(0), // Never used
            blacklisted: false
          });
        });
      }
    } catch (error) {
      console.error('Error fetching Luminati proxies:', error);
    }
  }
  
  private async fetchSmartproxyProxies(): Promise<void> {
    // Implementation for Smartproxy API
  }
  
  private async fetchOxylabsProxies(): Promise<void> {
    // Implementation for Oxylabs API
  }
  
  private async fetchBrightdataProxies(): Promise<void> {
    // Implementation for Brightdata API
  }

  public async addCustomProxy(ip: string, port: number, username?: string, password?: string): Promise<void> {
    // Format and validate the proxy
    const proxyIp = `${ip}:${port}`;
    
    // Store in the proxies map
    this.proxies.set(proxyIp, {
      ip: proxyIp,
      location: 'Custom',
      latency: 100, // Default value
      successRate: 1.0, // Assume 100% initially
      lastUsed: new Date(0), // Never used
      blacklisted: false
    });
  }

  public async getHealthyProxy(): Promise<string | null> {
    // If no proxies available, try to load them
    if (this.proxies.size === 0) {
      await this.loadProxies();
    }
    
    // Get a proxy that's not blacklisted and has good stats
    const healthyProxies = Array.from(this.proxies.entries())
      .filter(([_, stats]) => !stats.blacklisted && stats.successRate > 0.8)
      .sort((a, b) => a[1].latency - b[1].latency);
    
    if (healthyProxies.length === 0) {
      console.error("No healthy proxies available");
      return null;
    }

    const proxyIp = healthyProxies[0][0];
    this.updateProxyLastUsed(proxyIp);
    return proxyIp;
  }

  public async rotateIp(botId: string): Promise<string | null> {
    // Get a new healthy proxy
    const proxy = await this.getHealthyProxy();
    
    if (!proxy) {
      console.error(`Failed to rotate IP for bot ${botId}`);
      return null;
    }
    
    console.log(`Rotated IP for bot ${botId} to ${proxy}`);
    return proxy;
  }

  public blacklistIp(ip: string): void {
    if (this.proxies.has(ip)) {
      const stats = this.proxies.get(ip)!;
      stats.blacklisted = true;
      this.proxies.set(ip, stats);
    }
    this.blacklistedIps.add(ip);
  }

  public updateProxySuccessRate(ip: string, success: boolean): void {
    if (!this.proxies.has(ip)) return;
    
    const stats = this.proxies.get(ip)!;
    // Simple exponential moving average
    stats.successRate = stats.successRate * 0.9 + (success ? 0.1 : 0);
    this.proxies.set(ip, stats);
  }

  public async testProxyLatency(ip: string): Promise<number> {
    if (!this.proxies.has(ip)) {
      return -1; // Invalid proxy
    }
    
    try {
      const startTime = Date.now();
      
      // Perform a simple HTTP request through the proxy to measure latency
      // This is a placeholder - implement with actual proxy testing logic
      await fetch('https://api.ipify.org', {
        method: 'GET',
        // Add proxy configuration based on your fetch implementation
      });
      
      const latency = Date.now() - startTime;
      
      // Update latency in proxy stats
      const stats = this.proxies.get(ip)!;
      stats.latency = latency;
      this.proxies.set(ip, stats);
      
      return latency;
    } catch (error) {
      console.error(`Failed to test proxy ${ip}:`, error);
      this.updateProxySuccessRate(ip, false);
      return -1;
    }
  }

  private updateProxyLastUsed(ip: string): void {
    if (!this.proxies.has(ip)) return;
    
    const stats = this.proxies.get(ip)!;
    stats.lastUsed = new Date();
    this.proxies.set(ip, stats);
  }

  public updateRotationConfig(config: Partial<RotationConfig>): void {
    this.rotationConfig = { ...this.rotationConfig, ...config };
  }

  public getRotationConfig(): RotationConfig {
    return { ...this.rotationConfig };
  }

  public setProvider(provider: ProxyProvider): void {
    this.currentProvider = provider;
    this.loadProxies(); // Reload proxies when changing provider
  }

  public getProvider(): ProxyProvider {
    return this.currentProvider;
  }
  
  public getProxiesCount(): number {
    return this.proxies.size;
  }
  
  public getHealthyProxiesCount(): number {
    return Array.from(this.proxies.values())
      .filter(stats => !stats.blacklisted && stats.successRate > 0.8)
      .length;
  }
  
  public getBlacklistedCount(): number {
    return this.blacklistedIps.size;
  }
  
  public clearBlacklist(): void {
    this.blacklistedIps.clear();
    
    // Reset blacklisted flag for all proxies
    this.proxies.forEach((stats, ip) => {
      if (stats.blacklisted) {
        stats.blacklisted = false;
        this.proxies.set(ip, stats);
      }
    });
  }
}

// Create a singleton instance
export const proxyService = new ProxyService();
