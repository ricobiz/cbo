
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle, Check, RefreshCw, ExternalLink } from "lucide-react";
import externalAPIService from "@/services/external-api";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function OpenRouterSettings() {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState<boolean | null>(null);
  const [lastValidationTime, setLastValidationTime] = useState<string | null>(null);
  
  // Load existing API key if available
  useEffect(() => {
    console.log("OpenRouterSettings: Loading component");
    const storedKey = localStorage.getItem('openrouter_api_key');
    if (storedKey) {
      console.log("OpenRouterSettings: Found stored API key");
      setApiKey(storedKey);
      
      // Get current validation status
      const status = externalAPIService.getOpenRouterApiKeyValidationStatus();
      console.log("OpenRouterSettings: Current validation status:", status);
      setValidationStatus(status);
      
      // Get last validation time
      const lastValidation = localStorage.getItem('openrouter_api_key_last_validation');
      if (lastValidation) {
        setLastValidationTime(lastValidation);
      }
    } else {
      console.log("OpenRouterSettings: No stored API key found");
    }
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("API ключ не может быть пустым");
      return;
    }

    console.log("OpenRouterSettings: Saving API key...");
    setIsLoading(true);
    
    try {
      // Set the API key in the service
      externalAPIService.setOpenRouterApiKey(apiKey.trim());
      console.log("OpenRouterSettings: API key set in service");
      
      // Validate the API key
      console.log("OpenRouterSettings: Starting validation...");
      const isValid = await externalAPIService.validateOpenRouterApiKey();
      console.log("OpenRouterSettings: Validation result:", isValid);
      
      setValidationStatus(isValid);
      
      if (isValid) {
        const now = new Date().toISOString();
        localStorage.setItem('openrouter_api_key_last_validation', now);
        setLastValidationTime(now);
        
        toast.success("API ключ OpenRouter успешно сохранен и проверен");
        
        // Turn off offline mode if API key is valid
        if (externalAPIService.isOfflineMode()) {
          externalAPIService.setOfflineMode(false);
          toast.info("Оффлайн режим отключен, так как API ключ валиден");
        }
      } else {
        toast.error("API ключ OpenRouter недействителен", {
          description: "Проверьте ключ и попробуйте снова"
        });
      }
    } catch (error) {
      console.error("OpenRouterSettings: Error saving API key:", error);
      toast.error("Ошибка при сохранении API ключа: " + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
      setValidationStatus(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateKey = async () => {
    if (!apiKey.trim()) {
      toast.error("API ключ не может быть пустым");
      return;
    }

    console.log("OpenRouterSettings: Manual validation started");
    setIsLoading(true);
    
    try {
      // Set API key before validation
      externalAPIService.setOpenRouterApiKey(apiKey.trim());
      console.log("OpenRouterSettings: API key set, starting validation...");
      
      // Validate the key
      const isValid = await externalAPIService.validateOpenRouterApiKey();
      console.log("OpenRouterSettings: Manual validation result:", isValid);
      
      setValidationStatus(isValid);
      
      if (isValid) {
        const now = new Date().toISOString();
        localStorage.setItem('openrouter_api_key_last_validation', now);
        setLastValidationTime(now);
        toast.success("API ключ OpenRouter действителен");
      } else {
        toast.error("API ключ OpenRouter недействителен");
      }
    } catch (error) {
      console.error("OpenRouterSettings: Error validating API key:", error);
      toast.error("Ошибка при проверке API ключа: " + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
      setValidationStatus(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestGeneration = async () => {
    if (!apiKey.trim()) {
      toast.error("Сначала добавьте API ключ");
      return;
    }

    if (validationStatus !== true) {
      toast.error("Сначала проверьте API ключ");
      return;
    }

    console.log("OpenRouterSettings: Testing content generation...");
    setIsLoading(true);

    try {
      const testPrompt = "Напиши короткий пост для социальных сетей о важности тестирования API ключей.";
      console.log("OpenRouterSettings: Sending test request:", testPrompt);
      
      const response = await externalAPIService.sendToOpenRouter(testPrompt);
      console.log("OpenRouterSettings: Test generation response:", response);
      
      if (response && response.choices && response.choices.length > 0) {
        const generatedContent = response.choices[0].message.content;
        toast.success("Тест генерации успешен!", {
          description: `Сгенерирован контент: ${generatedContent.substring(0, 50)}...`
        });
      } else {
        toast.error("Тест генерации не удался", {
          description: "Получен пустой ответ от API"
        });
      }
    } catch (error) {
      console.error("OpenRouterSettings: Test generation error:", error);
      toast.error("Ошибка при тестировании генерации", {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки OpenRouter API</CardTitle>
        <CardDescription>
          OpenRouter API используется для генерации AI контента. 
          Получите ключ на{" "}
          <a 
            href="https://openrouter.ai/keys" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            openrouter.ai
            <ExternalLink className="h-3 w-3" />
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="openrouterApiKey">API Ключ OpenRouter</Label>
          <div className="flex gap-2">
            <Input
              id="openrouterApiKey"
              type="password"
              placeholder="sk-or-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              onClick={handleValidateKey} 
              disabled={isLoading || !apiKey}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                "Проверить"
              )}
            </Button>
          </div>
        </div>
        
        {validationStatus !== null && (
          <div className={`flex items-center gap-2 text-sm ${validationStatus ? 'text-green-600' : 'text-red-600'}`}>
            {validationStatus ? (
              <>
                <Check className="h-4 w-4" />
                API ключ действителен
                {lastValidationTime && (
                  <span className="text-muted-foreground ml-2">
                    (проверен: {new Date(lastValidationTime).toLocaleString('ru-RU')})
                  </span>
                )}
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                API ключ недействителен или не проверен
              </>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={handleSaveApiKey} 
            disabled={isLoading || !apiKey}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              "Сохранить API ключ"
            )}
          </Button>
          
          {validationStatus === true && (
            <Button 
              variant="outline"
              onClick={handleTestGeneration} 
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                "Тест генерации"
              )}
            </Button>
          )}
        </div>

        {externalAPIService.isOfflineMode() && validationStatus !== true && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium">Оффлайн режим активен</div>
              <div>Для использования API генерации контента, добавьте и проверьте действительный API ключ.</div>
            </AlertDescription>
          </Alert>
        )}

        {validationStatus === true && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              API ключ настроен правильно. Вы можете использовать генерацию контента.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
