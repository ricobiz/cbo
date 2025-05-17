
import { ContentGenerator } from "@/components/ContentGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Image, Music, Video, Calendar, Globe, Users } from "lucide-react";

const ContentPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Генератор контента</h1>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
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
          <Card>
            <CardHeader>
              <CardTitle>Генерация изображений</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">Скоро! Возможности генерации изображений будут доступны в ближайшем обновлении.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio">
          <Card>
            <CardHeader>
              <CardTitle>Генерация аудио</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">Скоро! Возможности генерации аудио будут доступны в ближайшем обновлении.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video">
          <Card>
            <CardHeader>
              <CardTitle>Генерация видео</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">Скоро! Возможности генерации видео будут доступны в ближайшем обновлении.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Расписание контента</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">Скоро! Возможности планирования контента будут доступны в ближайшем обновлении.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Мультиплатформенная публикация</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <p className="text-muted-foreground">Скоро! Возможность одновременной публикации во все социальные сети.</p>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4 w-full max-w-2xl">
                  {["telegram", "vk", "facebook", "instagram", "twitter", "linkedin", "tiktok", "youtube"].map((platform) => (
                    <div key={platform} className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium capitalize">{platform.slice(0, 2)}</span>
                      </div>
                      <span className="text-xs mt-1 capitalize">{platform}</span>
                    </div>
                  ))}
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
              <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">Скоро! Генерация контента для веб-сайтов, блогов, лендингов и других онлайн-платформ.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentPage;
