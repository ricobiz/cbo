
import { botService, BotActivity, Bot } from './BotService';

/**
 * Service to handle bot activities specifically
 */
class BotActivityService {
  /**
   * Get all current activities for all bots
   * @returns Record of bot IDs mapped to their current activities
   */
  public getAllBotActivities(): Record<string, BotActivity | undefined> {
    const activities: Record<string, BotActivity | undefined> = {};
    
    // Get all bots from the botService
    const bots = botService.getAllBots();
    
    // Extract current activity for each bot
    bots.forEach(bot => {
      if (bot.currentActivity) {
        activities[bot.id] = bot.currentActivity;
      }
    });
    
    return activities;
  }
}

// Create a singleton instance
export const botActivityService = new BotActivityService();
