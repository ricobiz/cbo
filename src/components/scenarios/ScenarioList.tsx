
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, PlayCircle, PauseCircle, Settings, TrendingUp, Users, ArrowRight, Sparkles, Layers } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Scenario, ScenarioCategory, ScenarioStatus } from "@/services/types/scenario";
import { ScenarioService } from "@/services/ScenarioService";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScenarioListProps {
  onSelectScenario: (scenario: Scenario) => void;
  onNewScenario: () => void;
  onCreateFromTemplate: () => void;
}

// Helper functions
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

export function ScenarioList({ onSelectScenario, onNewScenario, onCreateFromTemplate }: ScenarioListProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ScenarioStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ScenarioCategory | "all">("all");
  const { toast } = useToast();

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = () => {
    setIsLoading(true);
    try {
      const scenarioData = ScenarioService.getAllScenarios();
      setScenarios(scenarioData);
    } catch (error) {
      console.error("Error loading scenarios:", error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить список сценариев.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle scenario status update
  const handleScenarioAction = (scenario: Scenario, action: 'start' | 'pause' | 'stop') => {
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
      
      const updatedScenario = ScenarioService.updateScenarioStatus(scenario.id, newStatus);
      
      if (updatedScenario) {
        // Update scenario in state
        setScenarios(scenarios.map(s => s.id === scenario.id ? updatedScenario : s));
        
        toast({
          title: action === 'start' ? 'Сценарий запущен' : action === 'pause' ? 'Сценарий приостановлен' : 'Сценарий остановлен',
          description: `Статус сценария "${scenario.name}" успешно обновлен.`
        });
      }
    } catch (error) {
      console.error("Error updating scenario status:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус сценария.",
        variant: "destructive"
      });
    }
  };

  // Calculate scenario progress
  const calculateProgress = (scenario: Scenario): number => {
    if (!scenario.steps || scenario.steps.length === 0) return 0;
    
    const completedSteps = scenario.steps.filter(step => step.status === 'completed').length;
    return Math.floor((completedSteps / scenario.steps.length) * 100);
  };

  // Filter scenarios
  const getFilteredScenarios = () => {
    return scenarios.filter(scenario => {
      // Apply status filter
      if (statusFilter !== 'all' && scenario.status !== statusFilter) {
        return false;
      }
      
      // Apply category filter
      if (categoryFilter !== 'all' && scenario.category !== categoryFilter) {
        return false;
      }
      
      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          scenario.name.toLowerCase().includes(searchLower) ||
          (scenario.description && scenario.description.toLowerCase().includes(searchLower)) ||
          scenario.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  };

  const filteredScenarios = getFilteredScenarios();

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск сценариев..."
              className="w-full pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as ScenarioStatus | "all")}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                <SelectItem value="draft">Черновики</SelectItem>
                <SelectItem value="ready">Готовы</SelectItem>
                <SelectItem value="running">Запущены</SelectItem>
                <SelectItem value="paused">Приостановлены</SelectItem>
                <SelectItem value="completed">Завершены</SelectItem>
                <SelectItem value="failed">С ошибками</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={categoryFilter}
              onValueChange={(value) => setCategoryFilter(value as ScenarioCategory | "all")}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="growth">Рост</SelectItem>
                <SelectItem value="engagement">Вовлечение</SelectItem>
                <SelectItem value="monitoring">Мониторинг</SelectItem>
                <SelectItem value="content">Контент</SelectItem>
                <SelectItem value="conversion">Конверсия</SelectItem>
                <SelectItem value="custom">Особые</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCreateFromTemplate}>
            <Sparkles className="h-4 w-4 mr-2" />
            Из шаблона
          </Button>
          <Button onClick={onNewScenario}>
            + Новый сценарий
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-muted h-24" />
              <CardContent className="space-y-2 p-4">
                <div className="h-5 bg-muted rounded-md w-3/4" />
                <div className="h-4 bg-muted rounded-md w-1/2" />
                <div className="h-16 bg-muted rounded-md w-full mt-4" />
              </CardContent>
              <CardFooter className="bg-muted h-12" />
            </Card>
          ))}
        </div>
      ) : filteredScenarios.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Layers className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Нет сценариев</h3>
          {search || statusFilter !== 'all' || categoryFilter !== 'all' ? (
            <p className="text-muted-foreground mt-2">
              Нет сценариев, соответствующих выбранным фильтрам.
            </p>
          ) : (
            <p className="text-muted-foreground mt-2">
              Создайте свой первый сценарий для автоматизации процессов.
            </p>
          )}
          <div className="flex gap-2 justify-center mt-4">
            <Button variant="outline" onClick={onCreateFromTemplate}>
              <Sparkles className="h-4 w-4 mr-2" />
              Создать из шаблона
            </Button>
            <Button onClick={onNewScenario}>
              Создать сценарий вручную
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
          {filteredScenarios.map(scenario => {
            const progress = calculateProgress(scenario);
            
            return (
              <Card 
                key={scenario.id} 
                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onSelectScenario(scenario)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5">
                      {getScenarioCategoryIcon(scenario.category)}
                      <span className="text-sm font-medium">{getScenarioCategoryText(scenario.category)}</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getScenarioStatusColor(scenario.status)}`}>
                      {getScenarioStatusText(scenario.status)}
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-2">{scenario.name}</CardTitle>
                  {scenario.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {scenario.description}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="pb-2">
                  <div className="mt-1 mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Прогресс</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {scenario.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {scenario.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{scenario.tags.length - 3}
                      </Badge>
                    )}
                    
                    <div className="ml-auto flex items-center gap-1">
                      <div className="text-xs text-muted-foreground">
                        {scenario.steps.length} {scenario.steps.length === 1 ? 'шаг' : 'шагов'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {scenario.platforms.slice(0, 3).map((platform, index) => (
                      <Badge key={index} variant="outline" className="text-xs capitalize">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="border-t bg-muted/30 pt-2 flex">
                  <div className="flex-1 flex justify-between items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectScenario(scenario);
                      }}
                    >
                      Подробнее
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                    
                    <div>
                      {scenario.status === 'running' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScenarioAction(scenario, 'pause');
                          }}
                        >
                          <PauseCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {(scenario.status === 'ready' || scenario.status === 'paused') && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScenarioAction(scenario, 'start');
                          }}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
