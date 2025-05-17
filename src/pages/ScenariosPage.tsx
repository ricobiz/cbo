
import { useState } from "react";
import { ScenarioList } from "@/components/scenarios/ScenarioList";
import { TemplateSelector } from "@/components/scenarios/TemplateSelector";
import { Scenario, ScenarioTemplate } from "@/services/types/scenario";
import { ScenarioService } from "@/services/ScenarioService";
import { useToast } from "@/components/ui/use-toast";

type ViewMode = "list" | "template-select" | "detail" | "create" | "edit";

const ScenariosPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const { toast } = useToast();

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setViewMode("detail");
  };

  const handleNewScenario = () => {
    setSelectedScenario(null);
    setViewMode("create");
  };

  const handleTemplateSelect = () => {
    setSelectedScenario(null);
    setViewMode("template-select");
  };

  const handleCreateFromTemplate = (templateId: string, name: string, description: string) => {
    try {
      const newScenario = ScenarioService.createScenarioFromTemplate(templateId, name, description);
      
      if (newScenario) {
        toast({
          title: "Сценарий создан",
          description: `Сценарий "${name}" успешно создан из шаблона.`
        });
        
        setSelectedScenario(newScenario);
        setViewMode("detail");
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось создать сценарий из шаблона.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating scenario from template:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при создании сценария.",
        variant: "destructive"
      });
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case "list":
        return (
          <ScenarioList
            onSelectScenario={handleSelectScenario}
            onNewScenario={handleNewScenario}
            onCreateFromTemplate={handleTemplateSelect}
          />
        );
      case "template-select":
        return (
          <TemplateSelector
            onBack={() => setViewMode("list")}
            onTemplateSelect={handleCreateFromTemplate}
          />
        );
      // Note: Detail, Create and Edit views would be implemented in future iterations
      case "detail":
      case "create":
      case "edit":
      default:
        // For now, just go back to list if those features aren't implemented
        return (
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-2xl font-bold mb-4">Функционал в разработке</h1>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
              Детальный просмотр и редактирование сценариев будет доступно в следующем обновлении.
            </p>
            <button 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => setViewMode("list")}
            >
              Вернуться к списку
            </button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Сценарии</h1>
      </div>

      {renderContent()}
    </div>
  );
};

export default ScenariosPage;
