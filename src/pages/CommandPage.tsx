
import { useEffect } from "react";
import { CommandCenter } from "@/components/command/CommandCenter";
import { CommandExamples } from "@/components/command/CommandExamples";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Globe } from "lucide-react";

const CommandPage = () => {
  useEffect(() => {
    document.title = "AI Command Center";
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Bot className="h-7 w-7" /> AI Command Center
      </h1>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <CommandCenter />
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <CommandExamples />
        </div>
      </div>
    </div>
  );
};

export default CommandPage;
