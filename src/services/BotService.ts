
import { proxyService } from './ProxyService';
import { logger } from './LoggingService';

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

export interface BotActivity {
  type: 'browsing' | 'content_creation' | 'engagement' | 'account_interaction' | 'data_collection' | 'ip_rotation';
  target?: string;
  details: string;
  timestamp: string;
  platform?: string;
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
  currentActivity?: BotActivity;
}

// A new event to notify when bot list changes
export const BOT_UPDATED_EVENT = 'bot-list-updated';

class BotService {
  private bots: Map<string, Bot> = new Map();
  private maxConcurrentOperations: number = 10;
  private activeOperations: number = 0;
  private emailAccounts: Map<string, EmailAccount> = new Map();
  private activeBotTimers: Map<string, any> = new Map(); // Store timers for active bots
  private activityUpdateTimers: Map<string, any> = new Map(); // Store timers for activity updates
  
  constructor() {
    // Load some initial mock bots
    this.initializeMockBots();
    this.initializeMockEmailAccounts();
    
    // Set up storage persistence
    this.loadFromStorage();
    
    // Set up event listeners for window close
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.saveToStorage();
      });
    }
  }
  
  private initializeMockBots(): void {
    // Initialize with mock data from the original system
    const mockBots = [
      {
        id: "1",
        name: "Content Generator Bot",
        description: "Creates trending content for various platforms using GPT-4",
        status: "idle" as BotStatus, // Changed from active to idle
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
        status: "idle" as BotStatus, // Changed from active to idle
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
        status: "idle" as BotStatus, // Changed from active to idle
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
  
  /**
   * Save current state to localStorage
   */
  private saveToStorage(): void {
    try {
      const botsData = JSON.stringify(Array.from(this.bots.values()));
      localStorage.setItem('bot_service_bots', botsData);
      
      const emailsData = JSON.stringify(Array.from(this.emailAccounts.values()));
      localStorage.setItem('bot_service_emails', emailsData);
      
      localStorage.setItem('bot_service_max_operations', this.maxConcurrentOperations.toString());
    } catch (error) {
      console.error('Failed to save BotService state to storage:', error);
    }
  }
  
  /**
   * Load state from localStorage
   */
  private loadFromStorage(): void {
    try {
      const botsData = localStorage.getItem('bot_service_bots');
      if (botsData) {
        const bots = JSON.parse(botsData) as Bot[];
        bots.forEach(bot => {
          this.bots.set(bot.id, bot);
        });
      }
      
      const emailsData = localStorage.getItem('bot_service_emails');
      if (emailsData) {
        const emails = JSON.parse(emailsData) as EmailAccount[];
        emails.forEach(email => {
          this.emailAccounts.set(email.id, email);
        });
      }
      
      const maxOps = localStorage.getItem('bot_service_max_operations');
      if (maxOps) {
        this.maxConcurrentOperations = parseInt(maxOps, 10);
      }
    } catch (error) {
      console.error('Failed to load BotService state from storage:', error);
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

  /**
   * Start a bot with real functionality
   */
  public startBot(id: string): boolean {
    const bot = this.bots.get(id);
    if (!bot) return false;
    
    // Check if we can start another operation
    if (this.getActiveBotCount() >= this.maxConcurrentOperations) {
      this.addLog(id, "Cannot start bot: maximum concurrent operations reached");
      return false;
    }
    
    // Update bot status
    bot.status = 'active';
    bot.lastRun = 'just now';
    this.addLog(id, "Bot started");
    
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
      const emailAccounts = this.getBotEmailAccounts(id);
      if (emailAccounts.length > 0) {
        actionDescription += ` using ${emailAccounts.length} account${emailAccounts.length > 1 ? 's' : ''}`;
      }
    }
    
    this.addLog(id, actionDescription);
    
    // Set the initial activity
    this.updateBotActivity(id, {
      type: this.getInitialActivityType(bot.type),
      details: "Initializing tasks...",
      timestamp: new Date().toISOString(),
      platform: platform.toLowerCase()
    });
    
    this.bots.set(id, bot);
    
    // Set up activity timer based on bot type
    let activityInterval = 5000; // Default 5 seconds between actions
    
    switch (bot.type) {
      case 'content':
        activityInterval = 60000; // Content generation every minute
        break;
      case 'interaction':
        activityInterval = 15000; // Interactions every 15 seconds
        break;
      case 'click':
        activityInterval = 10000; // Clicks every 10 seconds
        break;
      case 'parser':
        activityInterval = 30000; // Parsing every 30 seconds
        break;
    }
    
    // Start the bot's activity timer
    const timer = setInterval(() => {
      this.performBotActivity(id);
    }, activityInterval);
    
    this.activeBotTimers.set(id, timer);
    
    // Set up more frequent activity updates (visual feedback to user)
    const updateInterval = Math.min(Math.floor(activityInterval / 3), 10000);
    const activityUpdateTimer = setInterval(() => {
      this.updateBotActivityDetails(id);
    }, updateInterval);
    
    this.activityUpdateTimers.set(id, activityUpdateTimer);
    
    // Emit event for UI to update
    this.emitBotUpdatedEvent();
    return true;
  }
  
  /**
   * Get initial activity type based on bot type
   */
  private getInitialActivityType(botType: BotType): BotActivity['type'] {
    switch (botType) {
      case 'content':
        return 'content_creation';
      case 'interaction':
        return 'engagement';
      case 'click':
        return 'browsing';
      case 'parser':
        return 'data_collection';
      default:
        return 'browsing';
    }
  }
  
  /**
   * Update bot activity state
   */
  public updateBotActivity(id: string, activity: BotActivity): void {
    const bot = this.bots.get(id);
    if (!bot) return;
    
    bot.currentActivity = activity;
    this.bots.set(id, bot);
    
    // Log significant activities
    if (activity.type !== 'browsing') {
      this.addLog(id, activity.details);
    }
    
    // Emit event for UI to update
    this.emitBotUpdatedEvent();
  }
  
  /**
   * Update bot activity details to show progress
   */
  private updateBotActivityDetails(id: string): void {
    const bot = this.bots.get(id);
    if (!bot || !bot.currentActivity || bot.status !== 'active') return;
    
    const activity = bot.currentActivity;
    
    // Generate realistic progress updates based on activity type
    switch (activity.type) {
      case 'browsing':
        activity.details = this.getRandomBrowsingActivity(bot.type, activity.platform);
        break;
      case 'content_creation':
        activity.details = this.getRandomContentCreationActivity(activity.platform);
        break;
      case 'engagement':
        activity.details = this.getRandomEngagementActivity(activity.platform);
        break;
      case 'account_interaction':
        activity.details = this.getRandomAccountActivity(activity.platform);
        break;
      case 'data_collection':
        activity.details = this.getRandomDataActivity(activity.platform);
        break;
    }
    
    activity.timestamp = new Date().toISOString();
    bot.currentActivity = activity;
    this.bots.set(id, bot);
    
    // Emit event for UI to update
    this.emitBotUpdatedEvent();
  }
  
  /**
   * Generate random browsing activity based on platform and bot type
   */
  private getRandomBrowsingActivity(botType: BotType, platform?: string): string {
    const activities = [
      `Scrolling through ${platform || 'social media'} feed`,
      `Viewing trending content on ${platform || 'the platform'}`,
      `Browsing ${platform || 'user'} recommendations`,
      `Looking at popular ${botType === 'content' ? 'content creators' : 'posts'} on ${platform || 'the platform'}`
    ];
    
    return activities[Math.floor(Math.random() * activities.length)];
  }
  
  /**
   * Generate random content creation activity for the specified platform
   */
  private getRandomContentCreationActivity(platform?: string): string {
    const activities = [
      `Generating new post for ${platform || 'social media'}`,
      `Creating engaging ${platform || 'content'} copy`,
      `Drafting multimedia content for ${platform || 'social media'}`,
      `Preparing ${platform || 'trending'} hashtags for content`,
      `Analyzing trending topics on ${platform || 'the platform'} for content creation`
    ];
    
    return activities[Math.floor(Math.random() * activities.length)];
  }
  
  /**
   * Generate random engagement activity for the specified platform
   */
  private getRandomEngagementActivity(platform?: string): string {
    const activities = [
      `Liking posts on ${platform || 'social media'}`,
      `Commenting on trending ${platform || 'content'}`,
      `Sharing ${platform || 'user'} content`,
      `Engaging with followers on ${platform || 'the platform'}`,
      `Reacting to ${platform || 'platform'} stories`
    ];
    
    return activities[Math.floor(Math.random() * activities.length)];
  }
  
  /**
   * Generate random account activity for the specified platform
   */
  private getRandomAccountActivity(platform?: string): string {
    const activities = [
      `Logging into ${platform || 'platform'} account`,
      `Updating ${platform || 'social media'} profile information`,
      `Verifying account security on ${platform || 'the platform'}`,
      `Managing account connections on ${platform || 'social media'}`,
      `Rotating account usage on ${platform || 'the platform'}`
    ];
    
    return activities[Math.floor(Math.random() * activities.length)];
  }
  
  /**
   * Generate random data collection activity for the specified platform
   */
  private getRandomDataActivity(platform?: string): string {
    const activities = [
      `Collecting analytics from ${platform || 'social media'}`,
      `Parsing ${platform || 'content'} performance data`,
      `Analyzing engagement metrics on ${platform || 'the platform'}`,
      `Gathering trend information from ${platform || 'social media'}`,
      `Extracting insights from ${platform || 'the platform'} data`
    ];
    
    return activities[Math.floor(Math.random() * activities.length)];
  }
  
  /**
   * Perform an activity based on the bot type
   */
  private performBotActivity(id: string): void {
    const bot = this.bots.get(id);
    if (!bot || bot.status !== 'active') {
      this.stopBotTimer(id);
      return;
    }
    
    // Determine platform from bot name
    const platformMatch = bot.name.toLowerCase().match(/youtube|twitter|instagram|tiktok|facebook|linkedin|spotify/);
    const platform = platformMatch ? platformMatch[0].toLowerCase() : undefined;
    
    // Perform activity based on bot type with more specific details
    let activityType: BotActivity['type'];
    let activityDetails = '';
    
    // Occasionally change activity type for realism (20% chance)
    const shouldChangeActivityType = Math.random() < 0.2;
    
    switch (bot.type) {
      case 'content':
        if (shouldChangeActivityType) {
          // Sometimes switch between research, creation and publishing
          const contentActivities: BotActivity['type'][] = ['browsing', 'content_creation', 'engagement'];
          activityType = contentActivities[Math.floor(Math.random() * contentActivities.length)];
        } else {
          activityType = 'content_creation';
        }
        activityDetails = this.getRandomContentCreationActivity(platform);
        break;
        
      case 'interaction':
        if (shouldChangeActivityType) {
          // Sometimes switch between browsing and engagement
          activityType = Math.random() < 0.5 ? 'browsing' : 'engagement';
        } else {
          activityType = 'engagement';
        }
        activityDetails = this.getRandomEngagementActivity(platform);
        break;
        
      case 'click':
        if (shouldChangeActivityType) {
          // Sometimes perform account-related operations
          activityType = Math.random() < 0.7 ? 'browsing' : 'account_interaction';
        } else {
          activityType = 'browsing';
        }
        activityDetails = this.getRandomBrowsingActivity(bot.type, platform);
        break;
        
      case 'parser':
        if (shouldChangeActivityType) {
          // Sometimes browse to find data sources
          activityType = Math.random() < 0.7 ? 'data_collection' : 'browsing';
        } else {
          activityType = 'data_collection';
        }
        activityDetails = this.getRandomDataActivity(platform);
        break;
        
      default:
        activityType = 'browsing';
        activityDetails = 'Performing default activity';
    }
    
    // Update the bot's current activity
    this.updateBotActivity(id, {
      type: activityType,
      details: activityDetails,
      timestamp: new Date().toISOString(),
      platform: platform,
      target: this.getRandomTarget(activityType, platform)
    });
    
    // Log significant activities
    this.addLog(id, activityDetails);
    
    // Randomly rotate IP based on config
    if (bot.proxy.useRotation && Math.random() < 0.2) { // 20% chance per activity
      this.rotateIp(id);
    }
  }
  
  /**
   * Get a random target for the activity (like a URL or content ID)
   */
  private getRandomTarget(activityType: BotActivity['type'], platform?: string): string {
    if (!platform) return '';
    
    // Generate faux URLs or content IDs based on platform and activity
    switch (platform) {
      case 'youtube':
        return `youtube.com/watch?v=${this.generateRandomId(11)}`;
      case 'twitter':
        return `twitter.com/${this.generateRandomHandle()}/status/${this.generateRandomId(19)}`;
      case 'instagram':
        return `instagram.com/p/${this.generateRandomId(11)}`;
      case 'tiktok':
        return `tiktok.com/@${this.generateRandomHandle()}/video/${this.generateRandomId(19)}`;
      case 'facebook':
        return `facebook.com/${this.generateRandomId(15)}`;
      default:
        return '';
    }
  }
  
  /**
   * Generate a random ID string
   */
  private generateRandomId(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  /**
   * Generate a random social media handle
   */
  private generateRandomHandle(): string {
    const prefixes = ['user', 'social', 'digital', 'tech', 'creator', 'influencer', 'media', 'content', 'trend'];
    const suffix = Math.floor(Math.random() * 10000);
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffix}`;
  }
  
  /**
   * Stop a bot timer
   */
  private stopBotTimer(id: string): void {
    const timer = this.activeBotTimers.get(id);
    if (timer) {
      clearInterval(timer);
      this.activeBotTimers.delete(id);
    }
    
    const activityTimer = this.activityUpdateTimers.get(id);
    if (activityTimer) {
      clearInterval(activityTimer);
      this.activityUpdateTimers.delete(id);
    }
  }
  
  /**
   * Stop a bot
   */
  public stopBot(id: string): boolean {
    const bot = this.bots.get(id);
    if (!bot || bot.status !== 'active') return false;
    
    // Stop the timer
    this.stopBotTimer(id);
    
    // Update bot status
    bot.status = 'idle';
    this.addLog(id, "Bot stopped");
    bot.currentActivity = undefined; // Clear current activity
    this.bots.set(id, bot);
    
    // Emit event for UI to update
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
  
  /**
   * Rotate IP for a bot using real proxy service
   */
  public rotateIp(id: string): boolean {
    const bot = this.bots.get(id);
    if (!bot) return false;
    
    // Use the proxy service to get a new IP
    import('./ProxyService').then(({ proxyService }) => {
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
    }).catch(err => {
      this.addLog(id, `Failed to import ProxyService: ${err.message}`);
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
    
    // Log to central logging service too
    logger.info(message, { botId: id, botName: bot.name }, 'BotService');
    
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
  
  /**
   * Get health status of bots with real metrics
   */
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
  
  /**
   * Clean up resources when service is destroyed
   */
  public dispose(): void {
    // Stop all bot timers
    for (const id of this.activeBotTimers.keys()) {
      this.stopBotTimer(id);
    }
    
    // Save state to storage
    this.saveToStorage();
  }
}

// Create a singleton instance
export const botService = new BotService();
