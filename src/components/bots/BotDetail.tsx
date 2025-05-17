import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, BotAction, BotActivity } from "@/services/types/bot";
import { BotManagementService } from "@/services/BotManagementService";
import { ArrowLeft, Calendar, CheckCircle, Clock, Edit, Trash, AlertTriangle, PlayCircle, PauseCircle, StopCircle, Settings, Info, Activity } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BotDetailProps {
  bot: Bot;
  onBack: () => void;
  onEdit: (bot: Bot) => void;
  onDelete: (botId: string) => void;
}

export function BotDetail({ bot: initialBot, onBack, onEdit, onDelete }: BotDetailProps) {
  const [bot, setBot] = useState<Bot>(initialBot);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Format date helper
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format time helper
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
    return `${diffDays} д. назад`;
  };

  // Get status label
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'running': return 'Активен';
      case 'paused': return 'Приостановлен';
      case 'idle': return 'Простаивает';
      case 'error': return 'Ошибка';
      case 'setup-required': return 'Требуется настройка';
      default: return status;
    }
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'paused': return 'bg-amber-500';
      case 'idle': return 'bg-slate-400';
      case 'error': return 'bg-red-500';
      case 'setup-required': return 'bg-blue-500';
      default: return 'bg-slate-400';
    }
  };

  // Bot status management
  const updateBotStatus = async (status: 'running' | 'paused' | 'idle') => {
    try {
      const updatedBot = await BotManagementService.updateBotStatus(bot.id, status);
      if (updatedBot) {
        setBot(updatedBot);
        toast({
          title: "Статус изменен",
          description: `Бот "${bot.name}" теперь ${getStatusLabel(status).toLowerCase()}.`
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

  // Get activity icon
  const getActivityIcon = (activity: BotActivity) => {
    switch (activity.type) {
      case 'start':
        return <PlayCircle className="h-4 w-4 text-green-500" />;
      case 'stop':
        return <StopCircle className="h-4 w-4 text-slate-500" />;
      case 'action':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'config':
        return <Settings className="h-4 w-4 text-violet-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get action status badge
  const getActionStatusBadge = (action: BotAction) => {
    switch (action.status) {
      case 'completed':
        return <Badge className="bg-green-500">Выполнено</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">В процессе</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Запланировано</Badge>;
      case 'failed':
        return <Badge variant="destructive">Ошибка</Badge>;
      default:
        return <Badge variant="outline">{action.status}</Badge>;
    }
  };

  // Get scheduled time display
  const formatSchedule = (times: { start: string; end: string; days: number[] }[]) => {
    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    return times.map((time, index) => (
      <div key={index} className="flex items-center gap-2 text-xs">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{time.start} - {time.end}</span>
        <span className="text-muted-foreground">
          {time.days.map(day => dayNames[day]).join(', ')}
        </span>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Назад ко всем ботам
        </Button>
        
        <div className="flex items-center gap-2">
          {bot.status === 'running' && (
            <Button variant="outline" onClick={() => updateBotStatus('paused')}>
              <PauseCircle className="h-4 w-4 mr-2" />
              Приостановить
            </Button>
          )}
          {(bot.status === 'paused' || bot.status === 'idle') && (
            <Button variant="outline" onClick={() => updateBotStatus('running')}>
              <PlayCircle className="h-4 w-4 mr-2" />
              Запустить
            </Button>
          )}
          {bot.status === 'running' && (
            <Button variant="outline" onClick={() => updateBotStatus('idle')}>
              <StopCircle className="h-4 w-4 mr-2" />
              Остановить
            </Button>
          )}
          <Button variant="outline" onClick={() => onEdit(bot)}>
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Удалить
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {bot.avatar ? (
                <img src={bot.avatar} alt={bot.name} className="w-14 h-14 rounded-full" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                  <Settings className="h-7 w-7 text-muted-foreground" />
                </div>
              )}
              <div>
                <CardTitle className="text-2xl">{bot.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span className="capitalize">{bot.type}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="capitalize">{bot.platform}</span>
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(bot.status)} text-white`}>
              {getStatusLabel(bot.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Rest of the detail content */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Создан: {formatDate(bot.createdAt)}</span>
            </div>
            {bot.lastActive && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Активность: {formatTimeAgo(bot.lastActive)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="activity">Активность</TabsTrigger>
          <TabsTrigger value="actions">Действия</TabsTrigger>
          <TabsTrigger value="config">Настройки</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Статус бота</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Status information */}
                <Progress value={bot.consumption.cpu} className="mb-4" />
                <div>Status: {getStatusLabel(bot.status)}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Журнал активности</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {bot.activity.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Нет записей активности</p>
                    </div>
                  ) : (
                    bot.activity.map(activity => (
                      <div key={activity.id} className="flex items-start gap-3 pb-4 border-b">
                        <div>{getActivityIcon(activity)}</div>
                        <div>
                          <p>{activity.description}</p>
                          <time className="text-sm text-muted-foreground">
                            {formatTimeAgo(activity.timestamp)}
                          </time>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Действия бота</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {bot.actions.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Нет запланированных действий</p>
                    </div>
                  ) : (
                    bot.actions.map(action => (
                      <div key={action.id} className="flex items-start gap-3 pb-4 border-b">
                        <div>
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <p>{action.type} - {action.target}</p>
                            {getActionStatusBadge(action)}
                          </div>
                          <time className="text-sm text-muted-foreground">
                            {action.startedAt ? `Начало: ${formatDate(action.startedAt)}` : 'Ожидание'}
                            {action.completedAt ? `, Завершено: ${formatDate(action.completedAt)}` : ''}
                          </time>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Конфигурация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Основные настройки</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs">Максимум действий:</p>
                    <p className="font-medium">{bot.config.maxActions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Прокси:</p>
                    <p className="font-medium">
                      {bot.config.proxy ? `${bot.config.proxy.type} (${bot.config.proxy.url})` : 'Нет'}
                    </p>
                  </div>
                </div>
              </div>
              
              {bot.config.targetUrls && bot.config.targetUrls.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Целевые URL</h4>
                  <ul className="list-disc pl-5">
                    {bot.config.targetUrls.map((url, index) => (
                      <li key={index} className="text-sm">{url}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {bot.config.templates && Object.keys(bot.config.templates).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Шаблоны</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(bot.config.templates).map(([name, value]) => (
                      <div key={name} className="space-y-1">
                        <p className="text-muted-foreground text-xs">{name}:</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {bot.config.schedule && bot.config.schedule.active && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Расписание</h4>
                  {formatSchedule(bot.config.schedule.times || [])}
                </div>
              )}
              
              {bot.config.advancedSettings && Object.keys(bot.config.advancedSettings).length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Расширенные настройки</h4>
                  <pre className="bg-muted/80 rounded-md p-2 text-xs overflow-x-auto">
                    {JSON.stringify(bot.config.advancedSettings, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Бот "{bot.name}" будет удален со всеми связанными данными.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete(bot.id);
                setIsDeleteDialogOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
