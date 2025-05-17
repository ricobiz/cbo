
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { apiService } from "@/services/api/ApiService";
import { API_CONFIG, DEFAULT_OFFLINE_MODE } from "@/config/api";
import { Globe, Server, CloudOff } from "lucide-react";

export function ApiConnectionSettings() {
  const [apiUrl, setApiUrl] = useState(API_CONFIG.BASE_URL);
  const [offlineMode, setOfflineMode] = useState(DEFAULT_OFFLINE_MODE);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    // При загрузке компонента проверяем текущие настройки
    setOfflineMode(apiService.isOfflineMode());
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (offlineMode) {
      setConnectionStatus('disconnected');
      return;
    }

    setConnectionStatus('checking');
    
    try {
      // Проверяем соединение с API
      await fetch(`${apiUrl}/health`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000) 
      });
      
      setConnectionStatus('connected');
    } catch (error) {
      console.error("API connection error:", error);
      setConnectionStatus('disconnected');
    }
  };

  const handleToggleOfflineMode = (checked: boolean) => {
    setOfflineMode(checked);
    apiService.setOfflineMode(checked);
    
    if (checked) {
      setConnectionStatus('disconnected');
      toast.info("Оффлайн режим активирован", {
        description: "Приложение будет использовать локальные данные"
      });
    } else {
      checkConnection();
    }
  };

  const handleSaveApiUrl = async () => {
    setIsConnecting(true);
    
    try {
      // Сохраняем новый URL и проверяем соединение
      localStorage.setItem('apiBaseUrl', apiUrl);
      
      // Перезагружаем страницу чтобы применить изменения URL
      // В реальном приложении можно создать фабрику для ApiService
      toast.info("Настройки API сохранены", {
        description: "Перезагрузка страницы для применения изменений..."
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Failed to save API URL:", error);
      toast.error("Ошибка сохранения URL", {
        description: "Не удалось сохранить настройки API"
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

        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          {connectionStatus === 'connected' ? (
            <>
              <Globe className="h-5 w-5 text-green-500" />
              <span className="text-green-500 font-medium">Подключено к API</span>
            </>
          ) : connectionStatus === 'checking' ? (
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
      </CardContent>
    </Card>
  );
}
