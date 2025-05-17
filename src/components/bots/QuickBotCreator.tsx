
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Bot, X, Settings } from "lucide-react";
import { botService } from "@/services/BotService";
import { useBotStore } from "@/store/BotStore";

interface QuickBotCreatorProps {
  onClose: () => void;
}

export function QuickBotCreator({ onClose }: QuickBotCreatorProps) {
  const [botName, setBotName] = useState("");
  const [botType, setBotType] = useState("");
  const [platform, setPlatform] = useState("");
  const [botCount, setBotCount] = useState(1);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const { toast } = useToast();
  const { fetchBots, createBot } = useBotStore();

  const handleCreateBot = () => {
    if (!botName) {
      toast({
        title: "Требуется имя",
        description: "Пожалуйста, укажите имя для вашего бота",
        variant: "destructive",
      });
      return;
    }

    if (!botType) {
      toast({
        title: "Требуется тип",
        description: "Пожалуйста, выберите тип бота",
        variant: "destructive",
      });
      return;
    }

    // Создаем указанное количество ботов
    let createdCount = 0;
    for (let i = 0; i < botCount; i++) {
      const botNameWithIndex = botCount > 1 ? `${botName} ${i+1}` : botName;
      
      // Используем store для создания ботов
      const newBotId = createBot({
        name: botNameWithIndex,
        type: botType as any,
        description: `${platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : ''} ${botType} bot`,
        status: "idle"
      });
      
      if (newBotId) createdCount++;
    }
    
    // Показываем сообщение об успехе
    toast({
      title: "Бот создан",
      description: createdCount === 1 
        ? `${botName} был успешно создан` 
        : `${createdCount} ботов с именем ${botName} были успешно созданы`,
    });
    
    // Обновляем список ботов и закрываем окно
    fetchBots();
    onClose();
  };

  return (
    <Card className="w-full border shadow-lg animate-fade-in">
      <CardHeader className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" /> Быстрое создание бота
        </CardTitle>
        <CardDescription>
          {showAdvancedSettings 
            ? "Настройте детали и количество ботов перед созданием" 
            : "Создайте нового бота за секунды с базовыми настройками"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quick-bot-name">Имя бота</Label>
          <Input 
            id="quick-bot-name" 
            placeholder="Введите имя бота" 
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quick-bot-type">Тип бота</Label>
          <Select value={botType} onValueChange={setBotType}>
            <SelectTrigger id="quick-bot-type">
              <SelectValue placeholder="Выберите тип бота" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="content">Генератор контента</SelectItem>
              <SelectItem value="interaction">Симулятор взаимодействия</SelectItem>
              <SelectItem value="click">Кликающий бот</SelectItem>
              <SelectItem value="parser">Парсер</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quick-platform">Целевая платформа</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger id="quick-platform">
              <SelectValue placeholder="Выберите целевую платформу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="spotify">Spotify</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showAdvancedSettings && (
          <>
            <div className="space-y-2">
              <Label htmlFor="bot-count">Количество ботов</Label>
              <Input
                id="bot-count"
                type="number"
                min={1}
                max={100}
                value={botCount}
                onChange={(e) => setBotCount(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <p className="text-xs text-muted-foreground">
                Будет создано указанное количество ботов с последовательной нумерацией
              </p>
            </div>
          </>
        )}

        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2" 
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
        >
          <Settings className="h-4 w-4" />
          {showAdvancedSettings ? "Скрыть дополнительные настройки" : "Показать дополнительные настройки"}
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>Отмена</Button>
        <Button onClick={handleCreateBot}>Создать бота{botCount > 1 && `(${botCount})`}</Button>
      </CardFooter>
    </Card>
  );
}
