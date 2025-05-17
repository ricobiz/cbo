
/**
 * Types for Bot Management
 */

export type BotType = 'content' | 'interaction' | 'view' | 'parser' | 'custom';

export type BotStatus = 'idle' | 'running' | 'paused' | 'error' | 'setup-required';

export type BotPlatform = 'youtube' | 'spotify' | 'instagram' | 'tiktok' | 'facebook' | 'twitter' | 'telegram' | 'multi';

export type BotHealthStatus = 'healthy' | 'warning' | 'critical' | 'unknown';

export type BotProxyStatus = 'active' | 'inactive' | 'expired' | 'unknown';

export type BotActivity = {
  id: string;
  type: 'start' | 'stop' | 'action' | 'error' | 'config';
  description: string;
  timestamp: string;
  details?: Record<string, any>;
};

export type BotConsumption = {
  cpu: number; // Percentage 0-100
  memory: number; // MB
  network: number; // KB/s
  quota: number; // Percentage of quota used 0-100
};

export type BotAction = {
  id: string;
  type: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  target?: string;
  details?: Record<string, any>;
};

export type BotConfig = {
  maxActions: number;
  targetUrls?: string[];
  templates?: Record<string, string>;
  proxy?: {
    type: 'http' | 'socks' | 'none';
    url?: string;
  };
  schedule?: {
    active: boolean;
    times?: {
      start: string; // HH:MM format
      end: string; // HH:MM format
      days: number[]; // 0-6, 0 is Sunday
    }[];
  };
  advancedSettings?: Record<string, any>;
};

export type Bot = {
  id: string;
  name: string;
  type: BotType;
  platform: BotPlatform;
  status: BotStatus;
  health: BotHealthStatus;
  proxyStatus: BotProxyStatus;
  description?: string;
  avatar?: string;
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
  consumption: BotConsumption;
  activity: BotActivity[];
  actions: BotAction[];
  config: BotConfig;
  associatedCampaignIds?: string[];
};

export type BotFilter = {
  type?: BotType[];
  platform?: BotPlatform[];
  status?: BotStatus[];
  health?: BotHealthStatus[];
  search?: string;
};
