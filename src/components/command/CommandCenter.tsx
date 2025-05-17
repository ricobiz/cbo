
import { useState, useCallback, useEffect } from "react";
import { Bot, Send, Sparkles, X, Clock, Monitor, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { processAICommand } from "@/services/AICommandService";
import { BotType } from "@/services/BotService";
import { CommandListener } from "./CommandListener";
import { externalAPIService } from "@/services/ExternalAPIService";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function CommandCenter() {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Привет! Я ваш ИИ-помощник. Опишите задачу, которую нужно выполнить, например: «Прокачай аккаунт Spotify на 1000 прослушиваний» или «Создай контент для моего Instagram на неделю».",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check API integration status
  const [hasOpenRouter, setHasOpenRouter] = useState(false);
  const [hasBrowserUse, setHasBrowserUse] = useState(false);
  
  useEffect(() => {
    // Check API status on component mount
    setHasOpenRouter(externalAPIService.hasOpenRouterApiKey());
    setHasBrowserUse(externalAPIService.hasBrowserUseApiKey());
  }, []);

  const processCommand = async (commandText: string) => {
    if (!commandText.trim() || isProcessing) return;
    
    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage: Message = {
      id: userMessageId,
      content: commandText,
      role: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCommand("");
    setIsProcessing(true);
    
    try {
      // Process the command
      const result = await processAICommand(commandText);
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.message,
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Show notification about created tasks
      if (result.success) {
        toast({
          title: "Задача создана",
          description: `${result.botsCreated} ботов настроено для выполнения вашей задачи.`,
          variant: "default"
        });
      } else {
        toast({
          title: "Не удалось создать задачу",
          description: "Пожалуйста, уточните запрос или проверьте настройки системы.",
          variant: "destructive"
        });
      }
    } catch (error) {
      // Handle error
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.",
        role: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Ошибка",
        description: "Не удалось обработать команду. Пожалуйста, попробуйте еще раз.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processCommand(command);
  };
  
  const handleCommandSelected = useCallback((selectedCommand: string) => {
    processCommand(selectedCommand);
  }, []);
  
  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-new",
        content: "История разговора очищена. Чем я могу помочь?",
        role: "assistant",
        timestamp: new Date()
      }
    ]);
  };
  
  const handleConfigureAPIs = () => {
    navigate("/settings");
    toast({
      title: "Настройки API",
      description: "Перейдите во вкладку 'API Integration' для настройки внешних API.",
      variant: "default"
    });
  };

  return (
    <>
      <CommandListener onCommandSelected={handleCommandSelected} />
      <div className="flex flex-col h-full max-h-[700px]">
        <Card className="flex flex-col h-full">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>ИИ-командный центр</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClearChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription className="flex flex-col gap-2">
              <div>
                Опишите задачу естественным языком и система автоматически настроит ботов для её выполнения
              </div>
              
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant={hasOpenRouter ? "default" : "outline"} className="flex gap-1 items-center">
                  <Info className="h-3 w-3" /> 
                  OpenRouter API: {hasOpenRouter ? "Подключен" : "Не подключен"}
                </Badge>
                <Badge variant={hasBrowserUse ? "default" : "outline"} className="flex gap-1 items-center">
                  <Monitor className="h-3 w-3" /> 
                  Browser Use API: {hasBrowserUse ? "Подключен" : "Не подключен"}
                </Badge>
                
                {(!hasOpenRouter || !hasBrowserUse) && (
                  <Button variant="outline" size="sm" onClick={handleConfigureAPIs} className="ml-auto">
                    Настроить API
                  </Button>
                )}
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-grow pb-0 overflow-hidden">
            <ScrollArea className="h-[400px] pr-4">
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[80%] px-4 py-3 rounded-lg ${
                        message.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                      }`}
                    >
                      {message.content}
                      <div className="text-xs mt-1 opacity-70 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] px-4 py-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-2">
                        <span className="animate-pulse">Анализирую запрос</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="pt-4">
            <form onSubmit={handleSubmit} className="w-full flex gap-2">
              <Input
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Опишите задачу для выполнения..."
                disabled={isProcessing}
                className="flex-grow"
              />
              <Button type="submit" disabled={!command.trim() || isProcessing}>
                <Send className="h-4 w-4 mr-1" />
                Отправить
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
