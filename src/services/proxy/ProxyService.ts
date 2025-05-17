
import { ProxyProviderService } from "./ProxyProviderService";
import type { ProxyProvider, RotationConfig } from "./types";

/**
 * Main proxy service that will be used throughout the application.
 * This is a facade for the ProxyProviderService.
 */
class ProxyService extends ProxyProviderService {
  constructor() {
    super();
    // Any additional initialization
  }
}

// Create a singleton instance
export const proxyService = new ProxyService();

// Re-export types for convenience
export type { ProxyProvider, RotationConfig };
