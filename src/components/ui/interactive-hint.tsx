
import { ReactNode, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InteractiveHintProps {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
  step?: number;
  totalSteps?: number;
  completed?: boolean;
  onComplete?: () => void;
  highlightLevel?: "low" | "medium" | "high";
}

export function InteractiveHint({
  title,
  description,
  children,
  className,
  step,
  totalSteps,
  completed = false,
  onComplete,
  highlightLevel = "medium"
}: InteractiveHintProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(completed);

  const handleComplete = () => {
    setIsCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  const highlightStyles = {
    low: "border-gray-200 bg-gray-50",
    medium: "border-blue-100 bg-blue-50",
    high: "border-amber-100 bg-amber-50 animate-pulse"
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative p-4 rounded-md border-2 transition-all",
              isCompleted ? "border-green-100 bg-green-50" : highlightStyles[highlightLevel],
              className
            )}
          >
            {step && totalSteps && (
              <Badge className="absolute -top-2 -left-2 z-10">
                {step}/{totalSteps}
              </Badge>
            )}
            
            <div className="absolute top-2 right-2">
              {isCompleted ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <HelpCircle className="h-5 w-5 text-blue-500 animate-pulse" />
              )}
            </div>
            
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs p-4 border-2 border-blue-100">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{title}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
            {!isCompleted && onComplete && (
              <button 
                onClick={handleComplete}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1 mt-2"
              >
                <Check className="h-3 w-3" /> Mark as completed
              </button>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
