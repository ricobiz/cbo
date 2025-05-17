
import { useState } from "react";
import { Bot } from "@/services/types/bot";
import { BotManagementService } from "@/services/BotManagementService";
import { BotList } from "@/components/bots/BotList";
import { BotDetail } from "@/components/bots/BotDetail";
import { BotForm } from "@/components/bots/BotForm";
import { useToast } from "@/components/ui/use-toast";

type ViewMode = "list" | "detail" | "create" | "edit";

const BotsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const { toast } = useToast();

  const handleSelectBot = (bot: Bot) => {
    setSelectedBot(bot);
    setViewMode("detail");
  };

  const handleNewBot = () => {
    setSelectedBot(null);
    setViewMode("create");
  };

  const handleEditBot = (bot: Bot) => {
    setSelectedBot(bot);
    setViewMode("edit");
  };

  const handleDeleteBot = (botId: string) => {
    try {
      const success = BotManagementService.deleteBot(botId);
      if (success) {
        toast({
          title: "Бот удален",
          description: "Бот был успешно удален."
        });
        setViewMode("list");
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить бота.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting bot:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при удалении бота.",
        variant: "destructive"
      });
    }
  };

  const handleSaveBot = (bot: Bot) => {
    setSelectedBot(bot);
    setViewMode("detail");
  };

  const renderContent = () => {
    switch (viewMode) {
      case "list":
        return (
          <BotList
            onSelectBot={handleSelectBot}
            onNewBot={handleNewBot}
          />
        );
      case "detail":
        return (
          <BotDetail
            bot={selectedBot!}
            onBack={() => setViewMode("list")}
            onEdit={handleEditBot}
            onDelete={handleDeleteBot}
          />
        );
      case "create":
        return (
          <BotForm
            onBack={() => setViewMode("list")}
            onSave={handleSaveBot}
          />
        );
      case "edit":
        return (
          <BotForm
            bot={selectedBot!}
            onBack={() => setViewMode("detail")}
            onSave={handleSaveBot}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Управление ботами</h1>
      </div>

      {renderContent()}
    </div>
  );
};

export default BotsPage;
