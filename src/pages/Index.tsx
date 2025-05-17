
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, MessageSquare, Sparkles, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IntegrationHistory } from "@/components/integration/IntegrationHistory";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useTranslation } from "@/store/LanguageStore";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
        <Button onClick={() => navigate("/content")} variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          {t('generateContent')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('campaignAnalytics')}</CardTitle>
            <CardDescription>{t('campaignAnalyticsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground">
              {t('noInteractions')}
            </p>
            <Button onClick={() => navigate("/campaigns")} variant="link" className="mt-4">
              {t('details')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('activeBots')}</CardTitle>
            <CardDescription>{t('activeBotsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground">
              {t('noBotsRunning')}
            </p>
            <Button onClick={() => navigate("/bots")} variant="link" className="mt-4">
              {t('manageBots')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="col-span-1">
          <QuickActions />
        </div>

        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('recentScenarios')}</CardTitle>
            <CardDescription>{t('recentScenariosDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground">
              {t('noScenarios')}
            </p>
            <Button onClick={() => navigate("/scenarios")} variant="link" className="mt-4">
              {t('manageScenarios')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
