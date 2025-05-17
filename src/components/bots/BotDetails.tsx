
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bot, Play, Pause, Settings, Clock, Zap, ChevronRight } from "lucide-react";

interface BotDetailsProps {
  id: string;
  name: string;
  description: string;
  status: "active" | "idle" | "error";
  type: "content" | "interaction" | "click" | "parser";
  lastRun?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BotDetails({ 
  id,
  name, 
  description, 
  status, 
  type, 
  lastRun,
  open,
  onOpenChange
}: BotDetailsProps) {
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

  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "idle":
        return <Badge variant="outline">Idle</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" /> {name}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div className="flex gap-2 mt-2">
            {getBotTypeBadge()}
            {getStatusBadge()}
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Behavior Settings</Label>
                <div className="rounded-md border p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Action Delay</div>
                    <div className="text-sm">1.5 - 3 seconds (random)</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Mouse Movement</div>
                    <div className="text-sm">Natural path simulation</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Content Interaction</div>
                    <div className="text-sm">Personalized response patterns</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Platform Settings</Label>
                <div className="rounded-md border p-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Rotation Schedule</div>
                      <div className="text-sm">Every 4 hours</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Instance Limitation</div>
                      <div className="text-sm">5 per IP address</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="space-y-2">
              <div className="rounded-md border p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Daily Schedule</span>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 items-center gap-2">
                      <div className="text-muted-foreground">Running time</div>
                      <div>08:00 - 22:00</div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                      <div className="text-muted-foreground">Break periods</div>
                      <div>Random 15-30 min breaks</div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-2">
                      <div className="text-muted-foreground">Days active</div>
                      <div>Monday - Sunday</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="h-[300px] overflow-y-auto space-y-4">
            <div className="space-y-3">
              {[
                { time: "12:45", message: "Content interaction completed" },
                { time: "12:32", message: "Engaged with trending topic #viral" },
                { time: "12:15", message: "Started content discovery routine" },
                { time: "11:50", message: "Session rotation completed" },
                { time: "11:30", message: "Profile switching initiated" },
                { time: "10:45", message: "Content interaction completed" },
                { time: "10:32", message: "Engaged with trending topic #tech" },
                { time: "10:15", message: "Started content discovery routine" }
              ].map((log, index) => (
                <div key={index} className="flex gap-3 text-sm p-2 rounded-md hover:bg-muted/50">
                  <div className="text-muted-foreground">{log.time}</div>
                  <div>{log.message}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Advanced Config
          </Button>
          
          {status === "active" ? (
            <Button variant="outline">
              <Pause className="mr-2 h-4 w-4" /> Pause Bot
            </Button>
          ) : (
            <Button>
              <Play className="mr-2 h-4 w-4" /> Start Bot
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
