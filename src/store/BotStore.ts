
import { create } from 'zustand';
import { botService, Bot, BotStatus, BotType, BotActivity } from '../services/BotService';
import { botActivityService } from '../services/BotActivityService';
import { proxyService } from '../services/ProxyService';

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
  fetchBots: () => void;
  startBot: (id: string) => void;
  stopBot: (id: string) => void;
  setFilterType: (type: string) => void;
  setFilterStatus: (status: string) => void;
  setSearchTerm: (term: string) => void;
  setIpRotationEnabled: (enabled: boolean) => void;
  selectBot: (id: string | null) => void;
  updateBotConfig: (id: string, config: any) => void;
  updateBotSchedule: (id: string, schedule: any) => void;
  updateBotProxy: (id: string, proxy: any) => void;
  rotateIp: (id: string) => void;
  createBot: (botData: Partial<Bot>) => string | null;
  refreshBotActivities: () => void;
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
    
    fetchBots: () => {
      set({ loading: true, error: null });
      try {
        const bots = botService.getAllBots();
        set({ bots, loading: false });
        
        // Also refresh activities when fetching bots
        get().refreshBotActivities();
      } catch (error) {
        set({ error: (error as Error).message, loading: false });
      }
    },
    
    startBot: (id: string) => {
      const success = botService.startBot(id);
      if (success) {
        set({ bots: botService.getAllBots() });
        get().refreshBotActivities();
      }
    },
    
    stopBot: (id: string) => {
      const success = botService.stopBot(id);
      if (success) {
        set({ bots: botService.getAllBots() });
        get().refreshBotActivities();
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
    
    updateBotConfig: (id: string, config: any) => {
      const success = botService.updateBotConfig(id, config);
      if (success) {
        set({ bots: botService.getAllBots() });
      }
    },
    
    updateBotSchedule: (id: string, schedule: any) => {
      const success = botService.updateBotSchedule(id, schedule);
      if (success) {
        set({ bots: botService.getAllBots() });
      }
    },
    
    updateBotProxy: (id: string, proxy: any) => {
      const success = botService.updateBotProxy(id, proxy);
      if (success) {
        set({ bots: botService.getAllBots() });
      }
    },
    
    rotateIp: (id: string) => {
      const success = botService.rotateIp(id);
      if (success) {
        set({ bots: botService.getAllBots() });
      }
    },
    
    createBot: (botData: Partial<Bot>) => {
      try {
        const newBotId = botService.createBot(botData);
        set({ bots: botService.getAllBots() });
        return newBotId;
      } catch (error) {
        set({ error: (error as Error).message });
        return null;
      }
    },
    
    refreshBotActivities: () => {
      const activities = botActivityService.getAllBotActivities();
      set({ botActivities: activities });
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
