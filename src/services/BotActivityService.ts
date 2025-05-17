
import { Bot, BotActivity, BotActivityType } from './BotService';
import { botService } from './BotService';

// Map to store current bot activities
const botActivities: Record<string, BotActivity> = {};

class BotActivityService {
  // Get all current bot activities
  getAllBotActivities(): Record<string, BotActivity | undefined> {
    // Return all tracked activities
    return botService.getAllBots().reduce((activities, bot) => {
      activities[bot.id] = bot.currentActivity || botActivities[bot.id];
      return activities;
    }, {} as Record<string, BotActivity | undefined>);
  }

  // Get activity for a specific bot
  getBotActivity(botId: string): BotActivity | undefined {
    const bot = botService.getBotById(botId);
    // Since Bot might not have currentActivity property, check botActivities map first
    return botActivities[botId] || (bot && bot.currentActivity);
  }

  // Update a bot's activity
  updateBotActivity(botId: string, activityType: BotActivityType, details: string, target?: string): BotActivity {
    const activity: BotActivity = {
      botId,
      type: activityType,
      details,
      target,
      timestamp: new Date().toISOString()
    };

    // Store in our local cache
    botActivities[botId] = activity;
    
    // Also try to update the bot object directly
    const bot = botService.getBotById(botId);
    if (bot) {
      // Update via spread to ensure we're not mutating the original object
      const updatedBot = { ...bot, currentActivity: activity };
      // This update might be lost unless we have proper state management
    }

    return activity;
  }

  // Clear a bot's activity
  clearBotActivity(botId: string): boolean {
    if (botActivities[botId]) {
      delete botActivities[botId];
      return true;
    }
    return false;
  }

  // Generate simulated activity based on bot type
  generateRandomActivity(bot: Bot): BotActivity | null {
    if (bot.status !== 'active') return null;

    // Different activity types for different bot types
    let activityType: BotActivityType;
    let details = '';
    let target = '';

    switch (bot.type) {
      case 'content':
        activityType = 'content_creation';
        details = `Creating ${['video', 'post', 'article', 'image'][Math.floor(Math.random() * 4)]} content`;
        target = ['YouTube', 'Instagram', 'TikTok', 'Blog'][Math.floor(Math.random() * 4)];
        break;
        
      case 'interaction':
        activityType = 'engagement';
        details = `${['Liking', 'Commenting on', 'Sharing', 'Following'][Math.floor(Math.random() * 4)]} content`;
        target = ['post', 'profile', 'page', 'thread'][Math.floor(Math.random() * 4)];
        break;
        
      case 'click':
        activityType = 'browsing';
        details = `Browsing ${['videos', 'articles', 'profiles', 'products'][Math.floor(Math.random() * 4)]}`;
        target = `${Math.floor(Math.random() * 100)} items viewed`;
        break;
        
      case 'parser':
        activityType = 'data_collection';
        details = `Collecting ${['pricing data', 'user profiles', 'comments', 'reviews'][Math.floor(Math.random() * 4)]}`;
        target = `${Math.floor(Math.random() * 1000)} items collected`;
        break;
        
      default:
        return null;
    }

    return this.updateBotActivity(bot.id, activityType, details, target);
  }
}

export const botActivityService = new BotActivityService();
