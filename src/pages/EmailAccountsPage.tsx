
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { botService, EmailAccount } from "@/services/BotService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Plus, 
  Trash, 
  CheckCircle, 
  AlertCircle,
  XCircle,
  UploadCloud,
  FileText,
  Bot
} from "lucide-react";

export default function EmailAccountsPage() {
  const [emails, setEmails] = useState<EmailAccount[]>([]);
  const [filteredEmails, setFilteredEmails] = useState<EmailAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [importText, setImportText] = useState("");
  const { toast } = useToast();
  
  // Load emails on mount
  useEffect(() => {
    fetchEmails();
  }, []);
  
  // Filter emails when search or filter changes
  useEffect(() => {
    let filtered = emails;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(email => 
        email.email.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(email => email.status === filterStatus);
    }
    
    setFilteredEmails(filtered);
  }, [emails, searchTerm, filterStatus]);
  
  // Fetch all emails
  const fetchEmails = () => {
    const allEmails = botService.getAllEmailAccounts();
    setEmails(allEmails);
    setFilteredEmails(allEmails);
  };
  
  // Add a new email account
  const handleAddEmail = () => {
    if (!newEmail || !newPassword) {
      toast({
        title: "Missing information",
        description: "Please provide both email and password",
        variant: "destructive"
      });
      return;
    }
    
    botService.addEmailAccount(newEmail, newPassword);
    setNewEmail("");
    setNewPassword("");
    setShowAddDialog(false);
    fetchEmails();
    
    toast({
      title: "Email added",
      description: "New email account added successfully"
    });
  };
  
  // Import email accounts
  const handleImportEmails = () => {
    if (!importText.trim()) {
      toast({
        title: "No data to import",
        description: "Please provide email:password pairs to import",
        variant: "destructive"
      });
      return;
    }
    
    let importCount = 0;
    const lines = importText.split('\n');
    
    lines.forEach(line => {
      const parts = line.trim().split(/[,:;|]|\s+/);
      if (parts.length >= 2) {
        const email = parts[0].trim();
        const password = parts[1].trim();
        
        if (email && password) {
          botService.addEmailAccount(email, password);
          importCount++;
        }
      }
    });
    
    if (importCount > 0) {
      fetchEmails();
      
      toast({
        title: "Import successful",
        description: `Imported ${importCount} email accounts`
      });
      
      setImportText("");
      setShowImportDialog(false);
    } else {
      toast({
        title: "Import failed",
        description: "No valid email:password pairs found",
        variant: "destructive"
      });
    }
  };
  
  // Delete an email account
  const handleDeleteEmail = (id: string) => {
    const success = botService.deleteEmailAccount(id);
    
    if (success) {
      fetchEmails();
      
      toast({
        title: "Email deleted",
        description: "Email account deleted successfully"
      });
    } else {
      toast({
        title: "Cannot delete",
        description: "This email is in use by one or more bots",
        variant: "destructive"
      });
    }
  };
  
  // Get status badge for email
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>;
      case "flagged":
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/20">Flagged</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Get bots that use this email
  const getBotsUsingEmail = (emailId: string) => {
    const allBots = botService.getAllBots();
    return allBots.filter(bot => bot.emailAccounts?.includes(emailId));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Mail className="h-7 w-7" /> Email Accounts
        </h1>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowImportDialog(true)}
            className="flex-1 md:flex-auto"
          >
            <UploadCloud className="mr-2 h-4 w-4" /> Import
          </Button>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="flex-1 md:flex-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Account
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Email Accounts</CardTitle>
          <CardDescription>
            Manage email accounts used by bots for various operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full md:w-auto">
              <TabsList className="w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="flagged">Flagged</TabsTrigger>
                <TabsTrigger value="blocked">Blocked</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {filteredEmails.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>In Use</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmails.map((email) => {
                    const botsUsingEmail = getBotsUsingEmail(email.id);
                    return (
                      <TableRow key={email.id}>
                        <TableCell className="font-medium">{email.email}</TableCell>
                        <TableCell>{getStatusBadge(email.status)}</TableCell>
                        <TableCell>{email.lastUsed || "Never"}</TableCell>
                        <TableCell>
                          {email.isInUse ? (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{botsUsingEmail.length} bot(s)</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Not in use</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEmail(email.id)}
                            disabled={email.isInUse}
                            className={email.isInUse ? "opacity-30 cursor-not-allowed" : ""}
                            title={email.isInUse ? "Cannot delete an email in use" : "Delete email"}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-12 border rounded-lg border-dashed">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No email accounts found</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Add email accounts to use with your bots
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Email Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Email Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Email Account</DialogTitle>
            <DialogDescription>
              Add a new email account to use with your bots
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-email">Email Address</Label>
              <Input
                id="new-email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEmail}>Add Email Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Import Email Accounts</DialogTitle>
            <DialogDescription>
              Paste email:password pairs, one per line
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="import-textarea">Email Credentials</Label>
                <div className="text-xs text-muted-foreground">Format: email:password</div>
              </div>
              <textarea
                id="import-textarea"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="user1@example.com:password1&#10;user2@example.com:password2&#10;user3@example.com:password3"
                className="w-full h-[150px] font-mono text-sm border rounded-md p-2"
              ></textarea>
              
              <div className="flex items-center border rounded-md p-2 bg-muted/50">
                <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                <p className="text-xs">
                  You can paste data in formats like "email:password", "email,password" or "email password"
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportEmails}>Import Email Accounts</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
