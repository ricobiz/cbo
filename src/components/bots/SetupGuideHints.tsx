
import { useState } from "react";
import { InteractiveHint } from "@/components/ui/interactive-hint";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  hint: string;
}

export function SetupGuideHints() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const setupSteps: SetupStep[] = [
    {
      id: "create-bot",
      title: "Создание бота",
      description: "Создайте нового бота для автоматизации действий",
      hint: "Нажмите кнопку 'Новый бот' в правом верхнем углу страницы"
    },
    {
      id: "configure-bot",
      title: "Настройка бота",
      description: "Выберите тип и платформу для вашего бота",
      hint: "Выберите нужный тип бота и целевую платформу из выпадающих списков"
    },
    {
      id: "setup-proxy",
      title: "Настройка прокси",
      description: "Добавьте прокси для обхода ограничений",
      hint: "Активируйте вращение IP в настройках бота"
    },
    {
      id: "add-accounts",
      title: "Добавление аккаунтов",
      description: "Добавьте email аккаунты для работы ботов",
      hint: "Перейдите на страницу аккаунтов для добавления учетных записей"
    },
    {
      id: "start-bot",
      title: "Запуск бота",
      description: "Активируйте бота для начала работы",
      hint: "Нажмите кнопку 'Запустить' на карточке бота"
    }
  ];

  const handleCompleteStep = (stepId: string) => {
    setCompletedSteps({
      ...completedSteps,
      [stepId]: true
    });
    
    // Move to next step if available
    if (activeStepIndex < setupSteps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  const totalCompleted = Object.values(completedSteps).filter(Boolean).length;
  const progress = Math.round((totalCompleted / setupSteps.length) * 100);

  return (
    <Card className="border-2 border-blue-100 p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium">Руководство по настройке</h3>
          <p className="text-sm text-muted-foreground">
            Выполнено шагов: {totalCompleted} из {setupSteps.length}
          </p>
        </div>
        <div className="bg-blue-100 h-2 rounded-full w-36">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {setupSteps.map((step, index) => {
          const isActive = index === activeStepIndex;
          const isCompleted = !!completedSteps[step.id];
          const isPending = index > activeStepIndex;

          return (
            <div key={step.id} className="flex items-start gap-3">
              <div className={`mt-1 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                isCompleted 
                  ? "bg-green-100 text-green-600" 
                  : isActive 
                    ? "bg-blue-100 text-blue-600 animate-pulse" 
                    : "bg-gray-100 text-gray-400"
              }`}>
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <InteractiveHint
                  title={step.title}
                  description={step.description}
                  highlightLevel={isActive ? "high" : "low"}
                  completed={isCompleted}
                  onComplete={() => handleCompleteStep(step.id)}
                  className={isPending ? "opacity-50" : ""}
                >
                  <div className="pl-2 min-h-14 flex items-center">
                    <div>
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.hint}</p>
                    </div>
                  </div>
                </InteractiveHint>
              </div>
            </div>
          );
        })}
      </div>

      {totalCompleted === setupSteps.length && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md flex items-center justify-between">
          <p className="text-green-700 font-medium">
            Настройка завершена! Система готова к использованию.
          </p>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            Перейти к мониторингу <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}
