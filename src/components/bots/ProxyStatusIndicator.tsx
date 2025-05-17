import { useEffect, useState } from "react";
import { Server, Shield, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useProxyStore } from "@/store/ProxyStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export function ProxyStatusIndicator() {
  const { proxiesCount, healthyCount, refreshCounts } = useProxyStore();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    refreshCounts();
    
    // Schedule refresh every minute
    const interval = setInterval(refreshCounts, 60000);
    return () => clearInterval(interval);
  }, [refreshCounts]);
  
  useEffect(() => {
    if (proxiesCount > 0) {
      setProgress(Math.round((healthyCount / proxiesCount) * 100));
    } else {
      setProgress(0);
    }
  }, [proxiesCount, healthyCount]);
  
  const getStatusColor = () => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getStatusIcon = () => {
    if (progress >= 80) return <Shield className="h-4 w-4 text-green-500" />;
    if (progress >= 50) return <Server className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card className="hover:border-primary/50 cursor-pointer" onClick={() => navigate('/proxies')}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">Proxy Status</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0" 
            onClick={(e) => {
              e.stopPropagation();
              refreshCounts();
            }}
          >
            <Server className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{healthyCount} healthy of {proxiesCount}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className={`h-1.5 ${getStatusColor()}`} />
        </div>
      </CardContent>
    </Card>
  );
}
