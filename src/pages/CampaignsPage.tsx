
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, ClipboardList, Calendar, Search, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { externalAPIService } from "@/services/ExternalAPIService";

const CampaignsPage = () => {
  useEffect(() => {
    document.title = "Управление кампаниями";
  }, []);

  const [isOfflineMode, setIsOfflineMode] = useState(true);
  const [currentTab, setCurrentTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  
  // Демо-данные для кампаний
  const demoCampaigns = [
    {
      id: "1",
      title: "Продвижение музыкального альбома",
      platform: "spotify",
      status: "active",
      progress: 45,
      startDate: "2024-05-10",
      endDate: "2024-06-10",
      type: "promotion",
      metrics: {
        views: 12500,
        engagement: 2340,
        conversions: 350
      }
    },
    {
      id: "2",
      title: "Привлечение подписчиков YouTube",
      platform: "youtube",
      status: "draft",
      progress: 0,
      startDate: "2024-05-20",
      endDate: "2024-06-20",
      type: "growth",
      metrics: {
        views: 0,
        engagement: 0,
        conversions: 0
      }
    },
    {
      id: "3",
      title: "Промо нового продукта в Instagram",
      platform: "instagram",
      status: "completed",
      progress: 100,
      startDate: "2024-04-01",
      endDate: "2024-05-01",
      type: "promotion",
      metrics: {
        views: 45000,
        engagement: 5600,
        conversions: 820
      }
    }
  ];

  // Проверка текущего режима при загрузке
  useEffect(() => {
    setIsOfflineMode(externalAPIService.isOfflineMode());
  }, []);

  // Фильтрация кампаний
  const filteredCampaigns = demoCampaigns.filter(campaign => {
    // Фильтрация по поиску
    const matchesSearch = searchQuery === "" || 
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Фильтрация по платформе
    const matchesPlatform = filterPlatform === "all" || 
      campaign.platform === filterPlatform;
    
    // Фильтрация по вкладке (статусу)
    const matchesTab = currentTab === "all" || 
      (currentTab === "active" && campaign.status === "active") ||
      (currentTab === "draft" && campaign.status === "draft") ||
      (currentTab === "completed" && campaign.status === "completed");
    
    return matchesSearch && matchesPlatform && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ClipboardList className="h-7 w-7" /> 
          Управление кампаниями
        </h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Создать кампанию
        </Button>
      </div>

      {isOfflineMode && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-800">Автономный режим активен</CardTitle>
            <CardDescription className="text-yellow-700">
              В автономном режиме доступны только демонстрационные данные и ограниченная функциональность.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700">
              Для полноценной работы с кампаниями рекомендуется подключить внешние API.
              <Button 
                variant="link" 
                className="h-auto p-0 ml-1 text-yellow-800 underline" 
                onClick={() => window.location.href = '/command'}
              >
                Настроить API <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger value="all">Все кампании</TabsTrigger>
            <TabsTrigger value="active">Активные</TabsTrigger>
            <TabsTrigger value="draft">Черновики</TabsTrigger>
            <TabsTrigger value="completed">Завершенные</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-[50%] transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Поиск кампаний..." 
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Платформа" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все платформы</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="spotify">Spotify</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TabsContent value={currentTab} className="mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))
          ) : (
            <div className="col-span-full flex justify-center py-12">
              <div className="text-center">
                <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Кампании не найдены</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery || filterPlatform !== "all" 
                    ? "Попробуйте изменить параметры поиска или фильтрации"
                    : "Создайте новую кампанию чтобы начать работу"}
                </p>
                <Button className="mt-4">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Создать кампанию
                </Button>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </div>
  );
};

export default CampaignsPage;
