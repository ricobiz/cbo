
import { useState } from "react";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter, SlidersHorizontal, BarChart } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignProgressIndicator } from "@/components/campaigns/CampaignProgressIndicator";

const mockCampaigns = [
  {
    id: "1",
    name: "Летняя музыкальная акция",
    description: "Продвижение новых электронных альбомов на лето",
    platform: "Spotify",
    progress: 65,
    status: "active" as const,
    startDate: "15 мая 2025",
    endDate: "30 июня 2025",
    target: {
      type: "прослушиваний",
      value: 10000
    },
    stats: {
      views: 6500,
      engagements: 842,
      clicks: 1230
    }
  },
  {
    id: "2",
    name: "Обзор технологического продукта",
    description: "Подробный обзор нового смартфона",
    platform: "YouTube",
    progress: 42,
    status: "active" as const,
    startDate: "20 мая 2025",
    endDate: "15 июля 2025",
    target: {
      type: "просмотров",
      value: 50000
    },
    stats: {
      views: 21000,
      engagements: 1842,
      clicks: 3120
    }
  },
  {
    id: "3",
    name: "Повышение узнаваемости бренда",
    description: "Увеличение видимости бренда и числа подписчиков",
    platform: "Twitter",
    progress: 78,
    status: "active" as const,
    startDate: "10 мая 2025",
    endDate: "25 июня 2025",
    target: {
      type: "подписчиков",
      value: 5000
    },
    stats: {
      views: 32500,
      engagements: 4210,
      clicks: 1820
    }
  },
  {
    id: "4",
    name: "Запуск нового продукта",
    description: "Рекламная кампания для нового SaaS инструмента",
    platform: "LinkedIn",
    progress: 100,
    status: "completed" as const,
    startDate: "1 апреля 2025",
    endDate: "15 мая 2025",
    target: {
      type: "лидов",
      value: 200
    },
    stats: {
      views: 15200,
      engagements: 2100,
      clicks: 580
    }
  },
  {
    id: "5",
    name: "Предпраздничная акция",
    description: "Продвижение интернет-магазина перед праздничным сезоном",
    platform: "Instagram",
    progress: 0,
    status: "scheduled" as const,
    startDate: "1 ноября 2025",
    endDate: "31 декабря 2025",
    target: {
      type: "продаж",
      value: 500
    }
  },
  {
    id: "6",
    name: "Серия обучающих видео",
    description: "Образовательная видеосерия о цифровом маркетинге",
    platform: "YouTube",
    progress: 35,
    status: "paused" as const,
    startDate: "1 мая 2025",
    endDate: "31 июля 2025",
    target: {
      type: "подписчиков",
      value: 2000
    },
    stats: {
      views: 12400,
      engagements: 950,
      clicks: 340
    }
  }
];

const CampaignsPage = () => {
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesPlatform = filterPlatform === "all" || campaign.platform.toLowerCase() === filterPlatform.toLowerCase();
    const matchesStatus = filterStatus === "all" || campaign.status === filterStatus;
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPlatform && matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const activeCampaigns = mockCampaigns.filter(c => c.status === "active").length;
  const completedCampaigns = mockCampaigns.filter(c => c.status === "completed").length;
  const totalViews = mockCampaigns.reduce((sum, c) => sum + (c.stats?.views || 0), 0);
  const totalEngagements = mockCampaigns.reduce((sum, c) => sum + (c.stats?.engagements || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Кампании</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Создать кампанию
        </Button>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">Все кампании</TabsTrigger>
            <TabsTrigger value="active">Активные</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant={view === "grid" ? "default" : "outline"} 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setView("grid")}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button 
              variant={view === "list" ? "default" : "outline"} 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setView("list")}
            >
              <BarChart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Поиск кампаний..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Фильтр по платформе" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все платформы</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="spotify">Spotify</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Фильтр по статусу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="paused">Приостановленные</SelectItem>
                  <SelectItem value="completed">Завершенные</SelectItem>
                  <SelectItem value="scheduled">Запланированные</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCampaigns.length > 0 ? (
              filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} {...campaign} />
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center p-12 border rounded-lg border-dashed">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">Кампании, соответствующие вашим критериям, не найдены</p>
                  <Button variant="outline" onClick={() => {
                    setFilterPlatform("all");
                    setFilterStatus("all");
                    setSearchTerm("");
                  }}>
                    Сбросить фильтры
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockCampaigns
              .filter(campaign => campaign.status === "active")
              .map(campaign => (
                <CampaignCard key={campaign.id} {...campaign} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Всего кампаний</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCampaigns.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeCampaigns} активных, {completedCampaigns} завершенных
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Всего просмотров</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  На всех платформах
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Всего взаимодействий</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEngagements.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Лайки, комментарии, репосты
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Средняя завершенность</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(mockCampaigns.reduce((sum, c) => sum + c.progress, 0) / mockCampaigns.length)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Среднее значение прогресса
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Эффективность кампаний</CardTitle>
              <CardDescription>Обзор прогресса всех ваших кампаний</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCampaigns.map(campaign => (
                  <div key={campaign.id} className="flex items-center gap-4">
                    <div className="w-40 font-medium truncate">{campaign.name}</div>
                    <div className="flex-1">
                      <CampaignProgressIndicator progress={campaign.progress} />
                    </div>
                    <div className="w-24 text-right">
                      <span className="text-sm font-medium">{campaign.platform}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignsPage;
