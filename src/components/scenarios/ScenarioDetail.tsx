
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Settings, 
  Sparkles, 
  Layers, 
  ArrowLeft,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Edit,
  Clock,
  ListChecks
} from "lucide-react";
import { toast } from "sonner";
import { Scenario, ScenarioCategory, ScenarioStatus } from "@/services/types/scenario";
import { ScenarioService } from "@/services/ScenarioService";

interface ScenarioDetailProps {
  scenario: Scenario;
  onBack: () => void;
  onEdit: (scenario: Scenario) => void;
}

const getScenarioCategoryIcon = (category: ScenarioCategory) => {
  switch (category) {
    case 'growth': return <TrendingUp className="h-4 w-4" />;
    case 'engagement': return <Users className="h-4 w-4" />;
    case 'monitoring': return <Settings className="h-4 w-4" />;
    case 'content': return <Sparkles className="h-4 w-4" />;
    case 'conversion': return <Layers className="h-4 w-4" />;
    default: return <Settings className="h-4 w-4" />;
  }
};

const getScenarioCategoryText = (category: ScenarioCategory): string => {
  switch (category) {
    case 'growth': return 'Рост';
    case 'engagement': return 'Вовлечение';
    case 'monitoring': return 'Мониторинг';
    case 'content': return 'Контент';
    case 'conversion': return 'Конверсия';
    case 'custom': return 'Особый';
    default: return 'Неизвестно';
  }
};

const getScenarioStatusColor = (status: ScenarioStatus): string => {
  switch (status) {
    case 'running': return 'bg-green-500';
    case 'paused': return 'bg-amber-500';
    case 'completed': return 'bg-blue-500';
    case 'failed': return 'bg-red-500';
    case 'ready': return 'bg-purple-500';
    default: return 'bg-slate-400';
  }
};

const getScenarioStatusText = (status: ScenarioStatus): string => {
  switch (status) {
    case 'running': return 'Запущен';
    case 'paused': return 'Приостановлен';
    case 'completed': return 'Завершен';
    case 'failed': return 'Ошибка';
    case 'ready': return 'Готов';
    case 'draft': return 'Черновик';
    default: return 'Неизвестно';
  }
};

export function ScenarioDetail({ scenario, onBack, onEdit }: ScenarioDetailProps) {
  const [activeScenario, setActiveScenario] = useState<Scenario>(scenario);
  
  // Calculate scenario progress
  const calculateProgress = (): number => {
    if (!activeScenario.steps || activeScenario.steps.length === 0) return 0;
    
    const completedSteps = activeScenario.steps.filter(step => step.status === 'completed').length;
    return Math.floor((completedSteps / activeScenario.steps.length) * 100);
  };
  
  // Handle scenario actions
  const handleScenarioAction = (action: 'start' | 'pause' | 'stop') => {
    try {
      let newStatus: ScenarioStatus;
      
      switch (action) {
        case 'start':
          newStatus = 'running';
          break;
        case 'pause':
          newStatus = 'paused';
          break;
        case 'stop':
        default:
          newStatus = 'completed';
          break;
      }
      
      const updatedScenario = ScenarioService.updateScenarioStatus(activeScenario.id, newStatus);
      
      if (updatedScenario) {
        setActiveScenario(updatedScenario);
        
        toast.success(
          action === 'start' ? 'Сценарий запущен' : 
          action === 'pause' ? 'Сценарий приостановлен' : 
          'Сценарий остановлен', 
          { description: `Статус сценария "${activeScenario.name}" успешно обновлен.` }
        );
      }
    } catch (error) {
      console.error("Error updating scenario status:", error);
      toast.error("Ошибка", { description: "Не удалось изменить статус сценария." });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Назад к списку
        </Button>
        
        <div className="flex items-center gap-2">
          {activeScenario.status === 'running' && (
            <Button 
              variant="outline"
              onClick={() => handleScenarioAction('pause')}
            >
              <PauseCircle className="h-4 w-4 mr-2" />
              Приостановить
            </Button>
          )}
          
          {(activeScenario.status === 'draft' || activeScenario.status === 'ready' || activeScenario.status === 'paused') && (
            <Button 
              onClick={() => handleScenarioAction('start')}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Запустить
            </Button>
          )}
          
          {activeScenario.status === 'running' && (
            <Button 
              variant="destructive"
              onClick={() => handleScenarioAction('stop')}
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Остановить
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={() => onEdit(activeScenario)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1.5">
                  {getScenarioCategoryIcon(activeScenario.category)}
                  <span className="text-sm font-medium">{getScenarioCategoryText(activeScenario.category)}</span>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getScenarioStatusColor(activeScenario.status)}`}>
                  {getScenarioStatusText(activeScenario.status)}
                </div>
              </div>
              <CardTitle className="text-2xl mt-2">{activeScenario.name}</CardTitle>
              {activeScenario.description && (
                <p className="text-muted-foreground mt-1">
                  {activeScenario.description}
                </p>
              )}
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Прогресс</span>
                  <span>{calculateProgress()}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2">
                {activeScenario.platforms.map((platform, index) => (
                  <Badge key={index} variant="outline" className="capitalize">
                    {platform}
                  </Badge>
                ))}
                
                {activeScenario.tags.map((tag, index) => (
                  <Badge key={`tag-${index}`} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Создан: {new Date(activeScenario.createdAt).toLocaleDateString()}</span>
                </div>
                
                {activeScenario.lastRun && (
                  <div className="flex items-center gap-1">
                    <PlayCircle className="h-4 w-4" />
                    <span>Последний запуск: {new Date(activeScenario.lastRun).toLocaleDateString()}</span>
                  </div>
                )}
                
                {activeScenario.nextRun && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Следующий запуск: {new Date(activeScenario.nextRun).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="steps">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="steps">Шаги</TabsTrigger>
              <TabsTrigger value="variables">Переменные</TabsTrigger>
              <TabsTrigger value="triggers">Триггеры</TabsTrigger>
            </TabsList>
            
            <TabsContent value="steps" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ListChecks className="h-5 w-5" />
                    Шаги сценария
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeScenario.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 border rounded-md p-3">
                        <div className={`rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5
                          ${step.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            step.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                            step.status === 'failed' ? 'bg-red-100 text-red-800' : 
                            'bg-muted'}`
                        }>
                          <span className="text-xs font-medium">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium flex items-center justify-between">
                            <span>{step.name}</span>
                            <Badge variant={
                              step.status === 'completed' ? 'success' : 
                              step.status === 'in-progress' ? 'default' : 
                              step.status === 'failed' ? 'destructive' : 
                              'outline'
                            }>
                              {step.status === 'pending' ? 'Ожидание' : 
                               step.status === 'in-progress' ? 'В процессе' : 
                               step.status === 'completed' ? 'Завершен' : 
                               step.status === 'failed' ? 'Ошибка' : 
                               step.status === 'skipped' ? 'Пропущен' : 'Неизвестно'}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {step.type === 'content-generation' ? 'Генерация контента' :
                             step.type === 'bot-action' ? 'Действие бота' :
                             step.type === 'wait' ? 'Ожидание' :
                             step.type === 'condition' ? 'Условие' :
                             step.type === 'campaign' ? 'Кампания' :
                             step.type === 'notification' ? 'Уведомление' : step.type}
                          </div>
                          
                          {step.dependsOn && step.dependsOn.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-2">
                              <span>Зависит от шагов: </span>
                              <span>{step.dependsOn.join(', ')}</span>
                            </div>
                          )}
                          
                          {step.results && Object.keys(step.results).length > 0 && (
                            <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                              <div className="font-medium mb-1">Результаты:</div>
                              <pre className="whitespace-pre-wrap overflow-x-auto">
                                {JSON.stringify(step.results, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="variables" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Переменные сценария</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeScenario.variables.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      Нет определенных переменных
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeScenario.variables.map((variable, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="font-medium">{variable.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Тип: {variable.type}
                          </div>
                          {variable.description && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {variable.description}
                            </div>
                          )}
                          <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                            <pre className="whitespace-pre-wrap overflow-x-auto">
                              {JSON.stringify(variable.value, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="triggers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Триггеры запуска</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeScenario.triggers.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      Нет определенных триггеров
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeScenario.triggers.map((trigger, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="flex items-center justify-between">
                            <div className="font-medium capitalize">
                              {trigger.type === 'scheduled' ? 'По расписанию' :
                               trigger.type === 'manual' ? 'Ручной запуск' :
                               trigger.type === 'event' ? 'По событию' :
                               trigger.type === 'webhook' ? 'Webhook' : trigger.type}
                            </div>
                            <Badge variant={trigger.active ? 'default' : 'outline'}>
                              {trigger.active ? 'Активен' : 'Неактивен'}
                            </Badge>
                          </div>
                          
                          {Object.keys(trigger.config).length > 0 && (
                            <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                              <div className="font-medium mb-1">Конфигурация:</div>
                              <pre className="whitespace-pre-wrap overflow-x-auto">
                                {JSON.stringify(trigger.config, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={() => handleScenarioAction('start')} disabled={activeScenario.status === 'running'}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Запустить
              </Button>
              <Button className="w-full" variant="outline" onClick={() => handleScenarioAction('pause')} disabled={activeScenario.status !== 'running'}>
                <PauseCircle className="h-4 w-4 mr-2" />
                Приостановить
              </Button>
              <Button className="w-full" variant="outline" onClick={() => onEdit(activeScenario)}>
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
              <Button className="w-full" variant="destructive" onClick={() => handleScenarioAction('stop')} disabled={activeScenario.status !== 'running'}>
                <StopCircle className="h-4 w-4 mr-2" />
                Остановить
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium">Платформы:</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeScenario.platforms.map((platform, index) => (
                    <Badge key={index} variant="outline" className="capitalize">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {activeScenario.tags.length > 0 && (
                <div>
                  <div className="text-sm font-medium">Теги:</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeScenario.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <div className="text-sm font-medium">Создан:</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(activeScenario.createdAt).toLocaleString()}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium">Обновлен:</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(activeScenario.updatedAt).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
