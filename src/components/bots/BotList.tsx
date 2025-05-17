import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot as BotIcon, AlertCircle, PlayCircle, PauseCircle, Heart, MessageSquare, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Bot, BotHealthStatus, BotStatus, BotType } from "@/services/types/bot";
import { BotManagementService } from "@/services/BotManagementService";
import { useToast } from "@/components/ui/use-toast";

interface BotCardProps {
  bot: Bot;
  onSelect: (bot: Bot) => void;
  onAction: (bot: Bot, action: 'start' | 'stop' | 'pause') => void;
}

// Helper functions
const getBotTypeIcon = (type: BotType) => {
  switch (type) {
    case 'content': return <MessageSquare className="h-4 w-4" />;
    case 'interaction': return <Heart className="h-4 w-4" />;
    case 'view': return <Activity className="h-4 w-4" />;
    case 'parser': return <BotIcon className="h-4 w-4" />;
    default: return <BotIcon className="h-4 w-4" />;
  }
};

const getBotTypeName = (type: BotType): string => {
  switch (type) {
    case 'content': return 'Контент';
    case 'interaction': return 'Взаимодействие';
    case 'view': return 'Просмотр';
    case 'parser': return 'Парсер';
    case 'custom': return 'Особый';
    default: return 'Неизвестно';
  }
};

const getBotStatusColor = (status: BotStatus): string => {
  switch (status) {
    case 'running': return 'bg-green-500';
    case 'paused': return 'bg-amber-500';
    case 'idle': return 'bg-slate-400';
    case 'error': return 'bg-red-500';
    case 'setup-required': return 'bg-blue-500';
    default: return 'bg-slate-400';
  }
};

const getBotStatusText = (status: BotStatus): string => {
  switch (status) {
    case 'running': return 'Активен';
    case 'paused': return 'Приостановлен';
    case 'idle': return 'Простаивает';
    case 'error': return 'Ошибка';
    case 'setup-required': return 'Требуется настройка';
    default: return 'Неизвестно';
  }
};

const getBotHealthColor = (health: BotHealthStatus): string => {
  switch (health) {
    case 'healthy': return 'text-green-500';
    case 'warning': return 'text-amber-500';
    case 'critical': return 'text-red-500';
    default: return 'text-slate-400';
  }
};

const getBotHealthIcon = (health: BotHealthStatus) => {
  switch (health) {
    case 'healthy': return <div className="bg-green-500 rounded-full w-2 h-2" />;
    case 'warning': return <div className="bg-amber-500 rounded-full w-2 h-2" />;
    case 'critical': return <div className="bg-red-500 rounded-full w-2 h-2" />;
    default: return <div className="bg-slate-400 rounded-full w-2 h-2" />;
  }
};

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} ч. назад`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} д. назад`;
  
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} мес. назад`;
};

function BotCard({ bot, onSelect, onAction }: BotCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex p-4" onClick={() => onSelect(bot)}>
        <div className="mr-4">
          {bot.avatar ? (
            <img src={bot.avatar} alt={bot.name} className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <BotIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{bot.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {getBotTypeIcon(bot.type)}
                <span>{getBotTypeName(bot.type)}</span>
                <span className="mx-1">•</span>
                <span className="capitalize">{bot.platform}</span>
              </div>
            </div>
            <div className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getBotStatusColor(bot.status)}`}>
              {getBotStatusText(bot.status)}
            </div>
          </div>
          
          {bot.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{bot.description}</p>
          )}
          
          <div className="mt-3 space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Использование ресурсов</span>
                <span className={getBotHealthColor(bot.health)}>{bot.consumption.cpu}% CPU</span>
              </div>
              <Progress value={bot.consumption.cpu} className="h-1" />
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>Квота:</span>
                <span className={bot.consumption.quota > 80 ? 'text-red-500' : 'text-muted-foreground'}>
                  {bot.consumption.quota}%
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                {getBotHealthIcon(bot.health)}
                <span className={getBotHealthColor(bot.health)}>
                  {bot.health === 'healthy' ? 'Здоров' : 
                   bot.health === 'warning' ? 'Внимание' : 
                   bot.health === 'critical' ? 'Критично' : 'Неизвестно'}
                </span>
              </div>
            </div>
            
            {bot.lastActive && (
              <div className="text-xs text-muted-foreground">
                Последняя активность: {formatTimeAgo(bot.lastActive)}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CardFooter className="bg-muted/50 p-2 flex gap-2 justify-end">
        {bot.status === 'running' ? (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={(e) => { 
              e.stopPropagation(); 
              onAction(bot, 'pause'); 
            }}
          >
            <PauseCircle className="h-4 w-4 mr-1" />
            Пауза
          </Button>
        ) : (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={(e) => { 
              e.stopPropagation(); 
              onAction(bot, 'start'); 
            }}
            disabled={bot.status === 'error' || bot.status === 'setup-required'}
          >
            <PlayCircle className="h-4 w-4 mr-1" />
            Запуск
          </Button>
        )}
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={(e) => { 
            e.stopPropagation(); 
            onSelect(bot); 
          }}
        >
          Подробнее
        </Button>
      </CardFooter>
    </Card>
  );
}

export interface BotListProps {
  onSelectBot: (bot: Bot) => void;
  onNewBot: () => void;
}

export function BotList({ onSelectBot, onNewBot }: BotListProps) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'issues'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadBots();
  }, []);

  const loadBots = () => {
    setIsLoading(true);
    try {
      const botData = BotManagementService.getAllBots();
      setBots(botData);
    } catch (error) {
      console.error("Error loading bots:", error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить список ботов.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBotAction = async (bot: Bot, action: 'start' | 'stop' | 'pause') => {
    try {
      let newStatus: BotStatus;
      
      switch (action) {
        case 'start':
          newStatus = 'running';
          break;
        case 'pause':
          newStatus = 'paused';
          break;
        case 'stop':
        default:
          newStatus = 'idle';
          break;
      }
      
      const updatedBot = await BotManagementService.updateBotStatus(bot.id, newStatus);
      
      if (updatedBot) {
        // Update bot in state
        setBots(bots.map(b => b.id === bot.id ? updatedBot : b));
        
        toast({
          title: action === 'start' ? 'Бот запущен' : action === 'pause' ? 'Бот приостановлен' : 'Бот остановлен',
          description: `Статус бота "${bot.name}" успешно обновлен.`
        });
      }
    } catch (error) {
      console.error("Error updating bot status:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус бота.",
        variant: "destructive"
      });
    }
  };

  const getFilteredBots = () => {
    switch (filter) {
      case 'active':
        return bots.filter(bot => bot.status === 'running');
      case 'issues':
        return bots.filter(bot => bot.status === 'error' || bot.health === 'warning' || bot.health === 'critical');
      default:
        return bots;
    }
  };

  const filteredBots = getFilteredBots();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button 
            variant={filter === 'all' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            Все боты
          </Button>
          <Button 
            variant={filter === 'active' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('active')}
          >
            Активные
          </Button>
          <Button 
            variant={filter === 'issues' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('issues')}
          >
            С проблемами
            {bots.filter(bot => bot.status === 'error' || bot.health === 'warning' || bot.health === 'critical').length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {bots.filter(bot => bot.status === 'error' || bot.health === 'warning' || bot.health === 'critical').length}
              </Badge>
            )}
          </Button>
        </div>
        
        <Button onClick={onNewBot}>
          + Создать бота
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="p-4 flex">
                <div className="w-12 h-12 bg-muted rounded-full mr-4"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full mt-4"></div>
                </div>
              </div>
              <div className="bg-muted h-10 mt-2"></div>
            </Card>
          ))}
        </div>
      ) : filteredBots.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <BotIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Нет ботов</h3>
          {filter !== 'all' ? (
            <p className="text-muted-foreground mt-2">
              Нет ботов, соответствующих выбранным критериям.
            </p>
          ) : (
            <p className="text-muted-foreground mt-2">
              Создайте своего первого бота, чтобы начать автоматизацию.
            </p>
          )}
          <Button variant="outline" className="mt-4" onClick={onNewBot}>
            Создать бота
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBots.map(bot => (
            <BotCard
              key={bot.id}
              bot={bot}
              onSelect={onSelectBot}
              onAction={handleBotAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
