
import { useEffect, useState } from "react";
import { CommandCenter } from "@/components/command/CommandCenter";
import { CommandExamples } from "@/components/command/CommandExamples";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Globe, Command, MessageSquare } from "lucide-react";
import { ApiSettings } from "@/components/settings/ApiSettings";
import { useToast } from "@/components/ui/use-toast";
import { externalAPIService } from "@/services/ExternalAPIService";
import { useNavigate } from "react-router-dom";

const CommandPage = () => {
  useEffect(() => {
    document.title = "AI Command Center";
  }, []);
  
  const [activeTab, setActiveTab] = useState("command");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleApiSettingsSave = () => {
    toast({
      title: "API настройки сохранены",
      description: "Ваши API ключи успешно сохранены и настроены",
      variant: "default",
    });
    
    // Вернуться на вкладку команд
    setActiveTab("command");
  };

  // Проверка наличия API ключей при загрузке страницы
  useEffect(() => {
    const hasOpenRouter = externalAPIService.hasOpenRouterApiKey();
    const hasBrowserUse = externalAPIService.hasBrowserUseApiKey();
    
    if (!hasOpenRouter || !hasBrowserUse) {
      // Если ключи не настроены, показываем уведомление
      toast({
        title: "Настройка API ключей",
        description: "Для полной функциональности рекомендуется настроить API ключи",
        action: (
          <button 
            className="bg-primary text-primary-foreground px-3 py-1 rounded text-xs"
            onClick={() => setActiveTab("integration")}
          >
            Настроить
          </button>
        ),
        duration: 5000
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Bot className="h-7 w-7" /> AI Command Center
      </h1>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="command" className="flex items-center gap-2">
            <Command className="h-4 w-4" /> AI Command
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> API Интеграции
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="command" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <CommandCenter />
            </div>
            
            <div className="md:col-span-1 space-y-6">
              <CommandExamples />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="integration">
          <ApiSettings onSave={handleApiSettingsSave} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommandPage;
