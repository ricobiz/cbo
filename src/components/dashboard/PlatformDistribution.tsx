
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type PlatformData = {
  name: string;
  value: number;
  color: string;
}

// Empty data set for initial state
const emptyData: PlatformData[] = [
  { name: "No Data", value: 100, color: "hsl(var(--muted))" }
];

export function PlatformDistribution() {
  const data = emptyData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] flex items-center justify-center">
          {data.length === 1 && data[0].name === "No Data" ? (
            <div className="text-center text-muted-foreground">
              <p>No platform distribution data available yet</p>
            </div>
          ) : (
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
          )}
        </div>
        <div className="flex justify-center flex-wrap gap-4 mt-4">
          {data[0].name !== "No Data" && data.map((platform) => (
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
