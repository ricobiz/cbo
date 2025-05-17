
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Bot } from "@/services/types/bot";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { BotDetails } from "@/components/bots/BotDetails";
import { useOnline } from "@/hooks/useOnline";
import { toast } from "sonner";
import { apiService } from "@/services/api/ApiService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function BotDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isOnline = useOnline();
  const isOfflineMode = apiService.isOfflineMode();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { data: bot, isLoading } = useQuery({
    queryKey: ['bot', id],
    queryFn: async () => {
      if (isOfflineMode) {
        return apiService.get<Bot>(`/bots/${id}`);
      } else {
        const response = await api.get(`/bots/${id}`);
        return response.data;
      }
    },
    enabled: (isOnline || isOfflineMode) && !!id
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (isOfflineMode) {
        return apiService.delete(`/bots/${id}`);
      } else {
        return api.delete(`/bots/${id}`);
      }
    },
    onSuccess: () => {
      toast.success("Бот удален", {
        description: "Бот был успешно удален"
      });
      queryClient.invalidateQueries({ queryKey: ['bots'] });
      navigate("/bots");
    },
    onError: () => {
      toast.error("Ошибка", {
        description: "Не удалось удалить бота"
      });
    }
  });

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  const handleBack = () => {
    navigate("/bots");
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Загрузка...</div>;
  }

  if (!bot) {
    return <div className="text-center p-8 text-red-500">Бот не найден</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/bots")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{bot.name}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate(`/bots/${id}/edit`)}
            disabled={!isOnline && !isOfflineMode}
          >
            <Edit className="h-4 w-4" />
            Редактировать
          </Button>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleDelete}
            disabled={!isOnline && !isOfflineMode}
          >
            <Trash2 className="h-4 w-4" />
            Удалить
          </Button>
        </div>
      </div>

      <BotDetails bot={bot} onBack={handleBack} />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удаление бота</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить бота "{bot.name}"? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
