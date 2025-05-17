
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Activity, AlertTriangle, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBotStore } from "@/store/BotStore";
import { BotActivity as BotActivityType } from "@/services/BotService";
import { InteractiveHint } from "@/components/ui/interactive-hint";
import { useTranslation } from "@/store/LanguageStore";

export function BotMonitoring() {
  const { bots, botActivities, refreshBotActivities } = useBotStore();
  const [showHint, setShowHint] = useState(true);
  const { t } = useTranslation();
  
  useEffect(() => {
    const interval = setInterval(() => {
      refreshBotActivities();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [refreshBotActivities]);
  
  // Get active bots
  const activeBots = bots.filter(bot => bot.status === 'active');
  
  // Count real activities - bots that have actual activity data
  const realActivitiesCount = Object.values(botActivities).filter(activity => activity !== undefined).length;
  
  // Show empty state if no active bots or no real activities
  if (activeBots.length === 0 || realActivitiesCount === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t('monitoring')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bot className="h-12 w-12 text-muted-foreground opacity-20" />
            {activeBots.length === 0 ? (
              <>
                <h3 className="mt-4 text-lg font-medium">{t('noActiveBotsOrData')}</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  {t('activateBot')}
                </p>
              </>
            ) : (
              <>
                <h3 className="mt-4 text-lg font-medium">{t('noActivityData')}</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  {t('waitingForActivityData')}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'browsing': return '🌐';
      case 'content_creation': return '📝';
      case 'engagement': return '👍';
      case 'account_interaction': return '👥';
      case 'data_collection': return '📊';
      case 'ip_rotation': return '🔄';
      default: return '🤖';
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t('monitoring')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showHint && (
          <InteractiveHint
            title={t('monitoring')}
            description={t('monitoringDesc')}
            onComplete={() => setShowHint(false)}
            className="mb-4"
          >
            <div className="flex items-start gap-3">
              <Info className="h-8 w-8 text-blue-500 mt-1" />
              <div>
                <h4 className="font-medium">{t('realTimeData')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('realTimeDataDesc')}
                </p>
              </div>
            </div>
          </InteractiveHint>
        )}
        
        <Tabs defaultValue="activity">
          <TabsList className="mb-4">
            <TabsTrigger value="activity">{t('activity')}</TabsTrigger>
            <TabsTrigger value="performance">{t('performance')}</TabsTrigger>
            <TabsTrigger value="errors">{t('errors')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-4">
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {activeBots.map(bot => {
                  const activity = botActivities[bot.id];
                  
                  if (!activity) {
                    return (
                      <div key={bot.id} className="border rounded-md p-3 flex items-start">
                        <div className="bg-primary/10 p-2 rounded-md mr-3 text-xl">🤖</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{bot.name}</h4>
                            <Badge variant="outline">{bot.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t('waitingForActivityData')}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div key={bot.id} className="border rounded-md p-3 flex items-start">
                      <div className="bg-primary/10 p-2 rounded-md mr-3 text-xl">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{bot.name}</h4>
                          <Badge variant="outline">{bot.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {activity.details}
                        </p>
                        {activity.target && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.target}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="performance">
            <div className="space-y-4">
              {activeBots.map(bot => (
                <div key={bot.id} className="border rounded-md p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{bot.name}</h4>
                    <Badge variant={bot.healthPercentage > 80 ? "default" : bot.healthPercentage > 60 ? "secondary" : "destructive"}>
                      {bot.healthPercentage}%
                    </Badge>
                  </div>
                  <Progress value={bot.healthPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Последний запуск: {new Date(bot.lastRun).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="errors">
            <div className="border rounded-md p-4 text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <h4 className="font-medium">{t('noErrors')}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {t('botsWorkingNormally')}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
