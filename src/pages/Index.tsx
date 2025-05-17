import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, MessageSquare, Sparkles, Users, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IntegrationHistory } from "@/components/integration/IntegrationHistory";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <Button onClick={() => navigate("/content")} variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          Сгенерировать контент
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Аналитика кампаний</CardTitle>
            <CardDescription>Обзор эффективности ваших маркетинговых кампаний</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">1,450</div>
            <p className="text-muted-foreground">
              Общее количество взаимодействий за последние 30 дней
            </p>
            <div className="flex items-center space-x-2">
              <BarChart className="h-4 w-4 text-green-500" />
              <p className="text-sm text-green-500">+12% по сравнению с прошлым месяцем</p>
            </div>
            <Button onClick={() => navigate("/campaigns")} variant="link" className="mt-4">
              Подробнее <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Активные боты</CardTitle>
            <CardDescription>Управление и мониторинг ваших активных ботов</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">24</div>
            <p className="text-muted-foreground">
              Количество ботов, работающих в данный момент
            </p>
            <Button onClick={() => navigate("/bots")} variant="link" className="mt-4">
              Управление ботами <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="col-span-1">
          <IntegrationHistory />
        </div>

        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Последние сценарии</CardTitle>
            <CardDescription>Быстрый доступ к вашим последним сценариям</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">5</div>
            <p className="text-muted-foreground">
              Количество запущенных сценариев на этой неделе
            </p>
            <Button onClick={() => navigate("/scenarios")} variant="link" className="mt-4">
              Управление сценариями <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
