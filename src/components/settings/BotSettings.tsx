
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";

interface BotSettingsProps {
  onSave: () => void;
}

export const BotSettings = ({ onSave }: BotSettingsProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Bot configuration has been updated successfully.",
    });
    onSave();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Configuration</CardTitle>
        <CardDescription>Configure bot behavior and limitations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="general">General Settings</TabsTrigger>
            <TabsTrigger value="email">Email Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="concurrency">Max Concurrent Bot Operations</Label>
              <Select defaultValue="10">
                <SelectTrigger id="concurrency">
                  <SelectValue placeholder="Select maximum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 operations</SelectItem>
                  <SelectItem value="10">10 operations</SelectItem>
                  <SelectItem value="25">25 operations</SelectItem>
                  <SelectItem value="50">50 operations</SelectItem>
                  <SelectItem value="100">100 operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="delay">Default Action Delay (ms)</Label>
              <Input id="delay" type="number" defaultValue="2000" />
              <p className="text-sm text-muted-foreground">Delay between actions to appear more human-like</p>
            </div>
            
            <div className="space-y-3">
              <Label>Human-like Behavior Intensity</Label>
              <Slider defaultValue={[75]} max={100} step={1} className="py-4" />
              <div className="text-sm text-muted-foreground">Higher values increase randomness in timing, mouse movements, and scrolling patterns</div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rotation">IP Rotation Frequency</Label>
              <Select defaultValue="60">
                <SelectTrigger id="rotation">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every 60 minutes</SelectItem>
                  <SelectItem value="120">Every 2 hours</SelectItem>
                  <SelectItem value="240">Every 4 hours</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">How often to switch IP addresses to avoid detection</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="proxy">Use Rotating Proxies</Label>
                <div className="text-sm text-muted-foreground">Route bot traffic through different IP addresses</div>
              </div>
              <Switch id="proxy" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="antiban">Anti-Ban Measures</Label>
                <div className="text-sm text-muted-foreground">Apply advanced evasion techniques</div>
              </div>
              <Switch id="antiban" defaultChecked />
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email-allocation">Email Account Allocation</Label>
              <Select defaultValue="dedicated">
                <SelectTrigger id="email-allocation">
                  <SelectValue placeholder="Select allocation method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dedicated">Dedicated per Bot</SelectItem>
                  <SelectItem value="shared">Shared Pool</SelectItem>
                  <SelectItem value="rotating">Rotating Accounts</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">How email accounts are assigned to bots</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-actions">Email Action Frequency</Label>
              <Select defaultValue="medium">
                <SelectTrigger id="email-actions">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Few actions per day)</SelectItem>
                  <SelectItem value="medium">Medium (Multiple actions per day)</SelectItem>
                  <SelectItem value="high">High (Many actions per day)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">How frequently the bot performs actions using email accounts</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-alerts">Email Alerts for Issues</Label>
                <div className="text-sm text-muted-foreground">Get notified about account lockouts or verification requests</div>
              </div>
              <Switch id="email-alerts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-verification">Auto-handle Verifications</Label>
                <div className="text-sm text-muted-foreground">Attempt to automatically handle verification requests</div>
              </div>
              <Switch id="auto-verification" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-rotation">Email Rotation Strategy</Label>
              <Select defaultValue="periodic">
                <SelectTrigger id="email-rotation">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="periodic">Periodic Rotation</SelectItem>
                  <SelectItem value="activity">Based on Activity Level</SelectItem>
                  <SelectItem value="risk">Risk-based Rotation</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">When and how to rotate between available email accounts</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
        <Button onClick={handleSave}>
          <Check className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </CardFooter>
    </Card>
  );
};
