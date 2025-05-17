
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
  createBot: (botData: Partial<Bot>) => string | null;
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
      // When a bot starts, we first log what platform and task it's working on
      const bot = botService.getBot(id);
      if (bot) {
        // Determine what platform this bot is focused on
        const platformMatch = bot.name.toLowerCase().match(/youtube|twitter|instagram|tiktok|facebook|linkedin|spotify/);
        const platform = platformMatch ? platformMatch[0].charAt(0).toUpperCase() + platformMatch[0].slice(1) : "Multiple platforms";
        
        // Add task context based on bot type
        let actionDescription = "";
        switch (bot.type) {
          case "content":
            actionDescription = `Started content creation for ${platform}`;
            break;
          case "interaction":
            actionDescription = `Began engagement tasks on ${platform}`;
            break;
          case "click":
            actionDescription = `Started driving traffic/views on ${platform}`;
            break;
          case "parser":
            actionDescription = `Initiated data analysis for ${platform}`;
            break;
        }
        
        // Add email account context if accounts are linked
        if (bot.emailAccounts && bot.emailAccounts.length > 0) {
          const emailAccounts = botService.getBotEmailAccounts(id);
          if (emailAccounts.length > 0) {
            actionDescription += ` using ${emailAccounts.length} account${emailAccounts.length > 1 ? 's' : ''}`;
          }
        }
        
        botService.addLog(id, actionDescription);
      }
      
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
  }
}));
