
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// More realistic data for the chart
const dailyData = [
  { name: "Mon", clicks: 34, engagements: 23, views: 67 },
  { name: "Tue", clicks: 42, engagements: 31, views: 89 },
  { name: "Wed", clicks: 38, engagements: 26, views: 72 },
  { name: "Thu", clicks: 51, engagements: 37, views: 102 },
  { name: "Fri", clicks: 63, engagements: 45, views: 128 },
  { name: "Sat", clicks: 47, engagements: 28, views: 91 },
  { name: "Sun", clicks: 36, engagements: 21, views: 74 },
];

const weeklyData = [
  { name: "Week 1", clicks: 263, engagements: 187, views: 512 },
  { name: "Week 2", clicks: 321, engagements: 215, views: 624 },
  { name: "Week 3", clicks: 287, engagements: 194, views: 578 },
  { name: "Week 4", clicks: 345, engagements: 231, views: 692 },
];

const monthlyData = [
  { name: "Jan", clicks: 1145, engagements: 763, views: 2290 },
  { name: "Feb", clicks: 1253, engagements: 812, views: 2465 },
  { name: "Mar", clicks: 1492, engagements: 973, views: 3015 },
  { name: "Apr", clicks: 1357, engagements: 884, views: 2715 },
  { name: "May", clicks: 1623, engagements: 1047, views: 3246 },
];

export function ActivityChart() {
  const [timeRange, setTimeRange] = useState("7d");
  
  // Choose the appropriate dataset based on the selected time range
  const getChartData = () => {
    switch(timeRange) {
      case "24h":
        // For 24h we'll just use the daily data but with fewer points
        return dailyData.slice(2);
      case "7d":
        return dailyData;
      case "30d":
        return weeklyData;
      case "90d":
        return monthlyData;
      default:
        return dailyData;
    }
  };
  
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-0.5">
          <CardTitle>Campaign Activity</CardTitle>
          <CardDescription>Activity across all platforms</CardDescription>
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
