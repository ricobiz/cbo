
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, RefreshCw, Plus, Server, Settings, Shield } from "lucide-react";
import { proxyService, ProxyProvider } from "@/services/ProxyService";
import { useToast } from "@/components/ui/use-toast";

interface ProxySettingsProps {
  onSave: () => void;
}

export function ProxySettings({ onSave }: ProxySettingsProps) {
  const [activeTab, setActiveTab] = useState("providers");
  const [provider, setProvider] = useState<ProxyProvider>("luminati");
  const [apiKey, setApiKey] = useState("");
  const [rotationConfig, setRotationConfig] = useState(proxyService.getRotationConfig());
  const [customProxy, setCustomProxy] = useState({ ip: "", port: "", username: "", password: "" });
  const { toast } = useToast();
  
  const [proxiesCount, setProxiesCount] = useState(0);
  const [healthyCount, setHealthyCount] = useState(0);
  const [blacklistedCount, setBlacklistedCount] = useState(0);
  
  // Load current settings on mount
  useEffect(() => {
    setProvider(proxyService.getProvider());
    setRotationConfig(proxyService.getRotationConfig());
    updateProxyCounts();
  }, []);
  
  const updateProxyCounts = () => {
    setProxiesCount(proxyService.getProxiesCount());
    setHealthyCount(proxyService.getHealthyProxiesCount());
    setBlacklistedCount(proxyService.getBlacklistedCount());
  };
  
  const handleSaveProvider = () => {
    proxyService.setProvider(provider);
    if (apiKey) {
      proxyService.setApiKey(apiKey);
    }
    
    toast({
      title: "Proxy provider updated",
      description: `Provider set to ${provider}${apiKey ? " and API key updated" : ""}`,
    });
    
    setTimeout(updateProxyCounts, 1000); // Update counts after proxies are loaded
    onSave();
  };
  
  const handleSaveRotation = () => {
    proxyService.updateRotationConfig(rotationConfig);
    
    toast({
      title: "Rotation settings updated",
      description: "Proxy rotation configuration has been saved",
    });
    
    onSave();
  };
  
  const handleAddCustomProxy = async () => {
    try {
      if (!customProxy.ip || !customProxy.port) {
        throw new Error("IP and port are required");
      }
      
      const port = parseInt(customProxy.port);
      if (isNaN(port) || port < 1 || port > 65535) {
        throw new Error("Port must be a valid number between 1-65535");
      }
      
      await proxyService.addCustomProxy(
        customProxy.ip, 
        port, 
        customProxy.username || undefined, 
        customProxy.password || undefined
      );
      
      setCustomProxy({ ip: "", port: "", username: "", password: "" });
      
      toast({
        title: "Custom proxy added",
        description: `Added proxy ${customProxy.ip}:${customProxy.port}`,
      });
      
      updateProxyCounts();
    } catch (error) {
      toast({
        title: "Error adding proxy",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };
  
  const handleClearBlacklist = () => {
    proxyService.clearBlacklist();
    
    toast({
      title: "Blacklist cleared",
      description: "All proxies have been removed from blacklist",
    });
    
    updateProxyCounts();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <CardTitle>Proxy Management</CardTitle>
          </div>
          <CardDescription>
            Configure proxy settings for your bots and automation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="text-2xl font-bold">{proxiesCount}</div>
              <p className="text-xs text-muted-foreground">Total Proxies</p>
            </div>
            <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="text-2xl font-bold">{healthyCount}</div>
              <p className="text-xs text-muted-foreground">Healthy Proxies</p>
            </div>
            <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="text-2xl font-bold">{blacklistedCount}</div>
              <p className="text-xs text-muted-foreground">Blacklisted</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="rotation">Rotation</TabsTrigger>
          <TabsTrigger value="custom">Custom Proxies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="providers" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Proxy Provider</CardTitle>
              <CardDescription>Select your proxy provider and enter your API key</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select 
                  value={provider} 
                  onValueChange={(value) => setProvider(value as ProxyProvider)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luminati">Luminati</SelectItem>
                    <SelectItem value="smartproxy">Smartproxy</SelectItem>
                    <SelectItem value="oxylabs">Oxylabs</SelectItem>
                    <SelectItem value="brightdata">Brightdata</SelectItem>
                    <SelectItem value="custom">Custom Proxies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {provider !== "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your provider API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    The API key will be used to fetch available proxies from your provider
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProvider}>
                <Check className="h-4 w-4 mr-2" /> Save Provider
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="rotation" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Proxy Rotation Settings</CardTitle>
              <CardDescription>Configure how frequently proxies rotate and other settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rotation-frequency">Rotation Frequency (minutes)</Label>
                <Input
                  id="rotation-frequency"
                  type="number"
                  min="1"
                  max="1440"
                  value={rotationConfig.frequency}
                  onChange={(e) => setRotationConfig({...rotationConfig, frequency: parseInt(e.target.value) || 60})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="check-reputation"
                  checked={rotationConfig.checkReputation}
                  onCheckedChange={(checked) => setRotationConfig({...rotationConfig, checkReputation: checked})}
                />
                <Label htmlFor="check-reputation">Check proxy reputation before using</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="avoid-flagged"
                  checked={rotationConfig.avoidFlagged}
                  onCheckedChange={(checked) => setRotationConfig({...rotationConfig, avoidFlagged: checked})}
                />
                <Label htmlFor="avoid-flagged">Avoid flagged or blocked proxies</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-retry"
                  checked={rotationConfig.autoRetry}
                  onCheckedChange={(checked) => setRotationConfig({...rotationConfig, autoRetry: checked})}
                />
                <Label htmlFor="auto-retry">Auto-retry on connection failure</Label>
              </div>
              
              <div className="space-y-2">
                <Label>Preferred Regions</Label>
                <div className="flex flex-wrap gap-2">
                  {["us", "ca", "uk", "au", "eu", "asia"].map((region) => (
                    <Badge
                      key={region}
                      variant={rotationConfig.regions.includes(region) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const regions = rotationConfig.regions.includes(region)
                          ? rotationConfig.regions.filter(r => r !== region)
                          : [...rotationConfig.regions, region];
                        setRotationConfig({...rotationConfig, regions});
                      }}
                    >
                      {region.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveRotation}>
                <Check className="h-4 w-4 mr-2" /> Save Rotation Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Proxies</CardTitle>
              <CardDescription>Add your own proxy servers to the pool</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proxy-ip">Proxy IP</Label>
                  <Input
                    id="proxy-ip"
                    placeholder="192.168.1.1"
                    value={customProxy.ip}
                    onChange={(e) => setCustomProxy({...customProxy, ip: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proxy-port">Proxy Port</Label>
                  <Input
                    id="proxy-port"
                    placeholder="8080"
                    value={customProxy.port}
                    onChange={(e) => setCustomProxy({...customProxy, port: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proxy-username">Username (optional)</Label>
                  <Input
                    id="proxy-username"
                    placeholder="Username"
                    value={customProxy.username}
                    onChange={(e) => setCustomProxy({...customProxy, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proxy-password">Password (optional)</Label>
                  <Input
                    id="proxy-password"
                    type="password"
                    placeholder="Password"
                    value={customProxy.password}
                    onChange={(e) => setCustomProxy({...customProxy, password: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleClearBlacklist}>
                <RefreshCw className="h-4 w-4 mr-2" /> Clear Blacklist
              </Button>
              <Button onClick={handleAddCustomProxy}>
                <Plus className="h-4 w-4 mr-2" /> Add Proxy
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
