
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
}

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  isConnected: false,
  lastChecked: null,
  error: null,
  isChecking: false,
  
  checkConnection: async () => {
    set({ isChecking: true });
    
    try {
      // Try to ping the API server
      await apiService.get(`${API_CONFIG.ENDPOINTS.HEALTH}`);
      
      set({ 
        isConnected: true, 
        error: null,
        lastChecked: new Date().toISOString(),
        isChecking: false 
      });
      return true;
    } catch (error) {
      set({ 
        isConnected: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to API',
        lastChecked: new Date().toISOString(),
        isChecking: false 
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
        useConnectionStore.getState().setConnectionStatus(true);
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
}

export const apiConnectionService = new ApiConnectionService();
