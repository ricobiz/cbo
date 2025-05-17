
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { externalAPIService } from "@/services/ExternalAPIService";
import { useToast } from "@/components/ui/use-toast";

interface ApiSettingsProps {
  onSave: () => void;
}

export const ApiSettings = ({ onSave }: ApiSettingsProps) => {
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••••");
  const [openRouterKey, setOpenRouterKey] = useState("••••••••••••••••••••••••••••••");
  const [browserUseKey, setBrowserUseKey] = useState("••••••••••••••••••••••••••••••");
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [isOpenRouterKeyVisible, setIsOpenRouterKeyVisible] = useState(false);
  const [isBrowserUseKeyVisible, setIsBrowserUseKeyVisible] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    // Set API keys in the service
    if (openRouterKey && !openRouterKey.includes("•")) {
      externalAPIService.setOpenRouterApiKey(openRouterKey);
    }
    
    if (browserUseKey && !browserUseKey.includes("•")) {
      externalAPIService.setBrowserUseApiKey(browserUseKey);
    }
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been updated successfully.",
      variant: "default",
    });
    
    onSave();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Integration</CardTitle>
        <CardDescription>Manage API keys for content generation and bot operations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General APIs</TabsTrigger>
            <TabsTrigger value="openrouter">OpenRouter</TabsTrigger>
            <TabsTrigger value="browseruse">Browser Use</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="space-y-4">
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
            </div>
          </TabsContent>
          
          <TabsContent value="openrouter">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openrouter">OpenRouter API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="openrouter" 
                    type={isOpenRouterKeyVisible ? "text" : "password"} 
                    value={openRouterKey} 
                    onChange={(e) => setOpenRouterKey(e.target.value)}
                    className="font-mono"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsOpenRouterKeyVisible(!isOpenRouterKeyVisible)}
                  >
                    {isOpenRouterKeyVisible ? "Hide" : "Show"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  OpenRouter provides cost-effective access to multiple AI models.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="browseruse">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="browseruse">Browser Use API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    id="browseruse" 
                    type={isBrowserUseKeyVisible ? "text" : "password"} 
                    value={browserUseKey} 
                    onChange={(e) => setBrowserUseKey(e.target.value)}
                    className="font-mono"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsBrowserUseKeyVisible(!isBrowserUseKeyVisible)}
                  >
                    {isBrowserUseKeyVisible ? "Hide" : "Show"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Browser Use API enables browser automation, including account registration and interaction.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

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
  );
};
