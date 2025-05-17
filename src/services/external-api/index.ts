
import { ExternalAPIService } from "./ExternalAPIService";

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
  CommandAnalysisResult,
  PlatformUrlMap,
  ApiResponse
} from "./types";

export default ExternalAPIService;
