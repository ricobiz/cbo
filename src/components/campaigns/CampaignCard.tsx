
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
        return <Badge variant="default" className="bg-green-500">Активна</Badge>;
      case "paused":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Приостановлена</Badge>;
      case "completed":
        return <Badge variant="secondary">Завершена</Badge>;
      case "scheduled":
        return <Badge variant="outline">Запланирована</Badge>;
    }
  };
  
  const handleStatusChange = () => {
    if (status === "active") {
      toast({
        title: "Кампания приостановлена",
        description: `${name} была успешно приостановлена.`,
      });
    } else if (status === "paused") {
      toast({
        title: "Кампания возобновлена",
        description: `${name} была успешно возобновлена.`,
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
                Цель: {target.value} {target.type}
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
                  <div className="text-xs text-muted-foreground">Просмотры</div>
                  <div className="text-sm font-medium">{stats.views.toLocaleString()}</div>
                </div>
              )}
              {stats.engagements !== undefined && (
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Взаимодействия</div>
                  <div className="text-sm font-medium">{stats.engagements.toLocaleString()}</div>
                </div>
              )}
              {stats.clicks !== undefined && (
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Клики</div>
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
            Подробнее
          </Button>
          {status === "active" ? (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleStatusChange}
            >
              Приостановить
            </Button>
          ) : status === "paused" ? (
            <Button
              variant="default"
              size="sm"
              className="text-xs"
              onClick={handleStatusChange}
            >
              Возобновить
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
