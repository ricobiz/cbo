import { v4 as uuidv4 } from 'uuid';

export type BotStatus = 'active' | 'idle' | 'error' | 'paused';
export type BotType = 'content' | 'interaction' | 'click' | 'parser';
export type BotActivityType = 'browsing' | 'content_creation' | 'engagement' | 'account_interaction' | 'data_collection' | 'ip_rotation';

// Add the missing interfaces
export interface BotConfig {
  actionDelay: [number, number];
  mouseMovement: 'natural' | 'direct' | 'random';
  scrollPattern: 'variable' | 'constant' | 'jump';
  randomnessFactor: number;
  behaviorProfile: string;
  sessionVariability?: number; // Add optional property used in AICommandService
}

export interface BotSchedule {
  active: boolean;
  startTime: string;
  endTime: string;
  breakDuration: [number, number];
  daysActive: string[];
}

export interface BotProxy {
  useRotation: boolean;
  rotationFrequency: number;
  provider: string;
  regions: string[];
}

export interface EmailAccount {
  id: string;
  email: string;
  password?: string;
  isInUse: boolean;
  assignedBots?: string[];
  status?: string; // Add missing property
  lastUsed?: string; // Add missing property
}

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
  schedule?: BotSchedule;
  config?: BotConfig;
  proxy?: BotProxy;
  logs?: Array<{time: string, message: string}>;
  currentActivity?: BotActivity; // Add missing property
}

export interface BotActivity {
  botId: string;
  type: BotActivityType;
  details: string;
  target?: string;
  timestamp: string;
}

// Mock email accounts
let mockEmailAccounts: EmailAccount[] = [
  {
    id: 'email1',
    email: 'bot1@example.com',
    password: 'password123',
    isInUse: false,
    status: 'active',
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'email2',
    email: 'bot2@example.com',
    password: 'password123',
    isInUse: false,
    status: 'active',
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  },
  {
    id: 'email3',
    email: 'bot3@example.com',
    password: 'password123',
    isInUse: false,
    status: 'active',
    lastUsed: null
  }
];

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
    config: {
      actionDelay: [1000, 3000],
      mouseMovement: 'natural',
      scrollPattern: 'variable',
      randomnessFactor: 0.7,
      behaviorProfile: 'Gen-Z Content Consumer'
    },
    schedule: {
      active: false,
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: [15, 45],
      daysActive: ['Monday', 'Wednesday', 'Friday']
    },
    proxy: {
      useRotation: true,
      rotationFrequency: 30,
      provider: 'luminati',
      regions: ['us', 'eu']
    },
    logs: []
  },
  {
    id: '2',
    name: 'Twitter Engagement Bot',
    description: 'Engages with tweets and follows users',
    type: 'interaction',
    status: 'idle',
    lastRun: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    healthPercentage: 87,
    config: {
      actionDelay: [2000, 5000],
      mouseMovement: 'natural',
      scrollPattern: 'variable',
      randomnessFactor: 0.6,
      behaviorProfile: 'Casual Browser'
    },
    schedule: {
      active: false,
      startTime: '10:00',
      endTime: '16:00',
      breakDuration: [10, 30],
      daysActive: ['Tuesday', 'Thursday']
    },
    proxy: {
      useRotation: true,
      rotationFrequency: 45,
      provider: 'smartproxy',
      regions: ['us', 'uk']
    },
    logs: []
  },
  {
    id: '3',
    name: 'Instagram Follower Bot',
    description: 'Follows users and likes posts',
    type: 'interaction',
    status: 'idle',
    lastRun: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    healthPercentage: 92,
    config: {
      actionDelay: [1500, 4000],
      mouseMovement: 'natural',
      scrollPattern: 'variable',
      randomnessFactor: 0.65,
      behaviorProfile: 'Gen-Z Content Consumer'
    },
    schedule: {
      active: false,
      startTime: '11:00',
      endTime: '19:00',
      breakDuration: [20, 40],
      daysActive: ['Monday', 'Wednesday', 'Friday', 'Saturday']
    },
    proxy: {
      useRotation: true,
      rotationFrequency: 60,
      provider: 'brightdata',
      regions: ['us', 'eu', 'as']
    },
    logs: []
  },
  {
    id: '4',
    name: 'TikTok Click Bot',
    description: 'Simulates user clicks on videos',
    type: 'click',
    status: 'idle',
    lastRun: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    healthPercentage: 79,
    config: {
      actionDelay: [800, 2500],
      mouseMovement: 'random',
      scrollPattern: 'jump',
      randomnessFactor: 0.8,
      behaviorProfile: 'Gen-Z Content Consumer'
    },
    schedule: {
      active: false,
      startTime: '12:00',
      endTime: '22:00',
      breakDuration: [5, 20],
      daysActive: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    proxy: {
      useRotation: true,
      rotationFrequency: 15,
      provider: 'oxylabs',
      regions: ['us', 'eu', 'as']
    },
    logs: []
  },
  {
    id: '5',
    name: 'Web Parser Bot',
    description: 'Extracts content from websites',
    type: 'parser',
    status: 'idle',
    lastRun: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    healthPercentage: 83,
    config: {
      actionDelay: [500, 1500],
      mouseMovement: 'direct',
      scrollPattern: 'constant',
      randomnessFactor: 0.3,
      behaviorProfile: 'Business Professional'
    },
    schedule: {
      active: false,
      startTime: '08:00',
      endTime: '14:00',
      breakDuration: [30, 60],
      daysActive: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    proxy: {
      useRotation: true,
      rotationFrequency: 90,
      provider: 'luminati',
      regions: ['us', 'uk', 'ca']
    },
    logs: []
  },
  {
    id: '6',
    name: 'Spotify Playlist Bot',
    description: 'Creates and manages Spotify playlists',
    type: 'content',
    status: 'idle',
    lastRun: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    healthPercentage: 88,
    config: {
      actionDelay: [1200, 3500],
      mouseMovement: 'natural',
      scrollPattern: 'variable',
      randomnessFactor: 0.55,
      behaviorProfile: 'Casual Browser'
    },
    schedule: {
      active: false,
      startTime: '14:00',
      endTime: '23:00',
      breakDuration: [25, 50],
      daysActive: ['Monday', 'Friday', 'Saturday', 'Sunday']
    },
    proxy: {
      useRotation: true,
      rotationFrequency: 40,
      provider: 'brightdata',
      regions: ['us', 'eu']
    },
    logs: []
  },
];

// Mock activities
let mockActivities: Record<string, BotActivity> = {};

// Track bot-email assignments
const botEmailAssignments: Record<string, string[]> = {};

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
  
  // Alias for getBotById to match the component's expected method name
  getBot(id: string): Bot | undefined {
    return this.getBotById(id);
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
      config: botData.config || {
        actionDelay: [1000, 3000],
        mouseMovement: 'natural',
        scrollPattern: 'variable',
        randomnessFactor: 0.5,
        behaviorProfile: 'Casual Browser'
      },
      schedule: botData.schedule || {
        active: false,
        startTime: '09:00',
        endTime: '17:00',
        breakDuration: [15, 30],
        daysActive: ['Monday', 'Wednesday', 'Friday']
      },
      proxy: botData.proxy || {
        useRotation: true,
        rotationFrequency: 30,
        provider: 'luminati',
        regions: ['us', 'eu']
      },
      logs: [],
      ...botData
    };
    
    mockBots.push(newBot);
    return newBot.id;
  }
  
  updateBotConfig(id: string, config: BotConfig): boolean {
    const botIndex = mockBots.findIndex(bot => bot.id === id);
    if (botIndex >= 0) {
      mockBots[botIndex].config = config;
      return true;
    }
    return false;
  }
  
  updateBotSchedule(id: string, schedule: BotSchedule): boolean {
    const botIndex = mockBots.findIndex(bot => bot.id === id);
    if (botIndex >= 0) {
      mockBots[botIndex].schedule = schedule;
      return true;
    }
    return false;
  }
  
  updateBotProxy(id: string, proxy: BotProxy): boolean {
    const botIndex = mockBots.findIndex(bot => bot.id === id);
    if (botIndex >= 0) {
      mockBots[botIndex].proxy = proxy;
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

  // Email account management methods
  getAllEmailAccounts(): EmailAccount[] {
    return [...mockEmailAccounts];
  }

  getBotEmailAccounts(botId: string): EmailAccount[] {
    const botEmails = botEmailAssignments[botId] || [];
    return mockEmailAccounts.filter(account => botEmails.includes(account.id));
  }

  addEmailAccount(email: string, password: string): string {
    const id = uuidv4();
    const newAccount: EmailAccount = {
      id,
      email,
      password,
      isInUse: false
    };
    mockEmailAccounts.push(newAccount);
    return id;
  }

  assignEmailAccountToBot(emailId: string, botId: string): boolean {
    const emailAccount = mockEmailAccounts.find(account => account.id === emailId);
    if (!emailAccount) return false;

    // Mark as in use
    emailAccount.isInUse = true;
    
    // Add to bot's assignments
    if (!botEmailAssignments[botId]) {
      botEmailAssignments[botId] = [];
    }
    
    if (!botEmailAssignments[botId].includes(emailId)) {
      botEmailAssignments[botId].push(emailId);
    }

    // Update bot's emailAccounts property
    const botIndex = mockBots.findIndex(bot => bot.id === botId);
    if (botIndex >= 0) {
      if (!mockBots[botIndex].emailAccounts) {
        mockBots[botIndex].emailAccounts = [];
      }
      if (!mockBots[botIndex].emailAccounts.includes(emailId)) {
        mockBots[botIndex].emailAccounts.push(emailId);
      }
    }
    
    return true;
  }

  removeEmailAccountFromBot(emailId: string, botId: string): boolean {
    // Remove from bot's assignments
    if (botEmailAssignments[botId]) {
      const index = botEmailAssignments[botId].indexOf(emailId);
      if (index >= 0) {
        botEmailAssignments[botId].splice(index, 1);
        
        // Update bot's emailAccounts property
        const botIndex = mockBots.findIndex(bot => bot.id === botId);
        if (botIndex >= 0 && mockBots[botIndex].emailAccounts) {
          const emailIndex = mockBots[botIndex].emailAccounts.indexOf(emailId);
          if (emailIndex >= 0) {
            mockBots[botIndex].emailAccounts.splice(emailIndex, 1);
          }
        }
        
        // Check if this email is no longer used by any bot
        let isStillInUse = false;
        for (const assignedBotId in botEmailAssignments) {
          if (botEmailAssignments[assignedBotId].includes(emailId)) {
            isStillInUse = true;
            break;
          }
        }
        
        // Update email's usage status if no longer used
        if (!isStillInUse) {
          const emailIndex = mockEmailAccounts.findIndex(account => account.id === emailId);
          if (emailIndex >= 0) {
            mockEmailAccounts[emailIndex].isInUse = false;
          }
        }
        
        return true;
      }
    }
    
    return false;
  }

  // Add missing method for deleting email accounts
  deleteEmailAccount(id: string): boolean {
    // Check if email is in use
    const account = mockEmailAccounts.find(email => email.id === id);
    if (!account || account.isInUse) return false;
    
    // Remove email account
    mockEmailAccounts = mockEmailAccounts.filter(email => email.id !== id);
    return true;
  }
  
  // Add log method for AICommandService
  addLog(botId: string, message: string): boolean {
    const botIndex = mockBots.findIndex(bot => bot.id === botId);
    if (botIndex >= 0) {
      if (!mockBots[botIndex].logs) {
        mockBots[botIndex].logs = [];
      }
      
      mockBots[botIndex].logs.push({
        time: new Date().toISOString(),
        message: message
      });
      
      return true;
    }
    return false;
  }
}

export const botService = new BotService();
