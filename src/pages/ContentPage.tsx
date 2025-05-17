import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentGenerator } from "@/components/ContentGenerator";
import { ImageGenerator } from "@/components/content/ImageGenerator";
import { AudioGenerator } from "@/components/content/AudioGenerator";
import { TextGenerator } from "@/components/content/TextGenerator";
import { Sparkles, Image, MessageSquareText, Music, Upload, FileText, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import externalAPIService from "@/services/external-api";

// Типы для генерации изображений
type ImageGenerationSize = "512x512" | "1024x1024" | "1024x1792" | "1792x1024";
type ImageStyle = "photographic" | "digital-art" | "cartoon" | "3d-render" | "pixel-art";

const ContentPage = () => {
  // Состояние для текущего активного таба
  const [activeTab, setActiveTab] = useState("text");
  const { toast } = useToast();
  const activePlatforms = getActivePlatforms();

  // Состояние для генерации изображений
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStyle, setImageStyle] = useState<ImageStyle>("photographic");
  const [imageSize, setImageSize] = useState<ImageGenerationSize>("1024x1024");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // Состояние для генерации аудио
  const [audioText, setAudioText] = useState("");
  const [audioVoice, setAudioVoice] = useState("female");
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);

  // Состояние для планирования контента
  const [scheduledPosts, setScheduledPosts] = useState<Array<{
    id: string;
    platform: string;
    content: string;
    scheduledDate: string;
    status: "pending" | "published" | "failed";
  }>>([
    {
      id: "1",
      platform: "instagram",
      content: "Демо-пост: Новый сезон - новые возможности! #мотивация #рост",
      scheduledDate: "2025-05-20T10:00",
      status: "pending"
    },
    {
      id: "2",
      platform: "youtube",
      content: "Демо: 10 советов по использованию нашего нового инструмента",
      scheduledDate: "2025-05-22T15:30",
      status: "pending"
    }
  ]);

  // Генерация изображения
  const handleImageGeneration = async () => {
    if (!imagePrompt) {
      toast({
        title: "Требуется описание",
        description: "Пожалуйста, введите описание для генерации изображения",
        variant: "destructive"
      });
      return;
    }

    setGeneratingImage(true);
    setGeneratedImageUrl(null);

    try {
      // Здесь будет интеграция с реальным API для генерации изображений
      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Заглушка для демонстрации функциональности
      const demoImages = [
        "https://images.unsplash.com/photo-1682686580186-b55d2a91053c?q=80&w=1075&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1170&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1682686580849-3e7b69b86c0e?q=80&w=1170&auto=format&fit=crop"
      ];
      
      const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
      setGeneratedImageUrl(randomImage);
      
      toast({
        title: "Изображение сгенерировано",
        description: "Изображение успешно создано на основе вашего описания"
      });
    } catch (error) {
      console.error("Ошибка при генерации изображения:", error);
      toast({
        title: "Ошибка генерации",
        description: "Не удалось сгенерировать изображение. Пожалуйста, попробуйте снова.",
        variant: "destructive"
      });
    } finally {
      setGeneratingImage(false);
    }
  };
  
  // Генерация аудио
  const handleAudioGeneration = async () => {
    if (!audioText) {
      toast({
        title: "Требуется текст",
        description: "Пожалуйста, введите текст для генерации аудио",
        variant: "destructive"
      });
      return;
    }

    setGeneratingAudio(true);
    setGeneratedAudioUrl(null);

    try {
      // Здесь будет интеграция с реальным API для генерации аудио
      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Заглушка для демонстрации функциональности
      setGeneratedAudioUrl("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
      
      toast({
        title: "Аудио сгенерировано",
        description: "Аудиозапись успешно создана на основе вашего текста"
      });
    } catch (error) {
      console.error("Ошибка при генерации аудио:", error);
      toast({
        title: "Ошибка генерации",
        description: "Не удалось сгенерировать аудио. Пожалуйста, попробуйте снова.",
        variant: "destructive"
      });
    } finally {
      setGeneratingAudio(false);
    }
  };

  // Планирование нового поста
  const scheduleNewPost = () => {
    const newPost = {
      id: Date.now().toString(),
      platform: activePlatforms[Math.floor(Math.random() * activePlatforms.length)].id,
      content: "Новый запланированный пост для вашей аудитории.",
      scheduledDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // +1 день
      status: "pending" as const
    };
    
    setScheduledPosts([...scheduledPosts, newPost]);
    
    toast({
      title: "Пост добавлен в расписание",
      description: `Пост запланирован на ${new Date(newPost.scheduledDate).toLocaleString()}`
    });
  };
  
  // Удаление запланированного поста
  const removeScheduledPost = (id: string) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id));
    
    toast({
      title: "Пост удален из расписания",
      description: "Запланированный пост был успешно удален"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Генератор ��онтента</h1>
        
        <Button variant="outline" onClick={() => {
          const randomTab = ["text", "image", "audio", "video", "schedule"][
            Math.floor(Math.random() * 5)
          ];
          setActiveTab(randomTab);
          toast({
            title: "ИИ рекомендует",
            description: `Попробуйте создать ${
              randomTab === "text" ? "текстовый контент" :
              randomTab === "image" ? "изображение" :
              randomTab === "audio" ? "аудиозапись" :
              randomTab === "video" ? "видеоролик" : "расписание публикаций"
            } для вашей следующей кампании.`
          });
        }}>
          <Wand className="h-4 w-4 mr-2" />
          ИИ рекомендация
        </Button>
      </div>

      <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4" />
            <span>Текст</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            <span>Изображение</span>
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span>Аудио</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Видео</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Расписание</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Соцсети</span>
          </TabsTrigger>
          <TabsTrigger value="web" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Веб</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ContentGenerator />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>История</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                      <div className="text-sm font-medium">Заголовок для YouTube видео</div>
                      <div className="text-xs text-muted-foreground mt-1">Сгенерировано 2 часа назад</div>
                    </div>
                    <div className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                      <div className="text-sm font-medium">Тред в Twitter про ИИ маркетинг</div>
                      <div className="text-xs text-muted-foreground mt-1">Сгенерировано вчера</div>
                    </div>
                    <div className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                      <div className="text-sm font-medium">Подписи для Instagram для запуска продукта</div>
                      <div className="text-xs text-muted-foreground mt-1">Сгенерировано 3 дня назад</div>
                    </div>
                    <div className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                      <div className="text-sm font-medium">Пост в Telegram канал про новые технологии</div>
                      <div className="text-xs text-muted-foreground mt-1">Сгенерировано 4 дня назад</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="image">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-secondary" />
                    Генератор изображений ИИ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="imagePrompt">Описание изображения</Label>
                    <Textarea
                      id="imagePrompt"
                      placeholder="Опишите желаемое изображение детально..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imageStyle">Стиль изображения</Label>
                      <Select 
                        value={imageStyle} 
                        onValueChange={(value) => setImageStyle(value as ImageStyle)}
                      >
                        <SelectTrigger id="imageStyle">
                          <SelectValue placeholder="Выберите стиль" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="photographic">Фотореалистичный</SelectItem>
                          <SelectItem value="digital-art">Цифровое искусство</SelectItem>
                          <SelectItem value="cartoon">Мультяшный</SelectItem>
                          <SelectItem value="3d-render">3D рендер</SelectItem>
                          <SelectItem value="pixel-art">Пиксельное искусство</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="imageSize">Размер изображения</Label>
                      <Select 
                        value={imageSize} 
                        onValueChange={(value) => setImageSize(value as ImageGenerationSize)}
                      >
                        <SelectTrigger id="imageSize">
                          <SelectValue placeholder="Выберите размер" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="512x512">Маленький (512x512)</SelectItem>
                          <SelectItem value="1024x1024">Средний (1024x1024)</SelectItem>
                          <SelectItem value="1024x1792">Вертикальный (1024x1792)</SelectItem>
                          <SelectItem value="1792x1024">Горизонтальный (1792x1024)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {generatedImageUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Результат</p>
                      <div className="relative aspect-square max-h-[400px] overflow-hidden rounded-md border">
                        <img 
                          src={generatedImageUrl} 
                          alt="Сгенерированное изображение" 
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                  
                  <Button
                    className="w-full"
                    onClick={handleImageGeneration}
                    disabled={generatingImage}
                  >
                    {generatingImage ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Генерация изображения...
                      </>
                    ) : (
                      "Сгенерировать изображение"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>История изображений</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img 
                          src="https://images.unsplash.com/photo-1682686580186-b55d2a91053c?q=80&w=1075&auto=format&fit=crop" 
                          alt="История изображений" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <div className="text-sm font-medium">Закат на пляже</div>
                        <div className="text-xs text-muted-foreground">Сгенерировано вчера</div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img 
                          src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1170&auto=format&fit=crop" 
                          alt="История изображений" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <div className="text-sm font-medium">Горный пейзаж</div>
                        <div className="text-xs text-muted-foreground">Сгенерировано 3 дня назад</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="audio">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="h-5 w-5 text-secondary" />
                    Генератор аудио ИИ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="audioText">Текст для озвучивания</Label>
                    <Textarea
                      id="audioText"
                      placeholder="Введите текст для преобразования в аудио..."
                      value={audioText}
                      onChange={(e) => setAudioText(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="audioVoice">Голос</Label>
                    <Select value={audioVoice} onValueChange={setAudioVoice}>
                      <SelectTrigger id="audioVoice">
                        <SelectValue placeholder="Выберите голос" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Женский</SelectItem>
                        <SelectItem value="male">Мужской</SelectItem>
                        <SelectItem value="neutral">Нейтральный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {generatedAudioUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Результат</p>
                      <audio controls className="w-full">
                        <source src={generatedAudioUrl} type="audio/mpeg" />
                        Ваш браузер не поддерживает аудио элемент.
                      </audio>
                    </div>
                  )}
                  
                  <Button
                    className="w-full"
                    onClick={handleAudioGeneration}
                    disabled={generatingAudio}
                  >
                    {generatingAudio ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Генерация аудио...
                      </>
                    ) : (
                      "Сгенерировать аудио"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Подсказки для аудио</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <InteractiveHint
                      title="Советы для качественного аудио"
                      description="Для лучших результатов используйте короткие, четкие предложения и избегайте сложных терминов."
                    >
                      <div className="text-sm">
                        <p className="font-medium">Как создать качественное аудио:</p>
                        <ul className="list-disc pl-4 mt-2 text-muted-foreground">
                          <li>Используйте простые предложения</li>
                          <li>Избегайте специальных символов</li>
                          <li>Добавляйте паузы (запятые, точки)</li>
                          <li>Оптимально 100-150 слов за раз</li>
                        </ul>
                      </div>
                    </InteractiveHint>
                    
                    <div className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                      <div className="text-sm font-medium">Шаблон для презентации продукта</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Нажмите, чтобы использовать готовый шаблон текста
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                      <div className="text-sm font-medium">Шаблон для обучающего материала</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Нажмите, чтобы использовать готовый шаблон текста
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-secondary" />
                Генерация видео контента
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-12 space-y-6">
                <Image className="h-16 w-16 text-muted-foreground" />
                <div className="text-center max-w-md">
                  <h3 className="text-lg font-medium">Генерация видео скоро будет доступна</h3>
                  <p className="text-muted-foreground mt-2">
                    Функция создания видеороликов с помощью ИИ находится в финальной стадии разработки.
                    Вы сможете создавать профессиональные видеоролики на основе текстовых подсказок.
                  </p>
                </div>
                <Button variant="outline" disabled>
                  <Wand className="h-4 w-4 mr-2" />
                  Создать видео
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-secondary" />
                    Планирование контента
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={scheduleNewPost}>
                    + Запланировать
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scheduledPosts.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        У вас пока нет запланированных публикаций
                      </p>
                    ) : (
                      scheduledPosts.map(post => (
                        <div key={post.id} className="border rounded-lg p-4 relative">
                          <div className="absolute top-3 right-3 flex gap-2">
                            <Badge variant={
                              post.status === "published" ? "default" : 
                              post.status === "pending" ? "secondary" : "destructive"
                            }>
                              {post.status === "published" ? "Опубликовано" : 
                               post.status === "pending" ? "Ожидает публикации" : "Ошибка"}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            {post.platform === "instagram" && <MessageSquareText className="h-4 w-4" />}
                            {post.platform === "youtube" && <Video className="h-4 w-4" />}
                            <span className="font-medium capitalize">{post.platform}</span>
                          </div>
                          
                          <p className="text-sm mb-3">{post.content}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              Запланировано: {new Date(post.scheduledDate).toLocaleString()}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">Изменить</Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeScheduledPost(post.id)}
                                className="text-destructive"
                              >
                                Удалить
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <InteractiveHint
                title="Планирование контента"
                description="Оптимизируйте свою стратегию контента с помощью ИИ-рекомендаций по расписанию"
                className="mb-6"
                highlightLevel="medium"
              >
                <div className="text-sm space-y-2 px-2">
                  <p className="font-medium">Советы по планированию:</p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Публикуйте в Instagram между 11:00 и 13:00</li>
                    <li>Лучшее время для YouTube - выходные в 15:00-18:00</li>
                    <li>Согласуйте контент с важными датами и событиями</li>
                  </ul>
                </div>
              </InteractiveHint>
              
              <Card>
                <CardHeader>
                  <CardTitle>Предстоящие события</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-medium">Международный день контент-маркетинга</div>
                        <Badge>28 мая</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Повод для тематических публикаций
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-medium">Начало летнего сезона</div>
                        <Badge>1 июня</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Сезонный контент, скидки и специальные предложения
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="social">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Мультиплатформенная публикация</CardTitle>
              <Button variant="outline" size="sm" disabled>Настроить</Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 space-y-6">
                <div className="grid grid-cols-4 md:grid-cols-4 gap-6 w-full max-w-3xl">
                  {activePlatforms.map((platform) => (
                    <div key={platform.id} className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <platform.icon className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <span className="text-xs mt-2 capitalize">{platform.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-center max-w-lg">
                  <p className="text-muted-foreground">
                    Подключите свои аккаунты в социальных сетях и публикуйте контент
                    во все платформы одновременно с настраиваемыми параметрами для каждой платформы.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="web">
          <Card>
            <CardHeader>
              <CardTitle>Веб-контент</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-12 space-y-6">
                <Globe className="h-16 w-16 text-muted-foreground" />
                <div className="text-center max-w-md">
                  <h3 className="text-lg font-medium">Скоро: Генерация веб-контента</h3>
                  <p className="text-muted-foreground mt-2">
                    Функция создания готовых HTML блоков, SEO-оптимизированных статей 
                    и лендингов будет доступна в следующем обновлении.
                  </p>
                </div>
                <Button variant="outline" disabled>
                  <Wand className="h-4 w-4 mr-2" />
                  Создать веб-контент
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentPage;
