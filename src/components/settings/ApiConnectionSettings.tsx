
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { apiService } from "@/services/api/ApiService";
import { API_CONFIG, DEFAULT_OFFLINE_MODE } from "@/config/api";
import { Globe, Server, CloudOff, RotateCw, Bell, BellOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiConnectionService, useConnectionStore } from "@/services/api/ApiConnectionService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { enableApiErrorNotifications, disableApiErrorNotifications } from "@/services/api";

export function ApiConnectionSettings() {
  const [apiUrl, setApiUrl] = useState(API_CONFIG.BASE_URL);
  const [offlineMode, setOfflineMode] = useState(DEFAULT_OFFLINE_MODE);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  const { isConnected, lastChecked, serverVersion, serverStatus } = useConnectionStore();

  useEffect(() => {
    // При загрузке компонента проверяем текущие настройки
    const storedOfflineMode = localStorage.getItem('offlineMode') === 'true';
    const storedApiUrl = localStorage.getItem('apiBaseUrl');
    const notificationsEnabled = localStorage.getItem('apiErrorNotificationsEnabled');
    
    // Применяем сохраненные настройки
    if (storedApiUrl) {
      setApiUrl(storedApiUrl);
    }
    
    setOfflineMode(storedOfflineMode || apiService.isOfflineMode());
    
    // Загружаем настройки уведомлений
    setShowNotifications(notificationsEnabled !== 'false');
    
    // Проверяем наличие ошибок при загрузке страницы
    const connectionErrors = localStorage.getItem('connectionErrors');
    if (connectionErrors && parseInt(connectionErrors) > 0) {
      setHasErrors(true);
    }
    
    if (!offlineMode) {
      checkConnection();
    }
  }, []);

  const checkConnection = async () => {
    if (offlineMode) return;
    
    setIsConnecting(true);
    try {
      await apiConnectionService.testConnection();
      setHasErrors(false);
      localStorage.setItem('connectionErrors', '0');
    } catch (error) {
      console.error("Connection check failed:", error);
      setHasErrors(true);
      
      // Увеличиваем счетчик ошибок
      const errors = parseInt(localStorage.getItem('connectionErrors') || '0') + 1;
      localStorage.setItem('connectionErrors', String(errors));
      
      // Если много ошибок подряд, предлагаем включить оффлайн-режим
      if (errors >= 3) {
        toast("Проблемы с подключением к API", {
          description: "Рекомендуется включить оффлайн режим до восстановления работы сервера",
          id: "connection-error-suggestion",
          dismissible: true
        });
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleToggleOfflineMode = (checked: boolean) => {
    setOfflineMode(checked);
    apiService.setOfflineMode(checked);
    localStorage.setItem('offlineMode', String(checked));
    
    if (!checked) {
      checkConnection();
    }
  };

  const handleToggleNotifications = (checked: boolean) => {
    setShowNotifications(checked);
    if (checked) {
      enableApiErrorNotifications();
    } else {
      disableApiErrorNotifications();
    }
  };

  const handleSaveApiUrl = async () => {
    setIsConnecting(true);
    
    try {
      // Сохраняем новый URL и проверяем соединение
      localStorage.setItem('apiBaseUrl', apiUrl);
      apiService.setBaseUrl(apiUrl);
      
      const success = await apiConnectionService.testConnection(apiUrl);
      
      if (success) {
        toast.success("URL API успешно сохранен", {
          description: "Настройки применены.",
          dismissible: true
        });
      } else {
        toast("URL сохранен, но соединение не установлено", {
          description: "Убедитесь, что API сервер доступен.",
          dismissible: true
        });
      }
    } catch (error) {
      console.error("Failed to save API URL:", error);
      toast.error("Ошибка сохранения URL", {
        description: "Не удалось сохранить настройки API",
        dismissible: true
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          <CardTitle>Подключение к API</CardTitle>
        </div>
        <CardDescription>
          Настройте подключение к бэкенду или используйте оффлайн режим
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasErrors && (
          <Alert variant="destructive" className="mb-4" dismissible>
            <AlertTitle>Проблема с подключением к API</AlertTitle>
            <AlertDescription>
              Сервер возвращает ошибки или недоступен. Рекомендуется включить оффлайн режим до восстановления работы сервера.
            </AlertDescription>
          </Alert>
        )}
      
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1">
            <h3 className="text-base font-medium">Оффлайн режим</h3>
            <p className="text-sm text-muted-foreground">
              В оффлайн режиме приложение использует локальные мок-данные вместо API
            </p>
          </div>
          <Switch 
            checked={offlineMode}
            onCheckedChange={handleToggleOfflineMode}
          />
        </div>

        <div className="flex items-center space-x-4 rounded-md border p-4">
          <div className="flex-1">
            <h3 className="text-base font-medium">Уведомления об ошибках API</h3>
            <p className="text-sm text-muted-foreground">
              Включить или отключить уведомления о проблемах с подключением к API
            </p>
          </div>
          <div className="flex items-center gap-2">
            {showNotifications ? 
              <Bell className="h-4 w-4 text-primary" /> : 
              <BellOff className="h-4 w-4 text-muted-foreground" />
            }
            <Switch 
              checked={showNotifications}
              onCheckedChange={handleToggleNotifications}
            />
          </div>
        </div>

        <div className={offlineMode ? "opacity-50 pointer-events-none" : ""}>
          <div className="space-y-2">
            <Label htmlFor="api-url">URL API бэкенда</Label>
            <div className="flex gap-2">
              <Input
                id="api-url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:8000"
                disabled={offlineMode || isConnecting}
              />
              <Button 
                onClick={handleSaveApiUrl} 
                disabled={offlineMode || isConnecting || !apiUrl}
              >
                Сохранить
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              URL должен включать протокол (http:// или https://)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Globe className="h-5 w-5 text-green-500" />
                <span className="text-green-500 font-medium">Подключено к API</span>
                {serverVersion && (
                  <Badge variant="outline" className="ml-2">v{serverVersion}</Badge>
                )}
              </>
            ) : isConnecting ? (
              <>
                <Globe className="h-5 w-5 text-amber-500 animate-pulse" />
                <span className="text-amber-500 font-medium">Проверка подключения...</span>
              </>
            ) : (
              <>
                <CloudOff className="h-5 w-5 text-gray-500" />
                <span className="text-gray-500 font-medium">
                  {offlineMode ? "Оффлайн режим" : "Нет подключения к API"}
                </span>
              </>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={checkConnection}
            disabled={isConnecting || offlineMode}
          >
            <RotateCw className={`h-4 w-4 ${isConnecting ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {isConnected && serverStatus && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-semibold mb-2">Информация о сервере:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">API сервер:</span>
              <span className="text-green-600 dark:text-green-400">Доступен</span>
              
              <span className="text-muted-foreground">База данных:</span>
              <span className={serverStatus.database ? 
                "text-green-600 dark:text-green-400" : 
                "text-amber-600 dark:text-amber-400"}>
                {serverStatus.database ? "Подключена" : "Недоступна"}
              </span>
              
              {lastChecked && (
                <>
                  <span className="text-muted-foreground">Последняя проверка:</span>
                  <span className="font-mono text-xs">
                    {new Date(lastChecked).toLocaleTimeString()}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
