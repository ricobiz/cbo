import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateCampaignDialog } from '@/components/campaigns/CreateCampaignDialog';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import { CampaignDetails } from '@/components/campaigns/CampaignDetails';
import { Plus, Filter, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CampaignService } from "@/services/CampaignService";
import { Campaign, CampaignStatus, CampaignType } from "@/services/types/campaign";
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from "@/store/LanguageStore";
import { toast } from 'sonner';

export default function CampaignsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const { t } = useTranslation();
  
  // Fetch campaigns on component mount
  useEffect(() => {
    const storedCampaigns = CampaignService.getAllCampaigns();
    setCampaigns(storedCampaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      platform: campaign.platforms[0] || '',
      status: campaign.status,
      progress: calculateProgress(campaign),
      metrics: campaign.metrics.reduce((obj, metric) => {
        obj[metric.name.toLowerCase()] = metric.value;
        return obj;
      }, {} as Record<string, number>),
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      description: campaign.description,
      budget: campaign.budget || 0,
      spent: calculateSpent(campaign),
      type: campaign.type
    })));
  }, []);
  
  const calculateProgress = (campaign: Campaign): number => {
    if (campaign.status === 'completed') return 100;
    if (campaign.status === 'draft') return 0;
    
    const now = new Date().getTime();
    const startDate = new Date(campaign.startDate).getTime();
    
    if (!campaign.endDate) return 50; // Default for campaigns without end date
    
    const endDate = new Date(campaign.endDate).getTime();
    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;
    
    if (elapsed <= 0) return 0;
    if (elapsed >= totalDuration) return 100;
    
    return Math.round((elapsed / totalDuration) * 100);
  };
  
  const calculateSpent = (campaign: Campaign): number => {
    if (!campaign.budget) return 0;
    const progress = calculateProgress(campaign) / 100;
    return Math.round(campaign.budget * progress);
  };
  
  // Filter campaigns based on search query and active tab
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (campaign.platform && campaign.platform.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && campaign.status === "active";
    if (activeTab === "paused") return matchesSearch && campaign.status === "paused";
    if (activeTab === "completed") return matchesSearch && campaign.status === "completed";
    if (activeTab === "draft") return matchesSearch && campaign.status === "draft";
    
    return matchesSearch;
  });
  
  const handleCreateCampaign = (campaignData: any) => {
    const newCampaign: Campaign = {
      id: uuidv4(),
      name: campaignData.name,
      description: campaignData.description || t('noCampaignDescription'),
      type: (campaignData.type || 'promotion') as CampaignType,
      status: 'draft' as CampaignStatus,
      platforms: [campaignData.platform],
      startDate: campaignData.startDate || new Date().toISOString(),
      endDate: campaignData.endDate,
      budget: campaignData.budget || 0,
      metrics: [],
      tags: campaignData.tags || [],
      actions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to CampaignService
    CampaignService.saveCampaign(newCampaign);
    
    // Add to UI state
    setCampaigns([...campaigns, {
      id: newCampaign.id,
      name: newCampaign.name,
      platform: newCampaign.platforms[0] || '',
      status: 'draft',
      progress: 0,
      metrics: {},
      startDate: newCampaign.startDate,
      endDate: newCampaign.endDate,
      description: newCampaign.description,
      budget: newCampaign.budget,
      spent: 0,
      type: newCampaign.type
    }]);
    
    toast.success(t('campaignCreated'), {
      position: "bottom-right",
      duration: 3000,
    });
    
    setIsCreateDialogOpen(false);
  };
  
  const handleCampaignSelect = (id: string) => {
    setSelectedCampaign(id);
  };
  
  const handleBackToList = () => {
    setSelectedCampaign(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('campaigns')}</h1>
          <p className="text-muted-foreground">
            {t('campaignsDescription')}
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> {t('createCampaign')}
        </Button>
      </div>
      
      {selectedCampaign ? (
        <CampaignDetails 
          campaign={campaigns.find(c => c.id === selectedCampaign)} 
          onBack={handleBackToList} 
        />
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                placeholder={t('searchCampaigns')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>{t('filterByPlatform')}</DropdownMenuItem>
                <DropdownMenuItem>{t('filterByStatus')}</DropdownMenuItem>
                <DropdownMenuItem>{t('filterByDate')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SortAsc className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>{t('sortByName')}</DropdownMenuItem>
                <DropdownMenuItem>{t('sortByDate')}</DropdownMenuItem>
                <DropdownMenuItem>{t('sortByProgress')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">{t('allCampaigns')}</TabsTrigger>
              <TabsTrigger value="active">{t('active')}</TabsTrigger>
              <TabsTrigger value="paused">{t('paused')}</TabsTrigger>
              <TabsTrigger value="completed">{t('completed')}</TabsTrigger>
              <TabsTrigger value="draft">{t('drafts')}</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              {filteredCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard 
                      key={campaign.id} 
                      campaign={campaign} 
                      onClick={() => handleCampaignSelect(campaign.id)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">{t('noCampaignsFound')}</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> {t('createFirstCampaign')}
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active" className="mt-6">
              {filteredCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard 
                      key={campaign.id} 
                      campaign={campaign} 
                      onClick={() => handleCampaignSelect(campaign.id)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">{t('noActiveCampaigns')}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="paused" className="mt-6">
              {filteredCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard 
                      key={campaign.id} 
                      campaign={campaign} 
                      onClick={() => handleCampaignSelect(campaign.id)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">{t('noPausedCampaigns')}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              {filteredCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard 
                      key={campaign.id} 
                      campaign={campaign} 
                      onClick={() => handleCampaignSelect(campaign.id)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">{t('noCompletedCampaigns')}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="draft" className="mt-6">
              {filteredCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampaigns.map((campaign) => (
                    <CampaignCard 
                      key={campaign.id} 
                      campaign={campaign} 
                      onClick={() => handleCampaignSelect(campaign.id)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground">{t('noDraftCampaigns')}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
      
      <CreateCampaignDialog 
        open={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateCampaign}
      />
    </div>
  );
}
