
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CampaignProps {
  name: string;
  target: string;
  progress: number;
  platform: string;
  endDate: string;
}

export function CampaignProgress({ campaigns }: { campaigns: CampaignProps[] }) {
  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500";
    if (progress >= 70) return "bg-emerald-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 30) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Active Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {campaigns.map((campaign) => (
            <div key={campaign.name} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{campaign.name}</span>
                  <div className="text-xs text-muted-foreground">
                    {campaign.platform} · Target: {campaign.target}
                  </div>
                </div>
                <span className="text-sm font-medium">{campaign.progress}%</span>
              </div>
              <Progress value={campaign.progress} className={`h-2 ${getProgressColor(campaign.progress)}`} />
              <div className="text-xs text-muted-foreground text-right">
                End date: {campaign.endDate}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
