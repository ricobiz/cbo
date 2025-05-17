
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, Bot, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IntegrationHistory } from "@/components/integration/IntegrationHistory";
import { QuickActions } from "@/components/dashboard/QuickActions";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <Button onClick={() => navigate("/content")} variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          Создать контент
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Аналитика кампаний</CardTitle>
            <CardDescription>Обзор активности ваших кампаний</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground">
              Нет активных взаимодействий
            </p>
            <Button onClick={() => navigate("/campaigns")} variant="link" className="mt-4">
              Подробнее <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Активные боты</CardTitle>
            <CardDescription>Мониторинг работающих ботов</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground">
              Нет запущенных ботов
            </p>
            <Button onClick={() => navigate("/bots")} variant="link" className="mt-4">
              Управление ботами <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Index;
