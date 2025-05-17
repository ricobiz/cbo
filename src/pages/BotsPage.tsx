
import { useEffect, useState } from "react";
import { BotCard } from "@/components/bots/BotCard";
import { BotCreationWizard } from "@/components/bots/BotCreationWizard";
import { BotMonitoring } from "@/components/bots/BotMonitoring";
import { Button } from "@/components/ui/button";
import { Plus, Filter, AlertTriangle } from "lucide-react";
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
    selectBot
  } = useBotStore();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Fetch bots on component mount
  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  const filteredBots = bots.filter(bot => {
    const matchesType = filterType === "all" || bot.type === filterType;
    const matchesStatus = filterStatus === "all" || bot.status === filterStatus;
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         bot.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const selectedBot = selectedBotId ? bots.find(bot => bot.id === selectedBotId) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Bots</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Bot
        </Button>
      </div>

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
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBots.length > 0 ? (
          filteredBots.map((bot) => (
            <BotCard 
              key={bot.id} 
              {...bot} 
              onClick={() => selectBot(bot.id)}
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
              }}>
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <BotCreationWizard 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
      />

      {selectedBot && (
        <BotDetails
          {...selectedBot}
          open={!!selectedBotId}
          onOpenChange={(open) => !open && selectBot(null)}
        />
      )}
    </div>
  );
};

export default BotsPage;
