
export interface ProxyStats {
  ip: string;
  location: string;
  latency: number;
  successRate: number;
  lastUsed: Date;
  blacklisted: boolean;
}

export type ProxyProvider = 'luminati' | 'smartproxy' | 'oxylabs' | 'brightdata' | 'custom';

export interface RotationConfig {
  frequency: number; // minutes
  checkReputation: boolean;
  avoidFlagged: boolean;
  autoRetry: boolean;
  regions: string[];
}
