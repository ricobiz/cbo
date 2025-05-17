
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ApiSettingsProps {
  onSave: () => void;
}

export const ApiSettings = ({ onSave }: ApiSettingsProps) => {
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••••");
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  return (
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
        <Button onClick={onSave}>Save API Keys</Button>
      </CardFooter>
    </Card>
  );
};
