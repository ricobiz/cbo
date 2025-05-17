import { proxyService } from './ProxyService';

export type BotStatus = 'active' | 'idle' | 'error' | 'paused';
export type BotType = 'content' | 'interaction' | 'click' | 'parser';

export interface BotConfig {
  actionDelay: [number, number]; // min, max delay in ms
  mouseMovement: 'natural' | 'direct' | 'random';
  scrollPattern: 'variable' | 'constant' | 'jump';
  randomnessFactor: number; // 0-1
  sessionVariability: number; // 0-1
  behaviorProfile: string;
}

export interface BotSchedule {
  active: boolean;
  startTime: string;
  endTime: string;
  breakDuration: [number, number]; // min, max in minutes
  daysActive: string[];
}

export interface BotProxy {
  useRotation: boolean;
  rotationFrequency: number; // minutes
  provider: string;
  regions: string[];
}

export interface EmailAccount {
  id: string;
  email: string;
  password: string;
  isInUse: boolean;
  lastUsed?: string;
  status: 'active' | 'blocked' | 'flagged';
}

export interface Bot {
  id: string;
  name: string;
  description: string;
  status: BotStatus;
  type: BotType;
  config: BotConfig;
  schedule: BotSchedule;
  proxy: BotProxy;
  lastRun: string;
  logs: Array<{time: string, message: string}>;
  emailAccounts?: string[]; // IDs of associated email accounts
  createdAt?: string;
}

// A new event to notify when bot list changes
export const BOT_UPDATED_EVENT = 'bot-list-updated';

class BotService {
  private bots: Map<string, Bot> = new Map();
  private maxConcurrentOperations: number = 10;
  private activeOperations: number = 0;
  private emailAccounts: Map<string, EmailAccount> = new Map();
  
  constructor() {
    // Load some initial mock bots
    this.initializeMockBots();
    this.initializeMockEmailAccounts();
  }

  private initializeMockBots(): void {
    // Initialize with mock data from the original system
    const mockBots = [
      {
        id: "1",
        name: "Content Generator Bot",
        description: "Creates trending content for various platforms using GPT-4",
        status: "active" as BotStatus,
        type: "content" as BotType,
        lastRun: "10 mins ago",
        config: this.getDefaultConfig(),
        schedule: this.getDefaultSchedule(),
        proxy: this.getDefaultProxy(),
        logs: []
      },
      {
        id: "2",
        name: "Social Interaction Simulator",
        description: "Simulates likes, shares, comments, and other social interactions",
        status: "active" as BotStatus,
        type: "interaction" as BotType,
        lastRun: "25 mins ago",
        config: this.getDefaultConfig(),
        schedule: this.getDefaultSchedule(),
        proxy: this.getDefaultProxy(),
        logs: []
      },
      {
        id: "3",
        name: "YouTube Click Bot",
        description: "Drives organic traffic and engagement on YouTube videos",
        status: "idle" as BotStatus,
        type: "click" as BotType,
        lastRun: "2 hours ago",
        config: this.getDefaultConfig(),
        schedule: this.getDefaultSchedule(),
        proxy: this.getDefaultProxy(),
        logs: []
      },
      {
        id: "4",
        name: "Spotify Stream Bot",
        description: "Increases plays and engagement on Spotify tracks",
        status: "idle" as BotStatus,
        type: "click" as BotType,
        lastRun: "5 hours ago",
        config: this.getDefaultConfig(),
        schedule: this.getDefaultSchedule(),
        proxy: this.getDefaultProxy(),
        logs: []
      },
      {
        id: "5",
        name: "Analytics Parser Bot",
        description: "Monitors campaign performance and collects real-time metrics",
        status: "active" as BotStatus,
        type: "parser" as BotType,
        lastRun: "15 mins ago",
        config: this.getDefaultConfig(),
        schedule: this.getDefaultSchedule(),
        proxy: this.getDefaultProxy(),
        logs: []
      },
      {
        id: "6",
        name: "Instagram Engagement Bot",
        description: "Drives likes, follows, and comments on Instagram posts",
        status: "error" as BotStatus,
        type: "interaction" as BotType,
        lastRun: "2 days ago",
        config: this.getDefaultConfig(),
        schedule: this.getDefaultSchedule(),
        proxy: this.getDefaultProxy(),
        logs: []
      },
    ];
    
    mockBots.forEach(bot => {
      this.bots.set(bot.id, bot as Bot);
    });
  }
  
  private initializeMockEmailAccounts(): void {
    const mockEmails = [
      {
        id: "1",
        email: "user1@example.com",
        password: "password123",
        isInUse: true,
        lastUsed: "2025-05-16",
        status: 'active' as const
      },
      {
        id: "2",
        email: "user2@example.com",
        password: "password456",
        isInUse: false,
        lastUsed: "2025-05-10",
        status: 'active' as const
      },
      {
        id: "3",
        email: "user3@example.com",
        password: "password789",
        isInUse: false,
        status: 'flagged' as const
      }
    ];
    
    mockEmails.forEach(email => {
      this.emailAccounts.set(email.id, email);
    });
    
    // Associate some emails with bots
    const bot1 = this.bots.get("1");
    const bot2 = this.bots.get("2");
    
    if (bot1) {
      bot1.emailAccounts = ["1"];
      this.bots.set("1", bot1);
    }
    
    if (bot2) {
      bot2.emailAccounts = ["2"];
      this.bots.set("2", bot2);
    }
  }
  
  public getAllBots(): Bot[] {
    return Array.from(this.bots.values());
  }
  
  public getBot(id: string): Bot | undefined {
    return this.bots.get(id);
  }
  
  public getBotsByType(type: BotType): Bot[] {
    return Array.from(this.bots.values()).filter(bot => bot.type === type);
  }
  
  public getBotsByStatus(status: BotStatus): Bot[] {
    return Array.from(this.bots.values()).filter(bot => bot.status === status);
  }

  public startBot(id: string): boolean {
    const bot = this.bots.get(id);
    if (!bot) return false;
    
    // Check if we can start another operation
    if (this.getActiveBotCount() >= this.maxConcurrentOperations) {
      this.addLog(id, "Cannot start bot: maximum concurrent operations reached");
      return false;
    }
    
    bot.status = 'active';
    bot.lastRun = 'just now';
    this.addLog(id, "Bot started");
    this.bots.set(id, bot);
    this.emitBotUpdatedEvent();
    return true;
  }
  
  public stopBot(id: string): boolean {
    const bot = this.bots.get(id);
    if (!bot || bot.status !== 'active') return false;
    
    bot.status = 'idle';
    this.addLog(id, "Bot stopped");
    this.bots.set(id, bot);
    this.emitBotUpdatedEvent();
    return true;
  }

  public updateBotConfig(id: string, config: Partial<BotConfig>): boolean {
    const bot = this.bots.get(id);
    if (!bot) return false;
    
    bot.config = { ...bot.config, ...config };
    this.addLog(id, "Bot configuration updated");
    this.bots.set(id, bot);
    return true;
  }

  public updateBotSchedule(id: string, schedule: Partial<BotSchedule>): boolean {
    const bot = this.bots.get(id);
    if (!bot) return false;
    
    bot.schedule = { ...bot.schedule, ...schedule };
    this.addLog(id, "Bot schedule updated");
    this.bots.set(id, bot);
    return true;
  }
  
  public updateBotProxy(id: string, proxy: Partial<BotProxy>): boolean {
    const bot = this.bots.get(id);
    if (!bot) return false;
    
    bot.proxy = { ...bot.proxy, ...proxy };
    this.addLog(id, "Bot proxy settings updated");
    this.bots.set(id, bot);
    return true;
  }
  
  public rotateIp(id: string): boolean {
    const bot = this.bots.get(id);
    if (!bot) return false;
    
    // Use the proxy service to get a new IP
    proxyService.rotateIp(id)
      .then(ip => {
        if (ip) {
          this.addLog(id, `IP rotated to ${ip}`);
        } else {
          this.addLog(id, "IP rotation failed - no healthy proxies available");
        }
      })
      .catch(err => {
        this.addLog(id, `IP rotation error: ${err.message}`);
      });
    
    return true;
  }

  public createBot(botData: Partial<Bot>): string {
    // Generate a new unique ID
    const newId = (Math.max(...Array.from(this.bots.keys()).map(id => parseInt(id)), 0) + 1).toString();
    
    const newBot: Bot = {
      id: newId,
      name: botData.name || `New Bot ${newId}`,
      description: botData.description || "A new bot",
      status: "idle" as BotStatus,
      type: botData.type || "content" as BotType,
      config: botData.config || this.getDefaultConfig(),
      schedule: botData.schedule || this.getDefaultSchedule(),
      proxy: botData.proxy || this.getDefaultProxy(),
      lastRun: "Never",
      logs: [],
      createdAt: new Date().toISOString()
    };
    
    this.bots.set(newId, newBot);
    this.addLog(newId, "Bot created");
    this.emitBotUpdatedEvent();
    return newId;
  }

  public addLog(id: string, message: string): void {
    const bot = this.bots.get(id);
    if (!bot) return;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    bot.logs.unshift({ time, message });
    
    // Keep logs manageable
    if (bot.logs.length > 100) {
      bot.logs = bot.logs.slice(0, 100);
    }
    
    this.bots.set(id, bot);
    // Minor log updates don't trigger the full event
  }
  
  public setMaxConcurrentOperations(count: number): void {
    this.maxConcurrentOperations = count;
  }
  
  public getMaxConcurrentOperations(): number {
    return this.maxConcurrentOperations;
  }
  
  public getActiveBotCount(): number {
    return Array.from(this.bots.values()).filter(bot => bot.status === 'active').length;
  }
  
  public getBotHealth(): number {
    const bots = Array.from(this.bots.values());
    if (bots.length === 0) return 100;
    
    const errorBots = bots.filter(bot => bot.status === 'error').length;
    return Math.round(((bots.length - errorBots) / bots.length) * 100);
  }

  public searchBots(term: string): Bot[] {
    const lowerTerm = term.toLowerCase();
    return Array.from(this.bots.values()).filter(bot => 
      bot.name.toLowerCase().includes(lowerTerm) || 
      bot.description.toLowerCase().includes(lowerTerm)
    );
  }

  public duplicateBot(id: string): string | null {
    const bot = this.bots.get(id);
    if (!bot) return null;
    
    const newBot = {...bot};
    const newId = (Math.max(...Array.from(this.bots.keys()).map(id => parseInt(id)), 0) + 1).toString();
    newBot.id = newId;
    newBot.name = `${bot.name} (Copy)`;
    newBot.status = "idle";
    newBot.lastRun = "Never";
    newBot.logs = [];
    
    this.bots.set(newId, newBot);
    this.addLog(newId, "Bot created as duplicate");
    return newId;
  }

  public getAllEmailAccounts(): EmailAccount[] {
    return Array.from(this.emailAccounts.values());
  }
  
  public getEmailAccount(id: string): EmailAccount | undefined {
    return this.emailAccounts.get(id);
  }
  
  public addEmailAccount(email: string, password: string): string {
    const newId = (Math.max(...Array.from(this.emailAccounts.keys()).map(id => parseInt(id)), 0) + 1).toString();
    
    const newAccount: EmailAccount = {
      id: newId,
      email,
      password,
      isInUse: false,
      status: 'active'
    };
    
    this.emailAccounts.set(newId, newAccount);
    return newId;
  }
  
  public deleteEmailAccount(id: string): boolean {
    // Check if email is in use by any bot
    const isUsed = Array.from(this.bots.values()).some(
      bot => bot.emailAccounts?.includes(id)
    );
    
    if (isUsed) {
      return false;
    }
    
    return this.emailAccounts.delete(id);
  }
  
  public assignEmailAccountToBot(emailId: string, botId: string): boolean {
    const bot = this.bots.get(botId);
    const email = this.emailAccounts.get(emailId);
    
    if (!bot || !email) return false;
    
    // Create emailAccounts array if it doesn't exist
    if (!bot.emailAccounts) {
      bot.emailAccounts = [];
    }
    
    // Add email if not already assigned
    if (!bot.emailAccounts.includes(emailId)) {
      bot.emailAccounts.push(emailId);
      
      // Mark email as in use
      email.isInUse = true;
      email.lastUsed = new Date().toISOString().split('T')[0];
      this.emailAccounts.set(emailId, email);
      
      this.bots.set(botId, bot);
      this.addLog(botId, `Email account ${email.email} assigned to bot`);
      return true;
    }
    
    return false;
  }
  
  public removeEmailAccountFromBot(emailId: string, botId: string): boolean {
    const bot = this.bots.get(botId);
    const email = this.emailAccounts.get(emailId);
    
    if (!bot || !email || !bot.emailAccounts) return false;
    
    // Filter out the email ID
    bot.emailAccounts = bot.emailAccounts.filter(id => id !== emailId);
    
    // Mark email as not in use if not assigned to any other bot
    const isUsedByOtherBot = Array.from(this.bots.values()).some(
      otherBot => otherBot.id !== botId && otherBot.emailAccounts?.includes(emailId)
    );
    
    if (!isUsedByOtherBot) {
      email.isInUse = false;
      this.emailAccounts.set(emailId, email);
    }
    
    this.bots.set(botId, bot);
    this.addLog(botId, `Email account ${email.email} removed from bot`);
    return true;
  }
  
  public getBotEmailAccounts(botId: string): EmailAccount[] {
    const bot = this.bots.get(botId);
    if (!bot || !bot.emailAccounts || bot.emailAccounts.length === 0) return [];
    
    return bot.emailAccounts
      .map(id => this.emailAccounts.get(id))
      .filter((email): email is EmailAccount => email !== undefined);
  }

  private getDefaultConfig(): BotConfig {
    return {
      actionDelay: [1500, 3000],
      mouseMovement: 'natural',
      scrollPattern: 'variable',
      randomnessFactor: 0.8,
      sessionVariability: 0.25,
      behaviorProfile: 'Gen-Z Content Consumer'
    };
  }

  private getDefaultSchedule(): BotSchedule {
    return {
      active: true,
      startTime: "08:00",
      endTime: "22:00",
      breakDuration: [15, 30],
      daysActive: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    };
  }

  private getDefaultProxy(): BotProxy {
    return {
      useRotation: true,
      rotationFrequency: 60,
      provider: "luminati",
      regions: ["us", "ca", "uk", "au"]
    };
  }

  // Helper method to emit an event when the bot list changes
  private emitBotUpdatedEvent(): void {
    const event = new CustomEvent(BOT_UPDATED_EVENT, {
      detail: { botCount: this.bots.size }
    });
    document.dispatchEvent(event);
  }
}

// Create a singleton instance
export const botService = new BotService();
