
import { ApiStatusIndicator } from "@/components/api/ApiStatusIndicator";
import { apiService } from "@/services/api/ApiService";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export function ApiStatusHeader() {
  const [offlineMode, setOfflineMode] = useState(apiService.isOfflineMode());
  const { toast } = useToast();
  
  useEffect(() => {
    // Initialize from service
    setOfflineMode(apiService.isOfflineMode());
  }, []);
  
  const handleToggleOffline = (checked: boolean) => {
    apiService.setOfflineMode(checked);
    setOfflineMode(checked);
    
    toast({
      title: checked ? "Offline Mode Enabled" : "Online Mode Enabled",
      description: checked 
        ? "Application is now using mock data" 
        : "Application is now connecting to backend API",
      variant: "default"
    });
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
      
      {!offlineMode && <ApiStatusIndicator />}
    </div>
  );
}
