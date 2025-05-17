
import { BarChart3, Bot, Eye, MessageSquare } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { CampaignProgress } from "@/components/dashboard/CampaignProgress";
import { PlatformDistribution } from "@/components/dashboard/PlatformDistribution";
import { RecentContent } from "@/components/dashboard/RecentContent";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Empty initial data
const activeCampaigns = [];

// Empty content entries
const recentContent = [];

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    campaigns: { value: "0", trend: 0 },
    bots: { value: "0", trend: 0 },
    content: { value: "0", trend: 0 },
    views: { value: "0", trend: 0 },
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set values to 0 to reflect the empty state
        setStatsData({
          campaigns: { value: "0", trend: 0 },
          bots: { value: "0", trend: 0 },
          content: { value: "0", trend: 0 },
          views: { value: "0", trend: 0 },
        });
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.error("Error loading dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-background p-4 rounded-lg shadow-sm border">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <div className="text-xs md:text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Campaigns"
          value={statsData.campaigns.value}
          icon={<BarChart3 className="h-4 w-4 text-primary" />}
          trend={{ value: statsData.campaigns.trend, isPositive: statsData.campaigns.trend >= 0 }}
        />
        <StatsCard
          title="Active Bots"
          value={statsData.bots.value}
          icon={<Bot className="h-4 w-4 text-secondary" />}
          trend={{ value: statsData.bots.trend, isPositive: statsData.bots.trend >= 0 }}
        />
        <StatsCard
          title="Generated Content"
          value={statsData.content.value}
          icon={<MessageSquare className="h-4 w-4 text-accent" />}
          trend={{ value: statsData.content.trend, isPositive: statsData.content.trend >= 0 }}
          description="Last 30 days"
        />
        <StatsCard
          title="Total Views"
          value={statsData.views.value}
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: statsData.views.trend, isPositive: statsData.views.trend >= 0 }}
          description="Across all platforms"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ActivityChart />
      </div>
      
      {activeCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CampaignProgress campaigns={activeCampaigns} />
          <PlatformDistribution />
        </div>
      ) : (
        <div className="bg-muted p-8 rounded-lg text-center">
          <h3 className="text-lg font-medium mb-2">No Active Campaigns</h3>
          <p className="text-muted-foreground mb-4">
            Create your first campaign to start tracking progress
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recentContent.length > 0 ? (
          <RecentContent items={recentContent} />
        ) : (
          <div className="bg-muted p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-2">No Recent Content</h3>
            <p className="text-muted-foreground">
              Generated content will appear here
            </p>
          </div>
        )}
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
