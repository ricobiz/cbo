
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiKey, ChevronRight, Info, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { externalAPIService } from "@/services/ExternalAPIService";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ApiSettingsProps {
  onSave: () => void;
}

export function ApiSettings({ onSave }: ApiSettingsProps) {
  const [openRouterApiKey, setOpenRouterApiKey] = useState("");
  const [browserUseApiKey, setBrowserUseApiKey] = useState("");
  const [activeTab, setActiveTab] = useState("keys");
  const { toast } = useToast();
  
  // Load current keys from service on mount
  useEffect(() => {
    // We're not getting the actual keys (for security), just checking if they exist
    if (externalAPIService.hasOpenRouterApiKey()) {
      setOpenRouterApiKey("API_KEY_SAVED");
    }
    
    if (externalAPIService.hasBrowserUseApiKey()) {
      setBrowserUseApiKey("API_KEY_SAVED");
    }
  }, []);
  
  const handleSave = () => {
    try {
      // Only update keys that have changed
      if (openRouterApiKey && openRouterApiKey !== "API_KEY_SAVED") {
        externalAPIService.setOpenRouterApiKey(openRouterApiKey);
      }
      
      if (browserUseApiKey && browserUseApiKey !== "API_KEY_SAVED") {
        externalAPIService.setBrowserUseApiKey(browserUseApiKey);
      }
      
      toast({
        title: "API ключи сохранены",
        description: "Настройки API успешно обновлены",
        variant: "default",
      });
      
      onSave();
    } catch (error) {
      toast({
        title: "Ошибка при сохранении",
        description: "Не удалось сохранить API ключи",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="keys">API Ключи</TabsTrigger>
          <TabsTrigger value="docs">Документация</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keys" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ApiKey className="h-5 w-5 text-primary" />
                <CardTitle>OpenRouter API</CardTitle>
              </div>
              <CardDescription>
                Интеграция с OpenRouter API для анализа команд с использованием продвинутых языковых моделей
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openrouter-key">API Ключ</Label>
                <Input
                  id="openrouter-key"
                  type="password"
                  value={openRouterApiKey}
                  onChange={(e) => setOpenRouterApiKey(e.target.value)}
                  placeholder="Введите ваш OpenRouter API ключ"
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <Info className="h-3 w-3" /> Получить API ключ на OpenRouter
                  <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ApiKey className="h-5 w-5 text-primary" />
                <CardTitle>Browser Use API</CardTitle>
              </div>
              <CardDescription>
                Интеграция с Browser Use для автоматизации действий в браузере
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="browser-use-key">API Ключ</Label>
                <Input
                  id="browser-use-key"
                  type="password"
                  value={browserUseApiKey}
                  onChange={(e) => setBrowserUseApiKey(e.target.value)}
                  placeholder="Введите ваш Browser Use API ключ"
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                <a 
                  href="https://browser-use.ai/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <Info className="h-3 w-3" /> Получить API ключ на Browser Use
                  <ChevronRight className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>
              <Check className="h-4 w-4 mr-2" /> Сохранить API ключи
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="docs" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Документация по API</CardTitle>
              <CardDescription>
                Информация о поддерживаемых API и их использовании
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">OpenRouter API</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  OpenRouter позволяет использовать различные языковые модели для анализа команд и генерации контента. 
                  API используется для улучшения понимания команд пользователя.
                </p>
                <div className="mt-2">
                  <a 
                    href="https://openrouter.ai/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <Info className="h-3 w-3" /> Официальная документация
                    <ChevronRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium">Browser Use API</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Browser Use позволяет автоматизировать действия в браузере, такие как 
                  навигация по сайтам, клики, ввод текста и другие взаимодействия.
                </p>
                <div className="mt-2">
                  <a 
                    href="https://browser-use.ai/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <Info className="h-3 w-3" /> Официальная документация
                    <ChevronRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
