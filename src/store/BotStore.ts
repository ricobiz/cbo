import { create } from 'zustand';
import { botService } from '../services/BotService';
import { Bot } from '../services/BotService';
import { BotStatus, BotType } from '../services/types/bot';
import { BotActivity } from '../services/BotService';
import { botActivityService } from '../services/BotActivityService';
import { proxyService } from '../services/ProxyService';
import { useToast } from '@/components/ui/use-toast';

interface BotState {
  bots: Bot[];
  filterType: string;
  filterStatus: string;
  searchTerm: string;
  ipRotationEnabled: boolean;
  selectedBotId: string | null;
  loading: boolean;
  error: string | null;
  botActivities: Record<string, BotActivity | undefined>;
  
  // Actions
  fetchBots: () => Promise<void>;
  startBot: (id: string) => Promise<void>;
  stopBot: (id: string) => Promise<void>;
  setFilterType: (type: string) => void;
  setFilterStatus: (status: string) => void;
  setSearchTerm: (term: string) => void;
  setIpRotationEnabled: (enabled: boolean) => void;
  selectBot: (id: string | null) => void;
  updateBotConfig: (id: string, config: any) => Promise<void>;
  updateBotSchedule: (id: string, schedule: any) => Promise<void>;
  updateBotProxy: (id: string, proxy: any) => Promise<void>;
  rotateIp: (id: string) => Promise<void>;
  createBot: (botData: Partial<Bot>) => Promise<string | null>;
  refreshBotActivities: () => Promise<void>;
  startActivityPolling: () => void;
  stopActivityPolling: () => void;
}

export const useBotStore = create<BotState>((set, get) => {
  // Activity polling interval
  let pollingInterval: number | null = null;
  
  return {
    bots: [],
    filterType: "all",
    filterStatus: "all",
    searchTerm: "",
    ipRotationEnabled: true,
    selectedBotId: null,
    loading: false,
    error: null,
    botActivities: {},
    
    fetchBots: async () => {
      set({ loading: true, error: null });
      try {
        const bots = await botService.getAllBots();
        set({ bots, loading: false });
        
        // Also refresh activities when fetching bots
        await get().refreshBotActivities();
      } catch (error) {
        set({ error: (error as Error).message, loading: false });
      }
    },
    
    startBot: async (id: string) => {
      try {
        const success = await botService.startBot(id);
        if (success) {
          const bots = await botService.getAllBots();
          set({ bots });
          await get().refreshBotActivities();
        }
      } catch (error) {
        set({ error: (error as Error).message });
      }
    },
    
    stopBot: async (id: string) => {
      try {
        const success = await botService.stopBot(id);
        if (success) {
          const bots = await botService.getAllBots();
          set({ bots });
          await get().refreshBotActivities();
        }
      } catch (error) {
        set({ error: (error as Error).message });
      }
    },
    
    setFilterType: (type: string) => {
      set({ filterType: type });
    },
    
    setFilterStatus: (status: string) => {
      set({ filterStatus: status });
    },
    
    setSearchTerm: (term: string) => {
      set({ searchTerm: term });
    },
    
    setIpRotationEnabled: (enabled: boolean) => {
      set({ ipRotationEnabled: enabled });
    },
    
    selectBot: (id: string | null) => {
      set({ selectedBotId: id });
    },
    
    updateBotConfig: async (id: string, config: any) => {
      try {
        const success = await botService.updateBotConfig(id, config);
        if (success) {
          const bots = await botService.getAllBots();
          set({ bots });
        }
      } catch (error) {
        set({ error: (error as Error).message });
      }
    },
    
    updateBotSchedule: async (id: string, schedule: any) => {
      try {
        const success = await botService.updateBotSchedule(id, schedule);
        if (success) {
          const bots = await botService.getAllBots();
          set({ bots });
        }
      } catch (error) {
        set({ error: (error as Error).message });
      }
    },
    
    updateBotProxy: async (id: string, proxy: any) => {
      try {
        const success = await botService.updateBotProxy(id, proxy);
        if (success) {
          const bots = await botService.getAllBots();
          set({ bots });
        }
      } catch (error) {
        set({ error: (error as Error).message });
      }
    },
    
    rotateIp: async (id: string) => {
      try {
        const success = await botService.rotateIp(id);
        if (success) {
          const bots = await botService.getAllBots();
          set({ bots });
        }
      } catch (error) {
        set({ error: (error as Error).message });
      }
    },
    
    createBot: async (botData: Partial<Bot>) => {
      try {
        const newBotId = await botService.createBot(botData);
        const bots = await botService.getAllBots();
        set({ bots });
        return newBotId;
      } catch (error) {
        set({ error: (error as Error).message });
        return null;
      }
    },
    
    refreshBotActivities: async () => {
      try {
        const activities = await botActivityService.getAllBotActivities();
        set({ botActivities: activities });
      } catch (error) {
        console.error("Error refreshing bot activities:", error);
      }
    },
    
    startActivityPolling: () => {
      // Clear existing interval if any
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      
      // Set up new polling interval (every 3 seconds)
      pollingInterval = setInterval(() => {
        get().refreshBotActivities();
      }, 3000) as unknown as number;
    },
    
    stopActivityPolling: () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
    }
  };
});

// Auto-start activity polling when imported
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useBotStore.getState().startActivityPolling();
  }, 1000);
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    useBotStore.getState().stopActivityPolling();
  });
}
