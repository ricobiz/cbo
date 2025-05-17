
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Empty data for various time periods
const emptyDailyData = [
  { name: "Mon", clicks: 0, engagements: 0, views: 0 },
  { name: "Tue", clicks: 0, engagements: 0, views: 0 },
  { name: "Wed", clicks: 0, engagements: 0, views: 0 },
  { name: "Thu", clicks: 0, engagements: 0, views: 0 },
  { name: "Fri", clicks: 0, engagements: 0, views: 0 },
  { name: "Sat", clicks: 0, engagements: 0, views: 0 },
  { name: "Sun", clicks: 0, engagements: 0, views: 0 },
];

const emptyWeeklyData = [
  { name: "Week 1", clicks: 0, engagements: 0, views: 0 },
  { name: "Week 2", clicks: 0, engagements: 0, views: 0 },
  { name: "Week 3", clicks: 0, engagements: 0, views: 0 },
  { name: "Week 4", clicks: 0, engagements: 0, views: 0 },
];

const emptyMonthlyData = [
  { name: "Jan", clicks: 0, engagements: 0, views: 0 },
  { name: "Feb", clicks: 0, engagements: 0, views: 0 },
  { name: "Mar", clicks: 0, engagements: 0, views: 0 },
  { name: "Apr", clicks: 0, engagements: 0, views: 0 },
  { name: "May", clicks: 0, engagements: 0, views: 0 },
];

export function ActivityChart() {
  const [timeRange, setTimeRange] = useState("7d");
  
  // Choose the appropriate dataset based on the selected time range
  const getChartData = () => {
    switch(timeRange) {
      case "24h":
        return emptyDailyData.slice(5); // Just show 2 days for 24h
      case "7d":
        return emptyDailyData;
      case "30d":
        return emptyWeeklyData;
      case "90d":
        return emptyMonthlyData;
      default:
        return emptyDailyData;
    }
  };
  
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-0.5">
          <CardTitle>Campaign Activity</CardTitle>
          <CardDescription>No activity recorded yet</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={getChartData()}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEngagements" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorViews)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="engagements" 
                stroke="hsl(var(--secondary))" 
                fillOpacity={1} 
                fill="url(#colorEngagements)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="clicks" 
                stroke="hsl(var(--accent))" 
                fillOpacity={1} 
                fill="url(#colorClicks)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-8 py-4">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-primary mr-2" />
            <span className="text-sm text-muted-foreground">Views</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-secondary mr-2" />
            <span className="text-sm text-muted-foreground">Engagements</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-accent mr-2" />
            <span className="text-sm text-muted-foreground">Clicks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
