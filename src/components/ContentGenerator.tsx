import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Sparkles, RefreshCw, Wand } from "lucide-react";
import { useToast } from "./ui/use-toast";
import externalAPIService from "@/services/external-api";
import { getActivePlatforms } from "@/constants/platforms";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type ContentType = "post" | "story" | "caption" | "thread" | "comment" | "bio";

const CONTENT_TYPE_OPTIONS: { value: ContentType; label: string }[] = [
  { value: "post", label: "Пост" },
  { value: "story", label: "История" },
  { value: "caption", label: "Подпись к фото" },
  { value: "thread", label: "Тред" },
  { value: "comment", label: "Комментарий" },
  { value: "bio", label: "Биография профиля" },
];

const TONE_OPTIONS = [
  { value: "professional", label: "Профессиональный" },
  { value: "friendly", label: "Дружелюбный" },
  { value: "casual", label: "Повседневный" },
  { value: "humorous", label: "Юмористический" },
  { value: "inspirational", label: "Вдохновляющий" },
  { value: "educational", label: "Образовательный" },
];

const SUGGESTED_TOPICS = [
  "Новый запуск продукта",
  "Отзывы клиентов",
  "Советы и лайфхаки",
  "Закулисье компании",
  "Мероприятия и события",
  "Новости индустрии",
  "Ответы на частые вопросы",
  "Истории успеха",
];

export function ContentGenerator() {
  const [platform, setPlatform] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>("post");
  const [tone, setTone] = useState("friendly");
  const [isLoading, setIsLoading] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<Array<{
    title: string;
    content: string;
    platform: string;
    timestamp: Date;
  }>>([]);
  const { toast } = useToast();
  const activePlatforms = getActivePlatforms();

  const generateContent = async () => {
    setIsLoading(true);
    try {
      const prompt = `Создай ${CONTENT_TYPE_OPTIONS.find(ct => ct.value === contentType)?.label.toLowerCase() || 'пост'} 
      для ${platform || 'социальной сети'} на тему "${topic || 'интересные факты'}". 
      Тон: ${TONE_OPTIONS.find(t => t.value === tone)?.label.toLowerCase() || 'дружелюбный'}.`;
      
      const response = await externalAPIService.sendToOpenRouter(prompt);

      if (response && response.choices && response.choices.length > 0) {
        const generatedContent = response.choices[0].message.content;
        setContent(generatedContent);
        
        // Add to history
        setGenerationHistory(prev => [
          {
            title: topic || "Контент без названия",
            content: generatedContent,
            platform: platform,
            timestamp: new Date()
          },
          ...prev.slice(0, 9) // Keep only 10 most recent
        ]);

        toast({
          title: "Контент сгенерирован",
          description: "Новый контент был успешно сгенерирован.",
        });
      } else {
        toast({
          title: "Генерация не удалась",
          description: "Не удалось сгенерировать контент. Пожалуйста, попробуйте снова.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ошибка при генерации контента:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при генерации контента.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestContent = () => {
    const randomTopic = SUGGESTED_TOPICS[Math.floor(Math.random() * SUGGESTED_TOPICS.length)];
    setTopic(randomTopic);
    toast({
      title: "Предложена тема",
      description: `Тема "${randomTopic}" добавлена в поле ввода.`,
    });
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    
    if (minutes < 1) return "Только что";
    if (minutes < 60) return `${minutes} минут назад`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} часов назад`;
    
    const days = Math.floor(hours / 24);
    return `${days} дней назад`;
  };

  const loadFromHistory = (historyItem: typeof generationHistory[0]) => {
    setPlatform(historyItem.platform);
    setTopic(historyItem.title);
    setContent(historyItem.content);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-secondary" />
          Генератор контента ИИ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="platform" className="space-y-4">
          <TabsList>
            <TabsTrigger value="platform">Платформа</TabsTrigger>
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="advanced">Расширенные настройки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="platform" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Платформа</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Выберите платформу" />
                </SelectTrigger>
                <SelectContent>
                  {activePlatforms.map(platform => (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center gap-2">
                        <platform.icon className="h-4 w-4" />
                        <span>{platform.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contentType">Тип контента</Label>
              <Select value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
                <SelectTrigger id="contentType">
                  <SelectValue placeholder="Выберите тип контента" />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="space-y-2 flex-1">
                <Label htmlFor="topic">Тема</Label>
                <Input
                  id="topic"
                  placeholder="Введите тему"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="mt-8"
                onClick={suggestContent}
              >
                <Wand className="mr-2 h-4 w-4" />
                Предложить
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tone">Тональность</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Выберите тональность" />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Ключевые слова (опционально)</Label>
              <Input
                id="keywords"
                placeholder="Введите ключевые слова через запятую"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Целевая аудитория (опционально)</Label>
              <Input
                id="audience"
                placeholder="Опишите вашу целевую аудиторию"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="callToAction">Призыв к действию (опционально)</Label>
              <Input
                id="callToAction"
                placeholder="Например: Подпишись, Купи сейчас, Узнай больше"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-2">
          <Label htmlFor="content">Сгенерированный контент</Label>
          <Textarea
            id="content"
            placeholder="Сгенерированный контент появится здесь"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] resize-none"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={generateContent}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Генерация...
            </>
          ) : (
            "Сгенерировать контент"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
