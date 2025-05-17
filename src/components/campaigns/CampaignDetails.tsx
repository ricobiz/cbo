
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Rocket, Users, Zap, BarChart, LineChart, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CampaignDetailsProps {
  id: string;
  name: string;
  description: string;
  platform: string;
  progress: number;
  status: "active" | "paused" | "completed" | "scheduled" | string;
  startDate: string;
  endDate: string;
  target: {
    type: string;
    value: number | string;
  };
  stats?: {
    views?: number;
    engagements?: number;
    clicks?: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignDetails({
  id,
  name,
  description,
  platform,
  progress,
  status,
  startDate,
  endDate,
  target,
  stats,
  open,
  onOpenChange
}: CampaignDetailsProps) {
  
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "paused":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Paused</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressColor = () => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 70) return "bg-emerald-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 30) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" /> {name}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{platform}</Badge>
            {getStatusBadge()}
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Campaign Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className={`h-2 ${getProgressColor()}`} />
            </div>
            
            <div className="rounded-md border p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Start Date
                </div>
                <div className="text-sm">{startDate}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  End Date
                </div>
                <div className="text-sm">{endDate}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Target className="h-4 w-4 text-primary" />
                  Target
                </div>
                <div className="text-sm">{target.value} {target.type}</div>
              </div>
            </div>
            
            {stats && (
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-3">Campaign Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  {stats.views !== undefined && (
                    <div className="bg-muted/30 p-3 rounded-md text-center">
                      <div className="text-sm text-muted-foreground">Views</div>
                      <div className="text-lg font-semibold">{stats.views.toLocaleString()}</div>
                    </div>
                  )}
                  {stats.engagements !== undefined && (
                    <div className="bg-muted/30 p-3 rounded-md text-center">
                      <div className="text-sm text-muted-foreground">Engagements</div>
                      <div className="text-lg font-semibold">{stats.engagements.toLocaleString()}</div>
                    </div>
                  )}
                  {stats.clicks !== undefined && (
                    <div className="bg-muted/30 p-3 rounded-md text-center">
                      <div className="text-sm text-muted-foreground">Clicks</div>
                      <div className="text-lg font-semibold">{stats.clicks.toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Performance Metrics</h3>
              <div className="h-[200px] border rounded-md p-4 flex items-center justify-center">
                <div className="text-muted-foreground text-center">
                  <LineChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Detailed performance charts will appear here</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Engagement Breakdown</h3>
              <div className="h-[200px] border rounded-md p-4 flex items-center justify-center">
                <div className="text-muted-foreground text-center">
                  <BarChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Engagement analytics will appear here</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="rounded-md border p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Campaign ID</div>
                <div className="text-sm font-mono">{id}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Platform Settings</div>
                <div className="text-sm">Integration: {platform}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Content Strategy</div>
                <div className="text-sm">Balanced Engagement</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Budget Allocation</div>
                <div className="text-sm">Auto-optimized</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">AI Assistance</div>
                <div className="text-sm">Enabled (Content & Targeting)</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" /> View Audience
          </Button>
          
          {status === "active" ? (
            <Button variant="outline">
              <Zap className="mr-2 h-4 w-4" /> Pause Campaign
            </Button>
          ) : status === "paused" ? (
            <Button>
              <Rocket className="mr-2 h-4 w-4" /> Resume Campaign
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
