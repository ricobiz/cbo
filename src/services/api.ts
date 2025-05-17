
import axios from 'axios';
import { toast } from "sonner"; 

// Create an axios instance with the base URL
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000
});

// Add response interceptor
api.interceptors.response.use(
  response => response, 
  error => {
    // Проверка на отключение сети или недоступность сервера
    if (!error.response) {
      toast.error('Сервер недоступен', {
        description: 'Не удается подключиться к API серверу. Проверьте подключение или попробуйте позже.'
      });
    } else if (error.response.status >= 500) {
      toast.error(`Ошибка сервера ${error.response.status}`, {
        description: 'Произошла ошибка на стороне сервера. Пожалуйста, попробуйте позже.'
      });
    } else {
      // Для других ошибок (4xx)
      toast.error(`Ошибка ${error.response.status}`, {
        description: error.response.data?.message || error.message
      });
    }
    
    // Переключаемся в оффлайн режим при повторных ошибках соединения
    if (!error.response || error.response.status >= 500) {
      const offlineMode = localStorage.getItem('offlineMode');
      if (offlineMode !== 'true') {
        localStorage.setItem('offlineMode', 'true');
        toast.info('Переключение в оффлайн режим', {
          description: 'Приложение переключено в оффлайн режим из-за проблем с подключением'
        });
        
        // Перезагружаем страницу для применения оффлайн режима
        setTimeout(() => {
          window.location.reload();
        }, 1500);
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
