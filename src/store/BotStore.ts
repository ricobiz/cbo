
import { create } from 'zustand';
import { botService, Bot, BotStatus, BotType } from '../services/BotService';
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
}

export const useBotStore = create<BotState>((set, get) => ({
  bots: [],
  filterType: "all",
  filterStatus: "all",
  searchTerm: "",
  ipRotationEnabled: true,
  selectedBotId: null,
  loading: false,
  error: null,
  
  fetchBots: () => {
    set({ loading: true, error: null });
    try {
      const bots = botService.getAllBots();
      set({ bots, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  startBot: (id: string) => {
    const success = botService.startBot(id);
    if (success) {
      set({ bots: botService.getAllBots() });
    }
  },
  
  stopBot: (id: string) => {
    const success = botService.stopBot(id);
    if (success) {
      set({ bots: botService.getAllBots() });
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
  }
}));
