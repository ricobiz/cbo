
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import externalAPIService from "@/services/external-api";
import { ContentType } from "./constants";

export function useTextGenerator() {
  const [platform, setPlatform] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>("post");
  const [tone, setTone] = useState("friendly");
  const [isLoading, setIsLoading] = useState(false);
  const [isIntegratorOpen, setIsIntegratorOpen] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<Array<{
    title: string;
    content: string;
    platform: string;
    timestamp: Date;
  }>>([]);
  const [apiStatus, setApiStatus] = useState<{
    hasApiKey: boolean;
    isValid: boolean | null;
    isOfflineMode: boolean;
  }>({
    hasApiKey: false,
    isValid: null,
    isOfflineMode: true,
  });
  
  const navigate = useNavigate();

  // Load history from localStorage on component mount and check API status
  useEffect(() => {
    // Load generation history
    try {
      const storedHistory = localStorage.getItem('textGenerationHistory');
      if (storedHistory) {
        setGenerationHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Error loading history from localStorage:", error);
    }

    // Check API key status
    checkApiStatus();
  }, []);

  // Function to check API key status
  const checkApiStatus = () => {
    setApiStatus({
      hasApiKey: externalAPIService.hasOpenRouterApiKey(),
      isValid: externalAPIService.getOpenRouterApiKeyValidationStatus(),
      isOfflineMode: externalAPIService.isOfflineMode()
    });
  };

  const generateContent = async () => {
    // Check if we have a valid API key
    if (!apiStatus.hasApiKey || apiStatus.isValid === false) {
      toast.error("Требуется действительный API ключ OpenRouter", {
        description: "Добавьте ключ в настройках API",
        action: {
          label: "Настройки",
          onClick: () => navigate("/settings")
        }
      });
      return;
    }

    // Check if we're in offline mode
    if (apiStatus.isOfflineMode) {
      toast.warning("Приложение работает в оффлайн режиме", {
        description: "Будут использованы заглушки вместо реального API",
        action: {
          label: "Переключить",
          onClick: () => {
            externalAPIService.setOfflineMode(false);
            checkApiStatus();
            toast.success("Оффлайн режим отключен");
          }
        }
      });
    }

    setIsLoading(true);
    try {
      const CONTENT_TYPE_LABELS = {
        post: "пост",
        story: "история", 
        caption: "подпись к фото", 
        thread: "тред", 
        comment: "комментарий", 
        bio: "биография профиля"
      };
      
      const TONE_LABELS = {
        professional: "профессиональный",
        friendly: "дружелюбный",
        casual: "повседневный", 
        humorous: "юмористический", 
        inspirational: "вдохновляющий", 
        educational: "образовательный"
      };
      
      const prompt = `Создай ${CONTENT_TYPE_LABELS[contentType] || 'пост'} 
      для ${platform || 'социальной сети'} на тему "${topic || 'интересные факты'}". 
      Тон: ${TONE_LABELS[tone as keyof typeof TONE_LABELS] || 'дружелюбный'}.`;
      
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

        toast.success("Контент сгенерирован", {
          description: "Новый контент был успешно сгенерирован.",
        });
        
        // Update API status after successful generation
        checkApiStatus();
      } else {
        toast.error("Генерация не удалась", {
          description: "Не удалось сгенерировать контент. Пожалуйста, попробуйте снова.",
        });
      }
    } catch (error) {
      console.error("Ошибка при генерации контента:", error);
      toast.error("Ошибка", {
        description: "Произошла ошибка при генерации контента.",
      });
      
      // Update API status
      checkApiStatus();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (historyItem: typeof generationHistory[0]) => {
    setPlatform(historyItem.platform);
    setTopic(historyItem.title);
    setContent(historyItem.content);
  };

  return {
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
    isLoading,
    generationHistory,
    apiStatus,
    isIntegratorOpen,
    setIsIntegratorOpen,
    generateContent,
    loadFromHistory,
    checkApiStatus
  };
}
