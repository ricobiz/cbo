
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

const activityData = [
  { time: "00:00", active: 3 },
  { time: "03:00", active: 2 },
  { time: "06:00", active: 5 },
  { time: "09:00", active: 8 },
  { time: "12:00", active: 10 },
  { time: "15:00", active: 9 },
  { time: "18:00", active: 12 },
  { time: "21:00", active: 7 },
];

const ipRotationData = [
  { time: "00:00", rotations: 4 },
  { time: "03:00", rotations: 5 },
  { time: "06:00", rotations: 3 },
  { time: "09:00", rotations: 7 },
  { time: "12:00", rotations: 8 },
  { time: "15:00", rotations: 6 },
  { time: "18:00", rotations: 9 },
  { time: "21:00", rotations: 5 },
];

export function BotMonitoring() {
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Bot Monitoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Active Bots</div>
            <div className="text-2xl font-bold">12/20</div>
            <div className="mt-2">
              <Progress value={60} className="h-1" />
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Bot Health</div>
            <div className="text-2xl font-bold">96%</div>
            <div className="mt-2">
              <Progress value={96} className="h-1" />
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Active Sessions</div>
            <div className="text-2xl font-bold">45</div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                23 YouTube
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                22 Twitter
              </Badge>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">IP Rotation Status</div>
            <div className="text-2xl font-bold">Active</div>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                47 IPs Used
              </Badge>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                3 Flagged
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Bot Activity (24h)</h3>
          <div className="h-[200px]">
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
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">IP Rotations (24h)</h3>
          <div className="h-[200px]">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
