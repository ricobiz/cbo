
// Base type for API responses
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Audio Generation Types
export interface AudioGenerationParams {
  text: string;
  voice: string;
  format?: string;
  speed?: number;
}

export interface AudioGenerationResult {
  url: string;
  duration?: number;
  format?: string;
  text?: string; // Добавлено поле для совместимости с мок данными
}

// Image Generation Types
export interface ImageGenerationParams {
  prompt: string;
  size?: string;
  style?: string;
  negativePrompt?: string;
  count?: number;
}

export interface ImageGenerationResult {
  url: string;
  width: number;
  height: number;
  seed?: number;
  prompt?: string; // Добавлено поле для совместимости с мок данными
}

// OpenRouter API Types
export interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    index: number;
    finish_reason: string;
  }[];
  created: number;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  object?: string; // Добавлено поле для совместимости с мок данными
}

// Browser Use API Types
export interface BrowserUseAction {
  type: 'navigate' | 'click' | 'type' | 'screenshot' | 'wait' | 'extract' | 'register' | 'login';
  params: Record<string, any>;
}

export interface BrowserUseResponse {
  success: boolean;
  sessionId: string;
  action: string;
  result: {
    status: 'completed' | 'failed' | 'in_progress';
    message: string;
    data?: any;
  };
  message?: string; // Добавлено поле для совместимости с мок данными
}

// Action Verification Types
export interface ActionVerification {
  platform: string;
  contentId: string;
  metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment';
  timestamp: string;
  verified: boolean;
  metrics?: {
    before: number;
    after: number;
  };
  error?: string;
  metricValue?: number;
}

// Command Analysis Types
export interface CommandAnalysisResult {
  platform?: string;
  action?: string;
  count?: number;
  url?: string | null;
  additionalParams?: Record<string, any>; // Добавлено поле для совместимости с мок данными
}

// Platform URL Types
export interface PlatformUrlMap {
  [key: string]: string;
}

// Дополнительные типы для совместимости с основным приложением
export interface BotTypeResponse {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  platforms: string[];
}

export interface BotConfigTemplate {
  id: string;
  name: string;
  description: string;
  config: Record<string, any>;
  botTypes: string[];
}

