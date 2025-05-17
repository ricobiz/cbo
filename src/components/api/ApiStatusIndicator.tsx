
import { useEffect, useState } from "react";
import { useConnectionStore } from "@/services/api/ApiConnectionService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, WifiOff, Wifi, Database, Server } from "lucide-react";

export function ApiStatusIndicator() {
  const { isConnected, error, isChecking, lastChecked, checkConnection, serverStatus } = useConnectionStore();
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    // Check connection status on component mount
    checkConnection();
    
    // Set up interval to check connection periodically
    const interval = setInterval(() => {
      checkConnection();
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [checkConnection]);
  
  const handleManualCheck = async () => {
    const result = await checkConnection();
    
    toast({
      title: result ? "API Connected" : "API Disconnected",
      description: result 
        ? "Successfully connected to the API server" 
        : `Failed to connect to API: ${error || "Unknown error"}`,
      variant: result ? "default" : "destructive"
    });
  };
  
  const formattedLastChecked = lastChecked 
    ? new Date(lastChecked).toLocaleTimeString() 
    : "Never";
  
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
              {isConnected ? (
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
