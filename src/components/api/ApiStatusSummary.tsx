
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { apiConnectionService, useConnectionStore } from "@/services/api/ApiConnectionService";
import { apiService } from "@/services/api/ApiService";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ApiStatusSummary() {
  const { isConnected, isChecking, error, lastChecked, serverStatus } = useConnectionStore();
  
  useEffect(() => {
    // Проверяем статус API при загрузке компонента
    if (!apiService.isOfflineMode() && !isConnected && !isChecking) {
      apiConnectionService.testConnection();
    }
  }, [isConnected, isChecking]);
  
  const getFormattedTimeSince = (timestamp: string | null) => {
    if (!timestamp) return "никогда";
    
    const lastCheck = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - lastCheck.getTime();
    
    if (diffMs < 60000) { // менее минуты
      return "только что";
    } else if (diffMs < 3600000) { // менее часа
      const minutes = Math.floor(diffMs / 60000);
      return `${minutes} ${minutes === 1 ? 'минута' : minutes < 5 ? 'минуты' : 'минут'} назад`;
    } else {
      return lastCheck.toLocaleTimeString();
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x">
          <div className={`flex flex-col items-center justify-center p-4 ${apiService.isOfflineMode() ? 
            'bg-muted/50' : 
            isConnected ? 'bg-green-50 dark:bg-green-950/20' : 'bg-amber-50 dark:bg-amber-950/20'}`}>
            {apiService.isOfflineMode() ? (
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            ) : isConnected ? (
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
            ) : (
              <XCircle className="h-8 w-8 text-amber-500 mb-2" />
            )}
            <h3 className="font-medium">
              {apiService.isOfflineMode() ? 
                'Оффлайн режим' : 
                isConnected ? 'API подключено' : 'API недоступно'}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Проверено: {getFormattedTimeSince(lastChecked)}
            </p>
          </div>
          
          <div className="p-4 flex flex-col justify-center">
            <h4 className="text-sm font-medium mb-1">Сервисы</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${apiService.isOfflineMode() ? 
                  'bg-muted' : 
                  isConnected ? 'bg-green-500' : 'bg-amber-500'}`} />
                <span className="text-sm">API сервер</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${apiService.isOfflineMode() ? 
                  'bg-muted' : 
                  (isConnected && serverStatus.database) ? 'bg-green-500' : 'bg-amber-500'}`} />
                <span className="text-sm">База данных</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Действия</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={() => apiConnectionService.testConnection()}
                disabled={isChecking}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span className="sr-only">Обновить</span>
              </Button>
            </div>
            
            {error && !apiService.isOfflineMode() && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Ошибка: {error}
              </p>
            )}
            
            {apiService.isOfflineMode() && (
              <p className="text-xs text-muted-foreground mt-1">
                Работа с локальными данными. Для подключения к API отключите оффлайн режим в настройках.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
