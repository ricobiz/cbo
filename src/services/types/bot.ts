
/**
 * Types for Bot Management
 */

export type BotType = 'content' | 'interaction' | 'view' | 'parser' | 'custom';

export type BotStatus = 'idle' | 'running' | 'paused' | 'error' | 'setup-required' | 'active';

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

// Add missing BotSchedule type
export type BotSchedule = {
  active: boolean;
  startTime?: string;
  endTime?: string;
  breakDuration?: [number, number];
  daysActive?: string[];
  times?: {
    start: string;
    end: string;
    days: number[];
  }[];
};

// Add missing BotProxy type
export type BotProxy = {
  useRotation?: boolean;
  rotationFrequency?: number;
  provider?: string;
  regions?: string[];
  type?: 'http' | 'socks' | 'none';
  url?: string;
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
  actionDelay?: [number, number];
  mouseMovement?: 'natural' | 'direct' | 'random';
  scrollPattern?: 'variable' | 'constant' | 'jump';
  randomnessFactor?: number;
  behaviorProfile?: string;
  sessionVariability?: number;
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
  lastRun?: string;
  createdAt: string;
  updatedAt: string;
  consumption: BotConsumption;
  activity: BotActivity[];
  actions: BotAction[];
  config: BotConfig;
  schedule?: BotSchedule;
  proxy?: BotProxy;
  logs?: Array<{time: string, message: string}>;
  healthPercentage?: number;
  ipAddress?: string;
  emailAccounts?: string[];
  associatedCampaignIds?: string[];
};

export type BotFilter = {
  type?: BotType[];
  platform?: BotPlatform[];
  status?: BotStatus[];
  health?: BotHealthStatus[];
  search?: string;
};
