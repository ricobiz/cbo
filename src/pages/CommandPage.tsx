
import { useEffect, useState } from "react";
import { CommandCenter } from "@/components/command/CommandCenter";
import { CommandExamples } from "@/components/command/CommandExamples";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Globe, Command, MessageSquare } from "lucide-react";

const CommandPage = () => {
  useEffect(() => {
    document.title = "AI Command Center";
  }, []);
  
  const [activeTab, setActiveTab] = useState("command");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Bot className="h-7 w-7" /> AI Command Center
      </h1>
      
      <Tabs defaultValue="command" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-md">Интегрированные системы управления</CardTitle>
              <CardDescription>
                Система поддерживает интеграцию с внешними API для расширенных функций
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4 space-y-1">
                <div className="font-medium flex items-center gap-1">
                  <Globe className="h-4 w-4 text-blue-500" /> 
                  OpenRouter API
                </div>
                <div className="text-sm text-muted-foreground">
                  Для продвинутого анализа команд и генерации контента
                </div>
              </div>
              <div className="border rounded-md p-4 space-y-1">
                <div className="font-medium flex items-center gap-1">
                  <Globe className="h-4 w-4 text-green-500" /> 
                  Browser Use API
                </div>
                <div className="text-sm text-muted-foreground">
                  Для эмуляции браузера и выполнения сложных автоматизаций
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Настройка интеграций</CardTitle>
              <CardDescription>
                Подключите внешние API для расширенной функциональности
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">OpenRouter API</h3>
                  <p className="text-sm text-muted-foreground">
                    Подключите API ключ OpenRouter для использования мощных языковых моделей и улучшенных возможностей генерации текста.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Browser Use API</h3>
                  <p className="text-sm text-muted-foreground">
                    Интегрируйте Browser Use API для автоматизации взаимодействия с веб-сайтами, включая регистрацию аккаунтов, заполнение форм и многое другое.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommandPage;
