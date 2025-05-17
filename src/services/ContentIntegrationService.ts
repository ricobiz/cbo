
import { CampaignService } from "./CampaignService";
import { Campaign, CampaignAction } from "./types/campaign";
import { toast } from "@/components/ui/use-toast";

/**
 * Service for integrating generated content with campaigns
 */
export class ContentIntegrationService {
  private static CONTENT_HISTORY_KEY = "contentIntegrationHistory";

  /**
   * Add generated text content to a campaign
   */
  static addTextContentToCampaign(
    campaignId: string,
    content: string,
    platform: string,
    contentType: string
  ): Campaign | undefined {
    try {
      const campaign = CampaignService.getCampaignById(campaignId);
      
      if (!campaign) {
        console.error(`Campaign with ID ${campaignId} not found`);
        return undefined;
      }
      
      // Create new action for the campaign
      const action: CampaignAction = {
        id: Date.now().toString(),
        type: 'post',
        status: 'pending',
        scheduledFor: new Date(Date.now() + 3600000).toISOString(), // Default to 1 hour from now
        platform: platform as any,
        details: {
          content,
          contentType,
          source: 'ai-generator'
        }
      };
      
      // Add action to campaign
      const updatedCampaign = CampaignService.addCampaignAction(campaignId, action);
      
      // Save to integration history
      this.saveToIntegrationHistory({
        id: Date.now().toString(),
        campaignId,
        campaignName: campaign.name,
        contentType: 'text',
        platform,
        content: content.length > 100 ? content.substring(0, 100) + '...' : content,
        timestamp: new Date().toISOString()
      });
      
      return updatedCampaign;
    } catch (error) {
      console.error("Error adding content to campaign:", error);
      return undefined;
    }
  }

  /**
   * Add generated image content to a campaign
   */
  static addImageContentToCampaign(
    campaignId: string,
    imageUrl: string,
    platform: string,
    description: string
  ): Campaign | undefined {
    try {
      const campaign = CampaignService.getCampaignById(campaignId);
      
      if (!campaign) {
        console.error(`Campaign with ID ${campaignId} not found`);
        return undefined;
      }
      
      // Create new action for the campaign
      const action: CampaignAction = {
        id: Date.now().toString(),
        type: 'post',
        status: 'pending',
        scheduledFor: new Date(Date.now() + 3600000).toISOString(), // Default to 1 hour from now
        platform: platform as any,
        details: {
          imageUrl,
          description,
          contentType: 'image',
          source: 'ai-generator'
        }
      };
      
      // Add action to campaign
      const updatedCampaign = CampaignService.addCampaignAction(campaignId, action);
      
      // Save to integration history
      this.saveToIntegrationHistory({
        id: Date.now().toString(),
        campaignId,
        campaignName: campaign.name,
        contentType: 'image',
        platform,
        content: description,
        mediaUrl: imageUrl,
        timestamp: new Date().toISOString()
      });
      
      return updatedCampaign;
    } catch (error) {
      console.error("Error adding image to campaign:", error);
      return undefined;
    }
  }

  /**
   * Add generated audio content to a campaign
   */
  static addAudioContentToCampaign(
    campaignId: string,
    audioUrl: string,
    platform: string,
    description: string
  ): Campaign | undefined {
    try {
      const campaign = CampaignService.getCampaignById(campaignId);
      
      if (!campaign) {
        console.error(`Campaign with ID ${campaignId} not found`);
        return undefined;
      }
      
      // Create new action for the campaign
      const action: CampaignAction = {
        id: Date.now().toString(),
        type: 'post',
        status: 'pending',
        scheduledFor: new Date(Date.now() + 3600000).toISOString(), // Default to 1 hour from now
        platform: platform as any,
        details: {
          audioUrl,
          description,
          contentType: 'audio',
          source: 'ai-generator'
        }
      };
      
      // Add action to campaign
      const updatedCampaign = CampaignService.addCampaignAction(campaignId, action);
      
      // Save to integration history
      this.saveToIntegrationHistory({
        id: Date.now().toString(),
        campaignId,
        campaignName: campaign.name,
        contentType: 'audio',
        platform,
        content: description,
        mediaUrl: audioUrl,
        timestamp: new Date().toISOString()
      });
      
      return updatedCampaign;
    } catch (error) {
      console.error("Error adding audio to campaign:", error);
      return undefined;
    }
  }

  /**
   * Get all active campaigns for content integration
   */
  static getActiveCampaignsForContent(): Array<{
    id: string;
    name: string;
    platform: string;
    type: string;
  }> {
    try {
      const allCampaigns = CampaignService.getAllCampaigns();
      const activeCampaigns = allCampaigns.filter(
        campaign => campaign.status === 'active' || campaign.status === 'draft'
      );
      
      return activeCampaigns.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        platform: campaign.platforms.join(', '),
        type: campaign.type
      }));
    } catch (error) {
      console.error("Error getting active campaigns:", error);
      return [];
    }
  }

  /**
   * Get integration history
   */
  static getIntegrationHistory(): Array<{
    id: string;
    campaignId: string;
    campaignName: string;
    contentType: 'text' | 'image' | 'audio';
    platform: string;
    content: string;
    mediaUrl?: string;
    timestamp: string;
  }> {
    try {
      const history = localStorage.getItem(this.CONTENT_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error("Error retrieving content integration history:", error);
      return [];
    }
  }

  /**
   * Save to integration history
   */
  private static saveToIntegrationHistory(item: {
    id: string;
    campaignId: string;
    campaignName: string;
    contentType: 'text' | 'image' | 'audio';
    platform: string;
    content: string;
    mediaUrl?: string;
    timestamp: string;
  }) {
    try {
      const history = this.getIntegrationHistory();
      const updatedHistory = [item, ...history.slice(0, 49)]; // Keep last 50 items
      localStorage.setItem(this.CONTENT_HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error saving to content integration history:", error);
    }
  }
}
