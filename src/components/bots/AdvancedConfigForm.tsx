import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { botService, Bot, BotConfig, BotSchedule, BotProxy } from "@/services/BotService";
import { Check, Bot as BotIcon, Clock, Globe } from "lucide-react";
import { EmailAccountSelector } from "../email/EmailAccountSelector";

interface AdvancedConfigFormProps {
  botId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedConfigForm({ botId, open, onOpenChange }: AdvancedConfigFormProps) {
  const { toast } = useToast();
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BotConfig>({
    maxActions: 0,
    actionDelay: [0, 0],
    mouseMovement: "natural",
    scrollPattern: "variable",
    randomnessFactor: 0.5,
    behaviorProfile: "Gen-Z Content Consumer"
  });

  // Load bot data
  useEffect(() => {
    if (open && botId) {
      loadBotData(botId);
    }
  }, [open, botId]);
  
  const loadBotData = (botId: string) => {
    if (botId) {
      botService.getBot(botId)
        .then(botData => {
          if (botData) {
            setBot(botData);
            
            // Initialize form with bot config
            if (botData.config) {
              setFormData({
                maxActions: botData.config.maxActions,
                actionDelay: botData.config.actionDelay,
                mouseMovement: botData.config.mouseMovement,
                scrollPattern: botData.config.scrollPattern,
                randomnessFactor: botData.config.randomnessFactor,
                behaviorProfile: botData.config.behaviorProfile
              });
            }
          }
        })
        .catch(err => console.error("Failed to load bot data:", err));
    }
  };
  
  const handleSave = () => {
    if (!bot) return;
    
    setLoading(true);
    
    try {
      // Save config
      botService.updateBotConfig(botId, bot.config);
      
      // Save schedule
      botService.updateBotSchedule(botId, bot.schedule);
      
      // Save proxy
      botService.updateBotProxy(botId, bot.proxy);
      
      toast({
        title: "Changes saved",
        description: "Advanced configuration updated successfully",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Update config values
  const updateConfig = (key: keyof BotConfig, value: any) => {
    if (!bot) return;
    setBot({
      ...bot,
      config: {
        ...bot.config,
        [key]: value
      }
    });
  };
  
  // Update schedule values
  const updateSchedule = (key: keyof BotSchedule, value: any) => {
    if (!bot) return;
    setBot({
      ...bot,
      schedule: {
        ...bot.schedule,
        [key]: value
      }
    });
  };
  
  // Update proxy values
  const updateProxy = (key: keyof BotProxy, value: any) => {
    if (!bot) return;
    setBot({
      ...bot,
      proxy: {
        ...bot.proxy,
        [key]: value
      }
    });
  };

  if (!bot) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BotIcon className="h-5 w-5" /> Advanced Configuration
          </DialogTitle>
          <DialogDescription>
            Fine-tune your bot's behavior, schedule, and proxy settings
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="behavior" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="proxy">Proxy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="behavior" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Action Delay (seconds)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Minimum</Label>
                    <Input 
                      type="number" 
                      value={bot.config.actionDelay[0] / 1000} 
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) * 1000;
                        updateConfig("actionDelay", [val, bot.config.actionDelay[1]]);
                      }}
                      min={0.1}
                      step={0.1}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Maximum</Label>
                    <Input 
                      type="number" 
                      value={bot.config.actionDelay[1] / 1000}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) * 1000;
                        updateConfig("actionDelay", [bot.config.actionDelay[0], val]);
                      }}
                      min={0.1}
                      step={0.1}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mouseMovement">Mouse Movement Pattern</Label>
                <Select 
                  value={bot.config.mouseMovement}
                  onValueChange={(value) => updateConfig("mouseMovement", value)}
                >
                  <SelectTrigger id="mouseMovement">
                    <SelectValue placeholder="Select movement pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">Natural (Human-like)</SelectItem>
                    <SelectItem value="direct">Direct (Point-to-point)</SelectItem>
                    <SelectItem value="random">Random (Chaotic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scrollPattern">Scrolling Pattern</Label>
                <Select 
                  value={bot.config.scrollPattern}
                  onValueChange={(value) => updateConfig("scrollPattern", value)}
                >
                  <SelectTrigger id="scrollPattern">
                    <SelectValue placeholder="Select scrolling pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="variable">Variable Speed (Human-like)</SelectItem>
                    <SelectItem value="constant">Constant Speed</SelectItem>
                    <SelectItem value="jump">Jump Scrolling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Randomness Factor ({Math.round(bot.config.randomnessFactor * 100)}%)</Label>
                <Slider 
                  value={[bot.config.randomnessFactor * 100]} 
                  max={100} 
                  step={1}
                  onValueChange={(value) => updateConfig("randomnessFactor", value[0] / 100)}
                />
                <p className="text-sm text-muted-foreground">Higher values make behavior less predictable</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="behaviorProfile">Behavior Profile</Label>
                <Select 
                  value={bot.config.behaviorProfile}
                  onValueChange={(value) => updateConfig("behaviorProfile", value)}
                >
                  <SelectTrigger id="behaviorProfile">
                    <SelectValue placeholder="Select behavior profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gen-Z Content Consumer">Gen-Z Content Consumer</SelectItem>
                    <SelectItem value="Business Professional">Business Professional</SelectItem>
                    <SelectItem value="Casual Browser">Casual Browser</SelectItem>
                    <SelectItem value="Power User">Power User</SelectItem>
                    <SelectItem value="Custom">Custom Profile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={bot.schedule.active}
                onCheckedChange={(checked) => updateSchedule("active", checked)}
              />
              <Label>Enable scheduling</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input 
                  type="time" 
                  value={bot.schedule.startTime} 
                  onChange={(e) => updateSchedule("startTime", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input 
                  type="time" 
                  value={bot.schedule.endTime}
                  onChange={(e) => updateSchedule("endTime", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Break Duration (minutes)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Minimum</Label>
                  <Input 
                    type="number" 
                    value={bot.schedule.breakDuration[0]} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      updateSchedule("breakDuration", [val, bot.schedule.breakDuration[1]]);
                    }}
                    min={1}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Maximum</Label>
                  <Input 
                    type="number" 
                    value={bot.schedule.breakDuration[1]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      updateSchedule("breakDuration", [bot.schedule.breakDuration[0], val]);
                    }}
                    min={1}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Days Active</Label>
              <div className="grid grid-cols-7 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const isActive = bot.schedule.daysActive.includes(day);
                  return (
                    <Button
                      key={day}
                      type="button"
                      variant={isActive ? "default" : "outline"}
                      className="text-xs py-1 h-auto"
                      onClick={() => {
                        if (isActive) {
                          updateSchedule("daysActive", bot.schedule.daysActive.filter(d => d !== day));
                        } else {
                          updateSchedule("daysActive", [...bot.schedule.daysActive, day]);
                        }
                      }}
                    >
                      {day.substring(0, 3)}
                    </Button>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="proxy" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={bot.proxy.useRotation}
                onCheckedChange={(checked) => updateProxy("useRotation", checked)}
              />
              <Label>Use IP rotation</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rotationFrequency">Rotation Frequency (minutes)</Label>
              <Input 
                id="rotationFrequency"
                type="number" 
                value={bot.proxy.rotationFrequency}
                onChange={(e) => updateProxy("rotationFrequency", parseInt(e.target.value))}
                min={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proxyProvider">Proxy Provider</Label>
              <Select 
                value={bot.proxy.provider}
                onValueChange={(value) => updateProxy("provider", value)}
              >
                <SelectTrigger id="proxyProvider">
                  <SelectValue placeholder="Select proxy provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luminati">Luminati Networks</SelectItem>
                  <SelectItem value="smartproxy">Smartproxy</SelectItem>
                  <SelectItem value="oxylabs">Oxylabs</SelectItem>
                  <SelectItem value="brightdata">Bright Data</SelectItem>
                  <SelectItem value="custom">Custom Provider</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Geographic Regions</Label>
              <div className="grid grid-cols-4 gap-2">
                {['us', 'ca', 'uk', 'au', 'eu', 'as', 'sa', 'af'].map((region) => {
                  const isSelected = bot.proxy.regions.includes(region);
                  const regionNames: Record<string, string> = {
                    us: 'USA', ca: 'Canada', uk: 'UK', au: 'Australia',
                    eu: 'Europe', as: 'Asia', sa: 'S. America', af: 'Africa'
                  };
                  
                  return (
                    <Button
                      key={region}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className="text-xs"
                      onClick={() => {
                        if (isSelected) {
                          updateProxy("regions", bot.proxy.regions.filter(r => r !== region));
                        } else {
                          updateProxy("regions", [...bot.proxy.regions, region]);
                        }
                      }}
                    >
                      {regionNames[region]}
                    </Button>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4 pt-4 border-t">
          <div>
            <h3 className="text-sm font-medium mb-2">Bot Email Accounts</h3>
            <EmailAccountSelector botId={botId} />
          </div>
        </div>
        
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
            {!loading && <Check className="ml-2 h-4 w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
