
import { useEffect, useState } from "react";
import { EmailCredentialsManager } from "@/components/settings/EmailCredentialsManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Mail, AlertTriangle, Shield, BadgeCheck } from "lucide-react";

const EmailAccountsPage = () => {
  const [healthPercent, setHealthPercent] = useState(85);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate email accounts health check
    const timer = setTimeout(() => {
      const newHealth = Math.floor(Math.random() * (100 - 70) + 70);
      setHealthPercent(newHealth);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSave = () => {
    toast({
      title: "Email Accounts Updated",
      description: "Your email account settings have been saved successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Mail className="h-7 w-7" /> Email Accounts
        </h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => {
            toast({
              title: "Health Check Complete",
              description: "All email accounts have been verified.",
            });
          }}>
            <Shield className="mr-2 h-4 w-4" />
            Run Health Check
          </Button>
          <Button>
            <BadgeCheck className="mr-2 h-4 w-4" />
            Verify All Accounts
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3 flex flex-col items-center gap-2">
              <div className="text-lg font-semibold">Email Accounts Health</div>
              <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center relative">
                <span className="text-2xl font-bold">{healthPercent}%</span>
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      ${healthPercent > 80 ? 'rgb(34 197 94)' : healthPercent > 60 ? 'rgb(234 179 8)' : 'rgb(239 68 68)'} 
                      ${healthPercent}%, 
                      transparent ${healthPercent}%
                    )`,
                    clipPath: 'circle(50% at 50% 50%)',
                  }}
                />
              </div>
            </div>
            
            <div className="w-full md:w-2/3 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Total Accounts</div>
                  <div className="text-3xl font-bold">32</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">In Use</div>
                  <div className="text-3xl font-bold">12</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Issues</div>
                  <div className="text-3xl font-bold text-amber-500">3</div>
                </div>
              </div>
              
              {healthPercent < 90 && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Account Issues Detected</div>
                    <div className="text-sm">3 accounts require verification, and 2 accounts have login issues.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="w-full md:w-auto mb-4">
          <TabsTrigger value="accounts">Account Management</TabsTrigger>
          <TabsTrigger value="analytics">Usage Analytics</TabsTrigger>
          <TabsTrigger value="verification">Verification Handling</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="pt-2">
          <EmailCredentialsManager onSave={handleSave} />
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-2">
          <Card>
            <CardContent className="p-6 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Account usage analytics will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verification" className="pt-2">
          <Card>
            <CardContent className="p-6 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Verification handling system will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailAccountsPage;
