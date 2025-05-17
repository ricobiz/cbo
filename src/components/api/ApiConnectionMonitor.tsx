
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api/ApiService";
import { useToast } from "@/hooks/use-toast";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

interface ApiConnectionMonitorProps {
  onConnectionChange?: (isConnected: boolean) => void;
}

export const ApiConnectionMonitor = ({ onConnectionChange }: ApiConnectionMonitorProps) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const checkConnection = async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    try {
      const connected = await apiService.checkConnection();
      setIsConnected(connected);
      
      if (onConnectionChange) {
        onConnectionChange(connected);
      }
    } catch (error) {
      console.error("Error checking API connection:", error);
      setIsConnected(false);
      
      if (onConnectionChange) {
        onConnectionChange(false);
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Check connection on component mount
    checkConnection();
    
    // Set up interval for regular checks
    const intervalId = setInterval(checkConnection, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  const toggleOfflineMode = () => {
    const newMode = !apiService.isOfflineMode();
    apiService.setOfflineMode(newMode);
    
    toast({
      title: newMode ? "Режим офлайн активирован" : "Режим офлайн деактивирован",
      description: newMode 
        ? "Приложение будет использовать локальные данные" 
        : "Приложение будет использовать API"
    });
    
    // If switching to online mode, check connection
    if (!newMode) {
      checkConnection();
    } else {
      setIsConnected(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isConnected === null ? (
        <div className="text-muted-foreground text-sm flex items-center">
          <div className="animate-pulse rounded-full h-2 w-2 bg-yellow-500 mr-2"></div>
          Проверка соединения...
        </div>
      ) : isConnected ? (
        <div className="text-green-600 text-sm flex items-center">
          <Wifi className="h-4 w-4 mr-1" />
          API доступно
        </div>
      ) : (
        <div className="text-red-600 text-sm flex items-center">
          <WifiOff className="h-4 w-4 mr-1" />
          API недоступно
        </div>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        title="Проверить соединение"
        onClick={checkConnection}
        disabled={isChecking}
      >
        <RefreshCw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
      </Button>
      
      <Button
        variant={apiService.isOfflineMode() ? "outline" : "ghost"}
        size="sm"
        onClick={toggleOfflineMode}
        className="text-xs"
      >
        {apiService.isOfflineMode() ? "Перейти онлайн" : "Перейти офлайн"}
      </Button>
    </div>
  );
};
