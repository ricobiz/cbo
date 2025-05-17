
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Globe, CheckCircle, XCircle } from "lucide-react";

interface ProxySettingsProps {
  onSave: () => void;
}

export const ProxySettings = ({ onSave }: ProxySettingsProps) => {
  const [provider, setProvider] = useState("luminati");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proxy Configuration</CardTitle>
        <CardDescription>Configure IP rotation and proxy settings for bots</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="provider" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="provider">Provider</TabsTrigger>
            <TabsTrigger value="rotation">Rotation</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="provider" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proxy-provider">Proxy Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger id="proxy-provider">
                  <SelectValue placeholder="Select provider" />
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
              <Label htmlFor="proxy-api-key">API Key</Label>
              <Input id="proxy-api-key" type="password" value="••••••••••••••••••••••••••••••" className="font-mono" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proxy-endpoints">Proxy Endpoints</Label>
              <Input 
                id="proxy-endpoints" 
                defaultValue={provider === "luminati" ? "zproxy.lum-superproxy.io:22225" : "proxy-server.provider.com:12345"} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="proxy-auth">Authentication Required</Label>
                <div className="text-sm text-muted-foreground">Use credentials for proxy access</div>
              </div>
              <Switch id="proxy-auth" defaultChecked />
            </div>
            
            {provider === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="proxy-format">Custom Proxy Format</Label>
                <Input id="proxy-format" defaultValue="http://user:pass@ip:port" />
                <p className="text-sm text-muted-foreground">Format for your custom proxy strings</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="rotation" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rotation-frequency">Default Rotation Frequency</Label>
              <Select defaultValue="60">
                <SelectTrigger id="rotation-frequency">
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country-selection">Geographic Distribution</Label>
              <Select defaultValue="us">
                <SelectTrigger id="country-selection">
                  <SelectValue placeholder="Select countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="global">Global (All Countries)</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                  <SelectItem value="custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ip-check">IP Reputation Check</Label>
                <div className="text-sm text-muted-foreground">Verify proxy quality before use</div>
              </div>
              <Switch id="ip-check" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-retry">Auto-retry on Detection</Label>
                <div className="text-sm text-muted-foreground">Automatically switch IP if detected</div>
              </div>
              <Switch id="auto-retry" defaultChecked />
            </div>
          </TabsContent>
          
          <TabsContent value="testing" className="space-y-4">
            <div className="space-y-2">
              <Label>Proxy Test Results</Label>
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">Connection Status</div>
                  </div>
                  <div className="flex items-center gap-1 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    <div className="text-sm">Connected</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">Current IP</div>
                  </div>
                  <div className="text-sm">104.28.42.16</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">Location</div>
                  </div>
                  <div className="text-sm">United States (New York)</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">Latency</div>
                  </div>
                  <div className="text-sm">45ms</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline">Test Proxy Connection</Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="rounded-md bg-muted p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-sm font-medium">Proxies Status</div>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Connected
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            250 residential proxies available in the current plan. Auto-rotation is active.
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
        <Button onClick={onSave}>Save Proxy Settings</Button>
      </CardFooter>
    </Card>
  );
};
