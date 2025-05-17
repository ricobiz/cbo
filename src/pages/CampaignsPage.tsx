import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateCampaignDialog } from '@/components/campaigns/CreateCampaignDialog';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import { CampaignDetails } from '@/components/campaigns/CampaignDetails';
import { Plus, Filter, SortAsc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import externalAPIService from "@/services/external-api";

export default function CampaignsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  
  // Fetch campaigns on component mount
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const mockCampaigns = [
      {
        id: "1",
        name: "Spotify Summer Track",
        platform: "spotify",
        status: "active",
        progress: 65,
        metrics: {
          plays: 3240,
          likes: 156,
          comments: 42
        },
        startDate: "2023-05-15",
        endDate: "2023-06-15",
        description: "Campaign to promote summer playlist and increase plays on featured tracks.",
        contentIds: ["track123", "playlist456"],
        targetAudience: "18-24 year olds interested in pop music",
        budget: 500,
        spent: 325
      },
      {
        id: "2",
        name: "YouTube Product Review",
        platform: "youtube",
        status: "active",
        progress: 42,
        metrics: {
          views: 12540,
          likes: 876,
          comments: 234,
          shares: 56
        },
        startDate: "2023-05-10",
        endDate: "2023-06-10",
        description: "Product review campaign for new tech gadget launch.",
        contentIds: ["video789"],
        targetAudience: "Tech enthusiasts and early adopters",
        budget: 1200,
        spent: 504
      },
      {
        id: "3",
        name: "Instagram Fashion Collection",
        platform: "instagram",
        status: "paused",
        progress: 28,
        metrics: {
          views: 8760,
          likes: 1243,
          comments: 89,
          saves: 156
        },
        startDate: "2023-05-05",
        endDate: "2023-06-05",
        description: "Campaign to showcase new summer fashion collection.",
        contentIds: ["post123", "post456"],
        targetAudience: "Fashion enthusiasts aged 18-35",
        budget: 800,
        spent: 224
      },
      {
        id: "4",
        name: "TikTok Dance Challenge",
        platform: "tiktok",
        status: "completed",
        progress: 100,
        metrics: {
          views: 45600,
          likes: 8900,
          shares: 1200,
          comments: 560
        },
        startDate: "2023-04-01",
        endDate: "2023-05-01",
        description: "Viral dance challenge campaign for brand awareness.",
        contentIds: ["video123", "video456"],
        targetAudience: "Gen Z users interested in dance and music",
        budget: 1500,
        spent: 1500
      },
      {
        id: "5",
        name: "Twitter Product Launch",
        platform: "twitter",
        status: "draft",
        progress: 0,
        metrics: {
          impressions: 0,
          likes: 0,
          retweets: 0,
          replies: 0
        },
        startDate: "",
        endDate: "",
        description: "Upcoming product launch campaign on Twitter.",
        contentIds: [],
        targetAudience: "Tech professionals and industry influencers",
        budget: 1000,
        spent: 0
      }
    ];
    
    setCampaigns(mockCampaigns);
  }, []);
  
  // Filter campaigns based on search query and active tab
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.platform.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return matchesSearch && campaign.status === "active";
    if (activeTab === "paused") return matchesSearch && campaign.status === "paused";
    if (activeTab === "completed") return matchesSearch && campaign.status === "completed";
    if (activeTab === "draft") return matchesSearch && campaign.status === "draft";
    
    return matchesSearch;
  });
  
  const handleCreateCampaign = (campaignData: any) => {
    // In a real app, this would send data to an API
    console.log("Creating campaign:", campaignData);
    
    // Add the new campaign to the list with a mock ID
    const newCampaign = {
      id: `new-${Date.now()}`,
      ...campaignData,
      status: "draft",
      progress: 0,
      metrics: {
        views: 0,
        likes: 0,
        comments: 0
      }
    };
    
    setCampaigns([...campaigns, newCampaign]);
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
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage your marketing campaigns across platforms
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Campaign
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
                placeholder="Search campaigns..."
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
                <DropdownMenuItem>Filter by Platform</DropdownMenuItem>
                <DropdownMenuItem>Filter by Status</DropdownMenuItem>
                <DropdownMenuItem>Filter by Date</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SortAsc className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Sort by Name</DropdownMenuItem>
                <DropdownMenuItem>Sort by Date</DropdownMenuItem>
                <DropdownMenuItem>Sort by Progress</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Campaigns</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
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
                  <p className="text-muted-foreground mb-4">No campaigns found</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create your first campaign
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
                  <p className="text-muted-foreground">No active campaigns found</p>
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
                  <p className="text-muted-foreground">No paused campaigns found</p>
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
                  <p className="text-muted-foreground">No completed campaigns found</p>
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
                  <p className="text-muted-foreground">No draft campaigns found</p>
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
