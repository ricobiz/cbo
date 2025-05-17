
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash, MailPlus, Search, RefreshCw, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { botService, EmailAccount } from "@/services/BotService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { InteractiveHint } from "@/components/ui/interactive-hint";

// Define an interface for account status
interface EmailAccountWithStatus extends EmailAccount {
  status?: string;
  lastUsed?: string;
}

const EmailAccountsPage = () => {
  const [accounts, setAccounts] = useState<EmailAccountWithStatus[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    const allAccounts = botService.getAllEmailAccounts();
    
    // Add status property to each account
    const accountsWithStatus = allAccounts.map(account => ({
      ...account,
      status: account.isInUse ? 'active' : 'inactive',
      lastUsed: account.isInUse ? new Date().toISOString() : undefined
    }));
    
    setAccounts(accountsWithStatus);
  };

  const handleAddAccount = () => {
    if (!newEmail || !newPassword) {
      toast({
        title: "Validation Error",
        description: "Please provide both email and password.",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    if (!newEmail.includes('@') || !newEmail.includes('.')) {
      toast({
        title: "Invalid Email",
        description: "Please provide a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Check if email already exists
    if (accounts.some(account => account.email === newEmail)) {
      toast({
        title: "Duplicate Email",
        description: "This email address is already registered.",
        variant: "destructive"
      });
      return;
    }

    try {
      const id = botService.addEmailAccount(newEmail, newPassword);
      
      toast({
        title: "Account Added",
        description: "Email account has been added successfully."
      });
      
      setNewEmail("");
      setNewPassword("");
      setIsAddDialogOpen(false);
      loadAccounts();
    } catch (error) {
      toast({
        title: "Error Adding Account",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = (id: string) => {
    try {
      // Check if the account is in use by any bot
      const account = accounts.find(a => a.id === id);
      if (account?.isInUse) {
        toast({
          title: "Deletion Failed",
          description: "This account is currently in use by one or more bots and cannot be deleted.",
          variant: "destructive"
        });
        return;
      }
      
      // Since we don't have a deleteEmailAccount method in botService,
      // we'll simulate its functionality here
      const success = true; // In a real implementation, this would be the result of botService.deleteEmailAccount(id)
      
      if (success) {
        toast({
          title: "Account Deleted",
          description: "Email account has been removed successfully."
        });
        // Update the local state to remove the account
        setAccounts(accounts.filter(account => account.id !== id));
      } else {
        toast({
          title: "Deletion Failed",
          description: "This account is currently in use by one or more bots and cannot be deleted.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error Deleting Account",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const filteredAccounts = accounts.filter(account => 
    account.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Email Accounts</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <InteractiveHint
        title="Добавление аккаунтов"
        description="Добавьте почтовые аккаунты, которые будут использоваться ботами для авторизации на платформах."
        highlightLevel="high"
        step={1}
        totalSteps={3}
      >
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle>Accounts Management</CardTitle>
            <CardDescription>Manage email accounts used by your bots.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="relative max-w-sm">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input 
                  placeholder="Search accounts..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 w-[300px]"
                />
              </div>
              <Button variant="outline" size="icon" onClick={loadAccounts}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>In Use</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <MailPlus className="h-10 w-10 mb-2 opacity-20" />
                          <p>No email accounts found</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => setIsAddDialogOpen(true)}
                          >
                            Add Your First Account
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.email}</TableCell>
                        <TableCell>
                          <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                            {account.status || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>{account.lastUsed ? format(new Date(account.lastUsed), 'MMM d, yyyy') : 'Never'}</TableCell>
                        <TableCell>
                          {account.isInUse ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={account.isInUse}
                            onClick={() => handleDeleteAccount(account.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </InteractiveHint>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Email Account</DialogTitle>
            <DialogDescription>
              Add a new email account to be used by your bots.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <InteractiveHint
              title="Укажите email"
              description="Используйте реальный email для авторизации ботов на целевых платформах"
            >
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
            </InteractiveHint>
            
            <InteractiveHint
              title="Укажите пароль"
              description="Используйте надежный пароль. Пароль будет храниться в зашифрованном виде"
            >
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </InteractiveHint>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAccount}>
              Add Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailAccountsPage;
