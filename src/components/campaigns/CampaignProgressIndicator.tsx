
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CampaignProgressIndicatorProps {
  progress: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function CampaignProgressIndicator({ 
  progress, 
  showPercentage = true,
  size = 'md',
  showTooltip = true 
}: CampaignProgressIndicatorProps) {
  const getProgressColor = () => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 70) return "bg-emerald-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 30) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const getProgressHeight = () => {
    switch(size) {
      case 'sm': return 'h-1';
      case 'lg': return 'h-3';
      default: return 'h-2';
    }
  };
  
  const getTooltipMessage = () => {
    if (progress >= 90) return "Excellent progress - on track to exceed targets";
    if (progress >= 70) return "Good progress - on track to meet targets";
    if (progress >= 50) return "Average progress - may need some attention";
    if (progress >= 30) return "Below target - requires attention";
    return "Significantly behind - urgent action required";
  };
  
  const ProgressBar = (
    <div className="space-y-1">
      {showPercentage && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
      )}
      <Progress 
        value={progress} 
        className={`${getProgressHeight()} ${progress < 30 ? "bg-muted/50" : ""} ${getProgressColor()} transition-all duration-300 ease-in-out`} 
      />
    </div>
  );

  if (!showTooltip) return ProgressBar;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {ProgressBar}
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipMessage()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
