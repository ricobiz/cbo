import { Bot, BotType, BotPlatform, BotStatus, BotHealthStatus, BotFilter, BotActivity } from "./types/bot";
import { ExternalAPIService } from "./external-api/ExternalAPIService";

/**
 * Service for Bot Management
 */
export class BotManagementService {
  private static STORAGE_KEY = 'bots';

  /**
   * Get all bots from storage
   */
  static async getAllBots(): Promise<Bot[]> {
    try {
      // Try to fetch from API first
      try {
        const bots = await ExternalAPIService.makeRequest<Bot[]>('/bots');
        return bots;
      } catch (apiError) {
        console.warn("Could not fetch bots from API, falling back to localStorage", apiError);
        // Fall back to localStorage if API is not available
        const bots = localStorage.getItem(this.STORAGE_KEY);
        return bots ? JSON.parse(bots) : this.generateDemoBots();
      }
    } catch (error) {
      console.error("Error retrieving bots:", error);
      return this.generateDemoBots();
    }
  }

  /**
   * Get a bot by ID
   */
  static async getBotById(id: string): Promise<Bot | undefined> {
    try {
      return await ExternalAPIService.makeRequest<Bot>(`/bots/${id}`);
    } catch (apiError) {
      console.warn(`Could not fetch bot ${id} from API, falling back to localStorage`, apiError);
      const bots = await this.getAllBots();
      return bots.find(bot => bot.id === id);
    }
  }

  /**
   * Filter bots based on criteria
   */
  static filterBots(filters: BotFilter): Bot[] {
    let bots = this.getAllBots();
    
    // Apply filters
    if (filters.type && filters.type.length > 0) {
      bots = bots.filter(bot => filters.type!.includes(bot.type));
    }
    
    if (filters.platform && filters.platform.length > 0) {
      bots = bots.filter(bot => filters.platform!.includes(bot.platform));
    }
    
    if (filters.status && filters.status.length > 0) {
      bots = bots.filter(bot => filters.status!.includes(bot.status));
    }
    
    if (filters.health && filters.health.length > 0) {
      bots = bots.filter(bot => filters.health!.includes(bot.health));
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      bots = bots.filter(bot => 
        bot.name.toLowerCase().includes(searchLower) || 
        (bot.description && bot.description.toLowerCase().includes(searchLower))
      );
    }
    
    return bots;
  }

  /**
   * Save a bot
   */
  static async saveBot(bot: Bot): Promise<Bot> {
    try {
      if (bot.id) {
        // Update existing bot
        return await ExternalAPIService.makeRequest<Bot>(`/bots/${bot.id}`, 'PUT', bot);
      } else {
        // Create new bot
        return await ExternalAPIService.makeRequest<Bot>('/bots', 'POST', bot);
      }
    } catch (apiError) {
      console.warn("Could not save bot to API, falling back to localStorage", apiError);
      
      const bots = await this.getAllBots();
      const existingIndex = bots.findIndex(b => b.id === bot.id);
      
      if (existingIndex >= 0) {
        // Update existing bot
        bots[existingIndex] = {
          ...bot,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Add new bot
        bots.push({
          ...bot,
          id: bot.id || crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bots));
      return bot;
    }
  }

  /**
   * Delete a bot
   */
  static async deleteBot(id: string): Promise<boolean> {
    try {
      await ExternalAPIService.makeRequest(`/bots/${id}`, 'DELETE');
      return true;
    } catch (apiError) {
      console.warn(`Could not delete bot ${id} from API, falling back to localStorage`, apiError);
      
      const bots = await this.getAllBots();
      const filteredBots = bots.filter(bot => bot.id !== id);
      
      if (filteredBots.length < bots.length) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredBots));
        return true;
      }
      
      return false;
    }
  }

  /**
   * Update bot status
   */
  static updateBotStatus(id: string, status: BotStatus): Bot | undefined {
    const bot = this.getBotById(id);
    
    if (bot) {
      // Add activity record
      const activity: BotActivity = {
        id: Date.now().toString(),
        type: status === 'running' ? 'start' : status === 'paused' || status === 'idle' ? 'stop' : 'error',
        description: `Bot ${status === 'running' ? 'started' : status === 'paused' ? 'paused' : status === 'idle' ? 'stopped' : 'encountered an error'}`,
        timestamp: new Date().toISOString()
      };
      
      const updatedBot = {
        ...bot,
        status,
        lastActive: new Date().toISOString(),
        activity: [activity, ...bot.activity.slice(0, 49)], // Keep last 50 activities
        updatedAt: new Date().toISOString()
      };
      
      this.saveBot(updatedBot);
      return updatedBot;
    }
    
    return undefined;
  }

  /**
   * Get bot health statistics
   */
  static getBotHealthStats(): Record<BotHealthStatus, number> {
    const bots = this.getAllBots();
    const stats: Record<BotHealthStatus, number> = {
      healthy: 0,
      warning: 0,
      critical: 0,
      unknown: 0
    };
    
    bots.forEach(bot => {
      stats[bot.health] = (stats[bot.health] || 0) + 1;
    });
    
    return stats;
  }

  /**
   * Generate demo bots for first-time use
   */
  private static generateDemoBots(): Bot[] {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 86400000);
    const hourAgo = new Date(now.getTime() - 3600000);
    
    const demoBots: Bot[] = [
      {
        id: '1',
        name: 'YouTube Viewer Bot',
        type: 'view',
        platform: 'youtube',
        status: 'running',
        health: 'healthy',
        proxyStatus: 'active',
        description: 'Бот для просмотра видео на YouTube. Имитирует поведение реального пользователя.',
        avatar: 'https://ui-avatars.com/api/?name=YT+Bot&background=c00&color=fff',
        lastActive: hourAgo.toISOString(),
        createdAt: dayAgo.toISOString(),
        updatedAt: hourAgo.toISOString(),
        consumption: {
          cpu: 15,
          memory: 256,
          network: 150,
          quota: 25
        },
        activity: [
          {
            id: '101',
            type: 'action',
            description: 'Просмотрено видео https://youtube.com/watch?v=example',
            timestamp: hourAgo.toISOString(),
            details: {
              watchDuration: '2m 45s',
              watchedPercent: 78
            }
          },
          {
            id: '102',
            type: 'start',
            description: 'Бот запущен',
            timestamp: new Date(hourAgo.getTime() - 3600000).toISOString()
          }
        ],
        actions: [
          {
            id: '201',
            type: 'view',
            status: 'completed',
            startedAt: new Date(hourAgo.getTime() - 1800000).toISOString(),
            completedAt: new Date(hourAgo.getTime() - 1700000).toISOString(),
            target: 'https://youtube.com/watch?v=example1',
            details: {
              duration: 120,
              liked: false,
              commented: false
            }
          },
          {
            id: '202',
            type: 'view',
            status: 'completed',
            startedAt: new Date(hourAgo.getTime() - 900000).toISOString(),
            completedAt: new Date(hourAgo.getTime() - 720000).toISOString(),
            target: 'https://youtube.com/watch?v=example2',
            details: {
              duration: 180,
              liked: true,
              commented: false
            }
          },
          {
            id: '203',
            type: 'view',
            status: 'in-progress',
            startedAt: new Date(hourAgo.getTime() - 300000).toISOString(),
            target: 'https://youtube.com/watch?v=example3'
          }
        ],
        config: {
          maxActions: 100,
          targetUrls: [
            'https://youtube.com/watch?v=example1',
            'https://youtube.com/watch?v=example2',
            'https://youtube.com/watch?v=example3'
          ],
          proxy: {
            type: 'http',
            url: 'http://proxy.example.com:8080'
          },
          schedule: {
            active: true,
            times: [
              {
                start: '09:00',
                end: '18:00',
                days: [1, 2, 3, 4, 5]
              },
              {
                start: '12:00',
                end: '16:00',
                days: [0, 6]
              }
            ]
          },
          advancedSettings: {
            watchDuration: {
              min: 60,
              max: 300
            },
            likeChance: 0.2,
            commentChance: 0.05
          }
        },
        associatedCampaignIds: ['1']
      },
      {
        id: '2',
        name: 'Instagram Engagement Bot',
        type: 'interaction',
        platform: 'instagram',
        status: 'paused',
        health: 'warning',
        proxyStatus: 'active',
        description: 'Бот для взаимодействия с постами в Instagram. Лайки, комментарии, подписки.',
        avatar: 'https://ui-avatars.com/api/?name=IG+Bot&background=c13584&color=fff',
        lastActive: new Date(now.getTime() - 7200000).toISOString(),
        createdAt: new Date(dayAgo.getTime() - 86400000 * 7).toISOString(),
        updatedAt: new Date(now.getTime() - 7200000).toISOString(),
        consumption: {
          cpu: 25,
          memory: 320,
          network: 90,
          quota: 48
        },
        activity: [
          {
            id: '103',
            type: 'stop',
            description: 'Бот приостановлен пользователем',
            timestamp: new Date(now.getTime() - 7200000).toISOString()
          }
        ],
        actions: [],
        config: {
          maxActions: 200,
          proxy: {
            type: 'socks',
            url: 'socks5://proxy.example.com:1080'
          },
          templates: {
            comment1: 'Great post! Love your content!',
            comment2: 'Amazing! 👏 Keep up the good work!',
            comment3: 'This is so inspiring! Thanks for sharing!'
          },
          schedule: {
            active: true,
            times: [
              {
                start: '10:00',
                end: '22:00',
                days: [0, 1, 2, 3, 4, 5, 6]
              }
            ]
          }
        }
      }
    ];
    
    return demoBots;
  }
}
