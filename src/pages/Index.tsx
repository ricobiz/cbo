
import { BarChart3, Bot, Eye, MessageSquare } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { CampaignProgress } from "@/components/dashboard/CampaignProgress";
import { PlatformDistribution } from "@/components/dashboard/PlatformDistribution";
import { RecentContent } from "@/components/dashboard/RecentContent";
import { QuickActions } from "@/components/dashboard/QuickActions";

const activeCampaigns = [
  {
    name: "Spotify Summer Track",
    target: "50,000 plays",
    progress: 100,
    platform: "Spotify",
    endDate: "Jun 30, 2025"
  },
  {
    name: "YouTube Product Review",
    target: "100,000 views",
    progress: 85,
    platform: "YouTube",
    endDate: "Jul 15, 2025"
  },
  {
    name: "TikTok Marketing Campaign",
    target: "250,000 views",
    progress: 75,
    platform: "TikTok",
    endDate: "Jun 25, 2025"
  }
];

const recentContent = [
  {
    id: "1",
    title: "10 Ways AI is Revolutionizing Marketing in 2025",
    platform: "YouTube",
    status: "approved" as const,
    timestamp: "2 hours ago",
    stats: {
      likes: 8245,
      comments: 1256
    }
  },
  {
    id: "2",
    title: "AI-powered automation can boost your productivity by 200%!",
    platform: "Twitter",
    status: "approved" as const,
    timestamp: "4 hours ago",
    stats: {
      likes: 3458,
      comments: 521
    }
  },
  {
    id: "3",
    title: "The Future of Marketing: AI Trends for 2026",
    platform: "Instagram",
    status: "approved" as const,
    timestamp: "Yesterday",
    stats: {
      likes: 5672,
      comments: 894
    }
  }
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Campaigns"
          value="24"
          icon={<BarChart3 className="h-4 w-4 text-primary" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Bots"
          value="17"
          icon={<Bot className="h-4 w-4 text-secondary" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Generated Content"
          value="342"
          icon={<MessageSquare className="h-4 w-4 text-accent" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Views"
          value="825.3k"
          icon={<Eye className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 24, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
