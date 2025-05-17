import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const SettingsPage = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••••");
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 w-full md:w-[600px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="bots">Bot Config</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" defaultValue="Admin User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="admin@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select a timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                    <SelectItem value="cet">CET (Central European Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <div className="text-sm text-muted-foreground">Receive email updates about your campaigns</div>
                </div>
                <Switch id="notifications" />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
              <CardDescription>Manage API keys for content generation and bot operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="openai">OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="openai" 
                    type={isApiKeyVisible ? "text" : "password"} 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)}
                    className="font-mono"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                  >
                    {isApiKeyVisible ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="midjourney">Midjourney API Key</Label>
                <Input id="midjourney" type="password" value="••••••••••••••••••••••••••••••" className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suno">Suno API Key</Label>
                <Input id="suno" type="password" value="••••••••••••••••••••••••••••••" className="font-mono" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="rotate-keys">Auto-rotate API Keys</Label>
                  <div className="text-sm text-muted-foreground">Automatically rotate keys to prevent rate limiting</div>
                </div>
                <Switch id="rotate-keys" />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
              <Button onClick={handleSave}>Save API Keys</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bot Configuration</CardTitle>
              <CardDescription>Configure bot behavior and limitations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
              <Button onClick={handleSave}>Save Configuration</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security preferences for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="2fa">Two-Factor Authentication</Label>
                <div className="flex items-center gap-4">
                  <Switch id="2fa" />
                  <span className="text-sm text-muted-foreground">Status: Disabled</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <Button variant="outline" className="w-full" id="password">
                  Change Password
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessions">Active Sessions</Label>
                <Card className="border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Chrome • Windows • Last active now</p>
                      </div>
                      <Badge variant="outline">Current</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
              <Button onClick={handleSave}>Save Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your subscription and billing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Current Plan: Free Trial</h3>
                    <p className="text-sm text-muted-foreground">10 campaigns, 5 active bots, basic analytics</p>
                  </div>
                  <Button>Upgrade to Pro</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Card className="border">
                  <CardContent className="p-4">
                    <p className="text-center text-muted-foreground">No payment method on file</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-2">
                <Label>Billing History</Label>
                <div className="text-center p-4 border rounded-lg text-muted-foreground">
                  No billing history available
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
              <Button variant="outline">Add Payment Method</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
