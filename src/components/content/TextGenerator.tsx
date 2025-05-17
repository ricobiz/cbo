import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sparkles, RefreshCw, Wand, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import externalAPIService from "@/services/external-api";
import { getActivePlatforms } from "@/constants/platforms";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignIntegrator } from "../integration/CampaignIntegrator";

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

export function TextGenerator() {
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
  const [isIntegratorOpen, setIsIntegratorOpen] = useState(false);
  const { toast } = useToast();
  const activePlatforms = getActivePlatforms();

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('textGenerationHistory');
      if (storedHistory) {
        setGenerationHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Error loading history from localStorage:", error);
    }
  }, []);

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
        
        const newHistoryItem = {
          title: topic || "Контент без названия",
          content: generatedContent,
          platform: platform,
          timestamp: new Date()
        };
        
        // Add to history
        const newHistory = [newHistoryItem, ...generationHistory.slice(0, 9)];
        setGenerationHistory(newHistory);
        
        // Save to localStorage
        try {
          localStorage.setItem('textGenerationHistory', JSON.stringify(newHistory));
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              Генератор текстового контента ИИ
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
          <CardFooter className="flex flex-wrap gap-2">
            <Button
              className="flex-1"
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
            
            {content && (
              <Button 
                variant="outline" 
                onClick={() => setIsIntegratorOpen(true)}
                className="flex-none"
              >
                <Share className="mr-2 h-4 w-4" />
                Добавить в кампанию
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>История</CardTitle>
          </CardHeader>
          <CardContent>
            {generationHistory.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                У вас пока нет сгенерированного контента
              </div>
            ) : (
              <div className="space-y-4">
                {generationHistory.map((item, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer"
                    onClick={() => loadFromHistory(item)}
                  >
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Сгенерировано {formatTimeAgo(new Date(item.timestamp))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Campaign Integration Dialog */}
      <CampaignIntegrator
        contentType="text"
        content={content}
        platform={platform}
        isOpen={isIntegratorOpen}
        onClose={() => setIsIntegratorOpen(false)}
      />
    </div>
  );
}
