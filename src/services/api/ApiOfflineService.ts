
import { MockDataService } from "@/services/api/MockDataService";
import { toast } from "sonner";

/**
 * Сервис для работы в офлайн-режиме
 * Имитирует взаимодействие с API, используя локальные данные
 */
export class ApiOfflineService {
  /**
   * Выполнить GET-запрос в офлайн-режиме
   */
  async get<T>(endpoint: string): Promise<T> {
    console.log(`[Offline] GET request to: ${endpoint}`);
    
    // Добавляем небольшую задержку для имитации сетевого запроса
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (endpoint.startsWith('/bots')) {
      if (endpoint === '/bots') {
        return MockDataService.getBots() as unknown as T;
      }
      
      const matches = endpoint.match(/\/bots\/([^/?]+)/);
      if (matches && matches[1]) {
        const botId = matches[1];
        const bot = MockDataService.getBotById(botId);
        if (bot) {
          return bot as unknown as T;
        }
        throw new Error('Bot not found');
      }
    }
    
    if (endpoint.startsWith('/campaigns')) {
      if (endpoint === '/campaigns') {
        return MockDataService.getCampaigns() as unknown as T;
      }
      
      const matches = endpoint.match(/\/campaigns\/([^/?]+)/);
      if (matches && matches[1]) {
        const campaignId = matches[1];
        const campaign = MockDataService.getCampaignById(campaignId);
        if (campaign) {
          return campaign as unknown as T;
        }
        throw new Error('Campaign not found');
      }
    }
    
    if (endpoint === '/health' || endpoint === '/health/ping') {
      return {
        status: 'ok',
        message: 'Mock API server is running (OFFLINE MODE)',
        version: '1.0.0-offline',
        system: {
          os: 'Mock OS',
          python: '3.11.0-mock'
        }
      } as unknown as T;
    }
    
    console.warn(`[Offline] Unhandled GET endpoint: ${endpoint}`);
    throw new Error(`Endpoint not implemented in offline mode: ${endpoint}`);
  }
  
  /**
   * Выполнить POST-запрос в офлайн-режиме
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    console.log(`[Offline] POST request to: ${endpoint}`, data);
    
    // Добавляем небольшую задержку для имитации сетевого запроса
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (endpoint === '/bots') {
      return MockDataService.createBot(data) as unknown as T;
    }
    
    if (endpoint === '/campaigns') {
      return MockDataService.createCampaign(data) as unknown as T;
    }
    
    console.warn(`[Offline] Unhandled POST endpoint: ${endpoint}`);
    throw new Error(`Endpoint not implemented in offline mode: ${endpoint}`);
  }
  
  /**
   * Выполнить PUT-запрос в офлайн-режиме
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    console.log(`[Offline] PUT request to: ${endpoint}`, data);
    
    // Добавляем небольшую задержку для имитации сетевого запроса
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const botMatches = endpoint.match(/\/bots\/([^/?]+)/);
    if (botMatches && botMatches[1]) {
      const botId = botMatches[1];
      const bot = MockDataService.updateBot(botId, data);
      if (bot) {
        return bot as unknown as T;
      }
      throw new Error('Bot not found');
    }
    
    const campaignMatches = endpoint.match(/\/campaigns\/([^/?]+)/);
    if (campaignMatches && campaignMatches[1]) {
      const campaignId = campaignMatches[1];
      const campaign = MockDataService.updateCampaign(campaignId, data);
      if (campaign) {
        return campaign as unknown as T;
      }
      throw new Error('Campaign not found');
    }
    
    console.warn(`[Offline] Unhandled PUT endpoint: ${endpoint}`);
    throw new Error(`Endpoint not implemented in offline mode: ${endpoint}`);
  }
  
  /**
   * Выполнить DELETE-запрос в офлайн-режиме
   */
  async delete<T>(endpoint: string): Promise<T> {
    console.log(`[Offline] DELETE request to: ${endpoint}`);
    
    // Добавляем небольшую задержку для имитации сетевого запроса
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const botMatches = endpoint.match(/\/bots\/([^/?]+)/);
    if (botMatches && botMatches[1]) {
      const botId = botMatches[1];
      const deleted = MockDataService.deleteBot(botId);
      if (deleted) {
        return { success: true } as unknown as T;
      }
      throw new Error('Bot not found');
    }
    
    const campaignMatches = endpoint.match(/\/campaigns\/([^/?]+)/);
    if (campaignMatches && campaignMatches[1]) {
      const campaignId = campaignMatches[1];
      const deleted = MockDataService.deleteCampaign(campaignId);
      if (deleted) {
        return { success: true } as unknown as T;
      }
      throw new Error('Campaign not found');
    }
    
    console.warn(`[Offline] Unhandled DELETE endpoint: ${endpoint}`);
    throw new Error(`Endpoint not implemented in offline mode: ${endpoint}`);
  }
  
  /**
   * Выполнить запрос в офлайн-режиме (общий метод)
   */
  async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    try {
      switch (method) {
        case 'GET':
          return await this.get<T>(endpoint);
        case 'POST':
          return await this.post<T>(endpoint, body);
        case 'PUT':
          return await this.put<T>(endpoint, body);
        case 'DELETE':
          return await this.delete<T>(endpoint);
        default:
          throw new Error(`Unsupported method in offline mode: ${method}`);
      }
    } catch (error) {
      console.error(`[Offline] Error during ${method} request to ${endpoint}:`, error);
      
      // Показываем уведомление только для неимплементированных эндпоинтов
      if ((error as Error).message.includes('not implemented')) {
        toast.error("Функция недоступна в офлайн-режиме", {
          description: `Эндпоинт ${endpoint} не реализован в офлайн-версии`
        });
      }
      
      throw error;
    }
  }
}

export const apiOfflineService = new ApiOfflineService();
