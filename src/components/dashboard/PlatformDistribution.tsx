
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type PlatformData = {
  name: string;
  value: number;
  color: string;
}

// Updated with more realistic distribution
const data: PlatformData[] = [
  { name: "YouTube", value: 35, color: "#FF0000" },
  { name: "Spotify", value: 25, color: "#1DB954" },
  { name: "Twitter", value: 15, color: "#1DA1F2" },
  { name: "Instagram", value: 15, color: "#C13584" },
  { name: "TikTok", value: 10, color: "#000000" },
];

export function PlatformDistribution() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, 'Distribution']}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center flex-wrap gap-4 mt-4">
          {data.map((platform) => (
            <div key={platform.name} className="flex items-center">
              <div 
                className="h-3 w-3 rounded-full mr-2"
                style={{ backgroundColor: platform.color }}
              />
              <span className="text-sm text-muted-foreground">
                {platform.name} ({platform.value}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
