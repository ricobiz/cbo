
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Campaign } from "@/services/types/campaign";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { useNavigate } from "react-router-dom";
import { useOnline } from "@/hooks/useOnline";
import { apiService } from "@/services/api/ApiService";
import { useState } from "react";
import { CreateCampaignDialog } from "@/components/campaigns/CreateCampaignDialog";

export default function CampaignsList() {
  const isOnline = useOnline();
  const navigate = useNavigate();
  const isOfflineMode = apiService.isOfflineMode();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      if (isOfflineMode) {
        return apiService.get<Campaign[]>('/campaigns');
      } else {
        const response = await api.get('/campaigns');
        return response.data;
      }
    },
    enabled: isOnline || isOfflineMode,
    refetchInterval: 5000 // Polling every 5 seconds
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Кампании</h1>
        <Button 
          onClick={() => setShowCreateDialog(true)} 
          disabled={!isOnline && !isOfflineMode}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Создать кампанию
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 animate-pulse bg-muted rounded-md" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-8 text-red-500">
          Произошла ошибка при загрузке кампаний
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center p-8 text-muted-foreground">
          Нет созданных кампаний. Создайте первую кампанию, чтобы начать.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((campaign) => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              onClick={() => navigate(`/campaigns/${campaign.id}`)} 
            />
          ))}
        </div>
      )}

      <CreateCampaignDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  );
}
