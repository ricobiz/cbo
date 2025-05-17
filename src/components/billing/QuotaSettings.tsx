
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PauseCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function QuotaSettings() {
  const { toast } = useToast();
  const [openRouterLimit, setOpenRouterLimit] = useState("10000");
  const [browserUseLimit, setBrowserUseLimit] = useState("5000");
  const [costLimit, setCostLimit] = useState("50");
  
  const handleSaveQuotas = () => {
    toast({
      title: "Quota limits saved",
      description: "Your API usage and cost limits have been updated.",
    });
  };
  
  // Example campaign data
  const campaigns = [
    {
      id: "1",
      name: "Spotify Summer Track",
      apiUsage: 5248,
      apiLimit: 10000,
      costUsage: 18.36,
      costLimit: 25,
      status: "active"
    },
    {
      id: "2",
      name: "YouTube Product Review",
      apiUsage: 4523,
      apiLimit: 8000,
      costUsage: 15.83,
      costLimit: 20,
      status: "active"
    },
    {
      id: "3",
      name: "Twitter Growth Campaign",
      apiUsage: 2581,
      apiLimit: 5000,
      costUsage: 7.99,
      costLimit: 10,
      status: "paused"
    }
  ];
  
  const toggleCampaignStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    toast({
      title: `Campaign ${newStatus}`,
      description: `Campaign has been ${newStatus}.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Usage Quotas</CardTitle>
          <CardDescription>Set limits for API usage and costs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="openrouter-limit">OpenRouter API Monthly Limit</Label>
              <Input
                id="openrouter-limit"
                type="number"
                min="1"
                value={openRouterLimit}
                onChange={(e) => setOpenRouterLimit(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Current usage: 8,520 calls (85.2%)</p>
              <Progress value={85.2} className="mt-1" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="browseruse-limit">Browser Use API Monthly Limit</Label>
              <Input
                id="browseruse-limit"
                type="number"
                min="1"
                value={browserUseLimit}
                onChange={(e) => setBrowserUseLimit(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Current usage: 3,245 calls (64.9%)</p>
              <Progress value={64.9} className="mt-1" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cost-limit">Monthly Cost Limit ($)</Label>
            <Input
              id="cost-limit"
              type="number"
              min="1"
              step="0.01"
              value={costLimit}
              onChange={(e) => setCostLimit(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Current spend: $42.18 (84.4%)</p>
            <Progress value={84.4} className="mt-1" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveQuotas}>Save Quota Limits</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Campaign Cost Management</CardTitle>
          <CardDescription>Monitor and control costs for individual campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-base">{campaign.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {campaign.apiUsage.toLocaleString()} API calls / {campaign.apiLimit.toLocaleString()} limit
                    </p>
                  </div>
                  <Button
                    variant={campaign.status === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                  >
                    {campaign.status === "active" ? (
                      <>
                        <PauseCircle className="h-4 w-4 mr-2" />
                        Pause Campaign
                      </>
                    ) : (
                      "Resume Campaign"
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">${campaign.costUsage.toFixed(2)} / ${campaign.costLimit} limit</span>
                  <span className="text-sm font-medium">
                    {Math.round((campaign.costUsage / campaign.costLimit) * 100)}%
                  </span>
                </div>
                <Progress value={(campaign.costUsage / campaign.costLimit) * 100} className="mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
