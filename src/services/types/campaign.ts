
/**
 * Types for Campaign Management
 */

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed';

export type CampaignType = 'promotion' | 'trend' | 'brand' | 'engagement' | 'custom';

export type CampaignPlatform = 'youtube' | 'spotify' | 'instagram' | 'tiktok' | 'facebook' | 'twitter' | 'telegram' | 'all';

export type CampaignMetric = {
  name: string;
  value: number;
  change?: number; // Percentage change
  target?: number; // Target value
};

export type CampaignAction = {
  id: string;
  type: 'post' | 'view' | 'like' | 'comment' | 'share' | 'follow' | 'custom';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  scheduledFor?: string;
  completedAt?: string;
  platform: CampaignPlatform;
  details: Record<string, any>;
  results?: Record<string, any>;
};

export type Campaign = {
  id: string;
  name: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  platforms: CampaignPlatform[];
  startDate: string;
  endDate?: string;
  budget?: number;
  metrics: CampaignMetric[];
  tags: string[];
  actions: CampaignAction[];
  createdAt: string;
  updatedAt: string;
};

export type CampaignFilter = {
  status?: CampaignStatus[];
  type?: CampaignType[];
  platform?: CampaignPlatform[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
};
