
import { v4 as uuidv4 } from 'uuid';

export type BotStatus = 'active' | 'idle' | 'error' | 'paused';
export type BotType = 'content' | 'interaction' | 'click' | 'parser';
export type BotActivityType = 'browsing' | 'content_creation' | 'engagement' | 'account_interaction' | 'data_collection' | 'ip_rotation';

export interface Bot {
  id: string;
  name: string;
  description: string;
  type: BotType;
  status: BotStatus;
  lastRun: string;
  healthPercentage: number;
  ipAddress?: string;
  emailAccounts?: string[];
  proxySettings?: any;
  schedule?: any;
  config?: any;
}

export interface BotActivity {
  botId: string;
  type: BotActivityType;
  details: string;
  target?: string;
  timestamp: string;
}

// Mock bot data
let mockBots: Bot[] = [
  {
    id: '1',
    name: 'YouTube Content Bot',
    description: 'Creates and posts video content to YouTube',
    type: 'content',
    status: 'idle',
    lastRun: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    healthPercentage: 95,
  },
  {
    id: '2',
    name: 'Twitter Engagement Bot',
    description: 'Engages with tweets and follows users',
    type: 'interaction',
    status: 'idle',
    lastRun: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    healthPercentage: 87,
  },
  {
    id: '3',
    name: 'Instagram Follower Bot',
    description: 'Follows users and likes posts',
    type: 'interaction',
    status: 'idle',
    lastRun: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    healthPercentage: 92,
  },
  {
    id: '4',
    name: 'TikTok Click Bot',
    description: 'Simulates user clicks on videos',
    type: 'click',
    status: 'idle',
    lastRun: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    healthPercentage: 79,
  },
  {
    id: '5',
    name: 'Web Parser Bot',
    description: 'Extracts content from websites',
    type: 'parser',
    status: 'idle',
    lastRun: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    healthPercentage: 83,
  },
  {
    id: '6',
    name: 'Spotify Playlist Bot',
    description: 'Creates and manages Spotify playlists',
    type: 'content',
    status: 'idle',
    lastRun: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    healthPercentage: 88,
  },
];

// Mock activities
let mockActivities: Record<string, BotActivity> = {};

class BotService {
  getAllBots(): Bot[] {
    return [...mockBots];
  }
  
  startBot(id: string): boolean {
    const botIndex = mockBots.findIndex(bot => bot.id === id);
    if (botIndex >= 0) {
      mockBots[botIndex].status = 'active';
      mockBots[botIndex].lastRun = new Date().toISOString();
      return true;
    }
    return false;
  }
  
  stopBot(id: string): boolean {
    const botIndex = mockBots.findIndex(bot => bot.id === id);
    if (botIndex >= 0) {
      mockBots[botIndex].status = 'idle';
      return true;
    }
    return false;
  }
  
  getBotById(id: string): Bot | undefined {
    return mockBots.find(bot => bot.id === id);
  }
  
  createBot(botData: Partial<Bot>): string {
    const newBot: Bot = {
      id: uuidv4(),
      name: botData.name || 'New Bot',
      description: botData.description || 'Bot description',
      type: botData.type || 'content',
      status: 'idle',
      lastRun: new Date().toISOString(),
      healthPercentage: 100,
      ...botData
    };
    
    mockBots.push(newBot);
    return newBot.id;
  }
  
  updateBotConfig(id: string, config: any): boolean {
    const botIndex = mockBots.findIndex(bot => bot.id === id);
    if (botIndex >= 0) {
      mockBots[botIndex].config = config;
      return true;
    }
    return false;
  }
  
  updateBotSchedule(id: string, schedule: any): boolean {
    const botIndex = mockBots.findIndex(bot => bot.id === id);
    if (botIndex >= 0) {
      mockBots[botIndex].schedule = schedule;
      return true;
    }
    return false;
  }
  
  updateBotProxy(id: string, proxy: any): boolean {
    const botIndex = mockBots.findIndex(bot => bot.id === id);
    if (botIndex >= 0) {
      mockBots[botIndex].proxySettings = proxy;
      return true;
    }
    return false;
  }
  
  rotateIp(id: string): boolean {
    const botIndex = mockBots.findIndex(bot => bot.id === id);
    if (botIndex >= 0) {
      mockBots[botIndex].ipAddress = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      return true;
    }
    return false;
  }
  
  getBotHealth(): number | "N/A" {
    if (mockBots.length === 0) {
      return "N/A";
    }
    
    const totalHealth = mockBots.reduce((sum, bot) => sum + bot.healthPercentage, 0);
    return Math.round(totalHealth / mockBots.length);
  }
}

export const botService = new BotService();

