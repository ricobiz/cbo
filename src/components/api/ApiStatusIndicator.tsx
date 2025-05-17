
import { useEffect, useState } from "react";
import { useConnectionStore } from "@/services/api/ApiConnectionService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { RefreshCw, WifiOff, Wifi, Database, Server, AlertTriangle } from "lucide-react";
import { apiService } from "@/services/api/ApiService";

export function ApiStatusIndicator() {
  const { isConnected, error, isChecking, lastChecked, checkConnection, serverStatus, retryCount } = useConnectionStore();
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Check connection status on component mount
    if (!apiService.isOfflineMode()) {
      checkConnection();
    }
    
    // Set up interval to check connection periodically
    const interval = setInterval(() => {
      if (!apiService.isOfflineMode()) {
        checkConnection();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [checkConnection]);
  
  // Handle manual connection check with feedback
  const handleManualCheck = async () => {
    if (apiService.isOfflineMode()) {
      toast.info("Offline Mode Active", {
        description: "Cannot check API connection while in offline mode."
      });
      return;
    }
    
    toast.promise(checkConnection(), {
      loading: 'Checking API connection...',
      success: () => 'Successfully connected to API',
      error: (err) => `Connection failed: ${err || 'Unknown error'}`
    });
  };
  
  const formattedLastChecked = lastChecked 
    ? new Date(lastChecked).toLocaleTimeString() 
    : "Never";
  
  // Don't show indicator in offline mode
  if (apiService.isOfflineMode()) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={isConnected ? "default" : "destructive"}
              className="cursor-pointer"
              onClick={() => setShowDetails(!showDetails)}
            >
              {isChecking ? (
                <div className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" /> Checking...
                </div>
              ) : isConnected ? (
                <div className="flex items-center gap-1">
                  <Wifi className="h-3 w-3" /> API Connected
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <WifiOff className="h-3 w-3" /> API Disconnected
                </div>
              )}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Last checked: {formattedLastChecked}</p>
            {error && <p className="text-red-500">Error: {error}</p>}
            <p className="text-xs text-muted-foreground mt-1">Click to {showDetails ? 'hide' : 'show'} details</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6" 
        onClick={handleManualCheck}
        disabled={isChecking}
      >
        <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
      </Button>
      
      {showDetails && (
        <div className="absolute top-10 right-0 mt-2 bg-background border rounded-md shadow-md p-4 z-50 w-80">
          <h3 className="font-medium mb-2">API Connection Status</h3>
          <div className="space-y-2 text-sm">
            <p>Status: <span className={isConnected ? "text-green-500" : "text-red-500"}>
              {isConnected ? "Connected" : "Disconnected"}
            </span></p>
            <p>Last checked: {formattedLastChecked}</p>
            
            <div className="flex items-center gap-2">
              <Server className={`h-4 w-4 ${serverStatus.api ? "text-green-500" : "text-red-500"}`} />
              <span>API Server: {serverStatus.api ? "Available" : "Unavailable"}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Database className={`h-4 w-4 ${serverStatus.database ? "text-green-500" : "text-red-500"}`} />
              <span>Database: {serverStatus.database ? "Connected" : "Disconnected"}</span>
            </div>
            
            {retryCount > 0 && (
              <div className="flex items-center gap-2 text-amber-500">
                <AlertTriangle className="h-4 w-4" />
                <span>Reconnection attempts: {retryCount}</span>
              </div>
            )}
            
            {serverStatus.message && (
              <p className="text-sm text-muted-foreground mt-1">{serverStatus.message}</p>
            )}
            
            {error && <p className="text-red-500 break-words">Error: {error}</p>}
            
            <Button 
              size="sm" 
              className="w-full mt-2" 
              onClick={handleManualCheck} 
              disabled={isChecking}
            >
              {isChecking ? "Checking..." : "Check Connection"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
