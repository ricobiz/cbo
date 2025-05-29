
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Globe, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Wifi,
  Shield,
  Eye
} from "lucide-react";
import externalAPIService from "@/services/external-api";
import { useBotStore } from "@/store/BotStore";

interface ConnectionTest {
  id: string;
  name: string;
  platform: string;
  status: 'pending' | 'testing' | 'success' | 'failed';
  latency?: number;
  error?: string;
  proxyUsed?: string;
  userAgent?: string;
}

export function BotConnectionTester() {
  const { bots } = useBotStore();
  const [isRunning, setIsRunning] = useState(false);
  const [tests, setTests] = useState<ConnectionTest[]>([]);
  const [progress, setProgress] = useState(0);

  const platformUrls = {
    instagram: 'https://www.instagram.com',
    youtube: 'https://www.youtube.com',
    twitter: 'https://twitter.com',
    facebook: 'https://www.facebook.com',
    tiktok: 'https://www.tiktok.com',
    spotify: 'https://open.spotify.com'
  };

  const runConnectionTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Подготавливаем тесты для активных ботов
    const testCases: ConnectionTest[] = bots
      .filter(bot => bot.status === 'active')
      .map(bot => ({
        id: bot.id,
        name: bot.name,
        platform: bot.targetPlatform || 'instagram',
        status: 'pending' as const
      }));

    setTests(testCases);

    if (testCases.length === 0) {
      toast.error("Нет активных ботов для тестирования");
      setIsRunning(false);
      return;
    }

    for (let i = 0; i < testCases.length; i++) {
      const test = testCases[i];
      const platformUrl = platformUrls[test.platform as keyof typeof platformUrls] || platformUrls.instagram;
      
      // Обновляем статус на "тестирование"
      setTests(prev => prev.map(t => 
        t.id === test.id ? { ...t, status: 'testing' } : t
      ));

      try {
        console.log(`Testing connection for bot ${test.name} to ${test.platform}`);
        
        const startTime = Date.now();
        
        // Тестируем создание сессии браузера
        const sessionId = await externalAPIService.createBrowserSession({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          viewport: { width: 1920, height: 1080 }
        });
        
        // Тестируем навигацию к платформе
        const navigationResult = await externalAPIService.executeBrowserAction({
          type: 'navigate',
          params: { url: platformUrl }
        }, sessionId);
        
        const latency = Date.now() - startTime;
        
        if (navigationResult.success) {
          setTests(prev => prev.map(t => 
            t.id === test.id ? { 
              ...t, 
              status: 'success',
              latency,
              proxyUsed: 'Auto-detected',
              userAgent: 'Chrome/Latest'
            } : t
          ));
          
          console.log(`✅ Bot ${test.name} successfully connected to ${test.platform}`);
        } else {
          throw new Error('Navigation failed');
        }
        
      } catch (error) {
        console.error(`❌ Bot ${test.name} failed to connect:`, error);
        
        setTests(prev => prev.map(t => 
          t.id === test.id ? { 
            ...t, 
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          } : t
        ));
      }
      
      // Обновляем прогресс
      setProgress(((i + 1) / testCases.length) * 100);
      
      // Небольшая задержка между тестами
      if (i < testCases.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsRunning(false);
    
    const successCount = testCases.filter(t => 
      tests.find(test => test.id === t.id)?.status === 'success'
    ).length;
    
    toast.success(`Тестирование завершено: ${successCount}/${testCases.length} ботов успешно подключились`);
  };

  const getStatusIcon = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'testing': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary">Ожидание</Badge>;
      case 'testing': return <Badge variant="secondary" className="bg-blue-100">Тестирование</Badge>;
      case 'success': return <Badge variant="default" className="bg-green-100 text-green-800">Успешно</Badge>;
      case 'failed': return <Badge variant="destructive">Ошибка</Badge>;
    }
  };

  const activeBots = bots.filter(bot => bot.status === 'active');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Тестирование подключений ботов
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeBots.length === 0 ? (
          <div className="text-center py-8">
            <Wifi className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">Нет активных ботов</h3>
            <p className="text-sm text-muted-foreground">
              Запустите хотя бы одного бота для тестирования подключений
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Найдено {activeBots.length} активных ботов для тестирования
                </p>
              </div>
              
              <Button 
                onClick={runConnectionTests} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {isRunning ? 'Тестирование...' : 'Запустить тесты'}
              </Button>
            </div>

            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Прогресс тестирования</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {tests.length > 0 && (
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-3">
                  {tests.map((test) => (
                    <div key={test.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(test.status)}
                          <div>
                            <h4 className="font-medium">{test.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Платформа: {test.platform}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(test.status)}
                      </div>
                      
                      {test.status === 'success' && (
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>Задержка: {test.latency}ms</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-3 w-3" />
                            <span>Прокси: {test.proxyUsed}</span>
                          </div>
                        </div>
                      )}
                      
                      {test.status === 'failed' && test.error && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          <strong>Ошибка:</strong> {test.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
