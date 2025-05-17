
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

  constructor() {
    // Initialize with some dummy data
    this.proxies.set('104.28.42.16', {
      ip: '104.28.42.16',
      location: 'United States (New York)',
      latency: 45,
      successRate: 0.98,
      lastUsed: new Date(),
      blacklisted: false
    });
  }

  public async getHealthyProxy(): Promise<string | null> {
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
    // Simulate IP rotation
    return this.getHealthyProxy();
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
  }

  public getProvider(): ProxyProvider {
    return this.currentProvider;
  }
}

// Create a singleton instance
export const proxyService = new ProxyService();
