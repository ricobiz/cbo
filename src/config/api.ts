
// Конфигурация API эндпоинтов
export const API_CONFIG = {
  // Use environment variable if available, otherwise use a relative path for API on the same domain
  BASE_URL: import.meta.env.VITE_API_URL || '/api',
  ENDPOINTS: {
    BOTS: '/bots',
    CAMPAIGNS: '/campaigns',
    CONTENT: '/content',
    ANALYTICS: '/analytics',
    HEALTH: '/health', // Health check endpoint
    PING: '/health/ping', // Simple ping endpoint for quick connectivity checks
  },
};

// Таймаут для API запросов (в миллисекундах)
export const API_TIMEOUT = 10000;

// Настройка для автоматического перехода в оффлайн режим при ошибках API
export const AUTO_FALLBACK_TO_OFFLINE = true;

// Использовать оффлайн режим по умолчанию
export const DEFAULT_OFFLINE_MODE = true;

// Настройка интервала проверки соединения (в миллисекундах)
export const CONNECTION_CHECK_INTERVAL = 60000; // 1 минута

// Максимальное количество повторных попыток при сбоях API
export const MAX_RETRY_ATTEMPTS = 3;
