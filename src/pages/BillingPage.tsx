
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, DollarSign, AlertCircle, PauseCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { UsageChart } from "@/components/billing/UsageChart";
import { CostBreakdown } from "@/components/billing/CostBreakdown";
import { QuotaSettings } from "@/components/billing/QuotaSettings";
import { useToast } from "@/components/ui/use-toast";

type PeriodType = "day" | "week" | "month" | "quarter";

const BillingPage = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("month");
  const [alertThreshold, setAlertThreshold] = useState("80");
  const [emailAlerts, setEmailAlerts] = useState(true);
  
  const handleSaveQuota = () => {
    toast({
      title: "Quota settings saved",
      description: "Your usage thresholds and alert preferences have been updated.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Billing & Usage</h1>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={(value: PeriodType) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14,352</div>
            <p className="text-xs text-muted-foreground mt-1">
              +24% from last month
            </p>
            <Progress value={72} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">72% of quota</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42.18</div>
            <p className="text-xs text-muted-foreground mt-1">
              +$12.45 from last month
            </p>
            <Progress value={56} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">56% of budget</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 / 5</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 paused due to cost limits
            </p>
            <Progress value={60} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">3 active campaigns</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="usage">
        <TabsList className="mb-4">
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="quotas">Quotas & Alerts</TabsTrigger>
          <TabsTrigger value="billing">Billing Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-4">
          <UsageChart period={selectedPeriod} />
          
          <Card>
            <CardHeader>
              <CardTitle>Campaigns API Usage</CardTitle>
              <CardDescription>View API usage by campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Spotify Summer Track</p>
                    <p className="text-sm text-muted-foreground">5,248 API calls</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$18.36</p>
                    <p className="text-sm text-muted-foreground">Est. cost</p>
                  </div>
                </div>
                <Progress value={65} />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">YouTube Product Review</p>
                    <p className="text-sm text-muted-foreground">4,523 API calls</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$15.83</p>
                    <p className="text-sm text-muted-foreground">Est. cost</p>
                  </div>
                </div>
                <Progress value={42} />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Twitter Growth Campaign</p>
                    <p className="text-sm text-muted-foreground">
                      2,581 API calls
                      <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Paused</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$7.99</p>
                    <p className="text-sm text-muted-foreground">Est. cost</p>
                  </div>
                </div>
                <Progress value={24} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="costs">
          <CostBreakdown period={selectedPeriod} />
        </TabsContent>
        
        <TabsContent value="quotas">
          <QuotaSettings />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
              <CardDescription>Configure when you want to be notified about usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="threshold">Usage Threshold Alert (%)</Label>
                <Input
                  id="threshold"
                  type="number"
                  min="1"
                  max="100"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  You'll be alerted when any campaign reaches this percentage of its quota
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-alerts"
                  checked={emailAlerts}
                  onCheckedChange={setEmailAlerts}
                />
                <Label htmlFor="email-alerts">Email notifications</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="auto-pause" />
                <Label htmlFor="auto-pause">Automatically pause campaigns exceeding budget</Label>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  When a campaign is paused due to cost limits, all active bots will stop their activities.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveQuota}>Save Alert Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <BillingSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingPage;
