
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { VerificationStats } from "@/components/analytics/VerificationStats";

const engagementData = [
  { name: "Week 1", organic: 4000, bot: 2400 },
  { name: "Week 2", organic: 3000, bot: 1398 },
  { name: "Week 3", organic: 2000, bot: 9800 },
  { name: "Week 4", organic: 2780, bot: 3908 },
  { name: "Week 5", organic: 1890, bot: 4800 },
  { name: "Week 6", organic: 2390, bot: 3800 },
  { name: "Week 7", organic: 3490, bot: 4300 },
];

const clickData = [
  { name: "Mon", clicks: 1200 },
  { name: "Tue", clicks: 1900 },
  { name: "Wed", clicks: 3000 },
  { name: "Thu", clicks: 2780 },
  { name: "Fri", clicks: 4890 },
  { name: "Sat", clicks: 3390 },
  { name: "Sun", clicks: 2490 },
];

const audienceData = [
  { name: "18-24", value: 20, color: "#8884d8" },
  { name: "25-34", value: 35, color: "#83a6ed" },
  { name: "35-44", value: 25, color: "#8dd1e1" },
  { name: "45-54", value: 15, color: "#82ca9d" },
  { name: "55+", value: 5, color: "#ffc658" },
];

const AnalyticsPage = () => {
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string | undefined>(undefined);
  const [selectedContentId, setSelectedContentId] = useState<string | undefined>(undefined);

  // Mock content IDs based on platform selection for the demo
  const getContentIds = (platform: string) => {
    if (platform === "youtube") {
      return [
        { id: "video123", name: "Product Review Video" },
        { id: "video456", name: "Tutorial Video" },
      ];
    } else if (platform === "spotify") {
      return [
        { id: "track123", name: "Summer EDM Track" },
        { id: "track456", name: "New Pop Release" },
      ];
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Analytics</h1>
        
        <div className="flex gap-2">
          <Select 
            defaultValue="all" 
            value={selectedCampaign}
            onValueChange={setSelectedCampaign}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="spotify">Spotify Summer Track</SelectItem>
              <SelectItem value="youtube">YouTube Product Review</SelectItem>
              <SelectItem value="twitter">Twitter Growth Campaign</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </Button>
          
          <Button>Export</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 w-full md:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <ActivityChart />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={engagementData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="organic" name="Organic" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="bot" name="Bot-Driven" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={audienceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {audienceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Click Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={clickData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audience Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">Detailed audience analytics will be available in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <p className="text-muted-foreground">Conversion analytics will be available in a future update.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verification" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Выберите платформу и контент</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Платформа</label>
                    <Select 
                      value={selectedPlatform} 
                      onValueChange={(value) => {
                        setSelectedPlatform(value);
                        setSelectedContentId(undefined);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите платформу" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="spotify">Spotify</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedPlatform && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Контент</label>
                      <Select 
                        value={selectedContentId} 
                        onValueChange={setSelectedContentId}
                        disabled={!selectedPlatform}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите контент" />
                        </SelectTrigger>
                        <SelectContent>
                          {getContentIds(selectedPlatform).map(item => (
                            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Статистика верификации</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold text-green-500">75%</div>
                      <div className="text-xs text-muted-foreground">Успешно верифицировано</div>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <div className="text-2xl font-bold">152</div>
                      <div className="text-xs text-muted-foreground">Всего взаимодействий</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>YouTube: 82% успешно</span>
                    <span className="font-medium">82/100</span>
                  </div>
                  <Progress value={82} className="h-1" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Spotify: 63% успешно</span>
                    <span className="font-medium">33/52</span>
                  </div>
                  <Progress value={63} className="h-1" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <VerificationStats 
            platform={selectedPlatform}
            contentId={selectedContentId}
            metricType={selectedPlatform === 'youtube' ? 'view' : 'play'}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;
