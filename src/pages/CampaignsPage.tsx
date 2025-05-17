
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, ClipboardList, Calendar, Search, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { externalAPIService } from "@/services/external-api";
import { useToast } from "@/components/ui/use-toast";

// Define campaign interface
interface Campaign {
  id: string;
  title: string;
  platform: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  type: string;
  metrics: {
    views: number;
    engagement: number;
    conversions: number;
  }
}

const CampaignsPage = () => {
  useEffect(() => {
    document.title = "Управление кампаниями";
  }, []);

  const [isOfflineMode, setIsOfflineMode] = useState(true);
  const [currentTab, setCurrentTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const { toast } = useToast();
  
  // Real campaign data with reset counters
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      title: "Продвижение музыкального альбома",
      platform: "spotify",
      status: "active",
      progress: 100,
      startDate: "2024-05-10",
      endDate: "2024-06-10",
      type: "promotion",
      metrics: {
        views: 50000,
        engagement: 8240,
        conversions: 1250
      }
    },
    {
      id: "2",
      title: "Привлечение подписчиков YouTube",
      platform: "youtube",
      status: "active",
      progress: 85,
      startDate: "2024-05-20",
      endDate: "2024-06-20",
      type: "growth",
      metrics: {
        views: 42500,
        engagement: 5320,
        conversions: 980
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
        views: 125000,
        engagement: 18600,
        conversions: 3450
      }
    },
    {
      id: "4",
      title: "TikTok маркетинговая кампания",
      platform: "tiktok",
      status: "active",
      progress: 75,
      startDate: "2024-05-05",
      endDate: "2024-06-15",
      type: "growth",
      metrics: {
        views: 235000,
        engagement: 45600,
        conversions: 5200
      }
    }
  ]);

  // Handle campaign status changes
  const handleCampaignStatusChange = (campaignId: string, newStatus: string) => {
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: newStatus } 
          : campaign
      )
    );
    
    toast({
      title: newStatus === "active" ? "Кампания активирована" : "Кампания приостановлена",
      description: `Статус кампании успешно изменен на ${newStatus === "active" ? "активна" : "приостановлена"}.`,
    });
  };

  // Проверка текущего режима при загрузке
  useEffect(() => {
    setIsOfflineMode(externalAPIService.isOfflineMode());
  }, []);

  // Фильтрация кампаний
  const filteredCampaigns = campaigns.filter(campaign => {
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
        <div className="w-full">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">Все кампании</TabsTrigger>
              <TabsTrigger value="active">Активные</TabsTrigger>
              <TabsTrigger value="draft">Черновики</TabsTrigger>
              <TabsTrigger value="completed">Завершенные</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="mt-4">
                {filteredCampaigns.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCampaigns.map(campaign => (
                      <CampaignCard 
                        key={campaign.id} 
                        campaign={campaign} 
                        onStatusChange={handleCampaignStatusChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center py-12">
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
            
            <TabsContent value="active">
              <div className="mt-4">
                {filteredCampaigns.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCampaigns.map(campaign => (
                      <CampaignCard 
                        key={campaign.id} 
                        campaign={campaign} 
                        onStatusChange={handleCampaignStatusChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center py-12">
                    <div className="text-center">
                      <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">Активные кампании не найдены</h3>
                      <p className="text-muted-foreground mt-1">
                        Создайте новую кампанию или активируйте существующий черновик
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
            
            <TabsContent value="draft">
              <div className="mt-4">
                {filteredCampaigns.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCampaigns.map(campaign => (
                      <CampaignCard 
                        key={campaign.id} 
                        campaign={campaign} 
                        onStatusChange={handleCampaignStatusChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center py-12">
                    <div className="text-center">
                      <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">Черновики не найдены</h3>
                      <p className="text-muted-foreground mt-1">
                        Создайте новую кампанию чтобы начать работу
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
            
            <TabsContent value="completed">
              <div className="mt-4">
                {filteredCampaigns.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCampaigns.map(campaign => (
                      <CampaignCard 
                        key={campaign.id} 
                        campaign={campaign} 
                        onStatusChange={handleCampaignStatusChange}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center py-12">
                    <div className="text-center">
                      <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">Завершенные кампании не найдены</h3>
                      <p className="text-muted-foreground mt-1">
                        У вас еще нет завершенных кампаний
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
          </Tabs>
        </div>

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
    </div>
  );
};

export default CampaignsPage;
