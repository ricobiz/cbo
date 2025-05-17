import { Button } from "@/components/ui/button";
import { CommandCenter } from "@/components/command/CommandCenter";
import { CommandExamples } from "@/components/command/CommandExamples";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowRight, Bot, CircleHelp, Cpu, Mic, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import externalAPIService from "@/services/external-api";

export default function CommandPage() {
  const [apiStatus, setApiStatus] = useState({
    openRouter: false,
    browserUse: false,
    offlineMode: true,
  });
  
  useEffect(() => {
    // Check API status on component mount
    const checkApiStatus = () => {
      setApiStatus({
        openRouter: externalAPIService.hasOpenRouterApiKey(),
        browserUse: externalAPIService.hasBrowserUseApiKey(),
        offlineMode: externalAPIService.isOfflineMode(),
      });
    };
    
    // Initialize API keys from storage
    externalAPIService.initializeFromStorage();
    
    // Check initial status
    checkApiStatus();
    
    // Set up interval to check API status periodically
    const intervalId = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container relative pb-6">
      <Tabs defaultValue="command" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="command">
            <Bot className="mr-2 h-4 w-4" />
            Командный центр
          </TabsTrigger>
          <TabsTrigger value="examples">
            <CircleHelp className="mr-2 h-4 w-4" />
            Примеры команд
          </TabsTrigger>
          <TabsTrigger value="status">
            <Settings className="mr-2 h-4 w-4" />
            Статус системы
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="command" className="space-y-4">
          <CommandCenter />
        </TabsContent>
        
        <TabsContent value="examples" className="space-y-4">
          <CommandExamples />
        </TabsContent>
        
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Статус интеграций</CardTitle>
              <CardDescription>Проверьте подключение к внешним сервисам</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Badge variant={apiStatus.offlineMode ? "secondary" : "outline"}>
                  Автономный режим: {apiStatus.offlineMode ? "Включен" : "Выключен"}
                </Badge>
                <Badge variant={apiStatus.openRouter ? "default" : "outline"}>
                  OpenRouter API: {apiStatus.openRouter ? "Подключен" : "Не подключен"}
                </Badge>
                <Badge variant={apiStatus.browserUse ? "default" : "outline"}>
                  Browser Use API: {apiStatus.browserUse ? "Подключен" : "Не подключен"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
