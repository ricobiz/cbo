
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

export function ApiStatusHeader() {
  const [offlineMode, setOfflineMode] = useState(apiService.isOfflineMode());
  const [showNotifications, setShowNotifications] = useState(true);
  const { isConnected, isChecking } = useConnectionStore();
  
  useEffect(() => {
    // Initialize from service
    setOfflineMode(apiService.isOfflineMode());
    
    // Check connection initially if not in offline mode
    if (!offlineMode) {
      apiConnectionService.testConnection();
    }
    
    // Load notification settings
    const notificationSetting = localStorage.getItem('apiErrorNotificationsEnabled');
    setShowNotifications(notificationSetting !== 'false');
  }, [offlineMode]);
  
  const handleToggleOffline = (checked: boolean) => {
    apiService.setOfflineMode(checked);
    setOfflineMode(checked);
    
    // Toggle periodic checks based on mode
    if (checked) {
      apiConnectionService.stopPeriodicCheck();
    } else {
      apiConnectionService.startPeriodicCheck();
      apiConnectionService.testConnection();
    }
    
    toast.success(checked ? "Offline Mode Enabled" : "Online Mode Enabled", {
      description: checked 
        ? "Application is now using mock data" 
        : "Application is now connecting to backend API",
      icon: checked ? <CloudOff className="h-4 w-4" /> : undefined,
      id: "offline-mode-toggle"
    });
  };
  
  const handleToggleNotifications = (checked: boolean) => {
    setShowNotifications(checked);
    if (checked) {
      enableApiErrorNotifications();
    } else {
      disableApiErrorNotifications();
    }
  };
  
  return (
    <div className="flex items-center gap-4 px-2 py-1 bg-muted/50 rounded-md">
      <div className="flex items-center gap-2">
        <Switch 
          id="offline-mode"
          checked={offlineMode}
          onCheckedChange={handleToggleOffline}
        />
        <Label htmlFor="offline-mode" className="text-xs">
          Offline Mode
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
              Checking...
            </span>
          )}
        </div>
      )}
    </div>
  );
}
