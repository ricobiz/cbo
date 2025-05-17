import { Bot } from "@/services/types/bot";
import { Campaign } from "@/services/types/campaign";
import { v4 as uuidv4 } from 'uuid';

/**
 * Сервис для предоставления мок-данных в офлайн режиме
 */
export class MockDataService {
  // Предзаполненные боты для демонстрации
  private static bots: Bot[] = [
    {
      id: "1",
      name: "Instagram Bot",
      status: "active",
      type: "interaction",
      platform: "instagram",
      health: "healthy",
      proxyStatus: "active",
      createdAt: "2023-05-15T10:30:00Z",
      updatedAt: "2023-05-15T10:30:00Z",
      consumption: {
        cpu: 5,
        memory: 120,
        network: 25,
        quota: 15
      },
      activity: [],
      actions: [],
      config: {
        maxActions: 100
      },
      proxy: {
        type: "http",
        url: "proxy.example.com:8080"
      }
    },
    {
      id: "2",
      name: "Twitter Bot",
      status: "paused",
      type: "content",
      platform: "twitter",
      health: "warning",
      proxyStatus: "inactive",
      createdAt: "2023-06-20T14:15:00Z",
      updatedAt: "2023-06-25T09:45:00Z",
      consumption: {
        cpu: 0,
        memory: 0,
        network: 0,
        quota: 0
      },
      activity: [],
      actions: [],
      config: {
        maxActions: 50
      },
      proxy: null
    },
    {
      id: "3",
      name: "Facebook Bot",
      status: "error",
      type: "view",
      platform: "facebook",
      health: "critical",
      proxyStatus: "expired",
      createdAt: "2023-07-05T16:20:00Z",
      updatedAt: "2023-07-10T11:30:00Z",
      consumption: {
        cpu: 15,
        memory: 250,
        network: 60,
        quota: 35
      },
      activity: [],
      actions: [],
      config: {
        maxActions: 150,
        proxy: {
          type: "http",
          url: "proxy3.example.com:8443"
        }
      }
    }
  ];

  // Предзаполненные кампании для демонстрации
  private static campaigns: Campaign[] = [
    {
      id: "1",
      name: "Летняя промо-кампания",
      description: "Продвижение летней коллекции",
      status: "active",
      type: "promotion",
      platforms: ["instagram", "facebook"],
      startDate: "2023-06-01T00:00:00Z",
      endDate: "2023-08-31T23:59:59Z",
      metrics: [
        { name: "likes", value: 1520 },
        { name: "shares", value: 342 },
        { name: "comments", value: 187 }
      ],
      createdAt: "2023-05-15T10:30:00Z",
      updatedAt: "2023-07-01T14:20:00Z",
      budget: 5000,
      tags: ["лето", "скидки", "промо"],
      actions: []
    },
    {
      id: "2",
      name: "Запуск нового продукта",
      description: "Анонс и продвижение нового продукта",
      status: "paused",
      type: "brand",
      platforms: ["twitter", "facebook", "instagram"],
      startDate: "2023-09-01T00:00:00Z",
      endDate: "2023-10-15T23:59:59Z",
      metrics: [
        { name: "views", value: 7800 },
        { name: "clicks", value: 450 },
        { name: "signups", value: 120 }
      ],
      createdAt: "2023-08-15T09:45:00Z",
      updatedAt: "2023-09-05T16:30:00Z",
      budget: 8500,
      tags: ["запуск", "новинка", "продукт"],
      actions: []
    },
    {
      id: "3",
      name: "Контент-маркетинг",
      description: "Серия образовательных постов",
      status: "draft",
      type: "custom",
      platforms: ["facebook"],
      startDate: "2023-11-01T00:00:00Z",
      endDate: null,
      metrics: [],
      createdAt: "2023-10-20T13:15:00Z",
      updatedAt: "2023-10-20T13:15:00Z",
      budget: 3000,
      tags: ["контент", "образование"],
      actions: []
    }
  ];

  // Получить все боты
  static getBots(): Bot[] {
    return JSON.parse(JSON.stringify(this.bots));
  }

  // Получить бота по ID
  static getBotById(id: string): Bot | null {
    const bot = this.bots.find(b => b.id === id);
    return bot ? JSON.parse(JSON.stringify(bot)) : null;
  }

  // Создать нового бота
  static createBot(botData: Partial<Bot>): Bot {
    const newBot: Bot = {
      id: uuidv4(),
      name: botData.name || "Новый бот",
      status: botData.status || "idle",
      type: botData.type || "custom",
      platform: botData.platform || "multi",
      health: botData.health || "unknown",
      proxyStatus: botData.proxyStatus || "inactive",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      consumption: botData.consumption || {
        cpu: 0,
        memory: 0,
        network: 0,
        quota: 0
      },
      activity: botData.activity || [],
      actions: botData.actions || [],
      config: botData.config || {
        maxActions: 100
      },
      proxy: botData.proxy || null
    };
    
    this.bots.push(newBot);
    return JSON.parse(JSON.stringify(newBot));
  }

  // Обновить бота
  static updateBot(id: string, botData: Partial<Bot>): Bot | null {
    const index = this.bots.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    this.bots[index] = {
      ...this.bots[index],
      ...botData,
      updatedAt: new Date().toISOString()
    };
    
    return JSON.parse(JSON.stringify(this.bots[index]));
  }

  // Удалить бота
  static deleteBot(id: string): boolean {
    const initialLength = this.bots.length;
    this.bots = this.bots.filter(b => b.id !== id);
    return initialLength !== this.bots.length;
  }

  // Получить все кампании
  static getCampaigns(): Campaign[] {
    return JSON.parse(JSON.stringify(this.campaigns));
  }

  // Получить кампанию по ID
  static getCampaignById(id: string): Campaign | null {
    const campaign = this.campaigns.find(c => c.id === id);
    return campaign ? JSON.parse(JSON.stringify(campaign)) : null;
  }

  // Создать новую кампанию
  static createCampaign(campaignData: Partial<Campaign>): Campaign {
    const newCampaign: Campaign = {
      id: uuidv4(),
      name: campaignData.name || "Новая кампания",
      description: campaignData.description || "",
      status: campaignData.status || "draft",
      type: campaignData.type || "promotion",
      platforms: campaignData.platforms || [],
      startDate: campaignData.startDate || new Date().toISOString(),
      endDate: campaignData.endDate || null,
      metrics: campaignData.metrics || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      budget: campaignData.budget || 0,
      tags: campaignData.tags || [],
      actions: campaignData.actions || []
    };
    
    this.campaigns.push(newCampaign);
    return JSON.parse(JSON.stringify(newCampaign));
  }

  // Обновить кампанию
  static updateCampaign(id: string, campaignData: Partial<Campaign>): Campaign | null {
    const index = this.campaigns.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.campaigns[index] = {
      ...this.campaigns[index],
      ...campaignData,
      updatedAt: new Date().toISOString()
    };
    
    return JSON.parse(JSON.stringify(this.campaigns[index]));
  }

  // Удалить кампанию
  static deleteCampaign(id: string): boolean {
    const initialLength = this.campaigns.length;
    this.campaigns = this.campaigns.filter(c => c.id !== id);
    return initialLength !== this.campaigns.length;
  }
}
