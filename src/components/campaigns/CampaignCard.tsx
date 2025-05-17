
import { useState } from "react";
import { Calendar, Rocket, Users, Zap } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CampaignProgressIndicator } from "./CampaignProgressIndicator";
import { CampaignDetails } from "./CampaignDetails";
import { useToast } from "@/components/ui/use-toast";

interface CampaignCardProps {
  id: string;
  name: string;
  description: string;
  platform: string;
  progress: number;
  status: "active" | "paused" | "completed" | "scheduled";
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
}

export function CampaignCard({
  id,
  name,
  description,
  platform,
  progress,
  status,
  startDate,
  endDate,
  target,
  stats
}: CampaignCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();
  
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
    }
  };
  
  const handleStatusChange = () => {
    if (status === "active") {
      toast({
        title: "Campaign paused",
        description: `${name} has been paused successfully.`,
      });
    } else if (status === "paused") {
      toast({
        title: "Campaign resumed",
        description: `${name} has been resumed successfully.`,
      });
    }
  };

  return (
    <>
      <Card className={status === "active" ? "border-primary/50 hover:shadow-md transition-shadow" : "hover:shadow-md transition-shadow"}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{name}</CardTitle>
                {getStatusBadge()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center">
              <Badge variant="outline">{platform}</Badge>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{startDate} - {endDate}</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-3 w-3 mr-1 text-primary" />
              <span>
                Target: {target.value} {target.type}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <CampaignProgressIndicator progress={progress} showPercentage={false} />
          </div>

          {stats && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              {stats.views !== undefined && (
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Views</div>
                  <div className="text-sm font-medium">{stats.views.toLocaleString()}</div>
                </div>
              )}
              {stats.engagements !== undefined && (
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Engagements</div>
                  <div className="text-sm font-medium">{stats.engagements.toLocaleString()}</div>
                </div>
              )}
              {stats.clicks !== undefined && (
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Clicks</div>
                  <div className="text-sm font-medium">{stats.clicks.toLocaleString()}</div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t bg-muted/50 flex justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setDetailsOpen(true)}
          >
            View Details
          </Button>
          {status === "active" ? (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleStatusChange}
            >
              Pause
            </Button>
          ) : status === "paused" ? (
            <Button
              variant="default"
              size="sm"
              className="text-xs"
              onClick={handleStatusChange}
            >
              Resume
            </Button>
          ) : null}
        </CardFooter>
      </Card>
      
      <CampaignDetails
        id={id}
        name={name}
        description={description}
        platform={platform}
        progress={progress}
        status={status}
        startDate={startDate}
        endDate={endDate}
        target={target}
        stats={stats}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}
