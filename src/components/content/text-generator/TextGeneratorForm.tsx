
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RefreshCw, Wand, Share } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ContentType, CONTENT_TYPE_OPTIONS, TONE_OPTIONS } from "./constants";
import { getActivePlatforms } from "@/constants/platforms";

interface TextGeneratorFormProps {
  platform: string;
  setPlatform: (platform: string) => void;
  topic: string;
  setTopic: (topic: string) => void;
  content: string;
  setContent: (content: string) => void;
  contentType: ContentType;
  setContentType: (contentType: ContentType) => void;
  tone: string;
  setTone: (tone: string) => void;
  generateContent: () => Promise<void>;
  isLoading: boolean;
  apiStatus: {
    hasApiKey: boolean;
    isValid: boolean | null;
    isOfflineMode: boolean;
  };
  onIntegrateContent: () => void;
}

export function TextGeneratorForm({
  platform,
  setPlatform,
  topic,
  setTopic,
  content,
  setContent,
  contentType,
  setContentType,
  tone,
  setTone,
  generateContent,
  isLoading,
  apiStatus,
  onIntegrateContent,
}: TextGeneratorFormProps) {
  const navigate = useNavigate();
  const activePlatforms = getActivePlatforms();

  const suggestContent = () => {
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
    
    const randomTopic = SUGGESTED_TOPICS[Math.floor(Math.random() * SUGGESTED_TOPICS.length)];
    setTopic(randomTopic);
    toast({
      description: `Тема "${randomTopic}" добавлена в поле ввода.`,
    });
  };

  return (
    <div className="space-y-4">
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

      <div className="flex flex-wrap gap-2">
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
            onClick={onIntegrateContent}
            className="flex-none"
          >
            <Share className="mr-2 h-4 w-4" />
            Добавить в кампанию
          </Button>
        )}
      </div>
    </div>
  );
}
