
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentIntegrationService } from "@/services/ContentIntegrationService";
import { MessageSquare, Image, Music, Calendar, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function IntegrationHistory() {
  const [history, setHistory] = useState<Array<{
    id: string;
    campaignId: string;
    campaignName: string;
    contentType: 'text' | 'image' | 'audio';
    platform: string;
    content: string;
    mediaUrl?: string;
    timestamp: string;
  }>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const integrationHistory = ContentIntegrationService.getIntegrationHistory();
      setHistory(integrationHistory);
    } catch (error) {
      console.error("Error loading integration history:", error);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ч. назад`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} д. назад`;
  };

  const getContentTypeIcon = (contentType: 'text' | 'image' | 'audio') => {
    switch (contentType) {
      case 'text': return <MessageSquare className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const navigateToCampaign = (campaignId: string) => {
    navigate(`/campaigns?id=${campaignId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>История интеграций</CardTitle>
        <Badge variant="outline" className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {history.length}
        </Badge>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Пока нет интегрированного контента
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {history.map(item => (
              <div 
                key={item.id} 
                className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {getContentTypeIcon(item.contentType)}
                    <span className="text-sm font-medium capitalize">
                      {item.contentType === 'text' ? 'Текст' : 
                       item.contentType === 'image' ? 'Изображение' : 'Аудио'}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {item.platform}
                  </Badge>
                </div>
                
                <div className="mt-2 text-sm line-clamp-2">
                  {item.content}
                </div>
                
                {item.mediaUrl && item.contentType === 'image' && (
                  <div className="mt-2 aspect-video bg-muted rounded-md overflow-hidden">
                    <img 
                      src={item.mediaUrl} 
                      alt="Content preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {item.mediaUrl && item.contentType === 'audio' && (
                  <div className="mt-2">
                    <audio controls className="w-full h-8">
                      <source src={item.mediaUrl} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
                
                <div 
                  className="flex items-center justify-between mt-3 text-xs cursor-pointer"
                  onClick={() => navigateToCampaign(item.campaignId)}
                >
                  <span className="text-muted-foreground">
                    {formatTimeAgo(item.timestamp)}
                  </span>
                  <div className="flex items-center gap-1 text-primary hover:underline">
                    <span>Кампания: {item.campaignName}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
