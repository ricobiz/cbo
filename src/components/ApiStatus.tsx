
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { CheckCircle, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { toast } from "sonner";

export function ApiStatus() {
  const { data, isError, isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await api.get('/health');
      return response.data;
    },
    refetchInterval: 10000,
    retry: 2
  });
  
  const isHealthy = data?.status === 'ok';
  const lastChecked = new Date(dataUpdatedAt).toLocaleTimeString();
  
  useEffect(() => {
    // Show toast when API comes back online after being down
    if (isHealthy && localStorage.getItem('wasOffline') === 'true') {
      toast.success('API подключено', {
        description: 'Соединение с сервером восстановлено'
      });
      localStorage.setItem('wasOffline', 'false');
    }
    
    // Save offline state
    if (isError && !isLoading) {
      localStorage.setItem('wasOffline', 'true');
    }
  }, [isHealthy, isError, isLoading]);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center">
            {isLoading ? (
              <div className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
            ) : isHealthy ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <div className="text-xs">
            <p>API Status: {isHealthy ? 'Online' : 'Offline'}</p>
            <p>Last checked: {lastChecked}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
