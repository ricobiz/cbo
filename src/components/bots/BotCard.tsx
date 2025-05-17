
import { useState } from "react";
import { Bot, Play, Pause, Settings } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

interface BotCardProps {
  id: string;
  name: string;
  description: string;
  status: "active" | "idle" | "error";
  type: "content" | "interaction" | "click" | "parser";
  lastRun?: string;
}

export function BotCard({ id, name, description, status, type, lastRun }: BotCardProps) {
  const [isActive, setIsActive] = useState(status === "active");
  const { toast } = useToast();

  const handleToggle = () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    toast({
      title: `Bot ${newStatus ? "activated" : "deactivated"}`,
      description: `${name} is now ${newStatus ? "running" : "stopped"}.`,
    });
  };

  const getBotTypeIcon = () => {
    switch (type) {
      case "content":
        return <Bot className="h-4 w-4 text-primary" />;
      case "interaction":
        return <Bot className="h-4 w-4 text-secondary" />;
      case "click":
        return <Bot className="h-4 w-4 text-accent" />;
      case "parser":
        return <Bot className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBotTypeBadge = () => {
    switch (type) {
      case "content":
        return <Badge variant="default">Content Generator</Badge>;
      case "interaction":
        return <Badge variant="secondary">Interaction Simulator</Badge>;
      case "click":
        return <Badge variant="outline" className="bg-accent/20 text-accent border-accent/20">Click Bot</Badge>;
      case "parser":
        return <Badge variant="outline">Parser Bot</Badge>;
    }
  };

  return (
    <Card className={isActive ? "border-primary/50" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getBotTypeIcon()}
            <CardTitle className="text-base">{name}</CardTitle>
          </div>
          <Switch checked={isActive} onCheckedChange={handleToggle} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex items-center gap-2">
          {getBotTypeBadge()}
          {lastRun && (
            <span className="text-xs text-muted-foreground">
              Last run: {lastRun}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 flex justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => {
            toast({
              title: "Bot configuration",
              description: `Opening configuration for ${name}`,
            });
          }}
        >
          <Settings className="h-3 w-3 mr-1" />
          Configure
        </Button>
        <Button
          variant={isActive ? "outline" : "default"}
          size="sm"
          className="text-xs"
          onClick={handleToggle}
        >
          {isActive ? (
            <>
              <Pause className="h-3 w-3 mr-1" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-3 w-3 mr-1" />
              Start
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
