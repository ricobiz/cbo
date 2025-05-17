
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
import { botService } from "@/services/BotService";

export function BotMonitoring() {
  const { bots, fetchBots } = useBotStore();
  const [activityData, setActivityData] = useState<{ time: string; active: number }[]>([]);
  const [ipRotationData, setIpRotationData] = useState<{ time: string; rotations: number }[]>([]);
  
  // Fetch bots on component mount
  useEffect(() => {
    fetchBots();
    
    // Generate empty activity and rotation data for charts
    generateEmptyChartData();
  }, [fetchBots]);
  
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
  
  // Calculate metrics
  const activeBots = bots.filter(bot => bot.status === "active").length;
  const totalBots = bots.length;
  const botHealth = totalBots > 0 ? botService.getBotHealth() : 100;
  
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

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Bot Monitoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Active Bots</div>
            <div className="text-2xl font-bold">{activeBots}/{totalBots}</div>
            <div className="mt-2">
              <Progress value={totalBots > 0 ? (activeBots / totalBots) * 100 : 0} className="h-1" />
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Bot Health</div>
            <div className="text-2xl font-bold">{botHealth}%</div>
            <div className="mt-2">
              <Progress value={botHealth} className="h-1" />
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
                    0 IPs Used
                  </Badge>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                    0 Flagged
                  </Badge>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">No active IP rotations</span>
              )}
            </div>
          </div>
        </div>
        
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
