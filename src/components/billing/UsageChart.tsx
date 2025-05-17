
import { BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface UsageChartProps {
  period?: "day" | "week" | "month" | "quarter";
}

export function UsageChart({ period = "month" }: UsageChartProps) {
  // Daily data (last 24 hours)
  const dailyData = [
    { hour: "00:00", openRouter: 120, browserUse: 85 },
    { hour: "03:00", openRouter: 145, browserUse: 92 },
    { hour: "06:00", openRouter: 105, browserUse: 67 },
    { hour: "09:00", openRouter: 240, browserUse: 132 },
    { hour: "12:00", openRouter: 310, browserUse: 245 },
    { hour: "15:00", openRouter: 290, browserUse: 210 },
    { hour: "18:00", openRouter: 325, browserUse: 187 },
    { hour: "21:00", openRouter: 180, browserUse: 93 },
  ];

  // Weekly data
  const weeklyData = [
    { day: "Mon", openRouter: 845, browserUse: 512 },
    { day: "Tue", openRouter: 1045, browserUse: 642 },
    { day: "Wed", openRouter: 1240, browserUse: 820 },
    { day: "Thu", openRouter: 1130, browserUse: 730 },
    { day: "Fri", openRouter: 1380, browserUse: 905 },
    { day: "Sat", openRouter: 820, browserUse: 410 },
    { day: "Sun", openRouter: 740, browserUse: 380 },
  ];

  // Monthly data
  const monthlyData = [
    { date: "05/01", openRouter: 5240, browserUse: 3120 },
    { date: "05/05", openRouter: 4980, browserUse: 2870 },
    { date: "05/10", openRouter: 6310, browserUse: 3580 },
    { date: "05/15", openRouter: 5840, browserUse: 3250 },
    { date: "05/20", openRouter: 7210, browserUse: 4150 },
    { date: "05/25", openRouter: 6430, browserUse: 3820 },
    { date: "05/30", openRouter: 8120, browserUse: 4730 },
  ];

  // Quarterly data
  const quarterlyData = [
    { month: "Jan", openRouter: 24580, browserUse: 14320 },
    { month: "Feb", openRouter: 28450, browserUse: 16740 },
    { month: "Mar", openRouter: 32150, browserUse: 18950 },
    { month: "Apr", openRouter: 35840, browserUse: 21430 },
    { month: "May", openRouter: 42310, browserUse: 24870 },
  ];

  // Select data based on period
  const chartData = 
    period === "day" ? dailyData :
    period === "week" ? weeklyData :
    period === "quarter" ? quarterlyData : 
    monthlyData;
    
  // Define x-axis label based on period
  const xAxisLabel = 
    period === "day" ? "hour" :
    period === "week" ? "day" :
    period === "quarter" ? "month" : "date";

  // Calculate totals
  const totalOpenRouter = chartData.reduce((sum, item) => sum + item.openRouter, 0);
  const totalBrowserUse = chartData.reduce((sum, item) => sum + item.browserUse, 0);
  const totalApiCalls = totalOpenRouter + totalBrowserUse;

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Usage Trends</CardTitle>
        <CardDescription>
          View your API usage trends over time
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{totalApiCalls.toLocaleString()}</div>
                <div className="text-green-500 flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  8.2%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">OpenRouter API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{totalOpenRouter.toLocaleString()}</div>
                <div className="text-green-500 flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  12.5%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">Browser Use API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{totalBrowserUse.toLocaleString()}</div>
                <div className="text-red-500 flex items-center text-sm">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  3.8%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisLabel} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="openRouter" name="OpenRouter API" fill="#4f46e5" />
              <Bar dataKey="browserUse" name="Browser Use API" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
