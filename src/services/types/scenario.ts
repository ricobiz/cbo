
/**
 * Types for Scenario Management
 */

import { BotType, BotPlatform } from "./bot";
import { CampaignType } from "./campaign";

export type ScenarioStatus = 'draft' | 'ready' | 'running' | 'completed' | 'failed' | 'paused';

export type ScenarioStep = {
  id: string;
  name: string;
  type: 'bot-action' | 'content-generation' | 'wait' | 'condition' | 'campaign' | 'notification';
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
  config: Record<string, any>;
  dependsOn?: string[]; // IDs of steps that must be completed before this step
  timeout?: number; // Timeout in seconds
  retryCount?: number; // Number of retries if step fails
  results?: Record<string, any>; // Results after execution
};

export type ScenarioVariable = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  value: any;
  description?: string;
};

export type ScenarioTrigger = {
  type: 'scheduled' | 'manual' | 'event' | 'webhook';
  config: Record<string, any>;
  active: boolean;
};

export type ScenarioPermission = {
  user: string;
  access: 'view' | 'edit' | 'execute' | 'admin';
};

export type ScenarioCategory = 'growth' | 'engagement' | 'monitoring' | 'content' | 'conversion' | 'custom';

export type Scenario = {
  id: string;
  name: string;
  description?: string;
  status: ScenarioStatus;
  category: ScenarioCategory;
  steps: ScenarioStep[];
  variables: ScenarioVariable[];
  triggers: ScenarioTrigger[];
  permissions: ScenarioPermission[];
  platforms: BotPlatform[];
  botTypes?: BotType[];
  campaignTypes?: CampaignType[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  nextRun?: string;
  tags: string[];
};

export type ScenarioFilter = {
  status?: ScenarioStatus[];
  category?: ScenarioCategory[];
  platform?: BotPlatform[];
  search?: string;
  tags?: string[];
};

export type ScenarioTemplate = {
  id: string;
  name: string;
  description: string;
  category: ScenarioCategory;
  platforms: BotPlatform[];
  previewImage?: string;
  complexity: 'simple' | 'medium' | 'advanced';
  estimatedDuration: string; // e.g. "2 hours", "3 days"
  steps: Omit<ScenarioStep, 'id' | 'status' | 'results'>[];
};
