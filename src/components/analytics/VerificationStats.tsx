import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { ActionVerification } from "@/services/external-api";
import externalAPIService from "@/services/external-api";

interface VerificationStatsProps {
  platform?: string;
  contentId?: string;
  metricType?: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment';
}

export function VerificationStats({ platform, contentId, metricType }: VerificationStatsProps) {
  const [verifications, setVerifications] = useState<ActionVerification[]>([]);
  const [successRate, setSuccessRate] = useState<number>(0);
  
  // This would be updated in a real implementation to use the actual verifications
  // For now, we'll use mock data
  useEffect(() => {
    // In a real implementation, we'd fetch the verification history
    if (platform && contentId) {
      // This will be an empty array until real verifications occur
      // We could also add mock data here for testing
      const mockVerifications: ActionVerification[] = [
        {
          platform: platform || 'youtube',
          contentId: contentId || 'video123',
          metricType: metricType || 'view',
          timestamp: new Date().toISOString(),
          verified: true,
          metricValue: 450
        },
        {
          platform: platform || 'youtube',
          contentId: contentId || 'video123',
          metricType: metricType || 'view',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          verified: true,
          metricValue: 442
        },
        {
          platform: platform || 'youtube',
          contentId: contentId || 'video123',
          metricType: metricType || 'view',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          verified: false,
          error: 'Failed to verify view count'
        }
      ];
      
      setVerifications(mockVerifications);
      setSuccessRate(platform && contentId ? 67 : 0); // Mock 67% success rate
    }
  }, [platform, contentId, metricType]);

  if (!platform || !contentId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Верификация действий</CardTitle>
          <CardDescription>
            Выберите платформу и контент для просмотра статистики верификации
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-muted-foreground">Нет выбранной кампании или контента</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Верификация действий: {getPlatformLabel(platform)}</CardTitle>
        <CardDescription>
          Статистика подтвержденных взаимодействий для ID: {contentId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Успешность верификации</span>
              <span className="text-sm">{successRate.toFixed(1)}%</span>
            </div>
            <Progress value={successRate} className="h-2" />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Последние проверки</h4>
            
            {verifications.length > 0 ? (
              <div className="space-y-2">
                {verifications.map((verification, i) => (
                  <div key={i} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <div className="text-sm font-medium flex items-center gap-2">
                        {getMetricTypeLabel(verification.metricType)}
                        {verification.verified ? (
                          <Badge className="bg-green-500">Подтверждено</Badge>
                        ) : (
                          <Badge variant="destructive">Не подтверждено</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(verification.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      {verification.metricValue !== undefined ? (
                        <div className="font-mono">{verification.metricValue}</div>
                      ) : verification.error ? (
                        <div className="text-sm text-red-500 max-w-[200px] truncate" title={verification.error}>
                          {verification.error}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 border rounded-md border-dashed">
                <p className="text-muted-foreground">Нет данных о верификации</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getPlatformLabel(platform: string): string {
  const platforms: Record<string, string> = {
    'youtube': 'YouTube',
    'spotify': 'Spotify',
    'instagram': 'Instagram',
    'tiktok': 'TikTok',
    'facebook': 'Facebook',
    'twitter': 'Twitter',
  };
  
  return platforms[platform.toLowerCase()] || platform;
}

function getMetricTypeLabel(metricType: string): string {
  const types: Record<string, string> = {
    'view': 'Просмотр',
    'play': 'Воспроизведение',
    'click': 'Клик',
    'like': 'Лайк',
    'follow': 'Подписка',
    'comment': 'Комментарий',
  };
  
  return types[metricType] || metricType;
}
