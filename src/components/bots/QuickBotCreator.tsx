
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Bot, Rocket } from "lucide-react";
import { useBotStore } from "@/store/BotStore";
import { InteractiveHint } from "@/components/ui/interactive-hint";

interface QuickBotCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickBotCreator({ open, onOpenChange }: QuickBotCreatorProps) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("");
  const [type, setType] = useState("");
  const [showHint, setShowHint] = useState(true);
  
  const { createBot } = useBotStore();
  const { toast } = useToast();
  
  const handleCreate = () => {
    if (!name || !platform || !type) {
      toast({
        title: "Необходимо заполнить все поля",
        description: "Пожалуйста, укажите название, платформу и тип бота.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const botId = createBot({
        name,
        description: `Быстро созданный ${type} бот для ${platform}`,
        type: type as any,
        status: 'idle',
        lastRun: new Date().toISOString(),
        healthPercentage: 100
      });
      
      if (botId) {
        toast({
          title: "Бот успешно создан",
          description: `${name} теперь доступен для настройки и запуска.`,
        });
        
        // Reset form and close dialog
        setName("");
        setPlatform("");
        setType("");
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "Ошибка при создании бота",
        description: `Не удалось создать бота: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" /> Быстрое создание бота
          </DialogTitle>
          <DialogDescription>
            Создайте бота с базовыми настройками за несколько секунд.
          </DialogDescription>
        </DialogHeader>
        
        {showHint && (
          <InteractiveHint
            title="Быстрое создание"
            description="Используйте быстрое создание, чтобы быстро добавить бота с базовыми настройками."
            onComplete={() => setShowHint(false)}
            highlightLevel="medium"
          >
            <div className="flex items-start gap-3">
              <Bot className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Быстрое создание</h4>
                <p className="text-sm text-muted-foreground">
                  Заполните основные параметры бота: название, платформу и тип. Позже вы сможете настроить дополнительные параметры в разделе конфигурации.
                </p>
              </div>
            </div>
          </InteractiveHint>
        )}
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Название бота</Label>
            <Input
              id="name"
              placeholder="Введите название бота"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="platform">Платформа</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Выберите платформу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="spotify">Spotify</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Тип бота</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Выберите тип бота" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="content">Генератор контента</SelectItem>
                <SelectItem value="interaction">Симулятор взаимодействия</SelectItem>
                <SelectItem value="click">Кликер</SelectItem>
                <SelectItem value="parser">Парсер данных</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {type === "content" && "Создаёт и публикует контент на платформе."}
              {type === "interaction" && "Имитирует взаимодействие с контентом: лайки, комментарии."}
              {type === "click" && "Автоматизирует просмотры и клики для увеличения активности."}
              {type === "parser" && "Собирает данные с выбранной платформы для анализа."}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleCreate}>
            Создать бота
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
