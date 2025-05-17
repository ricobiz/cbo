import { Campaign, CampaignFilter, CampaignStatus, CampaignType, CampaignPlatform, CampaignAction } from "./types/campaign";

/**
 * Service for Campaign Management
 */
export class CampaignService {
  private static STORAGE_KEY = 'campaigns';

  /**
   * Get all campaigns from storage
   */
  static getAllCampaigns(): Campaign[] {
    try {
      const campaigns = localStorage.getItem(this.STORAGE_KEY);
      return campaigns ? JSON.parse(campaigns) : [];
    } catch (error) {
      console.error("Error retrieving campaigns:", error);
      return [];
    }
  }

  /**
   * Get a campaign by ID
   */
  static getCampaignById(id: string): Campaign | undefined {
    const campaigns = this.getAllCampaigns();
    return campaigns.find(campaign => campaign.id === id);
  }

  /**
   * Filter campaigns based on criteria
   */
  static filterCampaigns(filters: CampaignFilter): Campaign[] {
    let campaigns = this.getAllCampaigns();
    
    // Apply filters
    if (filters.status && filters.status.length > 0) {
      campaigns = campaigns.filter(campaign => filters.status!.includes(campaign.status));
    }
    
    if (filters.type && filters.type.length > 0) {
      campaigns = campaigns.filter(campaign => filters.type!.includes(campaign.type));
    }
    
    if (filters.platform && filters.platform.length > 0) {
      campaigns = campaigns.filter(campaign => 
        campaign.platforms.some(platform => filters.platform!.includes(platform))
      );
    }
    
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      campaigns = campaigns.filter(campaign => {
        const campaignStart = new Date(campaign.startDate).getTime();
        const rangeStart = new Date(start).getTime();
        const rangeEnd = new Date(end).getTime();
        return campaignStart >= rangeStart && campaignStart <= rangeEnd;
      });
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      campaigns = campaigns.filter(campaign => 
        campaign.name.toLowerCase().includes(searchLower) || 
        campaign.description.toLowerCase().includes(searchLower) ||
        campaign.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return campaigns;
  }

  /**
   * Save a campaign
   */
  static saveCampaign(campaign: Campaign): Campaign {
    const campaigns = this.getAllCampaigns();
    const existingIndex = campaigns.findIndex(c => c.id === campaign.id);
    
    if (existingIndex >= 0) {
      // Update existing campaign
      campaigns[existingIndex] = {
        ...campaign,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new campaign
      campaigns.push({
        ...campaign,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(campaigns));
    return campaign;
  }

  /**
   * Delete a campaign
   */
  static deleteCampaign(id: string): boolean {
    const campaigns = this.getAllCampaigns();
    const filteredCampaigns = campaigns.filter(campaign => campaign.id !== id);
    
    if (filteredCampaigns.length < campaigns.length) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredCampaigns));
      return true;
    }
    
    return false;
  }

  /**
   * Update campaign status
   */
  static updateCampaignStatus(id: string, status: CampaignStatus): Campaign | undefined {
    const campaign = this.getCampaignById(id);
    
    if (campaign) {
      const updatedCampaign = {
        ...campaign,
        status,
        updatedAt: new Date().toISOString()
      };
      
      this.saveCampaign(updatedCampaign);
      return updatedCampaign;
    }
    
    return undefined;
  }

  /**
   * Add action to campaign
   */
  static addCampaignAction(campaignId: string, action: CampaignAction): Campaign | undefined {
    const campaign = this.getCampaignById(campaignId);
    
    if (campaign) {
      const updatedCampaign = {
        ...campaign,
        actions: [...campaign.actions, action],
        updatedAt: new Date().toISOString()
      };
      
      this.saveCampaign(updatedCampaign);
      return updatedCampaign;
    }
    
    return undefined;
  }

  /**
   * Generate demo campaigns for first-time use
   */
  private static generateDemoCampaigns(): Campaign[] {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const demoCampaigns: Campaign[] = [
      {
        id: '1',
        name: 'Продвижение летней коллекции',
        description: 'Кампания по продвижению новой летней коллекции с использованием ИИ-ботов.',
        type: 'promotion',
        status: 'active',
        platforms: ['instagram', 'tiktok'],
        startDate: lastWeek.toISOString(),
        endDate: nextWeek.toISOString(),
        budget: 500,
        metrics: [
          { name: 'Просмотры', value: 12500, target: 20000, change: 15 },
          { name: 'Лайки', value: 4200, target: 10000, change: 25 },
          { name: 'Комментарии', value: 320, target: 1000, change: 10 }
        ],
        tags: ['лето', 'коллекция', 'мода'],
        actions: [
          {
            id: '101',
            type: 'post',
            status: 'completed',
            platform: 'instagram',
            completedAt: lastWeek.toISOString(),
            details: { content: 'Пост о запуске летней коллекции' },
            results: { likes: 1500, comments: 120 }
          },
          {
            id: '102',
            type: 'post',
            status: 'completed',
            platform: 'tiktok',
            completedAt: new Date(lastWeek.getTime() + 86400000).toISOString(),
            details: { content: 'TikTok видео о летней коллекции' },
            results: { views: 5600, likes: 950 }
          }
        ],
        createdAt: new Date(lastWeek.getTime() - 86400000 * 2).toISOString(),
        updatedAt: now.toISOString()
      },
      {
        id: '2',
        name: 'Запуск нового трека',
        description: 'Вирусное продвижение нового музыкального трека с использованием ИИ-ботов.',
        type: 'trend',
        status: 'draft',
        platforms: ['youtube', 'spotify', 'tiktok'],
        startDate: tomorrow.toISOString(),
        budget: 1200,
        metrics: [
          { name: 'Стримы', value: 0, target: 50000 },
          { name: 'Просмотры', value: 0, target: 100000 },
          { name: 'Репосты', value: 0, target: 5000 }
        ],
        tags: ['музыка', 'трек', 'запуск'],
        actions: [],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      }
    ];
    
    return demoCampaigns;
  }
}
