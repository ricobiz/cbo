
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiConnectionService, useConnectionStore } from "@/services/api/ApiConnectionService";
import { API_CONFIG } from "@/config/api";
import { RefreshCw, ServerOff, Database, Server } from "lucide-react";

export function ApiConnectionIndicator() {
  const { isConnected, serverVersion, serverStatus, isChecking } = useConnectionStore();
  const [timeoutState, setTimeoutState] = useState<NodeJS.Timeout | null>(null);
  
  const handleCheckConnection = () => {
    if (timeoutState) clearTimeout(timeoutState);
    apiConnectionService.testConnection();
    
    // Предотвращает повторные нажатия
    setTimeoutState(setTimeout(() => setTimeoutState(null), 3000));
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1.5 py-1 h-7">
                <Server className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">API подключено</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1.5 py-1 h-7">
                <ServerOff className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">API недоступно</span>
              </Badge>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={handleCheckConnection}
              disabled={isChecking || timeoutState !== null}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span className="sr-only">Проверить соединение</span>
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end" className="p-4 max-w-xs">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Статус API</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
              <span className="text-muted-foreground">URL:</span>
              <span className="font-mono truncate">{API_CONFIG.BASE_URL}</span>
              
              {serverVersion && (
                <>
                  <span className="text-muted-foreground">Версия:</span>
                  <span>{serverVersion}</span>
                </>
              )}
              
              <span className="text-muted-foreground">API сервер:</span>
              <span className={isConnected ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
                {isConnected ? "Доступен" : "Недоступен"}
              </span>
              
              <span className="text-muted-foreground">База данных:</span>
              <span className={serverStatus.database ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}>
                {serverStatus.database ? "Подключена" : "Недоступна"}
              </span>
            </div>
            
            {!isConnected && (
              <div className="pt-2 border-t border-border mt-2">
                <p className="text-xs text-muted-foreground">
                  API сервер недоступен. Проверьте работу backend-сервисов или включите оффлайн-режим.
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
