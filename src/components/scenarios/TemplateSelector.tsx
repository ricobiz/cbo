
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScenarioTemplate, ScenarioCategory } from "@/services/types/scenario";
import { ScenarioService } from "@/services/ScenarioService";
import { Search, ArrowLeft, TrendingUp, Users, Settings, Sparkles, Layers, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TemplateSelectorProps {
  onBack: () => void;
  onTemplateSelect: (templateId: string, name: string, description: string) => void;
}

// Helper functions
const getCategoryIcon = (category: ScenarioCategory) => {
  switch (category) {
    case 'growth': return <TrendingUp className="h-4 w-4" />;
    case 'engagement': return <Users className="h-4 w-4" />;
    case 'monitoring': return <Settings className="h-4 w-4" />;
    case 'content': return <Sparkles className="h-4 w-4" />;
    case 'conversion': return <Layers className="h-4 w-4" />;
    default: return <Settings className="h-4 w-4" />;
  }
};

const getCategoryText = (category: ScenarioCategory): string => {
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

const getComplexityText = (complexity: string): string => {
  switch (complexity) {
    case 'simple': return 'Простой';
    case 'medium': return 'Средний';
    case 'advanced': return 'Продвинутый';
    default: return complexity;
  }
};

const getComplexityColor = (complexity: string): string => {
  switch (complexity) {
    case 'simple': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-amber-100 text-amber-800';
    case 'advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function TemplateSelector({ onBack, onTemplateSelect }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<ScenarioTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ScenarioCategory | "all">("all");
  const [selectedTemplate, setSelectedTemplate] = useState<ScenarioTemplate | null>(null);
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioDescription, setScenarioDescription] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    loadTemplates();
  }, []);
  
  const loadTemplates = () => {
    setIsLoading(true);
    try {
      const templateData = ScenarioService.getAllScenarioTemplates();
      setTemplates(templateData);
    } catch (error) {
      console.error("Error loading scenario templates:", error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить шаблоны сценариев.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle template selection
  const handleSelectTemplate = (template: ScenarioTemplate) => {
    setSelectedTemplate(template);
    setScenarioName(template.name);
    setScenarioDescription(template.description);
  };
  
  // Handle template creation
  const handleCreateFromTemplate = () => {
    if (!selectedTemplate) return;
    
    if (!scenarioName.trim()) {
      toast({
        title: "Требуется название",
        description: "Пожалуйста, введите название для сценария.",
        variant: "destructive"
      });
      return;
    }
    
    onTemplateSelect(selectedTemplate.id, scenarioName, scenarioDescription);
  };
  
  // Filter templates
  const getFilteredTemplates = () => {
    return templates.filter(template => {
      // Apply category filter
      if (categoryFilter !== 'all' && template.category !== categoryFilter) {
        return false;
      }
      
      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  };
  
  const filteredTemplates = getFilteredTemplates();

  return (
    <div className="space-y-6">
      {!selectedTemplate ? (
        <>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
            
            <h1 className="text-2xl font-bold">Выберите шаблон сценария</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск шаблонов..."
                  className="pl-8 w-full sm:w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value as ScenarioCategory | "all")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Все категории" />
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
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardHeader className="pb-2">
                    <div className="h-5 bg-muted rounded-md w-3/4" />
                    <div className="h-4 bg-muted rounded-md w-1/2 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-16 bg-muted rounded-md w-full" />
                  </CardContent>
                  <CardFooter className="bg-muted h-10" />
                </Card>
              ))}
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Нет шаблонов</h3>
              <p className="text-muted-foreground mt-2">
                Нет шаблонов, соответствующих выбранным фильтрам.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <Card 
                  key={template.id}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="aspect-video bg-muted relative">
                    {template.previewImage ? (
                      <img 
                        src={template.previewImage} 
                        alt={template.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        {getCategoryIcon(template.category)}
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2">
                      <div className={`text-xs px-2 py-1 rounded-full ${getComplexityColor(template.complexity)}`}>
                        {getComplexityText(template.complexity)}
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-1.5 mb-1">
                      {getCategoryIcon(template.category)}
                      <span className="text-sm font-medium">{getCategoryText(template.category)}</span>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {template.description}
                    </p>
                    
                    <div className="flex justify-between items-center mt-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{template.estimatedDuration}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Layers className="h-4 w-4" />
                        <span>{template.steps.length} шагов</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-4">
                      {template.platforms.map((platform, index) => (
                        <Badge key={index} variant="outline" className="text-xs capitalize">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t pt-3 flex justify-between">
                    <Button variant="ghost" size="sm">
                      Просмотр шагов
                    </Button>
                    <Button size="sm">
                      Выбрать
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedTemplate(null)} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Назад к шаблонам
            </Button>
            
            <h1 className="text-2xl font-bold">Создание сценария</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="scenarioName">Название сценария *</Label>
                    <Input
                      id="scenarioName"
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                      placeholder="Введите название сценария"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="scenarioDescription">Описание</Label>
                    <Input
                      id="scenarioDescription"
                      value={scenarioDescription}
                      onChange={(e) => setScenarioDescription(e.target.value)}
                      placeholder="Введите описание сценария"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Шаги сценария</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {selectedTemplate.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-3 border rounded-md p-3">
                        <div className="bg-muted rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-medium">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{step.name}</div>
                          <div className="text-sm text-muted-foreground mt-0.5">
                            {step.type === 'content-generation' ? 'Генерация контента' :
                             step.type === 'bot-action' ? 'Действие бота' :
                             step.type === 'wait' ? 'Ожидание' :
                             step.type === 'condition' ? 'Условие' :
                             step.type === 'campaign' ? 'Кампания' :
                             step.type === 'notification' ? 'Уведомление' : step.type}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {step.dependsOn && step.dependsOn.length > 0 ? (
                              <div className="flex items-center gap-1">
                                <span>Зависит от шагов:</span>
                                <span>{step.dependsOn.map(d => d.replace('{{stepId:', '').replace('}}', '')).join(', ')}</span>
                              </div>
                            ) : (
                              <div>Независимый шаг</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Сводка шаблона</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      {getCategoryIcon(selectedTemplate.category)}
                      <span className="font-medium">{getCategoryText(selectedTemplate.category)}</span>
                    </div>
                    
                    <div className="bg-muted rounded-md aspect-video overflow-hidden">
                      {selectedTemplate.previewImage ? (
                        <img 
                          src={selectedTemplate.previewImage} 
                          alt={selectedTemplate.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full">
                          {getCategoryIcon(selectedTemplate.category)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Сложность:</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getComplexityColor(selectedTemplate.complexity)}`}>
                        {getComplexityText(selectedTemplate.complexity)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Время выполнения:</span>
                      <span className="text-sm">{selectedTemplate.estimatedDuration}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Количество шагов:</span>
                      <span className="text-sm">{selectedTemplate.steps.length}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Платформы:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedTemplate.platforms.map((platform, index) => (
                        <Badge key={index} variant="outline" className="capitalize">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button className="w-full" onClick={handleCreateFromTemplate} disabled={!scenarioName.trim()}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Создать сценарий
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
