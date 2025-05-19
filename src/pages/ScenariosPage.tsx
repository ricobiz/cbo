
import { useState } from "react";
import { ScenarioList } from "@/components/scenarios/ScenarioList";
import { TemplateSelector } from "@/components/scenarios/TemplateSelector";
import { ScenarioDetail } from "@/components/scenarios/ScenarioDetail";
import { ScenarioForm } from "@/components/scenarios/ScenarioForm";
import { Scenario, ScenarioTemplate } from "@/services/types/scenario";
import { ScenarioService } from "@/services/ScenarioService";
import { toast } from "sonner";

type ViewMode = "list" | "template-select" | "detail" | "create" | "edit";

const ScenariosPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

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
  
  const handleEditScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setViewMode("edit");
  };
  
  const handleSaveScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setViewMode("detail");
    setIsUpdated(!isUpdated); // Toggle to force reload in list view
  };

  const handleCreateFromTemplate = (templateId: string, name: string, description: string) => {
    try {
      const newScenario = ScenarioService.createScenarioFromTemplate(templateId, name, description);
      
      if (newScenario) {
        toast.success("Сценарий создан", {
          description: `Сценарий "${name}" успешно создан из шаблона.`
        });
        
        setSelectedScenario(newScenario);
        setViewMode("detail");
        setIsUpdated(!isUpdated); // Toggle to force reload in list view
      } else {
        toast.error("Ошибка", {
          description: "Не удалось создать сценарий из шаблона."
        });
      }
    } catch (error) {
      console.error("Error creating scenario from template:", error);
      toast.error("Ошибка", {
        description: "Произошла ошибка при создании сценария."
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
            key={`scenario-list-${isUpdated}`} // Force reload when updated
          />
        );
      case "template-select":
        return (
          <TemplateSelector
            onBack={() => setViewMode("list")}
            onTemplateSelect={handleCreateFromTemplate}
          />
        );
      case "detail":
        if (!selectedScenario) {
          setViewMode("list");
          return null;
        }
        return (
          <ScenarioDetail
            scenario={selectedScenario}
            onBack={() => setViewMode("list")}
            onEdit={handleEditScenario}
          />
        );
      case "create":
        return (
          <ScenarioForm
            onBack={() => setViewMode("list")}
            onSave={handleSaveScenario}
          />
        );
      case "edit":
        if (!selectedScenario) {
          setViewMode("list");
          return null;
        }
        return (
          <ScenarioForm
            scenario={selectedScenario}
            onBack={() => setViewMode("detail")}
            onSave={handleSaveScenario}
          />
        );
      default:
        return (
          <ScenarioList
            onSelectScenario={handleSelectScenario}
            onNewScenario={handleNewScenario}
            onCreateFromTemplate={handleTemplateSelect}
          />
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
