
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import { toast } from "sonner";
import { Scenario, ScenarioCategory, ScenarioStatus } from "@/services/types/scenario";
import { BotPlatform } from "@/services/types/bot";
import { ScenarioService } from "@/services/ScenarioService";

interface ScenarioFormProps {
  scenario?: Scenario;
  onBack: () => void;
  onSave: (scenario: Scenario) => void;
}

export function ScenarioForm({ scenario, onBack, onSave }: ScenarioFormProps) {
  const isEditing = !!scenario;
  
  const [name, setName] = useState(scenario?.name || "");
  const [description, setDescription] = useState(scenario?.description || "");
  const [category, setCategory] = useState<ScenarioCategory>(scenario?.category || "growth");
  const [platforms, setPlatforms] = useState<BotPlatform[]>(scenario?.platforms || []);
  const [tags, setTags] = useState<string[]>(scenario?.tags || []);
  const [status, setStatus] = useState<ScenarioStatus>(scenario?.status || "draft");
  const [currentTag, setCurrentTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle platform selection
  const handlePlatformToggle = (platform: BotPlatform) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter(p => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };
  
  // Handle tag addition
  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };
  
  // Handle tag removal
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Название обязательно";
    }
    
    if (platforms.length === 0) {
      newErrors.platforms = "Выберите хотя бы одну платформу";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    try {
      let newScenario: Scenario;
      
      if (isEditing && scenario) {
        // Update existing scenario
        newScenario = {
          ...scenario,
          name,
          description,
          category,
          platforms,
          tags,
          status,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Create new scenario
        newScenario = {
          id: Date.now().toString(),
          name,
          description,
          category,
          platforms,
          tags,
          status,
          steps: [],
          variables: [],
          triggers: [{ type: 'manual', config: {}, active: true }],
          permissions: [{ user: 'admin', access: 'admin' }],
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      const savedScenario = ScenarioService.saveScenario(newScenario);
      
      toast.success(isEditing ? "Сценарий обновлен" : "Сценарий создан", {
        description: `Сценарий "${name}" успешно ${isEditing ? 'обновлен' : 'создан'}.`
      });
      
      onSave(savedScenario);
    } catch (error) {
      console.error("Error saving scenario:", error);
      toast.error("Ошибка", {
        description: `Не удалось ${isEditing ? 'обновить' : 'создать'} сценарий.`
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
          {isEditing ? "Редактирование сценария" : "Создание сценария"}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Название сценария <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите название сценария"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Введите описание сценария"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as ScenarioCategory)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="growth">Рост</SelectItem>
                    <SelectItem value="engagement">Вовлечение</SelectItem>
                    <SelectItem value="monitoring">Мониторинг</SelectItem>
                    <SelectItem value="content">Контент</SelectItem>
                    <SelectItem value="conversion">Конверсия</SelectItem>
                    <SelectItem value="custom">Особый</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as ScenarioStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Черновик</SelectItem>
                    <SelectItem value="ready">Готов</SelectItem>
                    <SelectItem value="running">Запущен</SelectItem>
                    <SelectItem value="paused">Приостановлен</SelectItem>
                    <SelectItem value="completed">Завершен</SelectItem>
                    <SelectItem value="failed">С ошибками</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Теги</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Добавить тег"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button 
                  variant="outline" 
                  onClick={handleAddTag}
                  disabled={!currentTag || tags.includes(currentTag)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Добавьте теги для лучшей организации сценариев</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Платформы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="mb-2 block">
                  Выберите платформы <span className="text-red-500">*</span>
                </Label>
                
                <div className="grid grid-cols-2 gap-2">
                  {["youtube", "instagram", "tiktok", "twitter", "facebook", "spotify"].map((platform) => (
                    <div
                      key={platform}
                      onClick={() => handlePlatformToggle(platform as BotPlatform)}
                      className={`
                        p-2 rounded-md border cursor-pointer flex items-center justify-center
                        ${platforms.includes(platform as BotPlatform) ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-input'}
                      `}
                    >
                      <span className="capitalize">{platform}</span>
                    </div>
                  ))}
                </div>
                
                {errors.platforms && (
                  <p className="text-sm text-red-500 mt-2">{errors.platforms}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Сохранение</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full"
                onClick={handleSubmit}
              >
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? "Сохранить изменения" : "Создать сценарий"}
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={onBack}
              >
                Отмена
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
