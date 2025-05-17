
import { ExternalAPIService } from './ExternalAPIService';

// Create a singleton instance
export const externalAPIService = new ExternalAPIService();

// Re-export types
export type {
  ActionVerification,
  BrowserUseAction,
  BrowserUseResponse,
  CommandAnalysisResult,
  OpenRouterResponse
} from './types';
