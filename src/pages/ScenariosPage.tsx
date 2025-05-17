
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ListChecks, Play, Pencil, Trash, Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface ScenarioProps {
  id: string;
  name: string;
  description: string;
  target: string;
  steps: number;
  completedSteps: number;
  platform: string;
  status: "active" | "draft" | "completed" | "failed";
}

const mockScenarios: ScenarioProps[] = [
  {
    id: "1",
    name: "Spotify Trending Track",
    description: "Push a music track to Spotify trending charts",
    target: "10,000 plays and 500 saves",
    steps: 8,
    completedSteps: 5,
    platform: "Spotify",
    status: "active"
  },
  {
    id: "2",
    name: "YouTube Video Boost",
    description: "Increase engagement on a YouTube product review",
    target: "50,000 views and 2,000 comments",
    steps: 6,
    completedSteps: 6,
    platform: "YouTube",
    status: "completed"
  },
  {
    id: "3",
    name: "Twitter Follower Growth",
    description: "Grow Twitter followers using content strategy",
    target: "5,000 new followers",
    steps: 7,
    completedSteps: 2,
    platform: "Twitter",
    status: "active"
  },
  {
    id: "4",
    name: "Instagram Product Launch",
    description: "Multi-phase product launch campaign",
    target: "1,000 pre-orders",
    steps: 10,
    completedSteps: 0,
    platform: "Instagram",
    status: "draft"
  },
  {
    id: "5",
    name: "Google Search Ranking",
    description: "Improve search ranking for target keywords",
    target: "Top 3 position for main keywords",
    steps: 12,
    completedSteps: 4,
    platform: "Google",
    status: "failed"
  },
  {
    id: "6",
    name: "Multi-Platform Awareness",
    description: "Cross-platform brand awareness campaign",
    target: "500,000 impressions across platforms",
    steps: 15,
    completedSteps: 5,
    platform: "Multiple",
    status: "active"
  }
];

const ScenariosPage = () => {
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredScenarios = mockScenarios.filter(scenario => {
    const matchesPlatform = filterPlatform === "all" || scenario.platform.toLowerCase() === filterPlatform.toLowerCase();
    const matchesStatus = filterStatus === "all" || scenario.status === filterStatus;
    const matchesSearch = scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         scenario.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPlatform && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  const handleAction = (action: string, scenario: ScenarioProps) => {
    toast({
      title: `${action} scenario`,
      description: `${action} action initiated for "${scenario.name}"`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Scenarios</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Scenario
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search scenarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="spotify">Spotify</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="multiple">Multiple</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredScenarios.length > 0 ? (
          filteredScenarios.map((scenario) => (
            <Card key={scenario.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{scenario.name}</CardTitle>
                  {getStatusBadge(scenario.status)}
                </div>
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <div className="flex items-center">
                      <ListChecks className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>Progress</span>
                    </div>
                    <span>
                      {scenario.completedSteps}/{scenario.steps} steps
                    </span>
                  </div>
                  <Progress 
                    value={(scenario.completedSteps / scenario.steps) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm">
                  <Badge variant="outline">{scenario.platform}</Badge>
                  <div className="text-muted-foreground">
                    Target: {scenario.target}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 flex justify-between pt-2">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => handleAction("Edit", scenario)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-100/10 h-8"
                    onClick={() => handleAction("Delete", scenario)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                {scenario.status !== "completed" && scenario.status !== "failed" && (
                  <Button
                    variant={scenario.status === "active" ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleAction(scenario.status === "active" ? "Pause" : "Run", scenario)}
                  >
                    {scenario.status === "active" ? "Pause" : <Play className="mr-1 h-3 w-3" />}
                    {scenario.status === "active" ? "Pause" : "Run"} Scenario
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center p-12 border rounded-lg border-dashed">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">No scenarios found matching your criteria</p>
              <Button variant="outline" onClick={() => {
                setFilterPlatform("all");
                setFilterStatus("all");
                setSearchTerm("");
              }}>
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenariosPage;
