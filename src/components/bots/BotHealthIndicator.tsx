
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, AlertCircle, AlertTriangle } from "lucide-react";

interface BotHealthIndicatorProps {
  healthPercentage: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animate?: boolean;
}

export const BotHealthIndicator = ({ 
  healthPercentage, 
  size = 'md', 
  showIcon = true,
  animate = false
}: BotHealthIndicatorProps) => {
  // Determine color based on health
  const getColorClass = () => {
    if (healthPercentage >= 90) return "text-green-500";
    if (healthPercentage >= 70) return "text-amber-500";
    return "text-red-500";
  };
  
  const getProgressColor = () => {
    if (healthPercentage >= 90) return "bg-green-500";
    if (healthPercentage >= 70) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getIcon = () => {
    if (healthPercentage >= 90) return <Check className="h-4 w-4 text-green-500" />;
    if (healthPercentage >= 70) return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };
  
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return "text-sm";
      case 'lg': return "text-xl";
      default: return "text-base";
    }
  };
  
  const getHealthMessage = () => {
    if (healthPercentage >= 90) return "Healthy - All systems operational";
    if (healthPercentage >= 70) return "Warning - Some issues detected";
    return "Critical - Immediate attention required";
  };
  
  const getHealthDetails = () => {
    if (healthPercentage >= 90) {
      return [
        "CPU usage: Normal",
        "Memory: Optimal",
        "Network: Stable",
        "Last error: None"
      ];
    }
    if (healthPercentage >= 70) {
      return [
        "CPU usage: Elevated",
        "Memory: Normal",
        "Network: Minor instability",
        "Last error: 4h ago (recovered)"
      ];
    }
    return [
      "CPU usage: High",
      "Memory: Leaking",
      "Network: Unstable",
      "Last error: Recent failures"
    ];
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            {showIcon && getIcon()}
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className={`font-medium ${getSizeClass()} ${getColorClass()}`}>
                  {healthPercentage}%
                </span>
              </div>
              <Progress 
                value={healthPercentage} 
                className={`h-1.5 ${healthPercentage < 70 ? "bg-gray-200" : ""} ${getProgressColor()} ${animate ? "transition-all duration-500" : ""}`}
              />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-60">
          <div className="space-y-2">
            <p className="font-medium">{getHealthMessage()}</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              {getHealthDetails().map((detail, index) => (
                <p key={index}>{detail}</p>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
