
// Конфигурация API эндпоинтов
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000', // URL вашего FastAPI бэкенда
  ENDPOINTS: {
    BOTS: '/bots',
    CAMPAIGNS: '/campaigns',
    CONTENT: '/content',
    ANALYTICS: '/analytics',
  },
};

// Таймаут для API запросов (в миллисекундах)
export const API_TIMEOUT = 10000;

// Настройка для автоматического перехода в оффлайн режим при ошибках API
export const AUTO_FALLBACK_TO_OFFLINE = true;

// Использовать оффлайн режим по умолчанию (установите в false для использования реального API)
export const DEFAULT_OFFLINE_MODE = false;
