import { useState } from "react";
import { Bot, Play, Pause, Settings, RefreshCw } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { BotDetails } from "./BotDetails";
import { BotStatus, BotType, BotHealthStatus, BotConfig, BotSchedule, BotProxy } from "@/services/types/bot";
import { proxyService } from "@/services/proxy";
import { Progress } from "@/components/ui/progress";

interface BotCardProps {
  id: string;
  name: string;
  description: string;
  status: BotStatus;
  type: BotType;
  platform: string;
  lastRun?: string;
  config: BotConfig;
  schedule: BotSchedule;
  proxy: BotProxy;
  logs: Array<{time: string, message: string}>;
  healthPercentage: number;
  consumption: {
    cpu: number;
    memory: number;
    network: number;
    quota: number;
  };
  onClick?: () => void;
  onStart?: () => void;
  onStop?: () => void;
}

export function BotCard({ 
  id, 
  name, 
  description, 
  status, 
  type, 
  platform, 
  lastRun, 
  consumption,
  healthPercentage,
  onClick, 
  onStart, 
  onStop 
}: BotCardProps) {
  const [isActive, setIsActive] = useState(status === "running" || status === "active");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isRotatingIp, setIsRotatingIp] = useState(false);
  const { toast } = useToast();

  const handleToggle = () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    
    // Вызываем соответствующие обработчики, если они предоставлены
    if (newStatus && onStart) {
      onStart();
    } else if (!newStatus && onStop) {
      onStop();
    }
    
    toast({
      title: `Бот ${newStatus ? "активирован" : "деактивирован"}`,
      description: `${name} ${newStatus ? "запущен" : "остановлен"}.`,
    });
  };

  const handleRotateIp = async () => {
    setIsRotatingIp(true);
    
    try {
      const newIp = await proxyService.rotateIp(id);
      
      if (newIp) {
        toast({
          title: "IP обновлен",
          description: `Новый IP назначен: ${newIp.split(':')[0]}...`,
        });
      } else {
        toast({
          title: "Ошибка ротации IP",
          description: "Не удалось найти подходящий прокси",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка ротации IP",
        description: error instanceof Error ? error.message : "Произошла неизвестная ошибка",
        variant: "destructive",
      });
    } finally {
      setIsRotatingIp(false);
    }
  };

  const getBotTypeIcon = () => {
    switch (type) {
      case "content":
        return <Bot className="h-4 w-4 text-primary" />;
      case "interaction":
        return <Bot className="h-4 w-4 text-secondary" />;
      case "view":
        return <Bot className="h-4 w-4 text-accent" />;
      case "parser":
        return <Bot className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const getBotTypeName = () => {
    switch (type) {
      case "content":
        return "Контент";
      case "interaction":
        return "Взаимодействие";
      case "view":
        return "Просмотр";
      case "parser":
        return "Парсер";
      default:
        return "Неизвестно";
    }
  };

  const getBotTypeBadge = () => {
    switch (type) {
      case "content":
        return <Badge variant="default">Генератор контента</Badge>;
      case "interaction":
        return <Badge variant="secondary">Симулятор взаимодействия</Badge>;
      case "view":
        return <Badge variant="outline" className="bg-accent/20 text-accent border-accent/20">Просмотр</Badge>;
      case "parser":
        return <Badge variant="outline">Парсер</Badge>;
      default:
        return <Badge>Неизвестно</Badge>;
    }
  };

  const getStatusText = () => {
    if (isActive) return "Активен";
    if (status === "paused") return "Приостановлен";
    return "Неактивен";
  };

  const getStatusColor = () => {
    if (isActive) return "text-green-500";
    if (status === "paused") return "text-amber-500";
    return "text-slate-500";
  };

  const getHealthColor = () => {
    if (healthPercentage >= 90) return "text-green-500";
    if (healthPercentage >= 70) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <>
      <Card className={isActive ? "border-primary/50" : ""}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {getBotTypeIcon()}
              <CardTitle className="text-base">{name}</CardTitle>
            </div>
            <div className={`px-2 py-0.5 rounded text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          <div className="flex items-center gap-2 mb-3">
            {getBotTypeBadge()}
            <Badge variant="outline" className="capitalize">{platform}</Badge>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Использование ресурсов</span>
                <span className={consumption.cpu > 80 ? "text-red-500" : "text-muted-foreground"}>
                  {consumption.cpu}% CPU
                </span>
              </div>
              <Progress value={consumption.cpu} className="h-1.5" />
            </div>
            
            <div className="flex justify-between text-xs">
              <span>Квота: {consumption.quota}%</span>
              <span className={getHealthColor()}>
                {healthPercentage >= 90 ? "Здоров" : 
                 healthPercentage >= 70 ? "Внимание" : "Критично"}
              </span>
            </div>
            
            {lastRun && (
              <div className="text-xs text-muted-foreground mt-1">
                Последняя активность: {lastRun}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 flex justify-between pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setDetailsOpen(true)}
            >
              <Settings className="h-3 w-3 mr-1" />
              Настройки
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleRotateIp}
              disabled={isRotatingIp}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRotatingIp ? 'animate-spin' : ''}`} />
              Сменить IP
            </Button>
          </div>
          <Button
            variant={isActive ? "outline" : "default"}
            size="sm"
            onClick={handleToggle}
          >
            {isActive ? (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Пауза
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1" />
                Запуск
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <BotDetails
        id={id}
        name={name}
        description={description}
        status={status}
        type={type}
        lastRun={lastRun}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onStart={onStart}
        onStop={onStop}
      />
    </>
  );
}
