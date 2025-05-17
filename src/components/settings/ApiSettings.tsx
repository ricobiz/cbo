
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { externalAPIService } from "@/services/ExternalAPIService";
import { useToast } from "@/components/ui/use-toast";

interface ApiSettingsProps {
  onSave: () => void;
}

export const ApiSettings = ({ onSave }: ApiSettingsProps) => {
  // Initialize with actual values from service when possible
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [browserUseKey, setBrowserUseKey] = useState("");
  const [openAiKey, setOpenAiKey] = useState("");
  const [midjourneyKey, setMidjourneyKey] = useState("");
  const [sunoKey, setSunoKey] = useState("");
  
  const [isOpenRouterKeyVisible, setIsOpenRouterKeyVisible] = useState(false);
  const [isBrowserUseKeyVisible, setIsBrowserUseKeyVisible] = useState(false);
  const [isOpenAiKeyVisible, setIsOpenAiKeyVisible] = useState(false);
  const [autoRotateKeys, setAutoRotateKeys] = useState(false);
  
  const { toast } = useToast();

  // Load saved API keys on component mount
  useEffect(() => {
    // Check if API keys exist in the service and load them
    const hasOpenRouter = externalAPIService.hasOpenRouterApiKey();
    const hasBrowserUse = externalAPIService.hasBrowserUseApiKey();
    
    if (hasOpenRouter) {
      setOpenRouterKey("••••••••••••••••••••••••••••••");
    }
    
    if (hasBrowserUse) {
      setBrowserUseKey("••••••••••••••••••••••••••••••");
    }
  }, []);

  const handleSave = () => {
    // Set API keys in the service
    if (openRouterKey && !openRouterKey.includes("•")) {
      externalAPIService.setOpenRouterApiKey(openRouterKey);
    }
    
    if (browserUseKey && !browserUseKey.includes("•")) {
      externalAPIService.setBrowserUseApiKey(browserUseKey);
    }
    
    // Additional keys can be saved here
    
    toast({
      title: "API ключи сохранены",
      description: "Ваши API ключи успешно обновлены.",
      variant: "default",
    });
    
    onSave();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Интеграции</CardTitle>
        <CardDescription>Управление API ключами для генерации контента и операций ботов</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="openrouter" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Основные API</TabsTrigger>
            <TabsTrigger value="openrouter">OpenRouter</TabsTrigger>
            <TabsTrigger value="browseruse">Browser Use</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai">OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="openai" 
                    type={isOpenAiKeyVisible ? "text" : "password"} 
                    value={openAiKey} 
                    onChange={(e) => setOpenAiKey(e.target.value)}
                    placeholder="sk-..."
                    className="font-mono"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsOpenAiKeyVisible(!isOpenAiKeyVisible)}
                  >
                    {isOpenAiKeyVisible ? "Скрыть" : "Показать"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="midjourney">Midjourney API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="midjourney" 
                    type="password" 
                    value={midjourneyKey}
                    onChange={(e) => setMidjourneyKey(e.target.value)}
                    placeholder="Введите API ключ Midjourney"
                    className="font-mono" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="suno">Suno API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="suno" 
                    type="password" 
                    value={sunoKey}
                    onChange={(e) => setSunoKey(e.target.value)}
                    placeholder="Введите API ключ Suno"
                    className="font-mono" 
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="openrouter">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openrouter">OpenRouter API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="openrouter" 
                    type={isOpenRouterKeyVisible ? "text" : "password"} 
                    value={openRouterKey} 
                    onChange={(e) => setOpenRouterKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="font-mono"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsOpenRouterKeyVisible(!isOpenRouterKeyVisible)}
                  >
                    {isOpenRouterKeyVisible ? "Скрыть" : "Показать"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  OpenRouter предоставляет экономичный доступ к множеству AI моделей.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="browseruse">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="browseruse">Browser Use API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="browseruse" 
                    type={isBrowserUseKeyVisible ? "text" : "password"} 
                    value={browserUseKey} 
                    onChange={(e) => setBrowserUseKey(e.target.value)}
                    placeholder="brw-use-..."
                    className="font-mono"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsBrowserUseKeyVisible(!isBrowserUseKeyVisible)}
                  >
                    {isBrowserUseKeyVisible ? "Скрыть" : "Показать"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Browser Use API обеспечивает автоматизацию браузера, включая регистрацию аккаунтов и взаимодействие.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="rotate-keys">Автоматическая ротация API ключей</Label>
            <div className="text-sm text-muted-foreground">Автоматически менять ключи для предотвращения ограничений скорости</div>
          </div>
          <Switch 
            id="rotate-keys" 
            checked={autoRotateKeys}
            onCheckedChange={setAutoRotateKeys}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 flex justify-end pt-4">
        <Button onClick={handleSave}>Сохранить API ключи</Button>
      </CardFooter>
    </Card>
  );
};
