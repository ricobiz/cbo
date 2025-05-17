
import { useState } from "react";
import { Calendar, Rocket, Users, Zap } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CampaignProgressIndicator } from "./CampaignProgressIndicator";
import { CampaignDetails } from "./CampaignDetails";
import { useToast } from "@/components/ui/use-toast";

export interface CampaignCardProps {
  campaign: {
    id: string;
    title: string;
    platform: string;
    status: string;
    progress: number;
    startDate: string;
    endDate: string;
    type: string;
    metrics: {
      views: number;
      engagement: number;
      conversions: number;
    }
  },
  onStatusChange?: (id: string, newStatus: string) => void;
}

export function CampaignCard({ campaign, onStatusChange }: CampaignCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();
  
  const getStatusBadge = () => {
    switch (campaign.status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Активна</Badge>;
      case "paused":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Приостановлена</Badge>;
      case "draft":
        return <Badge variant="outline">Черновик</Badge>;
      case "completed":
        return <Badge variant="secondary">Завершена</Badge>;
      case "scheduled":
        return <Badge variant="outline">Запланирована</Badge>;
      default:
        return <Badge variant="outline">{campaign.status}</Badge>;
    }
  };
  
  const handleStatusChange = () => {
    const newStatus = campaign.status === "active" ? "paused" : "active";
    
    // Call the parent component's handler if provided
    if (onStatusChange) {
      onStatusChange(campaign.id, newStatus);
    } else {
      // If no handler is provided, show toast only
      if (campaign.status === "active") {
        toast({
          title: "Кампания приостановлена",
          description: `${campaign.title} была успешно приостановлена.`,
        });
      } else if (campaign.status === "paused" || campaign.status === "draft") {
        toast({
          title: "Кампания возобновлена",
          description: `${campaign.title} была успешно возобновлена.`,
        });
      }
    }
  };

  return (
    <>
      <Card className={campaign.status === "active" ? "border-primary/50 hover:shadow-md transition-shadow" : "hover:shadow-md transition-shadow"}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{campaign.title}</CardTitle>
                {getStatusBadge()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{campaign.type === "promotion" ? "Продвижение" : "Рост аудитории"}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center">
              <Badge variant="outline">{campaign.platform}</Badge>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{campaign.startDate} - {campaign.endDate}</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-3 w-3 mr-1 text-primary" />
              <span>
                Цель: {campaign.type === "promotion" ? "Продвижение" : "Рост"}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <CampaignProgressIndicator progress={campaign.progress} showPercentage={true} />
          </div>

          {campaign.metrics && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              {campaign.metrics.views !== undefined && (
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Просмотры</div>
                  <div className="text-sm font-medium">{campaign.metrics.views.toLocaleString()}</div>
                </div>
              )}
              {campaign.metrics.engagement !== undefined && (
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Взаимодействия</div>
                  <div className="text-sm font-medium">{campaign.metrics.engagement.toLocaleString()}</div>
                </div>
              )}
              {campaign.metrics.conversions !== undefined && (
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Конверсии</div>
                  <div className="text-sm font-medium">{campaign.metrics.conversions.toLocaleString()}</div>
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
          {campaign.status === "active" ? (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleStatusChange}
            >
              Приостановить
            </Button>
          ) : (campaign.status === "paused" || campaign.status === "draft") ? (
            <Button
              variant="default"
              size="sm"
              className="text-xs"
              onClick={handleStatusChange}
            >
              Активировать
            </Button>
          ) : null}
        </CardFooter>
      </Card>
      
      <CampaignDetails
        id={campaign.id}
        name={campaign.title}
        description={campaign.type === "promotion" ? "Кампания продвижения" : "Кампания роста"}
        platform={campaign.platform}
        progress={campaign.progress}
        status={campaign.status}
        startDate={campaign.startDate}
        endDate={campaign.endDate}
        target={{
          type: campaign.type === "promotion" ? "просмотры" : "подписчики",
          value: campaign.type === "promotion" ? 50000 : 5000
        }}
        stats={{
          views: campaign.metrics.views,
          engagements: campaign.metrics.engagement,
          clicks: campaign.metrics.conversions
        }}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}
