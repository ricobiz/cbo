
import { Calendar, Rocket, Users, Zap } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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

  return (
    <Card className={status === "active" ? "border-primary/50" : ""}>
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
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
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
        >
          View Details
        </Button>
        {status === "active" ? (
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Pause
          </Button>
        ) : status === "paused" ? (
          <Button
            variant="default"
            size="sm"
            className="text-xs"
          >
            Resume
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
