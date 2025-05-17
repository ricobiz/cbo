
import { useEffect, useState } from "react";
import { BotCard } from "@/components/bots/BotCard";
import { BotCreationWizard } from "@/components/bots/BotCreationWizard";
import { BotMonitoring } from "@/components/bots/BotMonitoring";
import { Button } from "@/components/ui/button";
import { Plus, Filter, AlertTriangle, Bot } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBotStore } from "@/store/BotStore";
import { BotDetails } from "@/components/bots/BotDetails";
import { QuickBotCreator } from "@/components/bots/QuickBotCreator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BotsPage = () => {
  const { 
    bots, 
    filterType, 
    filterStatus, 
    searchTerm, 
    ipRotationEnabled, 
    selectedBotId,
    fetchBots,
    setFilterType, 
    setFilterStatus, 
    setSearchTerm,
    setIpRotationEnabled,
    selectBot,
    startBot,
    stopBot
  } = useBotStore();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [showQuickCreator, setShowQuickCreator] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("all");

  // Fetch bots on component mount
  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  const getFilteredBots = () => {
    return bots.filter(bot => {
      const matchesType = filterType === "all" || bot.type === filterType;
      const matchesStatus = filterStatus === "all" || bot.status === filterStatus;
      const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          bot.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = currentTab === "all" || 
                        (currentTab === "active" && bot.status === "active") ||
                        (currentTab === "idle" && bot.status === "idle") ||
                        (currentTab === "error" && bot.status === "error");
      
      return matchesType && matchesStatus && matchesSearch && matchesTab;
    });
  };

  const filteredBots = getFilteredBots();

  const selectedBot = selectedBotId ? bots.find(bot => bot.id === selectedBotId) : null;

  // Count active bots
  const activeBots = bots.filter(bot => bot.status === "active").length;

  // Initialize default values for config, schedule, proxy, and logs if they don't exist
  const defaultConfig = {
    actionDelay: [1000, 3000] as [number, number], // Fixed typing issue
    mouseMovement: 'natural' as const,
    scrollPattern: 'variable' as const,
    randomnessFactor: 0.5,
    behaviorProfile: 'Casual Browser'
  };

  const defaultSchedule = {
    active: false,
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: [15, 30] as [number, number],
    daysActive: ['Monday', 'Wednesday', 'Friday']
  };

  const defaultProxy = {
    useRotation: true,
    rotationFrequency: 30,
    provider: 'luminati',
    regions: ['us', 'eu']
  };

  const defaultLogs: Array<{time: string, message: string}> = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bot className="h-7 w-7" /> Bots
        </h1>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowQuickCreator(prev => !prev)}
            className="flex-1 md:flex-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Quick Create
          </Button>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="flex-1 md:flex-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Advanced
          </Button>
        </div>
      </div>

      {showQuickCreator && (
        <div className="animate-fade-in">
          <QuickBotCreator onClose={() => setShowQuickCreator(false)} />
        </div>
      )}

      {!ipRotationEnabled && (
        <Alert variant="destructive" className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>IP Rotation Not Enabled</AlertTitle>
          <AlertDescription>
            Running bots without IP rotation significantly increases detection risk. Configure proxy settings to enable IP rotation.
          </AlertDescription>
        </Alert>
      )}

      <BotMonitoring />

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
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs 
        defaultValue="all" 
        value={currentTab} 
        onValueChange={setCurrentTab}
        className="w-full"
      >
        <TabsList className="w-full md:w-auto mb-4">
          <TabsTrigger value="all">All Bots</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="idle">Idle</TabsTrigger>
          <TabsTrigger value="error">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBots.length > 0 ? (
              filteredBots.map((bot) => (
                <BotCard 
                  key={bot.id}
                  {...bot}
                  config={bot.config || defaultConfig}
                  schedule={bot.schedule || defaultSchedule}
                  proxy={bot.proxy || defaultProxy}
                  logs={bot.logs || defaultLogs}
                  onClick={() => selectBot(bot.id)}
                  onStart={() => startBot(bot.id)}
                  onStop={() => stopBot(bot.id)}
                />
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center p-12 border rounded-lg border-dashed">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">No bots found matching your criteria</p>
                  <Button variant="outline" onClick={() => {
                    setFilterType("all");
                    setFilterStatus("all");
                    setSearchTerm("");
                    setCurrentTab("all");
                  }}>
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBots.length > 0 ? (
              filteredBots.map((bot) => (
                <BotCard 
                  key={bot.id}
                  {...bot}
                  config={bot.config || defaultConfig}
                  schedule={bot.schedule || defaultSchedule}
                  proxy={bot.proxy || defaultProxy}
                  logs={bot.logs || defaultLogs}
                  onClick={() => selectBot(bot.id)}
                  onStart={() => startBot(bot.id)}
                  onStop={() => stopBot(bot.id)}
                />
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center p-12 border rounded-lg border-dashed">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">No active bots found</p>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
                    Create Bot
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="idle" className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBots.length > 0 ? (
              filteredBots.map((bot) => (
                <BotCard 
                  key={bot.id}
                  {...bot}
                  config={bot.config || defaultConfig}
                  schedule={bot.schedule || defaultSchedule}
                  proxy={bot.proxy || defaultProxy}
                  logs={bot.logs || defaultLogs}
                  onClick={() => selectBot(bot.id)}
                  onStart={() => startBot(bot.id)}
                  onStop={() => stopBot(bot.id)}
                />
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center p-12 border rounded-lg border-dashed">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">No idle bots found</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="error" className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBots.length > 0 ? (
              filteredBots.map((bot) => (
                <BotCard 
                  key={bot.id}
                  {...bot}
                  config={bot.config || defaultConfig}
                  schedule={bot.schedule || defaultSchedule}
                  proxy={bot.proxy || defaultProxy}
                  logs={bot.logs || defaultLogs}
                  onClick={() => selectBot(bot.id)}
                  onStart={() => startBot(bot.id)}
                  onStop={() => stopBot(bot.id)}
                />
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center p-12 border rounded-lg border-dashed">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">No bots with issues found</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <BotCreationWizard 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />

      {selectedBot && (
        <BotDetails
          id={selectedBot.id}
          name={selectedBot.name}
          description={selectedBot.description}
          status={selectedBot.status}
          type={selectedBot.type}
          lastRun={selectedBot.lastRun}
          open={!!selectedBotId}
          onOpenChange={(open) => !open && selectBot(null)}
          onStart={() => startBot(selectedBot.id)}
          onStop={() => stopBot(selectedBot.id)}
        />
      )}
    </div>
  );
};

export default BotsPage;
