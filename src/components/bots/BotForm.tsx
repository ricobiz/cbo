
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bot, BotType, BotPlatform, BotStatus } from "@/services/types/bot";
import { BotManagementService } from "@/services/BotManagementService";
import { ArrowLeft, Plus, X, Trash, RefreshCw, Link, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getActivePlatforms } from "@/constants/platforms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BotFormProps {
  bot?: Bot;
  onBack: () => void;
  onSave: (bot: Bot) => void;
}

export function BotForm({ bot, onBack, onSave }: BotFormProps) {
  const isEditing = !!bot;
  const { toast } = useToast();
  const activePlatforms = getActivePlatforms();
  
  // Basic information state
  const [name, setName] = useState(bot?.name || "");
  const [description, setDescription] = useState(bot?.description || "");
  const [type, setType] = useState<BotType>(bot?.type || "content");
  const [platform, setPlatform] = useState<BotPlatform>(bot?.platform || "youtube");
  const [avatar, setAvatar] = useState(bot?.avatar || "");
  
  // Configuration state
  const [maxActions, setMaxActions] = useState(bot?.config.maxActions || 100);
  const [proxyType, setProxyType] = useState(bot?.config.proxy?.type || "none");
  const [proxyUrl, setProxyUrl] = useState(bot?.config.proxy?.url || "");
  
  // Target URLs state
  const [targetUrls, setTargetUrls] = useState<string[]>(bot?.config.targetUrls || []);
  const [newUrl, setNewUrl] = useState("");
  
  // Templates state
  const [templates, setTemplates] = useState<Record<string, string>>(bot?.config.templates || {});
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateValue, setNewTemplateValue] = useState("");
  
  // Schedule state
  const [scheduleActive, setScheduleActive] = useState(bot?.config.schedule?.active || false);
  const [scheduleTimes, setScheduleTimes] = useState(bot?.config.schedule?.times || [
    { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] }
  ]);
  
  // Advanced settings state (as JSON string for editing)
  const [advancedSettingsJson, setAdvancedSettingsJson] = useState(
    JSON.stringify(bot?.config.advancedSettings || {}, null, 2)
  );
  
  // Validation state
  const [nameError, setNameError] = useState("");
  const [advancedSettingsError, setAdvancedSettingsError] = useState("");
  
  // Reset errors on input change
  useEffect(() => {
    setNameError("");
  }, [name]);
  
  useEffect(() => {
    try {
      JSON.parse(advancedSettingsJson);
      setAdvancedSettingsError("");
    } catch (e) {
      setAdvancedSettingsError("Неверный JSON формат");
    }
  }, [advancedSettingsJson]);
  
  // Handle URL management
  const addUrl = () => {
    if (newUrl && !targetUrls.includes(newUrl)) {
      setTargetUrls([...targetUrls, newUrl]);
      setNewUrl("");
    }
  };
  
  const removeUrl = (url: string) => {
    setTargetUrls(targetUrls.filter(u => u !== url));
  };
  
  const handleUrlKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addUrl();
    }
  };
  
  // Handle template management
  const addTemplate = () => {
    if (newTemplateName && !templates[newTemplateName]) {
      setTemplates({
        ...templates,
        [newTemplateName]: newTemplateValue
      });
      setNewTemplateName("");
      setNewTemplateValue("");
    }
  };
  
  const removeTemplate = (name: string) => {
    const { [name]: _, ...rest } = templates;
    setTemplates(rest);
  };
  
  // Handle schedule management
  const updateScheduleTime = (index: number, field: keyof typeof scheduleTimes[0], value: any) => {
    const newScheduleTimes = [...scheduleTimes];
    newScheduleTimes[index] = {
      ...newScheduleTimes[index],
      [field]: value
    };
    setScheduleTimes(newScheduleTimes);
  };
  
  const addScheduleTime = () => {
    setScheduleTimes([
      ...scheduleTimes,
      { start: "09:00", end: "18:00", days: [1, 2, 3, 4, 5] }
    ]);
  };
  
  const removeScheduleTime = (index: number) => {
    setScheduleTimes(scheduleTimes.filter((_, i) => i !== index));
  };
  
  const toggleDay = (timeIndex: number, day: number) => {
    const newScheduleTimes = [...scheduleTimes];
    const currentDays = newScheduleTimes[timeIndex].days;
    
    if (currentDays.includes(day)) {
      // Remove the day
      newScheduleTimes[timeIndex].days = currentDays.filter(d => d !== day);
    } else {
      // Add the day
      newScheduleTimes[timeIndex].days = [...currentDays, day].sort();
    }
    
    setScheduleTimes(newScheduleTimes);
  };
  
  // Generate an avatar URL using UI Avatars service
  const generateAvatar = () => {
    if (name) {
      // Get initials
      const nameParts = name.split(' ');
      let initials = nameParts[0].charAt(0);
      if (nameParts.length > 1) {
        initials += nameParts[1].charAt(0);
      }
      
      // Get color based on bot type
      const bgColor = type === 'content' ? '3b82f6' :
                      type === 'interaction' ? '10b981' :
                      type === 'view' ? '8b5cf6' :
                      type === 'parser' ? 'ef4444' : '6b7280';
      
      const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bgColor}&color=fff`;
      setAvatar(url);
      
      toast({
        title: "Аватар создан",
        description: "Аватар бота был автоматически сгенерирован."
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    let isValid = true;
    
    if (!name.trim()) {
      setNameError("Пожалуйста, введите название бота");
      isValid = false;
    }
    
    let parsedAdvancedSettings = {};
    try {
      parsedAdvancedSettings = JSON.parse(advancedSettingsJson);
    } catch (e) {
      setAdvancedSettingsError("Неверный JSON формат");
      isValid = false;
    }
    
    if (!isValid) {
      return;
    }
    
    // Prepare bot data
    const botData: Bot = {
      id: bot?.id || Date.now().toString(),
      name,
      description,
      type,
      platform,
      status: bot?.status || 'idle',
      health: bot?.health || 'healthy',
      proxyStatus: proxyType === 'none' ? 'inactive' : bot?.proxyStatus || 'active',
      avatar,
      lastActive: bot?.lastActive,
      createdAt: bot?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      consumption: bot?.consumption || {
        cpu: 0,
        memory: 0,
        network: 0,
        quota: 0
      },
      activity: bot?.activity || [],
      actions: bot?.actions || [],
      config: {
        maxActions,
        targetUrls: targetUrls.length > 0 ? targetUrls : undefined,
        templates: Object.keys(templates).length > 0 ? templates : undefined,
        proxy: proxyType !== 'none' ? {
          type: proxyType as 'http' | 'socks' | 'none',
          url: proxyUrl
        } : undefined,
        schedule: scheduleActive ? {
          active: scheduleActive,
          times: scheduleTimes
        } : undefined,
        advancedSettings: Object.keys(parsedAdvancedSettings).length > 0 ? parsedAdvancedSettings : undefined
      },
      associatedCampaignIds: bot?.associatedCampaignIds
    };
    
    try {
      // Save bot
      const savedBot = BotManagementService.saveBot(botData);
      
      toast({
        title: isEditing ? "Бот обновлен" : "Бот создан",
        description: `Бот "${name}" успешно ${isEditing ? 'обновлен' : 'создан'}.`
      });
      
      onSave(savedBot);
    } catch (error) {
      console.error("Error saving bot:", error);
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить бота. Пожалуйста, попробуйте снова.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        
        <h1 className="text-2xl font-bold">
          {isEditing ? `Редактирование: ${bot.name}` : "Создание нового бота"}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Основное</TabsTrigger>
            <TabsTrigger value="targets">Цели</TabsTrigger>
            <TabsTrigger value="templates">Шаблоны</TabsTrigger>
            <TabsTrigger value="advanced">Расширенные</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название бота *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Введите название бота"
                    className={nameError ? "border-destructive" : ""}
                  />
                  {nameError && <p className="text-sm text-destructive">{nameError}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Опишите назначение и задачи бота"
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Тип бота *</Label>
                    <Select value={type} onValueChange={(value) => setType(value as BotType)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Выберите тип бота" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="content">Контент</SelectItem>
                        <SelectItem value="interaction">Взаимодействие</SelectItem>
                        <SelectItem value="view">Просмотр</SelectItem>
                        <SelectItem value="parser">Парсер</SelectItem>
                        <SelectItem value="custom">Особый</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="platform">Платформа *</Label>
                    <Select value={platform} onValueChange={(value) => setPlatform(value as BotPlatform)}>
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Выберите платформу" />
                      </SelectTrigger>
                      <SelectContent>
                        {activePlatforms.map(p => (
                          <SelectItem key={p.id} value={p.id as BotPlatform}>
                            <div className="flex items-center gap-2">
                              <p.icon className="h-4 w-4" />
                              <span>{p.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="multi">Мультиплатформенный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar">Аватар бота</Label>
                  <div className="flex gap-2">
                    <Input
                      id="avatar"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="URL изображения"
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={generateAvatar}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Сгенерировать
                    </Button>
                  </div>
                  {avatar && (
                    <div className="mt-2 flex justify-center">
                      <img src={avatar} alt="Bot Avatar" className="w-16 h-16 rounded-full" />
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxActions">Максимум действий</Label>
                    <Input
                      id="maxActions"
                      type="number"
                      value={maxActions}
                      onChange={(e) => setMaxActions(Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="proxyType">Тип прокси</Label>
                    <Select value={proxyType} onValueChange={setProxyType}>
                      <SelectTrigger id="proxyType">
                        <SelectValue placeholder="Выберите тип прокси" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Без прокси</SelectItem>
                        <SelectItem value="http">HTTP</SelectItem>
                        <SelectItem value="socks">SOCKS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {proxyType !== 'none' && (
                  <div className="space-y-2">
                    <Label htmlFor="proxyUrl">URL прокси</Label>
                    <Input
                      id="proxyUrl"
                      value={proxyUrl}
                      onChange={(e) => setProxyUrl(e.target.value)}
                      placeholder={proxyType === 'http' ? 'http://proxy.example.com:8080' : 'socks5://proxy.example.com:1080'}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="targets">
            <Card>
              <CardHeader>
                <CardTitle>Целевые URL</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="targetUrl">Добавить URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="targetUrl"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      onKeyDown={handleUrlKeyDown}
                      placeholder="https://example.com/target"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={addUrl} 
                      disabled={!newUrl}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">Список URL ({targetUrls.length})</h3>
                  {targetUrls.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      Нет добавленных URL
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      {targetUrls.map((url, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/40 rounded-md p-2 text-sm">
                          <div className="truncate flex-1 mr-2">{url}</div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6"
                            onClick={() => removeUrl(url)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Шаблоны контента</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Название шаблона</Label>
                  <Input
                    id="templateName"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="Например: comment1, greeting, bio"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="templateValue">Текст шаблона</Label>
                  <Textarea
                    id="templateValue"
                    value={newTemplateValue}
                    onChange={(e) => setNewTemplateValue(e.target.value)}
                    placeholder="Текст шаблона, который будет использоваться ботом"
                    className="min-h-[100px]"
                  />
                </div>
                
                <Button 
                  type="button" 
                  onClick={addTemplate}
                  disabled={!newTemplateName || !newTemplateValue}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить шаблон
                </Button>
                
                <div className="border rounded-md p-4 mt-4">
                  <h3 className="text-sm font-medium mb-3">Список шаблонов ({Object.keys(templates).length})</h3>
                  {Object.keys(templates).length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      Нет добавленных шаблонов
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                      {Object.entries(templates).map(([name, value]) => (
                        <div key={name} className="bg-muted/40 rounded-md p-3 text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{name}</div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => removeTemplate(name)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="bg-background/60 p-2 rounded text-sm">{value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Расписание</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scheduleActive" className="cursor-pointer">Использовать расписание</Label>
                  <Switch
                    id="scheduleActive"
                    checked={scheduleActive}
                    onCheckedChange={setScheduleActive}
                  />
                </div>
                
                {scheduleActive && (
                  <div className="space-y-6 mt-4">
                    {scheduleTimes.map((time, index) => (
                      <div key={index} className="border rounded-md p-3 space-y-3">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium">Временной интервал #{index + 1}</div>
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeScheduleTime(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor={`startTime-${index}`} className="text-xs">Время начала</Label>
                            <Input
                              id={`startTime-${index}`}
                              type="time"
                              value={time.start}
                              onChange={(e) => updateScheduleTime(index, 'start', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor={`endTime-${index}`} className="text-xs">Время окончания</Label>
                            <Input
                              id={`endTime-${index}`}
                              type="time"
                              value={time.end}
                              onChange={(e) => updateScheduleTime(index, 'end', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs">Дни недели</Label>
                          <div className="flex flex-wrap gap-2">
                            {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map((day, dayIndex) => (
                              <Button
                                key={dayIndex}
                                type="button"
                                variant={time.days.includes(dayIndex) ? "default" : "outline"}
                                className="h-7 w-7 p-0"
                                onClick={() => toggleDay(index, dayIndex)}
                              >
                                {day}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={addScheduleTime}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить интервал
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Расширенные настройки (JSON)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="advancedSettings">
                    Настройки в формате JSON
                  </Label>
                  <Textarea
                    id="advancedSettings"
                    value={advancedSettingsJson}
                    onChange={(e) => setAdvancedSettingsJson(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                    placeholder="{}"
                  />
                  {advancedSettingsError && <p className="text-sm text-destructive">{advancedSettingsError}</p>}
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">
                    Пример настроек для бота просмотров:
                  </p>
                  <pre className="text-xs bg-muted p-2 rounded-md mt-2 overflow-x-auto">
{`{
  "watchDuration": {
    "min": 60,
    "max": 300
  },
  "likeChance": 0.2,
  "commentChance": 0.05
}`}
                  </pre>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    try {
                      const formatted = JSON.stringify(JSON.parse(advancedSettingsJson), null, 2);
                      setAdvancedSettingsJson(formatted);
                    } catch (e) {
                      // Если неверный формат, оставляем как есть
                    }
                  }}
                >
                  Форматировать JSON
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Отмена
          </Button>
          <Button type="submit">
            {isEditing ? "Сохранить изменения" : "Создать бота"}
          </Button>
        </div>
      </form>
    </div>
  );
}
