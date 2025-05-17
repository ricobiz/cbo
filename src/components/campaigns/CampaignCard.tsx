
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Instagram, Youtube, Twitter, Music } from "lucide-react";
import { useTranslation } from "@/store/LanguageStore";

export interface CampaignCardProps {
  campaign: any;
  onClick: () => void;
}

export const CampaignCard = ({ campaign, onClick }: CampaignCardProps) => {
  const { t } = useTranslation();
  
  const getPlatformIcon = () => {
    switch (campaign.platform?.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'spotify':
        return <Music className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = () => {
    switch (campaign.status) {
      case 'active':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'draft':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 70) return "bg-emerald-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 30) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card onClick={onClick} className="cursor-pointer hover:border-primary transition-colors overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{campaign.name}</h3>
          <Badge variant={getStatusBadgeVariant()} className="capitalize">
            {t(campaign.status)}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          {getPlatformIcon()}
          <span className="ml-1 capitalize">{campaign.platform}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mt-2">
          <div className="flex justify-between items-center mb-1 text-sm">
            <span>{t('progress')}</span>
            <span>{campaign.progress}%</span>
          </div>
          <Progress 
            value={campaign.progress} 
            className={`h-2 ${getProgressColor(campaign.progress)}`} 
          />
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground pt-0">
        {campaign.startDate && campaign.endDate ? (
          <div className="text-xs">
            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
          </div>
        ) : (
          <div className="text-xs">{t('noDateSpecified')}</div>
        )}
      </CardFooter>
    </Card>
  );
};
