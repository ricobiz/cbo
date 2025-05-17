
import { externalAPIService } from "./ExternalAPIService";

// Re-export types correctly using 'export type'
export type { 
  ActionVerification, 
  BrowserUseAction, 
  BrowserUseResponse, 
  OpenRouterResponse, 
  ImageGenerationParams, 
  ImageGenerationResult,
  AudioGenerationParams,
  AudioGenerationResult,
  CommandAnalysisResult
} from "./types";

export default externalAPIService;
