
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { apiService } from "@/services/api/ApiService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Bot } from "@/services/types/bot";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export interface CreateCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (campaignData: any) => void;
}

type FormData = {
  name: string;
  description: string;
  platforms: string[];
  bot_ids: string[];
};

export function CreateCampaignDialog({ open, onOpenChange, onSubmit }: CreateCampaignDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedBotIds, setSelectedBotIds] = useState<string[]>([]);
  const isOfflineMode = apiService.isOfflineMode();
  
  const { data: bots = [] } = useQuery({
    queryKey: ['bots'],
    queryFn: async () => {
      if (isOfflineMode) {
        return apiService.get<Bot[]>('/bots');
      } else {
        const response = await api.get('/bots');
        return response.data;
      }
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (isOfflineMode) {
        return apiService.post('/campaigns', {
          ...data,
          bot_ids: selectedBotIds
        });
      } else {
        const response = await api.post('/campaigns', {
          ...data,
          bot_ids: selectedBotIds
        });
        return response.data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success("Кампания создана", {
        description: "Новая кампания была успешно создана"
      });
      reset();
      onOpenChange(false);
      onSubmit(data);
      navigate(`/campaigns/${data.id}`);
    },
    onError: () => {
      toast.error("Ошибка", {
        description: "Не удалось создать кампанию"
      });
    }
  });

  const onFormSubmit = (data: FormData) => {
    mutation.mutate({
      ...data,
      bot_ids: selectedBotIds,
      platforms: ['instagram', 'facebook'] // Hardcoded for simplicity, would be from form in real app
    });
  };

  const handleBotToggle = (botId: string) => {
    setSelectedBotIds(prev => 
      prev.includes(botId) 
        ? prev.filter(id => id !== botId) 
        : [...prev, botId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) reset();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать новую кампанию</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input 
                id="name" 
                {...register("name", { required: "Название обязательно" })} 
                placeholder="Введите название кампании" 
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea 
                id="description" 
                {...register("description")} 
                placeholder="Введите описание кампании" 
              />
            </div>

            <div className="space-y-2">
              <Label>Выберите ботов для кампании</Label>
              <div className="border rounded-md p-4 space-y-2 max-h-52 overflow-y-auto">
                {bots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Нет доступных ботов</p>
                ) : (
                  bots.map(bot => (
                    <div key={bot.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`bot-${bot.id}`} 
                        checked={selectedBotIds.includes(bot.id)}
                        onCheckedChange={() => handleBotToggle(bot.id)}
                      />
                      <Label htmlFor={`bot-${bot.id}`} className="cursor-pointer">
                        {bot.name} ({bot.platform})
                      </Label>
                    </div>
                  ))
                )}
              </div>
              {selectedBotIds.length === 0 && (
                <p className="text-xs text-amber-500">Выберите хотя бы одного бота для кампании</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button 
              type="submit"
              disabled={mutation.isPending || selectedBotIds.length === 0}
            >
              {mutation.isPending ? "Создание..." : "Создать кампанию"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
