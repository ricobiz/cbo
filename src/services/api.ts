
import axios from 'axios';
import { toast } from "sonner"; 

// Create an axios instance with the base URL
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000
});

// Глобальная блокировка одинаковых уведомлений
let lastErrorMessage = '';
let errorNotificationBlockedUntil = 0;
let errorNotificationsEnabled = true;

// Функция для отключения уведомлений об ошибках API
export const disableApiErrorNotifications = () => {
  errorNotificationsEnabled = false;
  localStorage.setItem('apiErrorNotificationsEnabled', 'false');
  toast.success('Уведомления об ошибках API отключены');
};

// Функция для включения уведомлений об ошибках API
export const enableApiErrorNotifications = () => {
  errorNotificationsEnabled = true;
  localStorage.setItem('apiErrorNotificationsEnabled', 'true');
  toast.success('Уведомления об ошибках API включены');
};

// Функция для проверки настроек уведомлений
export const initApiErrorNotifications = () => {
  const setting = localStorage.getItem('apiErrorNotificationsEnabled');
  if (setting !== null) {
    errorNotificationsEnabled = setting === 'true';
  }
};

// Инициализация настроек при загрузке
initApiErrorNotifications();

// Add response interceptor
api.interceptors.response.use(
  response => response, 
  error => {
    // Проверяем, включены ли уведомления об ошибках
    if (errorNotificationsEnabled) {
      // Проверка на отключение сети или недоступность сервера
      if (!error.response) {
        // Избегаем повторных уведомлений о том же типе ошибки
        const now = Date.now();
        if (lastErrorMessage !== 'network-error' || now > errorNotificationBlockedUntil) {
          toast.error('Сервер недоступен', {
            description: 'Не удается подключиться к API серверу. Проверьте подключение или попробуйте позже.',
            id: 'api-network-error', // Уникальный ID для предотвращения дублирования
            dismissible: true // Возможность закрыть уведомление
          });
          lastErrorMessage = 'network-error';
          errorNotificationBlockedUntil = now + 30000; // Блокируем на 30 секунд
        }
      } else if (error.response.status >= 500) {
        // Для ошибок сервера
        const now = Date.now();
        if (lastErrorMessage !== 'server-error' || now > errorNotificationBlockedUntil) {
          toast.error(`Ошибка сервера ${error.response.status}`, {
            description: 'Произошла ошибка на стороне сервера. Пожалуйста, попробуйте позже.',
            id: 'api-server-error',
            dismissible: true
          });
          lastErrorMessage = 'server-error';
          errorNotificationBlockedUntil = now + 30000; // Блокируем на 30 секунд
        }
      } else {
        // Для других ошибок (4xx) - показываем только важные
        if (error.response.status === 401 || error.response.status === 403) {
          toast.error(`Ошибка авторизации`, {
            description: error.response.data?.message || 'Требуется вход в систему',
            id: 'api-auth-error',
            dismissible: true
          });
        }
      }
    }
    
    // Переключаемся в оффлайн режим при повторных ошибках соединения
    if (!error.response || error.response.status >= 500) {
      const offlineMode = localStorage.getItem('offlineMode');
      if (offlineMode !== 'true') {
        localStorage.setItem('offlineMode', 'true');
        
        if (errorNotificationsEnabled) {
          toast.info('Переключение в оффлайн режим', {
            description: 'Приложение переключено в оффлайн режим из-за проблем с подключением',
            id: 'offline-mode-switch',
            dismissible: true
          });
        }
        
        // Перезагружаем страницу для применения оффлайн режима
        // ВАЖНО: Убираем автоматическую перезагрузку, которая могла вызывать проблемы
        // Вместо этого дадим пользователю самому решить, когда перезагрузить страницу
      }
    }
    
    return Promise.reject(error);
  }
);

// Add request interceptor for authentication if needed
api.interceptors.request.use(
  config => {
    // Проверка оффлайн режима перед запросом
    const offlineMode = localStorage.getItem('offlineMode') === 'true';
    if (offlineMode) {
      // Отменяем запрос, если включен оффлайн режим
      return Promise.reject(new Error('Оффлайн режим активен'));
    }
    
    // Добавление токена авторизации
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
