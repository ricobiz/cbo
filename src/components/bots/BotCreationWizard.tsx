
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Bot, Check } from "lucide-react";

interface BotCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BotCreationWizard({ open, onOpenChange }: BotCreationWizardProps) {
  const [step, setStep] = useState(1);
  const [botName, setBotName] = useState("");
  const [botType, setBotType] = useState("");
  const [platform, setPlatform] = useState("");
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 1 && (!botName || !botType)) {
      toast({
        title: "Missing information",
        description: "Please provide a name and type for your bot.",
        variant: "destructive",
      });
      return;
    }

    if (step === 2 && !platform) {
      toast({
        title: "Missing information",
        description: "Please select a target platform.",
        variant: "destructive",
      });
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      // Create bot
      toast({
        title: "Bot created",
        description: `${botName} has been created successfully.`,
      });
      onOpenChange(false);
      // Reset form
      setStep(1);
      setBotName("");
      setBotType("");
      setPlatform("");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" /> Create New Bot
          </DialogTitle>
          <DialogDescription>
            Set up a new bot to automate content interactions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex justify-between items-center mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 
                  ${step === i 
                    ? 'bg-primary text-primary-foreground' 
                    : step > i 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                  {step > i ? <Check className="h-4 w-4" /> : i}
                </div>
                <div className="text-xs text-muted-foreground">
                  {i === 1 ? 'Basic Info' : i === 2 ? 'Platform' : 'Configuration'}
                </div>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bot-name">Bot Name</Label>
                <Input 
                  id="bot-name" 
                  placeholder="Enter bot name" 
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bot-type">Bot Type</Label>
                <Select value={botType} onValueChange={setBotType}>
                  <SelectTrigger id="bot-type">
                    <SelectValue placeholder="Select bot type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content">Content Generator</SelectItem>
                    <SelectItem value="interaction">Interaction Simulator</SelectItem>
                    <SelectItem value="click">Click Bot</SelectItem>
                    <SelectItem value="parser">Parser Bot</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {botType === "content" && "Creates and publishes content on social platforms."}
                  {botType === "interaction" && "Simulates user interactions like comments, likes, shares."}
                  {botType === "click" && "Generates clicks, views and engagement metrics."}
                  {botType === "parser" && "Extracts and analyzes data from target platforms."}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bot-description">Description (Optional)</Label>
                <Textarea 
                  id="bot-description" 
                  placeholder="Enter a brief description of what this bot does"
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Target Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger id="platform">
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
              
              <div className="space-y-2">
                <Label>Behavior Pattern</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start h-auto py-4 flex flex-col items-start">
                    <span className="font-medium">Standard</span>
                    <span className="text-xs text-muted-foreground mt-1">Regular patterns that appear natural</span>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-4 flex flex-col items-start">
                    <span className="font-medium">Randomized</span>
                    <span className="text-xs text-muted-foreground mt-1">Highly variable patterns to avoid detection</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Bot Configuration</Label>
                <div className="rounded-md border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rotation Schedule</span>
                    <Select defaultValue="4">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">Every 2 hrs</SelectItem>
                        <SelectItem value="4">Every 4 hrs</SelectItem>
                        <SelectItem value="6">Every 6 hrs</SelectItem>
                        <SelectItem value="12">Every 12 hrs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Content Interaction Rate</span>
                    <Select defaultValue="medium">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentication</span>
                    <Select defaultValue="proxy">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="proxy">Proxy</SelectItem>
                        <SelectItem value="browser">Browser</SelectItem>
                        <SelectItem value="api">API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Summary</Label>
                <div className="rounded-md bg-muted p-4 text-sm">
                  <p><span className="font-medium">Name:</span> {botName || "Unnamed Bot"}</p>
                  <p><span className="font-medium">Type:</span> {botType 
                    ? botType === "content" ? "Content Generator" 
                      : botType === "interaction" ? "Interaction Simulator"
                      : botType === "click" ? "Click Bot"
                      : "Parser Bot"
                    : "Not selected"}
                  </p>
                  <p><span className="font-medium">Platform:</span> {platform || "Not selected"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>Back</Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          )}
          <Button onClick={handleNext}>
            {step === 3 ? "Create Bot" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
