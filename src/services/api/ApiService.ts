
import { API_CONFIG, API_TIMEOUT, DEFAULT_OFFLINE_MODE } from '@/config/api';
import { toast } from "@/hooks/use-toast";

/**
 * Сервис для работы с внешним API
 */
export class ApiService {
  private baseUrl: string;
  private offlineMode: boolean;
  private connectionErrorCount: number = 0;
  private maxRetryCount: number = 3;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
    // Check local storage first, then fall back to default
    const storedMode = localStorage.getItem('offlineMode');
    this.offlineMode = storedMode !== null ? storedMode === 'true' : DEFAULT_OFFLINE_MODE;
  }

  /**
   * Установить режим работы (онлайн/оффлайн)
   */
  setOfflineMode(mode: boolean): void {
    this.offlineMode = mode;
    localStorage.setItem('offlineMode', String(mode));
    
    // Reset error count when manually switching modes
    this.connectionErrorCount = 0;
    
    // Notify user of mode change
    const modeText = mode ? 'Оффлайн' : 'Онлайн';
    toast({
      title: `Режим ${modeText} активирован`,
      description: mode 
        ? 'Приложение работает с локальными данными' 
        : 'Приложение подключено к API'
    });
  }

  /**
   * Проверить текущий режим работы
   */
  isOfflineMode(): boolean {
    return this.offlineMode;
  }

  /**
   * Получить текущий базовый URL API
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Установить новый базовый URL API
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
    // Reset error count when changing API URL
    this.connectionErrorCount = 0;
  }

  /**
   * Проверить соединение с API
   */
  async checkConnection(): Promise<boolean> {
    if (this.offlineMode) return false;
    
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.PING}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000) // Quick timeout for ping
      });
      
      return response.ok;
    } catch (error) {
      console.error('API connection check failed:', error);
      return false;
    }
  }

  /**
   * Переключение в оффлайн режим при повторяющихся ошибках
   */
  private handleConnectionError(): void {
    this.connectionErrorCount++;
    
    if (this.connectionErrorCount >= this.maxRetryCount && !this.offlineMode) {
      this.setOfflineMode(true);
      toast({
        title: "Автоматическое переключение в оффлайн режим",
        description: "Обнаружены повторяющиеся проблемы с подключением к API. Приложение переведено в оффлайн режим.",
        variant: "destructive"
      });
    }
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
        const errorMessage = errorData.detail || `Ошибка API: ${response.status} ${response.statusText}`;
        
        // Log detailed error information
        console.error(`API Error (${method} ${endpoint}):`, {
          status: response.status,
          statusText: response.statusText,
          details: errorData
        });
        
        // Handle specific error codes
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "Ошибка авторизации",
            description: "У вас нет прав для выполнения данного действия. Пожалуйста, войдите в систему заново.",
            variant: "destructive"
          });
        } else if (response.status === 429) {
          toast({
            title: "Слишком много запросов",
            description: "Превышен лимит запросов к API. Пожалуйста, попробуйте позже.",
            variant: "destructive"
          });
        } else if (response.status >= 500) {
          toast({
            title: "Ошибка сервера",
            description: "Сервер временно недоступен. Пожалуйста, попробуйте позже.",
            variant: "destructive"
          });
          // Count server errors for potential fallback
          this.handleConnectionError();
        }
        
        throw new Error(errorMessage);
      }
      
      // Reset error count on successful request
      this.connectionErrorCount = 0;
      
      return await response.json();
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.error(`Request timeout (${method} ${endpoint})`);
        toast({
          title: "Превышено время ожидания",
          description: "Сервер не отвечает. Проверьте соединение с интернетом.",
          variant: "destructive"
        });
        
        // Count timeout errors for potential fallback
        this.handleConnectionError();
        
        throw new Error('API request timed out');
      }
      
      // Handle network errors (offline, DNS failure, etc.)
      if ((error as Error).message === 'Failed to fetch') {
        console.error(`Network error (${method} ${endpoint})`);
        toast({
          title: "Ошибка сети",
          description: "Не удалось подключиться к серверу. Проверьте соединение с интернетом.",
          variant: "destructive"
        });
        
        // Count network errors for potential fallback
        this.handleConnectionError();
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
