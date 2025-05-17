
import { API_CONFIG, API_TIMEOUT } from '@/config/api';

/**
 * Сервис для работы с внешним API
 */
export class ApiService {
  private baseUrl: string;
  private offlineMode: boolean;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
    this.offlineMode = localStorage.getItem('offlineMode') === 'true';
  }

  /**
   * Установить режим работы (онлайн/оффлайн)
   */
  setOfflineMode(mode: boolean): void {
    this.offlineMode = mode;
    localStorage.setItem('offlineMode', String(mode));
  }

  /**
   * Проверить текущий режим работы
   */
  isOfflineMode(): boolean {
    return this.offlineMode;
  }

  /**
   * Выполнить запрос к API
   */
  async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    customConfig: RequestInit = {}
  ): Promise<T> {
    if (this.offlineMode) {
      throw new Error('API_OFFLINE_MODE');
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...customConfig.headers,
      },
      signal: controller.signal,
      ...customConfig,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `API error: ${response.status} ${response.statusText}`
        );
      }
      
      return await response.json();
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new Error('API request timed out');
      }
      throw error;
    }
  }

  /**
   * GET запрос
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | string[]>): Promise<T> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      });
      
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return this.request<T>(url, 'GET');
  }

  /**
   * POST запрос
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, 'POST', data);
  }

  /**
   * PUT запрос
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, 'PUT', data);
  }

  /**
   * DELETE запрос
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, 'DELETE');
  }
}

export const apiService = new ApiService();
