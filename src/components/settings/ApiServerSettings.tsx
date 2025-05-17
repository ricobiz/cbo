
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { apiConnectionService, useConnectionStore } from "@/services/api/ApiConnectionService";
import { apiService } from "@/services/api/ApiService";
import { API_CONFIG } from "@/config/api";
import { Server, Loader2 } from "lucide-react";

export function ApiServerSettings() {
  const [apiUrl, setApiUrl] = useState(API_CONFIG.BASE_URL);
  const [testingUrl, setTestingUrl] = useState(false);
  const { isConnected, serverVersion, serverStatus } = useConnectionStore();
  const [originalUrl] = useState(API_CONFIG.BASE_URL);
  const [urlChanged, setUrlChanged] = useState(false);
  
  const handleApiUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setApiUrl(newUrl);
    setUrlChanged(newUrl !== originalUrl);
  };
  
  const handleTestConnection = async () => {
    if (!apiUrl.trim()) {
      toast.error("URL API не может быть пустым");
      return;
    }
    
    if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
      toast.error("URL должен начинаться с http:// или https://");
      return;
    }
    
    setTestingUrl(true);
    const success = await apiConnectionService.testConnection(apiUrl);
    setTestingUrl(false);
    
    if (success) {
      toast.success("Соединение успешно установлено", {
        description: "API сервер доступен и работает корректно."
      });
    } else {
      toast.error("Не удалось подключиться к API", {
        description: "Проверьте URL и убедитесь, что сервер запущен."
      });
    }
  };
  
  const handleSaveUrl = () => {
    if (!apiUrl.trim()) {
      toast.error("URL API не может быть пустым");
      return;
    }
    
    localStorage.setItem('apiBaseUrl', apiUrl);
    apiService.setBaseUrl(apiUrl);
    
    toast.success("URL API успешно сохранен", {
      description: "Настройки применены. Рекомендуется перезагрузить страницу."
    });
    
    setUrlChanged(false);
    apiConnectionService.testConnection(apiUrl);
  };
  
  const handleResetToDefault = () => {
    const defaultUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    setApiUrl(defaultUrl);
    setUrlChanged(defaultUrl !== originalUrl);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Server className="h-5 w-5 text-primary" />
          <CardTitle>API сервер</CardTitle>
        </div>
        <CardDescription>
          Настройте подключение к FastAPI бэкенду
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="api-url">
              URL API сервера
            </label>
            <Badge variant={isConnected ? "outline" : "secondary"} className={isConnected ? 
              "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : 
              "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
            }>
              {isConnected ? "Подключено" : "Отключено"}
            </Badge>
          </div>
          
          <Input
            id="api-url"
            value={apiUrl}
            onChange={handleApiUrlChange}
            placeholder="http://localhost:8000"
          />
          
          <p className="text-xs text-muted-foreground">
            URL должен включать протокол (http:// или https://) и порт, если он отличается от стандартного
          </p>
        </div>
        
        {serverVersion && (
          <div className="bg-muted/50 p-3 rounded-md text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Версия API:</span>
              <span>{serverVersion}</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm" onClick={handleResetToDefault}>
          По умолчанию
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleTestConnection} disabled={testingUrl}>
            {testingUrl ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Проверить соединение
          </Button>
          <Button size="sm" onClick={handleSaveUrl} disabled={!urlChanged}>
            Сохранить
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
