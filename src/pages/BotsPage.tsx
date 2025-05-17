
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Bot, Plus, Filter, Search, AlignLeft, Grid3x3, MoreVertical, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { Bot as BotType, BotStatus, BotConfig, BotSchedule, BotProxy } from "@/services/BotService";
import { useBotStore } from "@/store/BotStore";
import { BotCard } from "@/components/bots/BotCard";
import { BotCreationWizard } from "@/components/bots/BotCreationWizard";
import { BotHealthIndicator } from "@/components/bots/BotHealthIndicator";
import { QuickBotCreator } from "@/components/bots/QuickBotCreator";
import { BotMonitoring } from "@/components/bots/BotMonitoring";

const BotsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<"grid" | "list">("grid");
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  const { 
    bots, 
    filterType, 
    filterStatus, 
    searchTerm, 
    ipRotationEnabled,
    fetchBots,
    startBot,
    stopBot,
    setFilterType,
    setFilterStatus,
    setSearchTerm,
    setIpRotationEnabled
  } = useBotStore();

  const { toast } = useToast();

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  const handleRefreshBots = () => {
    toast({
      title: "Refreshing bots",
      description: "Getting the latest bot status..."
    });
    fetchBots();
  };

  const handleCreateBot = () => {
    setIsCreateDialogOpen(true);
  };

  const handleQuickCreate = () => {
    setIsQuickCreateOpen(true);
  };

  const filteredBots = bots.filter(bot => {
    // Filter by type
    if (filterType !== "all" && bot.type !== filterType) {
      return false;
    }

    // Filter by status
    if (filterStatus !== "all" && bot.status !== filterStatus) {
      return false;
    }

    // Search by name or description
    if (searchTerm && !bot.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !bot.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  const getDefaultConfig = (): BotConfig => ({
    actionDelay: [1000, 3000],
    mouseMovement: "natural",
    scrollPattern: "variable",
    randomnessFactor: 0.5,
    behaviorProfile: "General User"
  });

  const getDefaultSchedule = (): BotSchedule => ({
    active: false,
    startTime: "09:00",
    endTime: "17:00",
    breakDuration: [15, 30],
    daysActive: ["Monday", "Wednesday", "Friday"]
  });

  const getDefaultProxy = (): BotProxy => ({
    useRotation: true,
    rotationFrequency: 30,
    provider: "luminati",
    regions: ["us", "eu"]
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h1 className="text-3xl font-bold">Bots</h1>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefreshBots}
            className="ml-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleQuickCreate}>
            <AlignLeft className="h-4 w-4 mr-2" />
            Quick Create
          </Button>
          <Button onClick={handleCreateBot}>
            <Plus className="h-4 w-4 mr-2" />
            New Bot
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input 
              placeholder="Search bots..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="content">Content Generator</SelectItem>
                <SelectItem value="interaction">Interaction Simulator</SelectItem>
                <SelectItem value="click">Click Bot</SelectItem>
                <SelectItem value="parser">Parser Bot</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <BotHealthIndicator />

          <div className="flex items-center gap-2">
            <Label htmlFor="ip-rotation" className="text-sm">IP Rotation</Label>
            <Switch 
              id="ip-rotation" 
              checked={ipRotationEnabled} 
              onCheckedChange={setIpRotationEnabled} 
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedView("grid")}>
                <Grid3x3 className="mr-2 h-4 w-4" />
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedView("list")}>
                <AlignLeft className="mr-2 h-4 w-4" />
                List View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                Show Active Bots
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("idle")}>
                Show Idle Bots
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                Show All Bots
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all-bots" className="h-full space-y-6">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="all-bots">All Bots</TabsTrigger>
            <TabsTrigger value="content-bots">Content</TabsTrigger>
            <TabsTrigger value="interaction-bots">Interaction</TabsTrigger>
            <TabsTrigger value="click-bots">Click</TabsTrigger>
            <TabsTrigger value="parser-bots">Parser</TabsTrigger>
          </TabsList>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all-bots" className="h-full flex-1">
          {filteredBots.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <Bot className="h-16 w-16 text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-xl font-medium">No bots found</h3>
              <p className="mt-2 text-muted-foreground">Create a bot to get started, or adjust your filters.</p>
              <Button className="mt-4" onClick={handleCreateBot}>Create Your First Bot</Button>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBots.map(bot => (
                  <BotCard
                    key={bot.id}
                    id={bot.id}
                    name={bot.name}
                    description={bot.description}
                    type={bot.type}
                    status={bot.status}
                    lastRun={bot.lastRun}
                    healthPercentage={bot.healthPercentage}
                    config={bot.config || getDefaultConfig()}
                    schedule={bot.schedule || getDefaultSchedule()}
                    proxy={bot.proxy || getDefaultProxy()}
                    logs={bot.logs || []}
                    onClick={() => {}} // Placeholder
                    onStart={() => startBot(bot.id)}
                    onStop={() => stopBot(bot.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="content-bots" className="h-full flex-1">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBots.filter(bot => bot.type === 'content').map(bot => (
                <BotCard
                  key={bot.id}
                  id={bot.id}
                  name={bot.name}
                  description={bot.description}
                  type={bot.type}
                  status={bot.status}
                  lastRun={bot.lastRun}
                  healthPercentage={bot.healthPercentage}
                  config={bot.config || getDefaultConfig()}
                  schedule={bot.schedule || getDefaultSchedule()}
                  proxy={bot.proxy || getDefaultProxy()}
                  logs={bot.logs || []}
                  onClick={() => {}} // Placeholder
                  onStart={() => startBot(bot.id)}
                  onStop={() => stopBot(bot.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="interaction-bots" className="h-full flex-1">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBots.filter(bot => bot.type === 'interaction').map(bot => (
                <BotCard
                  key={bot.id}
                  id={bot.id}
                  name={bot.name}
                  description={bot.description}
                  type={bot.type}
                  status={bot.status}
                  lastRun={bot.lastRun}
                  healthPercentage={bot.healthPercentage}
                  config={bot.config || getDefaultConfig()}
                  schedule={bot.schedule || getDefaultSchedule()}
                  proxy={bot.proxy || getDefaultProxy()}
                  logs={bot.logs || []}
                  onClick={() => {}} // Placeholder
                  onStart={() => startBot(bot.id)}
                  onStop={() => stopBot(bot.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="click-bots" className="h-full flex-1">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBots.filter(bot => bot.type === 'click').map(bot => (
                <BotCard
                  key={bot.id}
                  id={bot.id}
                  name={bot.name}
                  description={bot.description}
                  type={bot.type}
                  status={bot.status}
                  lastRun={bot.lastRun}
                  healthPercentage={bot.healthPercentage}
                  config={bot.config || getDefaultConfig()}
                  schedule={bot.schedule || getDefaultSchedule()}
                  proxy={bot.proxy || getDefaultProxy()}
                  logs={bot.logs || []}
                  onClick={() => {}} // Placeholder
                  onStart={() => startBot(bot.id)}
                  onStop={() => stopBot(bot.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="parser-bots" className="h-full flex-1">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBots.filter(bot => bot.type === 'parser').map(bot => (
                <BotCard
                  key={bot.id}
                  id={bot.id}
                  name={bot.name}
                  description={bot.description}
                  type={bot.type}
                  status={bot.status}
                  lastRun={bot.lastRun}
                  healthPercentage={bot.healthPercentage}
                  config={bot.config || getDefaultConfig()}
                  schedule={bot.schedule || getDefaultSchedule()}
                  proxy={bot.proxy || getDefaultProxy()}
                  logs={bot.logs || []}
                  onClick={() => {}} // Placeholder
                  onStart={() => startBot(bot.id)}
                  onStop={() => stopBot(bot.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <BotCreationWizard
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      
      <QuickBotCreator
        open={isQuickCreateOpen}
        onOpenChange={setIsQuickCreateOpen}
      />
      
      <BotMonitoring />
    </div>
  );
};

export default BotsPage;
