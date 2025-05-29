
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextGenerator } from "@/components/content/text-generator/TextGenerator";
import { ImageGenerator } from "@/components/content/image-generator/ImageGenerator";
import { AudioGenerator } from "@/components/content/audio-generator/AudioGenerator";
import { BotConnectionTester } from "@/components/bots/BotConnectionTester";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Image, Music, Bot } from "lucide-react";

const ContentPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Генерация контента</h1>
        <p className="text-muted-foreground">
          Создавайте текст, изображения и аудио с помощью ИИ
        </p>
      </div>

      <Tabs defaultValue="text" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Текст
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Изображения
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Аудио
          </TabsTrigger>
          <TabsTrigger value="bots" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Тест ботов
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <TextGenerator />
        </TabsContent>

        <TabsContent value="image">
          <ImageGenerator />
        </TabsContent>

        <TabsContent value="audio">
          <AudioGenerator />
        </TabsContent>

        <TabsContent value="bots">
          <BotConnectionTester />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentPage;
