
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Bot } from "@/services/types/bot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { BotCard } from "@/components/bots/BotCard";
import { useNavigate } from "react-router-dom";
import { useOnline } from "@/hooks/useOnline";
import { apiService } from "@/services/api/ApiService";

export default function BotsList() {
  const isOnline = useOnline();
  const navigate = useNavigate();
  const isOfflineMode = apiService.isOfflineMode();
  
  const { data: bots = [], isLoading, error } = useQuery({
    queryKey: ['bots'],
    queryFn: async () => {
      if (isOfflineMode) {
        return apiService.get<Bot[]>('/bots');
      } else {
        const response = await api.get('/bots');
        return response.data;
      }
    },
    enabled: isOnline || isOfflineMode
  });

  const handleCreateBot = () => {
    navigate("/bots/create");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление ботами</h1>
        <Button 
          onClick={handleCreateBot} 
          disabled={!isOnline && !isOfflineMode}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Создать бота
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6 h-40 animate-pulse bg-muted" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-8 text-red-500">
          Произошла ошибка при загрузке ботов
        </div>
      ) : bots.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          Нет созданных ботов. Создайте первого бота, чтобы начать.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bots.map((bot) => (
            <BotCard 
              key={bot.id} 
              bot={bot} 
              onClick={() => navigate(`/bots/${bot.id}`)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
