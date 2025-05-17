
import { apiService } from './ApiService';
import { API_CONFIG, CONNECTION_CHECK_INTERVAL, MAX_RETRY_ATTEMPTS } from '@/config/api';
import { create } from 'zustand';
import { toast } from "sonner";

// Define interface for API health response
interface HealthCheckResponse {
  status: string;
  message: string;
  version: string;
  system?: {
    os: string;
    python: string;
  };
  error?: string;
}

interface ConnectionState {
  isConnected: boolean;
  lastChecked: string | null;
  error: string | null;
  isChecking: boolean;
  checkConnection: () => Promise<boolean>;
  setConnectionStatus: (status: boolean, error?: string | null) => void;
  serverVersion: string | null;
  serverStatus: {
    database: boolean;
    api: boolean;
    message?: string;
  };
  retryCount: number;
  maxRetries: number;
}

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  isConnected: false,
  lastChecked: null,
  error: null,
  isChecking: false,
  serverVersion: null,
  retryCount: 0,
  maxRetries: MAX_RETRY_ATTEMPTS,
  serverStatus: {
    database: false,
    api: false,
    message: undefined
  },
  
  checkConnection: async () => {
    // Don't run multiple checks simultaneously
    if (get().isChecking) return get().isConnected;
    
    set({ isChecking: true });
    
    try {
      // Try to ping the API server
      const response = await apiService.get<HealthCheckResponse>(`${API_CONFIG.ENDPOINTS.HEALTH}`);
      
      // Reset retry count on successful connection
      set({ retryCount: 0 });
      
      // Update server status information
      set({ 
        isConnected: true, 
        error: null,
        lastChecked: new Date().toISOString(),
        isChecking: false,
        serverVersion: response.version || null,
        serverStatus: {
          database: response.status === 'ok',
          api: true,
          message: response.message
        }
      });
      return true;
    } catch (error) {
      const currentRetries = get().retryCount;
      const maxRetries = get().maxRetries;
      
      // Increment retry count
      set({ retryCount: currentRetries + 1 });
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect to API';
      
      set({ 
        isConnected: false, 
        error: errorMessage,
        lastChecked: new Date().toISOString(),
        isChecking: false,
        serverStatus: {
          database: false,
          api: false,
          message: errorMessage
        }
      });
      
      // Only show toast after multiple failures to avoid spamming the user
      if (currentRetries >= 2 && currentRetries < maxRetries) {
        toast.error(`Connection issue: ${errorMessage}`, {
          description: `Attempt ${currentRetries + 1} of ${maxRetries}`,
          id: "connection-error" // Use ID to prevent duplicate toasts
        });
      }
      
      return false;
    }
  },
  
  setConnectionStatus: (status: boolean, error: string | null = null) => {
    set({ 
      isConnected: status,
      error: error,
      lastChecked: new Date().toISOString(),
      // Reset retry count when status is explicitly set
      retryCount: status ? 0 : get().retryCount
    });
  }
}));

class ApiConnectionService {
  private checkInterval: number | null = null;
  private pingTimeout: number = 5000; // 5 second timeout for ping requests
  
  constructor() {
    // Initialize the connection check
    this.startPeriodicCheck();
  }
  
  startPeriodicCheck(interval: number = CONNECTION_CHECK_INTERVAL) {
    // Clear any existing interval
    if (this.checkInterval) {
      window.clearInterval(this.checkInterval);
    }
    
    // Only start periodic checks if we're not in offline mode
    if (!apiService.isOfflineMode()) {
      this.checkInterval = window.setInterval(() => {
        this.testConnection();
      }, interval);
    }
  }
  
  stopPeriodicCheck() {
    if (this.checkInterval) {
      window.clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  async testConnection(baseUrl: string = API_CONFIG.BASE_URL): Promise<boolean> {
    // Skip check if in offline mode
    if (apiService.isOfflineMode()) {
      return false;
    }
    
    try {
      const response = await fetch(`${baseUrl}${API_CONFIG.ENDPOINTS.HEALTH}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.pingTimeout)
      });
      
      if (response.ok) {
        const data = await response.json() as HealthCheckResponse;
        useConnectionStore.getState().setConnectionStatus(true);
        
        // Update server status if available
        if (data) {
          useConnectionStore.setState({
            serverVersion: data.version || null,
            serverStatus: {
              database: data.status === 'ok',
              api: true,
              message: data.message
            }
          });
        }
        return true;
      }
      
      useConnectionStore.getState().setConnectionStatus(false, `API responded with status: ${response.status}`);
      return false;
    } catch (error) {
      useConnectionStore.getState().setConnectionStatus(
        false, 
        error instanceof Error ? error.message : 'Connection failed'
      );
      return false;
    }
  }
  
  getConnectionStatus(): boolean {
    return useConnectionStore.getState().isConnected;
  }
  
  getLastError(): string | null {
    return useConnectionStore.getState().error;
  }
  
  getServerInfo() {
    return {
      version: useConnectionStore.getState().serverVersion,
      status: useConnectionStore.getState().serverStatus
    };
  }
  
  // Method to attempt pingback with shortened timeout for quick checks
  async pingApi(): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PING}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(2000) // Shorter timeout for ping
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiConnectionService = new ApiConnectionService();
