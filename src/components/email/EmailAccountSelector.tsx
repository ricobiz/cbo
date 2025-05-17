
import { useState, useEffect } from "react";
import { botService, EmailAccount } from "@/services/BotService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Plus, X, Upload, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailAccountSelectorProps {
  botId: string;
}

export function EmailAccountSelector({ botId }: EmailAccountSelectorProps) {
  const [botEmails, setBotEmails] = useState<EmailAccount[]>([]);
  const [availableEmails, setAvailableEmails] = useState<EmailAccount[]>([]);
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [importText, setImportText] = useState("");
  const { toast } = useToast();
  
  // Load bot emails and available emails
  useEffect(() => {
    if (botId) {
      const botEmailAccounts = botService.getBotEmailAccounts(botId);
      setBotEmails(botEmailAccounts);
      
      const allEmails = botService.getAllEmailAccounts();
      const unusedEmails = allEmails.filter(email => !email.isInUse || 
        botEmailAccounts.some(botEmail => botEmail.id === email.id));
      setAvailableEmails(unusedEmails);
    }
  }, [botId]);
  
  // Add email to bot
  const addEmailToBot = (emailId: string) => {
    const success = botService.assignEmailAccountToBot(emailId, botId);
    if (success) {
      const botEmailAccounts = botService.getBotEmailAccounts(botId);
      setBotEmails(botEmailAccounts);
      
      toast({
        title: "Email added",
        description: "Email account assigned to bot successfully"
      });
    } else {
      toast({
        title: "Failed to add email",
        description: "Could not assign email to bot",
        variant: "destructive"
      });
    }
  };
  
  // Remove email from bot
  const removeEmailFromBot = (emailId: string) => {
    const success = botService.removeEmailAccountFromBot(emailId, botId);
    if (success) {
      const botEmailAccounts = botService.getBotEmailAccounts(botId);
      setBotEmails(botEmailAccounts);
      
      toast({
        title: "Email removed",
        description: "Email account removed from bot successfully"
      });
    } else {
      toast({
        title: "Failed to remove email",
        description: "Could not remove email from bot",
        variant: "destructive"
      });
    }
  };
  
  // Add new email account to system
  const handleAddNewEmail = () => {
    if (!newEmail || !newPassword) {
      toast({
        title: "Missing information",
        description: "Please provide both email and password",
        variant: "destructive"
      });
      return;
    }
    
    const emailId = botService.addEmailAccount(newEmail, newPassword);
    addEmailToBot(emailId);
    
    setNewEmail("");
    setNewPassword("");
    setShowAddEmail(false);
    
    // Refresh available emails
    const allEmails = botService.getAllEmailAccounts();
    const botEmailAccounts = botService.getBotEmailAccounts(botId);
    const unusedEmails = allEmails.filter(email => !email.isInUse || 
      botEmailAccounts.some(botEmail => botEmail.id === email.id));
    setAvailableEmails(unusedEmails);
  };
  
  // Import email accounts from text
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
          const emailId = botService.addEmailAccount(email, password);
          botService.assignEmailAccountToBot(emailId, botId);
          importCount++;
        }
      }
    });
    
    if (importCount > 0) {
      const botEmailAccounts = botService.getBotEmailAccounts(botId);
      setBotEmails(botEmailAccounts);
      
      toast({
        title: "Import successful",
        description: `Imported ${importCount} email accounts`
      });
      
      setImportText("");
      setShowImportDialog(false);
      
      // Refresh available emails
      const allEmails = botService.getAllEmailAccounts();
      const unusedEmails = allEmails.filter(email => !email.isInUse || 
        botEmailAccounts.some(botEmail => botEmail.id === email.id));
      setAvailableEmails(unusedEmails);
    } else {
      toast({
        title: "Import failed",
        description: "No valid email:password pairs found",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4">
      {botEmails.length > 0 ? (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Assigned Email Accounts</Label>
          <div className="flex flex-wrap gap-2">
            {botEmails.map(email => (
              <Badge key={email.id} variant="outline" className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>{email.email}</span>
                <button
                  className="ml-1 text-muted-foreground hover:text-destructive"
                  onClick={() => removeEmailFromBot(email.id)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground border rounded-md p-3 text-center">
          No email accounts assigned to this bot
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => setShowAddEmail(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Email
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => setShowImportDialog(true)}
        >
          <Upload className="h-3.5 w-3.5 mr-1" /> Import
        </Button>
      </div>
      
      {/* Add Email Dialog */}
      <Dialog open={showAddEmail} onOpenChange={setShowAddEmail}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Email Account</DialogTitle>
            <DialogDescription>
              Add a new email account or select from existing ones
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>
            
            {availableEmails.length > 0 && !botEmails.some(e => availableEmails.some(a => a.id === e.id)) && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or select existing
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Available Email Accounts</Label>
                  <div className="max-h-[150px] overflow-y-auto space-y-2">
                    {availableEmails
                      .filter(email => !botEmails.some(e => e.id === email.id))
                      .map(email => (
                        <div 
                          key={email.id}
                          className="text-sm p-2 border rounded-md flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                          onClick={() => addEmailToBot(email.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {email.email}
                          </div>
                          <Plus className="h-4 w-4" />
                        </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEmail(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewEmail}>Add Email Account</Button>
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
                <Label htmlFor="import-text">Email Credentials</Label>
                <div className="text-xs text-muted-foreground">Format: email:password</div>
              </div>
              <Input
                id="import-text"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="user1@example.com:password1"
                className="font-mono"
              />
              <textarea
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
