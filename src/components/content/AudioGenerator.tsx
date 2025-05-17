import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RefreshCw, Music, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InteractiveHint } from "@/components/ui/interactive-hint";
import { AudioGenerationParams } from "@/services/external-api/types";
import { externalAPIService } from "@/services/external-api";
import { CampaignIntegrator } from "../integration/CampaignIntegrator";

export function AudioGenerator() {
  const [audioText, setAudioText] = useState("");
  const [audioVoice, setAudioVoice] = useState("female");
  const [audioSpeed, setAudioSpeed] = useState("1.0");
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [isIntegratorOpen, setIsIntegratorOpen] = useState(false);
  const { toast } = useToast();

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
      const params: AudioGenerationParams = {
        text: audioText,
        voice: audioVoice,
        speed: parseFloat(audioSpeed),
        format: "mp3"
      };
      
      const response = await externalAPIService.generateAudio(params);
      
      if (response && response.url) {
        setGeneratedAudioUrl(response.url);
        
        toast({
          title: "Аудио сгенерировано",
          description: "Аудиозапись успешно создана на основе вашего текста"
        });
      } else {
        toast({
          title: "Ошибка генерации",
          description: "Не удалось сгенерировать аудио. Пожалуйста, попробуйте снова.",
          variant: "destructive"
        });
      }
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

  return (
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
            
            <div className="grid grid-cols-2 gap-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="audioSpeed">Скорость речи</Label>
                <Select value={audioSpeed} onValueChange={setAudioSpeed}>
                  <SelectTrigger id="audioSpeed">
                    <SelectValue placeholder="Выберите скорость" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.8">Медленно</SelectItem>
                    <SelectItem value="1.0">Обычная</SelectItem>
                    <SelectItem value="1.2">Быстрее</SelectItem>
                    <SelectItem value="1.5">Очень быстро</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            
            <div className="flex flex-wrap gap-2">
              <Button
                className="flex-1"
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
              
              {generatedAudioUrl && (
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
      
      {/* Campaign Integration Dialog */}
      <CampaignIntegrator
        contentType="audio"
        content={audioText}
        mediaUrl={generatedAudioUrl || undefined}
        platform="spotify" // Default to Spotify for audio
        isOpen={isIntegratorOpen}
        onClose={() => setIsIntegratorOpen(false)}
      />
    </div>
  );
}
