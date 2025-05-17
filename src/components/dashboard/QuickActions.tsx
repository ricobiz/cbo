
import { Bot, Rocket, MessageSquare, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { externalAPIService } from "@/services/external-api";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  const handleAction = async (action: string) => {
    setIsLoading(action);
    
    try {
      let result;
      
      switch(action) {
        case "New Campaign":
          toast({
            title: "Creating new campaign",
            description: "Please set up the campaign details in the next screen.",
          });
          navigate("/campaigns?create=true");
          break;
          
        case "Generate Content":
          // First check if the API key is set
          if (!externalAPIService.hasOpenRouterApiKey()) {
            toast({
              title: "API Key Required",
              description: "Please add your OpenRouter API key in settings first.",
              variant: "destructive",
            });
            navigate("/settings");
            break;
          }
          
          result = await externalAPIService.sendToOpenRouter("Generate a short social media post about the latest technology trends");
          
          if (result) {
            toast({
              title: "Content Generated",
              description: "New content has been created and added to your library.",
            });
            navigate("/content");
          } else {
            toast({
              title: "Generation Failed",
              description: "There was an error generating content. Please check logs.",
              variant: "destructive",
            });
          }
          break;
          
        case "Deploy Bot":
          // First check if the API key is set
          if (!externalAPIService.hasBrowserUseApiKey()) {
            toast({
              title: "API Key Required",
              description: "Please add your Browser Use API key in settings first.",
              variant: "destructive",
            });
            navigate("/settings");
            break;
          }
          
          // Create a new browser session
          const sessionId = await externalAPIService.createBrowserSession();
          
          if (sessionId) {
            toast({
              title: "Bot Deployed",
              description: `New bot session created with ID: ${sessionId.substring(0, 8)}...`,
            });
            
            // Redirect to the bots page
            navigate("/bots");
          } else {
            toast({
              title: "Deployment Failed",
              description: "Could not create a browser session. Please check API settings.",
              variant: "destructive",
            });
          }
          break;
          
        case "Create Scenario":
          // Command analysis with AI
          if (!externalAPIService.hasOpenRouterApiKey()) {
            toast({
              title: "API Key Required",
              description: "Please add your OpenRouter API key in settings first.",
              variant: "destructive",
            });
            navigate("/settings");
            break;
          }
          
          const analysis = await externalAPIService.analyzeCommand("Listen to playlist XYZ on Spotify 500 times");
          
          if (analysis) {
            toast({
              title: "Scenario Created",
              description: `New ${analysis.platform || "general"} scenario has been created.`,
            });
            
            // Redirect to the scenarios page
            navigate("/scenarios");
          } else {
            toast({
              title: "Analysis Failed",
              description: "Could not analyze the command. Please try again.",
              variant: "destructive",
            });
          }
          break;
      }
    } catch (error) {
      console.error(`Error executing action ${action}:`, error);
      toast({
        title: "Action Failed",
        description: `There was an error processing your request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => handleAction("New Campaign")}
          disabled={isLoading === "New Campaign"}
        >
          <Rocket className={`mr-2 h-4 w-4 ${isLoading === "New Campaign" ? "animate-spin text-muted-foreground" : "text-primary"}`} />
          <span>{isLoading === "New Campaign" ? "Processing..." : "New Campaign"}</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => handleAction("Generate Content")}
          disabled={isLoading === "Generate Content"}
        >
          <MessageSquare className={`mr-2 h-4 w-4 ${isLoading === "Generate Content" ? "animate-spin text-muted-foreground" : "text-secondary"}`} />
          <span>{isLoading === "Generate Content" ? "Generating..." : "Generate Content"}</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => handleAction("Deploy Bot")}
          disabled={isLoading === "Deploy Bot"}
        >
          <Bot className={`mr-2 h-4 w-4 ${isLoading === "Deploy Bot" ? "animate-spin text-muted-foreground" : "text-accent"}`} />
          <span>{isLoading === "Deploy Bot" ? "Deploying..." : "Deploy Bot"}</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => handleAction("Create Scenario")}
          disabled={isLoading === "Create Scenario"}
        >
          <PlusCircle className={`mr-2 h-4 w-4 ${isLoading === "Create Scenario" ? "animate-spin text-muted-foreground" : "text-muted-foreground"}`} />
          <span>{isLoading === "Create Scenario" ? "Creating..." : "Create Scenario"}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
