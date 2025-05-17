
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Mail, Plus, Trash2, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface EmailCredential {
  id: string;
  email: string;
  password: string;
  creationDate?: string;
  lastUsed?: string;
  notes?: string;
  status: "available" | "in-use" | "blocked";
}

interface EmailCredentialsManagerProps {
  onSave: () => void;
}

export const EmailCredentialsManager = ({ onSave }: EmailCredentialsManagerProps) => {
  const [credentials, setCredentials] = useState<EmailCredential[]>([
    {
      id: "1",
      email: "test1@example.com",
      password: "password123",
      creationDate: "2023-05-15",
      lastUsed: "2025-05-10",
      status: "available"
    },
    {
      id: "2",
      email: "test2@example.com",
      password: "password456",
      creationDate: "2024-01-10",
      lastUsed: "2025-04-28",
      status: "in-use"
    }
  ]);
  
  const [bulkInput, setBulkInput] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setBulkInput(content);
    };
    reader.readAsText(file);
  };

  const processCredentialsFromText = () => {
    try {
      // Split by lines and process each line
      const lines = bulkInput.split('\n').filter(line => line.trim() !== '');
      
      const newCredentials: EmailCredential[] = lines.map((line, index) => {
        // Expecting format: email:password or email,password
        const parts = line.includes(':') ? line.split(':') : line.split(',');
        
        if (parts.length < 2) {
          throw new Error(`Line ${index + 1} is not formatted correctly. Expected format: email:password or email,password`);
        }
        
        return {
          id: (credentials.length + index + 1).toString(),
          email: parts[0].trim(),
          password: parts[1].trim(),
          creationDate: new Date().toISOString().split('T')[0],
          status: "available"
        };
      });
      
      setCredentials([...credentials, ...newCredentials]);
      setBulkInput("");
      
      toast({
        title: "Credentials Imported",
        description: `Successfully imported ${newCredentials.length} credentials.`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to process credentials",
        variant: "destructive",
      });
    }
  };

  const addSingleCredential = () => {
    if (!newEmail || !newPassword) {
      toast({
        title: "Missing Information",
        description: "Please provide both email and password.",
        variant: "destructive",
      });
      return;
    }

    const newCred: EmailCredential = {
      id: (credentials.length + 1).toString(),
      email: newEmail,
      password: newPassword,
      creationDate: new Date().toISOString().split('T')[0],
      notes: newNotes,
      status: "available"
    };

    setCredentials([...credentials, newCred]);
    setNewEmail("");
    setNewPassword("");
    setNewNotes("");
    
    toast({
      title: "Credential Added",
      description: `Successfully added ${newEmail}.`,
    });
  };

  const deleteCredential = (id: string) => {
    setCredentials(credentials.filter(cred => cred.id !== id));
    toast({
      title: "Credential Removed",
      description: "Email credential has been removed.",
    });
  };

  const getStatusBadge = (status: EmailCredential["status"]) => {
    switch (status) {
      case "available":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Available</Badge>;
      case "in-use":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Use</Badge>;
      case "blocked":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Blocked</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Credentials</CardTitle>
        <CardDescription>Manage email accounts for bot operations</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="import" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="import">Import Accounts</TabsTrigger>
            <TabsTrigger value="manage">Manage Accounts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="space-y-4">
            <div className="space-y-2">
              <Label>Add Multiple Accounts</Label>
              <div className="p-4 border rounded-md border-dashed">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Paste accounts in format "email:password" or "email,password", one account per line:
                  </p>
                  <Textarea 
                    rows={5} 
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="user@example.com:password123&#10;another@example.com:pass456"
                    className="font-mono text-sm"
                  />
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="relative">
                    <Input 
                      type="file" 
                      accept=".txt,.csv" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="relative z-10">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload TXT/CSV
                    </Button>
                  </div>
                  <Button onClick={processCredentialsFromText} disabled={!bulkInput.trim()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Accounts
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Add Single Account</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="user@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input 
                  id="notes" 
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Account details, age, etc."
                />
              </div>
              <Button 
                onClick={addSingleCredential}
                disabled={!newEmail || !newPassword}
                className="mt-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="manage">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>All Credentials</Label>
                <Badge variant="outline">{credentials.length} Accounts</Badge>
              </div>
              
              <ScrollArea className="h-[300px] border rounded-md p-2">
                {credentials.length > 0 ? (
                  <div className="space-y-2">
                    {credentials.map((cred) => (
                      <div 
                        key={cred.id} 
                        className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{cred.email}</span>
                            {getStatusBadge(cred.status)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created: {cred.creationDate || "Unknown"}
                            {cred.lastUsed && ` • Last used: ${cred.lastUsed}`}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => deleteCredential(cred.id)}
                          disabled={cred.status === "in-use"}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Mail className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No email credentials added yet.</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t bg-muted/50 flex justify-end pt-2">
        <Button onClick={onSave}>
          <Check className="mr-2 h-4 w-4" />
          Save Credentials
        </Button>
      </CardFooter>
    </Card>
  );
};
