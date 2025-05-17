
import { Bot, Rocket, MessageSquare, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function QuickActions() {
  const { toast } = useToast();
  
  const handleAction = (action: string) => {
    toast({
      title: "Action initiated",
      description: `The "${action}" action has been triggered.`,
    });
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
        >
          <Rocket className="mr-2 h-4 w-4 text-primary" />
          <span>New Campaign</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => handleAction("Generate Content")}
        >
          <MessageSquare className="mr-2 h-4 w-4 text-secondary" />
          <span>Generate Content</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => handleAction("Deploy Bot")}
        >
          <Bot className="mr-2 h-4 w-4 text-accent" />
          <span>Deploy Bot</span>
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => handleAction("Create Scenario")}
        >
          <PlusCircle className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Create Scenario</span>
        </Button>
      </CardContent>
    </Card>
  );
}
