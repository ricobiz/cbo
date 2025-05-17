
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { BotForm } from "@/components/bots/BotForm";
import { Bot } from "@/services/types/bot";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/services/api/ApiService";

export default function CreateBot() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOfflineMode = apiService.isOfflineMode();
  
  const mutation = useMutation({
    mutationFn: async (botData: Partial<Bot>) => {
      if (isOfflineMode) {
        return apiService.post('/bots', botData);
      } else {
        const response = await api.post('/bots', botData);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
      toast.success("Бот создан", {
        description: "Новый бот был успешно создан"
      });
      navigate("/bots");
    },
    onError: (error) => {
      console.error("Error creating bot:", error);
      toast.error("Ошибка", {
        description: "Не удалось создать бота"
      });
      setIsSubmitting(false);
    }
  });

  const handleSaveBot = async (bot: Bot) => {
    setIsSubmitting(true);
    mutation.mutate(bot);
  };

  const handleBack = () => {
    navigate("/bots");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/bots")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Создание нового бота</h1>
      </div>

      <BotForm onSave={handleSaveBot} onBack={handleBack} />
    </div>
  );
}
