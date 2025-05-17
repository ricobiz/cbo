
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Bot, Copy, Check } from "lucide-react";

export function ContentGenerator() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [style, setStyle] = useState("informative");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!topic) {
      toast({
        title: "Требуется тема",
        description: "Пожалуйста, введите тему для генерации контента.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Mock content generation delay
    setTimeout(() => {
      const platformContent = {
        twitter: {
          informative: `📊 Знаете ли вы? Автоматизация с ИИ может повысить эффективность маркетинга до 80%! #ИИМаркетинг #ЦифроваяЭффективность`,
          engaging: `🤯 Я был ПОРАЖЕН, когда увидел результаты использования ИИ для автоматизации маркетинга! Повышение эффективности на 80% всего за ОДНУ неделю! Кто-нибудь еще пробовал? #ИИРеволюция`,
          promotional: `Готовы увеличить результаты маркетинга в 10 раз? Наша платформа ИИ обеспечивает на 80% большую эффективность при вдвое меньших усилиях. Ограниченное предложение: начните бесплатный пробный период сейчас! #ИИМаркетинг #РостБизнеса`
        },
        instagram: {
          informative: `Маркетинг на основе ИИ — это не просто тренд, это будущее. Наше последнее исследование показывает, как бренды видят увеличение эффективности на 80%.\n\n#ИИМаркетинг #ЦифроваяТрансформация #СоветыПоМаркетингу`,
          engaging: `✨ Вопрос для моей маркетинговой семьи! ✨\n\nВы уже внедрили ИИ в свою стратегию? Мы видим СУМАСШЕДШИЕ результаты (увеличение эффективности на 80%!) с нашим новым подходом.\n\nПоставьте 🤖, если хотите, чтобы я поделился дополнительными идеями!\n\n#СоветыПоМаркетингу #ИИРеволюция`,
          promotional: `Преобразите свое цифровое присутствие с маркетингом на базе ИИ\n\n✅ Увеличение эффективности на 80%\n✅ Персонализированный контент в больших масштабах\n✅ Стратегии на основе данных\n\nНажмите на ссылку в профиле, чтобы начать свой путь!\n\n#ТрансформацияМаркетинга #ИИТехнологии`
        },
        youtube: {
          informative: `Эволюция ИИ в цифровом маркетинге: стратегии на основе данных на 2024 год\n\nВ этом всестороннем анализе мы исследуем, как искусственный интеллект меняет ландшафт маркетинга, с примерами из практики, показывающими повышение эффективности до 80% в различных отраслях.`,
          engaging: `Я пробовал ИИ-маркетинг 30 дней... Результаты вас ШОКИРУЮТ! 😱\n\nВ этом видео я документирую свой путь использования передовых инструментов ИИ для моей маркетинговой стратегии. От создания контента до таргетирования аудитории, узнайте, как я добился повышения эффективности на 80% и какие уроки я извлек.`,
          promotional: `РАСКРЫТО: Секрет ИИ-маркетинга, который крупные агентства не хотят, чтобы вы знали\n\nУзнайте, как наша запатентованная система ИИ помогает бизнесу, такому как ваш, достичь на 80% большей эффективности маркетинга при одновременном сокращении расходов вдвое. Доступно ограниченное количество мест в нашей эксклюзивной бета-программе!`
        }
      };
      
      setGeneratedContent(platformContent[platform as keyof typeof platformContent][style as keyof typeof platformContent.twitter]);
      setIsGenerating(false);
      
      toast({
        title: "Контент сгенерирован",
        description: "Ваш контент был успешно сгенерирован.",
      });
    }, 1500);
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
