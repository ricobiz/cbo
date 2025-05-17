
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Bot, Copy, Check, ExternalLink } from "lucide-react";
import { externalAPIService } from "@/services/ExternalAPIService";

export function ContentGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [style, setStyle] = useState("informative");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(true);
  const { toast } = useToast();

  // Check current mode on component mount
  useEffect(() => {
    setIsOfflineMode(externalAPIService.isOfflineMode());
  }, []);

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        title: "Требуется тема",
        description: "Пожалуйста, введите тему для генерации контента.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Формируем запрос для генерации контента
      const prompt = `Создай контент на тему "${topic}" для платформы ${platform} в ${style === "informative" ? "информативном" : 
        style === "engaging" ? "вовлекающем" : "рекламном"} стиле. 
        Используй эмодзи и соответствующее форматирование для выбранной платформы.`;
      
      let content = "";
      
      // В автономном режиме используем заготовленные шаблоны
      if (isOfflineMode) {
        const platformContent = {
          twitter: {
            informative: `📊 ${topic}: Знаете ли вы? Автоматизация с ИИ может повысить эффективность до 80%! #ИИМаркетинг #ЦифроваяЭффективность`,
            engaging: `🤯 Я был ПОРАЖЕН, когда увидел результаты для "${topic}"! Повышение эффективности на 80% всего за ОДНУ неделю! Кто-нибудь еще пробовал? #ИИРеволюция`,
            promotional: `Готовы увеличить результаты для "${topic}" в 10 раз? Наша платформа обеспечивает на 80% большую эффективность при вдвое меньших усилиях. Ограниченное предложение: начните бесплатный пробный период сейчас! #ИИМаркетинг #РостБизнеса`
          },
          instagram: {
            informative: `${topic} — это не просто тренд, это будущее. Наше последнее исследование показывает, как бренды видят увеличение эффективности на 80%.\n\n#ИИМаркетинг #ЦифроваяТрансформация #СоветыПоМаркетингу`,
            engaging: `✨ Вопрос для моих подписчиков о "${topic}"! ✨\n\nВы уже изучали эту тему? Мы видим НЕВЕРОЯТНЫЕ результаты (увеличение эффективности на 80%!) с нашим новым подходом.\n\nПоставьте 🤖, если хотите, чтобы я поделился дополнительными идеями!\n\n#СоветыПоМаркетингу #ИИРеволюция`,
            promotional: `Преобразите свое понимание "${topic}" с нашим подходом\n\n✅ Увеличение эффективности на 80%\n✅ Персонализированный контент в больших масштабах\n✅ Стратегии на основе данных\n\nНажмите на ссылку в профиле, чтобы начать свой путь!\n\n#ТрансформацияМаркетинга #ИИТехнологии`
          },
          youtube: {
            informative: `${topic}: Эволюция в цифровом маркетинге 2024\n\nВ этом всестороннем анализе мы исследуем, как "${topic}" меняет ландшафт маркетинга, с примерами из практики, показывающими повышение эффективности до 80% в различных отраслях.`,
            engaging: `Я изучал "${topic}" 30 дней... Результаты вас ШОКИРУЮТ! 😱\n\nВ этом видео я документирую свой путь использования передовых инструментов для моей стратегии. От создания контента до таргетирования аудитории, узнайте, как я добился повышения эффективности на 80% и какие уроки я извлек.`,
            promotional: `РАСКРЫТО: Секрет "${topic}", который крупные агентства не хотят, чтобы вы знали\n\nУзнайте, как наша запатентованная система помогает бизнесу, такому как ваш, достичь на 80% большей эффективности при одновременном сокращении расходов вдвое. Доступно ограниченное количество мест в нашей эксклюзивной бета-программе!`
          }
        };
        
        content = platformContent[platform as keyof typeof platformContent][style as keyof typeof platformContent.twitter];
        
        // Имитируем задержку API
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Используем реальный API в онлайн режиме
        if (!externalAPIService.hasOpenRouterApiKey()) {
          toast({
            title: "API ключ не настроен",
            description: "Для генерации контента с помощью AI необходимо добавить OpenRouter API ключ в настройках.",
            variant: "destructive",
          });
          setIsGenerating(false);
          return;
        }
        
        const response = await externalAPIService.sendToOpenRouter(prompt);
        if (response && response.choices && response.choices[0]?.message?.content) {
          content = response.choices[0].message.content;
        } else {
          throw new Error("Не удалось получить ответ от API");
        }
      }
      
      setGeneratedContent(content);
      
      toast({
        title: "Контент сгенерирован",
        description: "Ваш контент был успешно сгенерирован.",
      });
    } catch (error) {
      console.error("Ошибка при генерации контента:", error);
      toast({
        title: "Ошибка генерации",
        description: "Не удалось сгенерировать контент. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast({
      title: "Контент скопирован",
      description: "Контент скопирован в буфер обмена.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Генератор контента
          {isOfflineMode && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">
              Автономный режим
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isOfflineMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
            Приложение работает в автономном режиме. Генерируемый контент будет основан на шаблонах. 
            <Button 
              variant="link" 
              className="h-auto p-0 ml-1 text-yellow-800 underline" 
              onClick={() => window.location.href = '/command'}
            >
              Настроить API <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Тема</label>
          <Input 
            placeholder="Введите тему или ключевое слово" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Платформа</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите платформу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Стиль</label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите стиль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informative">Информативный</SelectItem>
                <SelectItem value="engaging">Вовлекающий</SelectItem>
                <SelectItem value="promotional">Рекламный</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleGenerate} 
          disabled={isGenerating || !topic}
        >
          {isGenerating ? "Генерация..." : "Сгенерировать контент"}
        </Button>
        
        {generatedContent && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Сгенерированный контент</label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Textarea 
              value={generatedContent} 
              readOnly 
              className="min-h-[120px] font-mono text-sm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
