import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RefreshCw, Image, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageGenerationService } from "@/services/external-api/ImageGenerationService";
import { ImageGenerationParams, ImageGenerationResult } from "@/services/external-api/types";
import { CampaignIntegrator } from "../integration/CampaignIntegrator";

type ImageGenerationSize = "512x512" | "1024x1024" | "1024x1792" | "1792x1024";
type ImageStyle = "photographic" | "digital-art" | "cartoon" | "3d-render" | "pixel-art";

export function ImageGenerator() {
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStyle, setImageStyle] = useState<ImageStyle>("photographic");
  const [imageSize, setImageSize] = useState<ImageGenerationSize>("1024x1024");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isIntegratorOpen, setIsIntegratorOpen] = useState(false);
  const { toast } = useToast();

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

  return (
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
                <div className="relative max-h-[400px] overflow-hidden rounded-md border">
                  <img 
                    src={generatedImageUrl} 
                    alt="Сгенерированное изображение" 
                    className="object-contain w-full h-full max-h-[400px]"
                  />
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              <Button
                className="flex-1"
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
              
              {generatedImageUrl && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsIntegratorOpen(true)}
                  className="flex-none"
                >
                  <Share className="mr-2 h-4 w-4" />
                  Добавить в кампанию
                </Button>
              )}
            </div>
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
      
      {/* Campaign Integration Dialog */}
      <CampaignIntegrator
        contentType="image"
        content={imagePrompt}
        mediaUrl={generatedImageUrl || undefined}
        platform="instagram" // Default to Instagram for images
        isOpen={isIntegratorOpen}
        onClose={() => setIsIntegratorOpen(false)}
      />
    </div>
  );
}
