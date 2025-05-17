
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useBotStore } from "@/store/BotStore";
import { botService, BotActivity } from "@/services/BotService";
import { Clock, Eye, FileText, UserPlus, Activity } from "lucide-react";

export function BotMonitoring() {
  const { bots, fetchBots, botActivities, refreshBotActivities } = useBotStore();
  const [activityData, setActivityData] = useState<{ time: string; active: number }[]>([]);
  const [ipRotationData, setIpRotationData] = useState<{ time: string; rotations: number }[]>([]);
  
  // Fetch bots on component mount
  useEffect(() => {
    fetchBots();
    
    // Generate empty activity and rotation data for charts
    generateEmptyChartData();
    
    // Set up interval to refresh activities
    refreshBotActivities();
    
    // Start a timer to simulate chart data changes for active bots
    const chartInterval = setInterval(() => {
      if (bots.filter(bot => bot.status === "active").length > 0) {
        updateChartData();
      }
    }, 30000); // Update every 30 seconds
    
    return () => {
      clearInterval(chartInterval);
    };
  }, [fetchBots, refreshBotActivities]);
  
  // Update charts when active bots change
  useEffect(() => {
    const activeBotCount = bots.filter(bot => bot.status === "active").length;
    if (activeBotCount > 0) {
      updateChartData();
    } else {
      generateEmptyChartData();
    }
  }, [bots.filter(bot => bot.status === "active").length]);
  
  const generateEmptyChartData = () => {
    const hours = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
    
    const emptyActivity = hours.map(time => ({
      time,
      active: 0
    }));
    
    const emptyRotations = hours.map(time => ({
      time,
      rotations: 0
    }));
    
    setActivityData(emptyActivity);
    setIpRotationData(emptyRotations);
  };
  
  const updateChartData = () => {
    // Only update if we have active bots
    const activeBotCount = bots.filter(bot => bot.status === "active").length;
    if (activeBotCount === 0) return;
    
    // Get current time and create hour segments for the chart
    const now = new Date();
    const hours = Array(8).fill(0).map((_, i) => {
      const d = new Date(now);
      d.setHours(d.getHours() - 21 + i * 3);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    
    // Generate semi-random activity data based on active bots
    const newActivityData = hours.map((time, index) => {
      // More activity during working hours, less at night
      const timeBoost = index > 1 && index < 6 ? 1.5 : 0.5;
      // Random activity level based on number of active bots
      const activity = Math.round(
        Math.max(0, activeBotCount * timeBoost * (0.7 + Math.random() * 0.6))
      );
      
      return {
        time,
        active: activity
      };
    });
    
    // Generate semi-random IP rotation data
    const newRotationData = hours.map((time, index) => {
      // More rotations during high activity periods
      const rotations = Math.round(
        Math.max(0, activeBotCount * 0.3 * (0.5 + Math.random() * 1))
      );
      
      return {
        time,
        rotations
      };
    });
    
    setActivityData(newActivityData);
    setIpRotationData(newRotationData);
  };
  
  // Calculate metrics
  const activeBots = bots.filter(bot => bot.status === "active").length;
  const totalBots = bots.length;
  
  // Only calculate bot health if there are bots, otherwise show N/A
  const botHealth = totalBots > 0 ? botService.getBotHealth() : "N/A";
  
  // Count active sessions by platform
  const sessionsByPlatform = bots.reduce((acc, bot) => {
    if (bot.status === "active") {
      const platform = bot.name.toLowerCase().includes("youtube") ? "YouTube" : 
                      bot.name.toLowerCase().includes("twitter") ? "Twitter" :
                      bot.name.toLowerCase().includes("instagram") ? "Instagram" :
                      bot.name.toLowerCase().includes("tiktok") ? "TikTok" :
                      "Other";
      
      acc[platform] = (acc[platform] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  const sessionBadges = Object.entries(sessionsByPlatform).map(([platform, count]) => (
    <Badge key={platform} variant="outline" className={`
      ${platform === 'YouTube' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''}
      ${platform === 'Twitter' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : ''}
      ${platform === 'Instagram' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : ''}
      ${platform === 'TikTok' ? 'bg-black/10 text-foreground border-foreground/20' : ''}
      ${platform === 'Other' ? 'bg-gray-500/10 text-gray-500 border-gray-500/20' : ''}
    `}>
      {count} {platform}
    </Badge>
  ));

  const totalActiveSessions = Object.values(sessionsByPlatform).reduce((sum, count) => sum + count, 0);
  
  // Helper to get activity icon
  const getActivityIcon = (type: BotActivity['type']) => {
    switch (type) {
      case 'browsing':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'content_creation':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'engagement':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'account_interaction':
        return <UserPlus className="h-4 w-4 text-amber-500" />;
      case 'data_collection':
        return <Activity className="h-4 w-4 text-red-500" />;
      case 'ip_rotation':
        return <Activity className="h-4 w-4 text-gray-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };
  
  // Format time since activity occurred
  const formatTimeSince = (timestamp: string) => {
    const activityTime = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000);
    
    if (diffSeconds < 5) return 'just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  };

  const renderBotActions = () => {
    if (activeBots === 0) {
      return (
        <div className="border rounded-lg p-4 mt-4">
          <h3 className="text-sm font-medium mb-3">Active Bot Tasks</h3>
          <div className="flex items-center justify-center h-[100px] border-dashed border rounded-lg bg-muted/30">
            <p className="text-muted-foreground">No active bot tasks</p>
          </div>
        </div>
      );
    }

    return (
      <div className="border rounded-lg p-4 mt-4">
        <h3 className="text-sm font-medium mb-3">Active Bot Tasks</h3>
        <div className="space-y-3">
          {bots
            .filter(bot => bot.status === "active")
            .map(bot => {
              // Get the current activity
              const activity = botActivities[bot.id];
              
              // Determine activity timing
              const activityTime = activity ? formatTimeSince(activity.timestamp) : 'Just started';
              
              // Determine platform
              const platformMatch = bot.name.toLowerCase().match(/youtube|twitter|instagram|tiktok|facebook|linkedin|spotify/);
              const platform = platformMatch ? platformMatch[0].charAt(0).toUpperCase() + platformMatch[0].slice(1) : "Multiple platforms";
              
              // Determine which accounts the bot is using
              const accountsInfo = bot.emailAccounts?.length 
                ? `Working with ${bot.emailAccounts.length} account(s)` 
                : "No accounts connected";
                
              return (
                <div key={bot.id} className="p-3 border rounded-lg bg-background">
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{bot.name}</div>
                    <Badge variant={bot.type === "content" ? "default" : 
                                    bot.type === "interaction" ? "secondary" :
                                    bot.type === "click" ? "outline" : 
                                    "destructive"}>
                      {bot.type.charAt(0).toUpperCase() + bot.type.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    {activity ? getActivityIcon(activity.type) : <Activity className="h-4 w-4" />}
                    <div className="text-sm font-medium">
                      {activity ? activity.details : "Initializing..."}
                    </div>
                  </div>
                  
                  <div className="mt-1 text-xs">
                    {activity?.target && (
                      <div className="truncate text-blue-500">
                        {activity.target}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <div>{accountsInfo}</div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activityTime}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Bot Monitoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Active Bots</div>
            <div className="text-2xl font-bold">{activeBots}</div>
            <div className="mt-2">
              <Progress value={totalBots > 0 ? (activeBots / totalBots) * 100 : 0} className="h-1" />
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Bot Health</div>
            <div className="text-2xl font-bold">
              {typeof botHealth === "number" ? `${botHealth}%` : botHealth}
            </div>
            <div className="mt-2">
              <Progress 
                value={typeof botHealth === "number" ? botHealth : 0} 
                className={`h-1 ${totalBots === 0 ? "bg-gray-200" : ""}`} 
              />
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Active Sessions</div>
            <div className="text-2xl font-bold">{totalActiveSessions}</div>
            <div className="mt-2 flex gap-2 flex-wrap">
              {sessionBadges.length > 0 ? (
                sessionBadges
              ) : (
                <span className="text-xs text-muted-foreground">No active sessions</span>
              )}
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">IP Rotation Status</div>
            <div className="text-2xl font-bold">{activeBots > 0 ? "Active" : "Inactive"}</div>
            <div className="mt-2 flex gap-2">
              {activeBots > 0 ? (
                <>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    {Math.ceil(activeBots * 0.8)} IPs Used
                  </Badge>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                    {Math.floor(activeBots * 0.1)} Flagged
                  </Badge>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">No active IP rotations</span>
              )}
            </div>
          </div>
        </div>

        {renderBotActions()}
        
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Bot Activity (24h)</h3>
          <div className="h-[200px]">
            {activeBots > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <XAxis 
                    dataKey="time" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`} 
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center border-dashed border rounded-lg bg-muted/30">
                <p className="text-muted-foreground">No activity data available</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">IP Rotations (24h)</h3>
          <div className="h-[200px]">
            {activeBots > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ipRotationData}>
                  <XAxis 
                    dataKey="time" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`} 
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="rotations"
                    fill="#16a34a20"
                    stroke="#16a34a"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center border-dashed border rounded-lg bg-muted/30">
                <p className="text-muted-foreground">No IP rotation data available</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
