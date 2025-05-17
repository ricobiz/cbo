
import { useState } from "react";
import { BotCard } from "@/components/bots/BotCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const mockBots = [
  {
    id: "1",
    name: "Content Generator Bot",
    description: "Creates trending content for various platforms using GPT-4",
    status: "active" as const,
    type: "content" as const,
    lastRun: "10 mins ago"
  },
  {
    id: "2",
    name: "Social Interaction Simulator",
    description: "Simulates likes, shares, comments, and other social interactions",
    status: "active" as const,
    type: "interaction" as const,
    lastRun: "25 mins ago"
  },
  {
    id: "3",
    name: "YouTube Click Bot",
    description: "Drives organic traffic and engagement on YouTube videos",
    status: "idle" as const,
    type: "click" as const,
    lastRun: "2 hours ago"
  },
  {
    id: "4",
    name: "Spotify Stream Bot",
    description: "Increases plays and engagement on Spotify tracks",
    status: "idle" as const,
    type: "click" as const,
    lastRun: "5 hours ago"
  },
  {
    id: "5",
    name: "Analytics Parser Bot",
    description: "Monitors campaign performance and collects real-time metrics",
    status: "active" as const,
    type: "parser" as const,
    lastRun: "15 mins ago"
  },
  {
    id: "6",
    name: "Instagram Engagement Bot",
    description: "Drives likes, follows, and comments on Instagram posts",
    status: "error" as const,
    type: "interaction" as const,
    lastRun: "2 days ago"
  },
];

const BotsPage = () => {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBots = mockBots.filter(bot => {
    const matchesType = filterType === "all" || bot.type === filterType;
    const matchesStatus = filterStatus === "all" || bot.status === filterStatus;
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         bot.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Bots</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Bot
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search bots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="interaction">Interaction</SelectItem>
              <SelectItem value="click">Click</SelectItem>
              <SelectItem value="parser">Parser</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBots.length > 0 ? (
          filteredBots.map((bot) => (
            <BotCard key={bot.id} {...bot} />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center p-12 border rounded-lg border-dashed">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">No bots found matching your criteria</p>
              <Button variant="outline" onClick={() => {
                setFilterType("all");
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

export default BotsPage;
