
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiConnectionSettings } from "@/components/settings/ApiConnectionSettings";
import { ApiServerSettings } from "@/components/settings/ApiServerSettings";
import { OpenRouterSettings } from "@/components/settings/OpenRouterSettings";
import { Card } from "@/components/ui/card";

export function ApiSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Настройки API</h3>
        <p className="text-sm text-muted-foreground">
          Управление подключением к API и настройка параметров
        </p>
      </div>
      
      <Tabs defaultValue="connection" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connection">Подключение</TabsTrigger>
          <TabsTrigger value="server">Сервер</TabsTrigger>
          <TabsTrigger value="openrouter">OpenRouter</TabsTrigger>
          <TabsTrigger value="advanced">Дополнительно</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connection" className="space-y-4">
          <ApiConnectionSettings />
        </TabsContent>
        
        <TabsContent value="server" className="space-y-4">
          <ApiServerSettings />
        </TabsContent>
        
        <TabsContent value="openrouter" className="space-y-4">
          <OpenRouterSettings />
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              Расширенные настройки API будут добавлены в следующих обновлениях.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
