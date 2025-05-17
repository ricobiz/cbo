
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
import { Bot, X, Settings, AlertTriangle } from "lucide-react";
import { botService } from "@/services/BotService";
import { useBotStore } from "@/store/BotStore";
import { externalAPIService } from "@/services/ExternalAPIService";
import { proxyService } from "@/services/ProxyService";

interface QuickBotCreatorProps {
  onClose: () => void;
}

export function QuickBotCreator({ onClose }: QuickBotCreatorProps) {
  const [botName, setBotName] = useState("");
  const [botType, setBotType] = useState("");
  const [platform, setPlatform] = useState("");
  const [botCount, setBotCount] = useState(1);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [readyToCreate, setReadyToCreate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { fetchBots, createBot } = useBotStore();

  const handlePrepareBot = () => {
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
    
    // Показываем расширенные настройки перед созданием
    setShowAdvancedSettings(true);
    setReadyToCreate(true);
  };

  // Проверка наличия необходимых API ключей
  const checkApiKeys = (): boolean => {
    const needsOpenRouter = botType === "content" || botType === "interaction";
    const needsBrowserUse = botType === "interaction" || botType === "click";
    
    let apiKeysValid = true;
    
    if (needsOpenRouter && !externalAPIService.hasOpenRouterApiKey()) {
      toast({
        title: "Требуется API ключ",
        description: "Для этого типа бота необходим API ключ OpenRouter. Пожалуйста, добавьте его в настройках.",
        variant: "destructive",
      });
      apiKeysValid = false;
    }
    
    if (needsBrowserUse && !externalAPIService.hasBrowserUseApiKey()) {
      toast({
        title: "Требуется API ключ",
        description: "Для этого типа бота необходим API ключ Browser Use. Пожалуйста, добавьте его в настройках.",
        variant: "destructive",
      });
      apiKeysValid = false;
    }
    
    return apiKeysValid;
  };

  const handleCreateBot = async () => {
    // Проверяем API ключи
    if (!checkApiKeys()) {
      return;
    }
    
    // Проверяем доступность прокси для ботов, требующих взаимодействия
    if ((botType === "interaction" || botType === "click") && proxyService.getHealthyProxiesCount() === 0) {
      toast({
        title: "Нет доступных прокси",
        description: "Для интерактивных ботов требуется хотя бы один рабочий прокси. Пожалуйста, настройте прокси в настройках.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
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
        
        if (newBotId) {
          // Для ботов с взаимодействием инициализируем сессию браузера
          if (botType === "interaction" || botType === "click") {
            try {
              // Получаем прокси
              const proxy = await proxyService.getHealthyProxy();
              
              if (proxy) {
                // Создаем браузерную сессию
                const session = await externalAPIService.createBrowserSession({
                  proxy,
                  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
                });
                
                console.log(`Bot ${newBotId} created with browser session`);
              }
            } catch (error) {
              console.error(`Failed to initialize browser session for bot ${newBotId}:`, error);
            }
          }
          
          createdCount++;
        }
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
    } catch (error) {
      console.error("Error creating bots:", error);
      toast({
        title: "Ошибка создания",
        description: error instanceof Error ? error.message : "Произошла ошибка при создании ботов",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Проверка требований для платформы
  const getPlatformRequirements = () => {
    if (!platform) return null;
    
    const requiresAuth = ["youtube", "instagram", "facebook", "twitter", "tiktok", "spotify"].includes(platform);
    const requiresProxy = ["youtube", "instagram", "facebook", "twitter", "tiktok", "linkedin"].includes(platform);
    
    if (!requiresAuth && !requiresProxy) return null;
    
    return (
      <div className="bg-amber-50 text-amber-800 border border-amber-200 p-2 rounded-md mt-2">
        <div className="flex items-center gap-1 text-xs">
          <AlertTriangle className="h-3 w-3" />
          <span className="font-medium">Требования для платформы {platform}:</span>
        </div>
        <ul className="text-xs mt-1 space-y-1 ml-4 list-disc">
          {requiresAuth && <li>Требуется аккаунт для полнофункциональной работы</li>}
          {requiresProxy && <li>Рекомендуется использование прокси для избежания блокировок</li>}
        </ul>
      </div>
    );
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
              <SelectItem value="telegram">Telegram</SelectItem>
              <SelectItem value="vk">ВКонтакте</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="reddit">Reddit</SelectItem>
              <SelectItem value="pinterest">Pinterest</SelectItem>
              <SelectItem value="snapchat">Snapchat</SelectItem>
              <SelectItem value="twitch">Twitch</SelectItem>
              <SelectItem value="spotify">Spotify</SelectItem>
              <SelectItem value="soundcloud">SoundCloud</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="discord">Discord</SelectItem>
              <SelectItem value="clubhouse">Clubhouse</SelectItem>
              <SelectItem value="other">Другая платформа</SelectItem>
            </SelectContent>
          </Select>
          
          {getPlatformRequirements()}
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

        {!showAdvancedSettings && (
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2" 
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          >
            <Settings className="h-4 w-4" />
            {showAdvancedSettings ? "Скрыть дополнительные настройки" : "Показать дополнительные настройки"}
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>Отмена</Button>
        {readyToCreate ? (
          <Button 
            onClick={handleCreateBot} 
            disabled={isCreating}
          >
            {isCreating ? "Создание..." : `Создать бота${botCount > 1 ? ` (${botCount})` : ""}`}
          </Button>
        ) : (
          <Button onClick={handlePrepareBot}>Продолжить</Button>
        )}
      </CardFooter>
    </Card>
  );
}
