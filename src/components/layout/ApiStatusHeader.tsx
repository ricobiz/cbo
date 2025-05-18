
import { ApiStatusIndicator } from "@/components/api/ApiStatusIndicator";
import { apiService } from "@/services/api/ApiService";
import { apiConnectionService } from "@/services/api/ApiConnectionService";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useConnectionStore } from "@/services/api/ApiConnectionService";
import { CloudOff, Bell, BellOff } from "lucide-react";
import { enableApiErrorNotifications, disableApiErrorNotifications } from "@/services/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ApiStatusHeader() {
  const [offlineMode, setOfflineMode] = useState(apiService.isOfflineMode());
  const [showNotifications, setShowNotifications] = useState(true);
  const { isConnected, isChecking } = useConnectionStore();
  const [apiCheckTriggered, setApiCheckTriggered] = useState(false);
  
  useEffect(() => {
    // Initialize from service
    setOfflineMode(apiService.isOfflineMode());
    
    // Check connection initially if not in offline mode
    if (!offlineMode) {
      apiConnectionService.testConnection();
      setApiCheckTriggered(true);
    }
    
    // Load notification settings
    const notificationSetting = localStorage.getItem('apiErrorNotificationsEnabled');
    setShowNotifications(notificationSetting !== 'false');
    
    console.log("ApiStatusHeader initialized - Offline mode:", offlineMode);
  }, []);
  
  // Effect to log state changes for debugging
  useEffect(() => {
    console.log("Connection status updated:", { isConnected, isChecking, offlineMode });
  }, [isConnected, isChecking, offlineMode]);
  
  const handleToggleOffline = (checked: boolean) => {
    apiService.setOfflineMode(checked);
    setOfflineMode(checked);
    
    // Toggle periodic checks based on mode
    if (checked) {
      apiConnectionService.stopPeriodicCheck();
    } else {
      apiConnectionService.startPeriodicCheck();
      apiConnectionService.testConnection();
      setApiCheckTriggered(true);
    }
    
    toast.success(checked ? "Оффлайн режим включен" : "Онлайн режим включен", {
      description: checked 
        ? "Приложение использует локальные данные" 
        : "Приложение подключается к API",
      icon: checked ? <CloudOff className="h-4 w-4" /> : undefined,
    });
    
    console.log("Offline mode toggled:", checked);
  };
  
  const handleToggleNotifications = (checked: boolean) => {
    setShowNotifications(checked);
    if (checked) {
      enableApiErrorNotifications();
    } else {
      disableApiErrorNotifications();
    }
    
    console.log("API notifications toggled:", checked);
  };
  
  const handleCheckConnection = () => {
    if (!offlineMode) {
      toast.promise(
        apiConnectionService.testConnection(),
        {
          loading: 'Проверка соединения...',
          success: 'Соединение с API установлено',
          error: 'Не удалось подключиться к API'
        }
      );
      setApiCheckTriggered(true);
      console.log("Manual API check triggered");
    }
  };
  
  return (
    <div className="space-y-2">
      {!offlineMode && apiCheckTriggered && !isConnected && !isChecking && (
        <Alert variant="warning" className="mb-2">
          <AlertDescription>
            Не удалось подключиться к API. Возможно, сервер недоступен или возникли проблемы с сетью. 
            Рекомендуется включить оффлайн режим.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center gap-4 px-2 py-1 bg-muted/50 rounded-md">
        <div className="flex items-center gap-2">
          <Switch 
            id="offline-mode"
            checked={offlineMode}
            onCheckedChange={handleToggleOffline}
          />
          <Label htmlFor="offline-mode" className="text-xs">
            {offlineMode ? "Оффлайн режим" : "Онлайн режим"}
          </Label>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch 
            id="api-notifications"
            checked={showNotifications}
            onCheckedChange={handleToggleNotifications}
          />
          <Label htmlFor="api-notifications" className="text-xs flex items-center gap-1">
            {showNotifications ? 
              <><Bell className="h-3 w-3" /> Уведомления</> : 
              <><BellOff className="h-3 w-3" /> Уведомления</>
            }
          </Label>
        </div>
        
        {!offlineMode && (
          <div className="flex items-center gap-2">
            <ApiStatusIndicator />
            {isChecking && (
              <span className="text-xs text-muted-foreground animate-pulse">
                Проверка...
              </span>
            )}
            {!isChecking && !isConnected && (
              <button 
                onClick={handleCheckConnection}
                className="text-xs text-blue-500 hover:underline"
              >
                Проверить соединение
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
