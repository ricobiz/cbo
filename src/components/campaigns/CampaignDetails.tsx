
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Rocket, Users, Zap, BarChart, LineChart, Target, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getPlatformById } from "@/constants/platforms";

interface CampaignDetailsProps {
  id: string;
  name: string;
  description: string;
  platform: string;
  platformName?: string;
  progress: number;
  status: "active" | "paused" | "completed" | "scheduled" | string;
  startDate: string;
  endDate: string;
  isDemo?: boolean;
  target: {
    type: string;
    value: number | string;
  };
  stats?: {
    views?: number;
    engagements?: number;
    clicks?: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignDetails({
  id,
  name,
  description,
  platform,
  platformName,
  progress,
  status,
  startDate,
  endDate,
  isDemo,
  target,
  stats,
  open,
  onOpenChange
}: CampaignDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const platformData = getPlatformById(platform);
  const PlatformIcon = platformData?.icon;
  
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Активна</Badge>;
      case "paused":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Приостановлена</Badge>;
      case "completed":
        return <Badge variant="secondary">Завершена</Badge>;
      case "scheduled":
        return <Badge variant="outline">Запланирована</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressColor = () => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 70) return "bg-emerald-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 30) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" /> {name}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {PlatformIcon && <PlatformIcon className="h-3.5 w-3.5" />}
              <span>{platformName || platform}</span>
            </Badge>
            {getStatusBadge()}
            {isDemo && (
              <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                Демо
              </Badge>
            )}
          </div>
        </DialogHeader>
        
        {isDemo && (
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Это демонстрационная кампания, предназначенная только для ознакомления с интерфейсом.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="performance">Эффективность</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Прогресс кампании</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className={`h-2 ${getProgressColor()}`} />
            </div>
            
            <div className="rounded-md border p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Дата начала
                </div>
                <div className="text-sm">{startDate}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Дата окончания
                </div>
                <div className="text-sm">{endDate}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Target className="h-4 w-4 text-primary" />
                  Цель кампании
                </div>
                <div className="text-sm">{target.value} {target.type}</div>
              </div>
            </div>
            
            {stats && (
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-3">Статистика кампании</h3>
                <div className="grid grid-cols-3 gap-4">
                  {stats.views !== undefined && (
                    <div className="bg-muted/30 p-3 rounded-md text-center">
                      <div className="text-sm text-muted-foreground">Просмотры</div>
                      <div className="text-lg font-semibold">{stats.views.toLocaleString()}</div>
                    </div>
                  )}
                  {stats.engagements !== undefined && (
                    <div className="bg-muted/30 p-3 rounded-md text-center">
                      <div className="text-sm text-muted-foreground">Взаимодействия</div>
                      <div className="text-lg font-semibold">{stats.engagements.toLocaleString()}</div>
                    </div>
                  )}
                  {stats.clicks !== undefined && (
                    <div className="bg-muted/30 p-3 rounded-md text-center">
                      <div className="text-sm text-muted-foreground">Клики</div>
                      <div className="text-lg font-semibold">{stats.clicks.toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Метрики эффективности</h3>
              <div className="h-[200px] border rounded-md p-4 flex items-center justify-center">
                <div className="text-muted-foreground text-center">
                  <LineChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Детальные графики эффективности будут доступны здесь</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Анализ взаимодействий</h3>
              <div className="h-[200px] border rounded-md p-4 flex items-center justify-center">
                <div className="text-muted-foreground text-center">
                  <BarChart className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Аналитика взаимодействий будет доступна здесь</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="rounded-md border p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">ID кампании</div>
                <div className="text-sm font-mono">{id}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Настройки платформы</div>
                <div className="text-sm">Интеграция: {platformName || platform}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Стратегия контента</div>
                <div className="text-sm">Сбалансированное взаимодействие</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">Распределение бюджета</div>
                <div className="text-sm">Авто-оптимизация</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium">ИИ ассистент</div>
                <div className="text-sm">Включен (Контент и Таргетинг)</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" /> Аудитория
          </Button>
          
          {status === "active" ? (
            <Button variant="outline">
              <Zap className="mr-2 h-4 w-4" /> Приостановить
            </Button>
          ) : status === "paused" ? (
            <Button>
              <Rocket className="mr-2 h-4 w-4" /> Возобновить
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
