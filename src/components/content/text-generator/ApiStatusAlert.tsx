
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ApiStatusAlertProps {
  apiStatus: {
    hasApiKey: boolean;
    isValid: boolean | null;
    isOfflineMode: boolean;
  };
}

export function ApiStatusAlert({ apiStatus }: ApiStatusAlertProps) {
  const navigate = useNavigate();
  
  if (!apiStatus.hasApiKey) {
    return (
      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Требуется API ключ OpenRouter</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>Для генерации контента требуется действительный API ключ OpenRouter.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/settings")}
            className="w-fit"
          >
            Перейти к настройкам API
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (apiStatus.hasApiKey && apiStatus.isValid === false) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Недействительный API ключ</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>Ваш API ключ OpenRouter недействителен или не был проверен.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/settings")}
            className="w-fit"
          >
            Проверить ключ
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
}
