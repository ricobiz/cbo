
import { BarChart3, Bot, Eye, MessageSquare } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { CampaignProgress } from "@/components/dashboard/CampaignProgress";
import { PlatformDistribution } from "@/components/dashboard/PlatformDistribution";
import { RecentContent } from "@/components/dashboard/RecentContent";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Updated with more realistic data
const activeCampaigns = [
  {
    name: "Spotify Summer Promotion",
    target: "10,000 plays",
    progress: 62,
    platform: "Spotify",
    endDate: "Jun 30, 2025"
  },
  {
    name: "YouTube Product Launch",
    target: "25,000 views",
    progress: 34,
    platform: "YouTube",
    endDate: "Jul 15, 2025"
  },
  {
    name: "TikTok Viral Challenge",
    target: "50,000 views",
    progress: 18,
    platform: "TikTok",
    endDate: "Jun 25, 2025"
  }
];

// More realistic content entries
const recentContent = [
  {
    id: "1",
    title: "Product Demo: New Features Overview",
    platform: "YouTube",
    status: "approved" as const,
    timestamp: "2 hours ago",
    stats: {
      likes: 245,
      comments: 56
    }
  },
  {
    id: "2",
    title: "Check out our latest update - now with AI integration",
    platform: "Twitter",
    status: "pending" as const,
    timestamp: "4 hours ago",
    stats: {
      likes: 158,
      comments: 21
    }
  },
  {
    id: "3",
    title: "Behind the scenes: How we built our platform",
    platform: "Instagram",
    status: "approved" as const,
    timestamp: "Yesterday",
    stats: {
      likes: 372,
      comments: 47
    }
  }
];

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
        
        // Set realistic values
        setStatsData({
          campaigns: { value: "7", trend: 5 },
          bots: { value: "12", trend: 3 },
          content: { value: "43", trend: -2 },
          views: { value: "12.5k", trend: 8 },
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CampaignProgress campaigns={activeCampaigns} />
        <PlatformDistribution />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentContent items={recentContent} />
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
