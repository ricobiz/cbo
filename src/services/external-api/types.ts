

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
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
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
  metricValue?: number; // Adding the metricValue property that was missing
}

// Command Analysis Types
export interface CommandAnalysisResult {
  platform?: string;
  action?: string;
  count?: number;
  url?: string;
  parameters?: Record<string, any>;
}

// Platform URL Types
export interface PlatformUrlMap {
  [key: string]: string;
}

