
import { useState } from "react";
import { InteractiveHint } from "@/components/ui/interactive-hint";
import { Card } from "@/components/ui/card";
import { Bot, Settings, Users, Mail, Globe, Shield } from "lucide-react";

export function SetupGuideHints() {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    createBot: false,
    configureProxy: false,
    addAccounts: false,
    scheduleBot: false,
    secureConnection: false
  });

  const markStepComplete = (step: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [step]: true
    }));
  };

  const allStepsCompleted = Object.values(completedSteps).every(Boolean);

  if (allStepsCompleted) {
    return null;
  }

  return (
    <Card className="p-4 bg-muted/30">
      <h3 className="text-lg font-medium mb-4">Руководство по настройке</h3>
      <div className="space-y-4">
        <InteractiveHint
          title="Создайте бота"
          description="Создайте нового бота, выбрав тип и указав, для какой платформы он будет работать."
          step={1}
          totalSteps={5}
          completed={completedSteps.createBot}
          onComplete={() => markStepComplete('createBot')}
          highlightLevel="high"
        >
          <div className="flex items-start gap-3">
            <Bot className="h-8 w-8 text-primary mt-1" />
            <div>
              <h4 className="font-medium">Создание бота</h4>
              <p className="text-sm text-muted-foreground">
                Нажмите на кнопку «New Bot» или «Quick Create», чтобы начать создание бота. Выберите тип бота в зависимости от ваших потребностей.
              </p>
            </div>
          </div>
        </InteractiveHint>

        <InteractiveHint
          title="Настройте прокси-серверы"
          description="Настройте прокси для обеспечения безопасного доступа и ротации IP-адресов."
          step={2}
          totalSteps={5}
          completed={completedSteps.configureProxy}
          onComplete={() => markStepComplete('configureProxy')}
          highlightLevel={completedSteps.createBot ? "high" : "low"}
        >
          <div className="flex items-start gap-3">
            <Globe className="h-8 w-8 text-blue-500 mt-1" />
            <div>
              <h4 className="font-medium">Настройка прокси</h4>
              <p className="text-sm text-muted-foreground">
                Перейдите в настройки прокси и добавьте IP-адреса для ротации. Рекомендуется использовать разные регионы для максимальной эффективности.
              </p>
            </div>
          </div>
        </InteractiveHint>

        <InteractiveHint
          title="Добавьте учетные записи"
          description="Назначьте электронные почты или учетные записи социальных сетей для работы ботов."
          step={3}
          totalSteps={5}
          completed={completedSteps.addAccounts}
          onComplete={() => markStepComplete('addAccounts')}
          highlightLevel={completedSteps.configureProxy ? "high" : "low"}
        >
          <div className="flex items-start gap-3">
            <Users className="h-8 w-8 text-amber-500 mt-1" />
            <div>
              <h4 className="font-medium">Управление аккаунтами</h4>
              <p className="text-sm text-muted-foreground">
                Добавьте аккаунты социальных сетей или электронные почты для каждого бота через раздел учетных записей или при настройке бота.
              </p>
            </div>
          </div>
        </InteractiveHint>

        <InteractiveHint
          title="Настройка расписания"
          description="Настройте время работы и режим действий для каждого бота."
          step={4}
          totalSteps={5}
          completed={completedSteps.scheduleBot}
          onComplete={() => markStepComplete('scheduleBot')}
          highlightLevel={completedSteps.addAccounts ? "high" : "low"}
        >
          <div className="flex items-start gap-3">
            <Settings className="h-8 w-8 text-green-500 mt-1" />
            <div>
              <h4 className="font-medium">Расписание работы</h4>
              <p className="text-sm text-muted-foreground">
                Установите дни недели, время начала и окончания работы для каждого бота. Рекомендуется настроить перерывы для более естественного поведения.
              </p>
            </div>
          </div>
        </InteractiveHint>

        <InteractiveHint
          title="Настройка безопасности"
          description="Настройте параметры безопасности для защиты ваших ботов и аккаунтов."
          step={5}
          totalSteps={5}
          completed={completedSteps.secureConnection}
          onComplete={() => markStepComplete('secureConnection')}
          highlightLevel={completedSteps.scheduleBot ? "high" : "low"}
        >
          <div className="flex items-start gap-3">
            <Shield className="h-8 w-8 text-purple-500 mt-1" />
            <div>
              <h4 className="font-medium">Безопасность</h4>
              <p className="text-sm text-muted-foreground">
                Установите параметры безопасности для защиты от обнаружения. Настройте поведение ботов так, чтобы оно максимально напоминало поведение обычных пользователей.
              </p>
            </div>
          </div>
        </InteractiveHint>
      </div>
    </Card>
  );
}
