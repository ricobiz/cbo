
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ArrowRight } from "lucide-react";
import { useState } from "react";

interface CommandExample {
  title: string;
  command: string;
  description: string;
}

export function CommandExamples() {
  const [examples] = useState<CommandExample[]>([
    {
      title: "Прокачка Spotify",
      command: "Прокачай мой трек на Spotify до 1000 прослушиваний",
      description: "Создаст нескольких ботов для прослушиваний трека на Spotify"
    },
    {
      title: "YouTube просмотры",
      command: "Набери 500 просмотров для моего видео на YouTube",
      description: "Настроит ботов для увеличения просмотров на YouTube"
    },
    {
      title: "Instagram аудитория",
      command: "Добавь 200 подписчиков в Instagram",
      description: "Запустит ботов для подписки на ваш аккаунт"
    },
    {
      title: "Комментарии на видео",
      command: "Создай 50 комментариев к моему YouTube видео",
      description: "Сгенерирует уникальные комментарии для вашего контента"
    },
    {
      title: "Контент-план",
      command: "Создай контент-план для Instagram на неделю",
      description: "Составит план публикаций и сгенерирует контент"
    }
  ]);
  
  // Функция для выбора примера - теперь реально отправляет команду
  const selectExample = (command: string) => {
    console.log("Selected command example:", command);
    // Отправляем команду через событие
    const event = new CustomEvent('ai-command-selected', { 
      detail: { command } 
    });
    document.dispatchEvent(event);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <CardTitle>Примеры команд</CardTitle>
        </div>
        <CardDescription>
          Нажмите на пример, чтобы использовать его
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {examples.map((example, index) => (
          <div 
            key={index}
            className="border rounded-md p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
            onClick={() => selectExample(example.command)}
          >
            <div className="font-medium">{example.title}</div>
            <div className="text-sm text-muted-foreground">{example.description}</div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <ArrowRight className="h-3 w-3" />
              <span className="text-primary font-medium">{example.command}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
