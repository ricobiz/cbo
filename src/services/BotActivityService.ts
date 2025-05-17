
import { Bot, BotActivity, BotActivityType } from './BotService';
import { botService } from './BotService';

// Map to store current bot activities
const botActivities: Record<string, BotActivity> = {};

class BotActivityService {
  // Get all current bot activities
  getAllBotActivities(): Record<string, BotActivity | undefined> {
    // Return only tracked activities - don't generate fake ones
    return botService.getAllBots().reduce((activities, bot) => {
      activities[bot.id] = botActivities[bot.id];
      return activities;
    }, {} as Record<string, BotActivity | undefined>);
  }

  // Get activity for a specific bot
  getBotActivity(botId: string): BotActivity | undefined {
    // Only return real activity data
    return botActivities[botId];
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

  // This is kept for future use when we implement real bot activities
  // For now, it doesn't generate any random activity
  generateRandomActivity(bot: Bot): BotActivity | null {
    // Only return null - we don't want to generate fake activity
    return null;
  }
}

export const botActivityService = new BotActivityService();
