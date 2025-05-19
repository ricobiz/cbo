
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle, Check, RefreshCw } from "lucide-react";
import externalAPIService from "@/services/external-api";

export function OpenRouterSettings() {
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState<boolean | null>(null);
  
  // Load existing API key if available
  useEffect(() => {
    const storedKey = localStorage.getItem('openrouter_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      
      // Get current validation status
      const status = externalAPIService.getOpenRouterApiKeyValidationStatus();
      setValidationStatus(status);
    }
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("API ключ не может быть пустым");
      return;
    }

    setIsLoading(true);
    
    try {
      // Set the API key in the service
      externalAPIService.setOpenRouterApiKey(apiKey.trim());
      
      // Validate the API key
      const isValid = await externalAPIService.validateOpenRouterApiKey();
      setValidationStatus(isValid);
      
      if (isValid) {
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
      console.error("Error saving OpenRouter API key:", error);
      toast.error("Ошибка при сохранении API ключа");
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

    setIsLoading(true);
    
    try {
      // Validate the API key
      const isValid = await externalAPIService.validateOpenRouterApiKey();
      setValidationStatus(isValid);
      
      if (isValid) {
        toast.success("API ключ OpenRouter действителен");
      } else {
        toast.error("API ключ OpenRouter недействителен");
      }
    } catch (error) {
      console.error("Error validating OpenRouter API key:", error);
      toast.error("Ошибка при проверке API ключа");
      setValidationStatus(false);
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
          Получите ключ на <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openrouter.ai</a>
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
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                API ключ недействителен или не проверен
              </>
            )}
          </div>
        )}
        
        <Button 
          onClick={handleSaveApiKey} 
          disabled={isLoading || !apiKey}
          className="w-full"
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

        {externalAPIService.isOfflineMode() && validationStatus !== true && (
          <div className="bg-amber-100 dark:bg-amber-900 p-3 rounded text-sm flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Оффлайн режим активен</div>
              <div>Для использования API генерации контента, добавьте и проверьте действительный API ключ.</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
