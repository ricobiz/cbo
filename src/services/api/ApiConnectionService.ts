
import { apiService } from './ApiService';
import { API_CONFIG } from '@/config/api';
import { create } from 'zustand';

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
}

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  isConnected: false,
  lastChecked: null,
  error: null,
  isChecking: false,
  serverVersion: null,
  serverStatus: {
    database: false,
    api: false,
    message: undefined
  },
  
  checkConnection: async () => {
    set({ isChecking: true });
    
    try {
      // Try to ping the API server
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.HEALTH}`);
      
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
      set({ 
        isConnected: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to API',
        lastChecked: new Date().toISOString(),
        isChecking: false,
        serverStatus: {
          database: false,
          api: false,
          message: error instanceof Error ? error.message : 'Connection failed'
        }
      });
      return false;
    }
  },
  
  setConnectionStatus: (status: boolean, error: string | null = null) => {
    set({ 
      isConnected: status,
      error: error,
      lastChecked: new Date().toISOString() 
    });
  }
}));

class ApiConnectionService {
  async testConnection(baseUrl: string = API_CONFIG.BASE_URL): Promise<boolean> {
    try {
      const response = await fetch(`${baseUrl}${API_CONFIG.ENDPOINTS.HEALTH}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        useConnectionStore.getState().setConnectionStatus(true);
        
        // Update server status if available
        if (data && typeof data === 'object') {
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
}

export const apiConnectionService = new ApiConnectionService();
