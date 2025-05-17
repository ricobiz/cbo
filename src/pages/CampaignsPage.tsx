
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
    name: "Summer Beats Promotion",
    description: "Promoting new electronic album releases for summer",
    platform: "Spotify",
    progress: 65,
    status: "active" as const,
    startDate: "May 15, 2025",
    endDate: "Jun 30, 2025",
    target: {
      type: "plays",
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
    name: "Tech Product Review",
    description: "In-depth review of the latest smartphone",
    platform: "YouTube",
    progress: 42,
    status: "active" as const,
    startDate: "May 20, 2025",
    endDate: "Jul 15, 2025",
    target: {
      type: "views",
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
    name: "Brand Awareness Drive",
    description: "Increasing brand visibility and follower count",
    platform: "Twitter",
    progress: 78,
    status: "active" as const,
    startDate: "May 10, 2025",
    endDate: "Jun 25, 2025",
    target: {
      type: "followers",
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
    name: "Product Launch Campaign",
    description: "New SaaS tool promotional campaign",
    platform: "LinkedIn",
    progress: 100,
    status: "completed" as const,
    startDate: "Apr 1, 2025",
    endDate: "May 15, 2025",
    target: {
      type: "leads",
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
    name: "Holiday Season Special",
    description: "E-commerce promotion for upcoming holiday season",
    platform: "Instagram",
    progress: 0,
    status: "scheduled" as const,
    startDate: "Nov 1, 2025",
    endDate: "Dec 31, 2025",
    target: {
      type: "sales",
      value: 500
    }
  },
  {
    id: "6",
    name: "Video Series Promotion",
    description: "Educational video series on digital marketing",
    platform: "YouTube",
    progress: 35,
    status: "paused" as const,
    startDate: "May 1, 2025",
    endDate: "Jul 31, 2025",
    target: {
      type: "subscribers",
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
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Campaign
        </Button>
      </div>

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="spotify">Spotify</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
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
                  <p className="text-muted-foreground">No campaigns found matching your criteria</p>
                  <Button variant="outline" onClick={() => {
                    setFilterPlatform("all");
                    setFilterStatus("all");
                    setSearchTerm("");
                  }}>
                    Reset Filters
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
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCampaigns.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {activeCampaigns} active, {completedCampaigns} completed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all platforms
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Engagements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEngagements.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Likes, comments, shares
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(mockCampaigns.reduce((sum, c) => sum + c.progress, 0) / mockCampaigns.length)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Campaign progress average
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Overview of all your campaign progress</CardDescription>
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
