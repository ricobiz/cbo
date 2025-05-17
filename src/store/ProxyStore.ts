
import { create } from 'zustand';
import { proxyService, ProxyProvider } from '../services/ProxyService';

interface ProxyState {
  provider: ProxyProvider;
  proxiesCount: number;
  healthyCount: number;
  blacklistedCount: number;
  isLoading: boolean;

  // Actions
  setProvider: (provider: ProxyProvider) => void;
  setApiKey: (apiKey: string) => void;
  addCustomProxy: (ip: string, port: number, username?: string, password?: string) => Promise<void>;
  clearBlacklist: () => void;
  refreshCounts: () => void;
  rotateIp: (botId: string) => Promise<string | null>;
}

export const useProxyStore = create<ProxyState>((set, get) => ({
  provider: 'luminati' as ProxyProvider,
  proxiesCount: 0,
  healthyCount: 0,
  blacklistedCount: 0,
  isLoading: false,

  setProvider: (provider: ProxyProvider) => {
    proxyService.setProvider(provider);
    set({ provider });
  },

  setApiKey: (apiKey: string) => {
    proxyService.setApiKey(apiKey);
  },

  addCustomProxy: async (ip: string, port: number, username?: string, password?: string) => {
    await proxyService.addCustomProxy(ip, port, username, password);
    get().refreshCounts();
  },

  clearBlacklist: () => {
    proxyService.clearBlacklist();
    get().refreshCounts();
  },

  refreshCounts: () => {
    set({
      proxiesCount: proxyService.getProxiesCount(),
      healthyCount: proxyService.getHealthyProxiesCount(),
      blacklistedCount: proxyService.getBlacklistedCount()
    });
  },

  rotateIp: async (botId: string) => {
    return await proxyService.rotateIp(botId);
  }
}));
