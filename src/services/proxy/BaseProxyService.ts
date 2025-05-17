
import { ProxyStats, RotationConfig } from "./types";

export abstract class BaseProxyService {
  protected proxies: Map<string, ProxyStats> = new Map();
  protected blacklistedIps: Set<string> = new Set();
  protected apiKey: string | null = null;
  
  constructor() {}
  
  public setApiKey(key: string): void {
    this.apiKey = key;
    this.loadProxies(); // Load proxies when API key is set
  }
  
  protected abstract loadProxies(): Promise<void>;
  
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

  protected updateProxyLastUsed(ip: string): void {
    if (!this.proxies.has(ip)) return;
    
    const stats = this.proxies.get(ip)!;
    stats.lastUsed = new Date();
    this.proxies.set(ip, stats);
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
