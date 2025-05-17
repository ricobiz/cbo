
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Bot, X } from "lucide-react";
import { botService } from "@/services/BotService";
import { useBotStore } from "@/store/BotStore";

interface QuickBotCreatorProps {
  onClose: () => void;
}

export function QuickBotCreator({ onClose }: QuickBotCreatorProps) {
  const [botName, setBotName] = useState("");
  const [botType, setBotType] = useState("");
  const [platform, setPlatform] = useState("");
  const { toast } = useToast();
  const { fetchBots } = useBotStore();

  const handleCreateBot = () => {
    if (!botName) {
      toast({
        title: "Name required",
        description: "Please provide a name for your bot",
        variant: "destructive",
      });
      return;
    }

    if (!botType) {
      toast({
        title: "Type required",
        description: "Please select a bot type",
        variant: "destructive",
      });
      return;
    }

    // In a real application, we would call an API to create the bot
    // For now, we'll just show a success message
    toast({
      title: "Bot created",
      description: `${botName} has been created successfully`,
    });
    
    // Simulate bot creation and refetch bots
    setTimeout(() => {
      fetchBots();
      onClose();
    }, 500);
  };

  return (
    <Card className="w-full border shadow-lg animate-fade-in">
      <CardHeader className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" /> Quick Bot Creator
        </CardTitle>
        <CardDescription>
          Create a new bot in seconds with just the essential settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quick-bot-name">Bot Name</Label>
          <Input 
            id="quick-bot-name" 
            placeholder="Enter bot name" 
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quick-bot-type">Bot Type</Label>
          <Select value={botType} onValueChange={setBotType}>
            <SelectTrigger id="quick-bot-type">
              <SelectValue placeholder="Select bot type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="content">Content Generator</SelectItem>
              <SelectItem value="interaction">Interaction Simulator</SelectItem>
              <SelectItem value="click">Click Bot</SelectItem>
              <SelectItem value="parser">Parser Bot</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quick-platform">Target Platform</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger id="quick-platform">
              <SelectValue placeholder="Select target platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="spotify">Spotify</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreateBot}>Create Bot</Button>
      </CardFooter>
    </Card>
  );
}
