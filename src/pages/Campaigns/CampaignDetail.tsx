
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Campaign } from "@/services/types/campaign";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CampaignDetails } from "@/components/campaigns/CampaignDetails";
import { useOnline } from "@/hooks/useOnline";
import { apiService } from "@/services/api/ApiService";

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isOnline = useOnline();
  const isOfflineMode = apiService.isOfflineMode();
  
  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      if (isOfflineMode) {
        return apiService.get<Campaign>(`/campaigns/${id}`);
      } else {
        const response = await api.get(`/campaigns/${id}`);
        return response.data;
      }
    },
    enabled: (isOnline || isOfflineMode) && !!id,
    refetchInterval: 5000 // Polling every 5 seconds
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Загрузка...</div>;
  }

  if (!campaign) {
    return <div className="text-center p-8 text-red-500">Кампания не найдена</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/campaigns")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{campaign.name}</h1>
      </div>

      <CampaignDetails campaign={campaign} />
    </div>
  );
}
