
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Plus, Import, Download, Search, Trash2, Check, X, Filter } from "lucide-react";
import { botService, EmailAccount } from "@/services/BotService";
import { InteractiveHint } from "@/components/ui/interactive-hint";

const EmailAccountsPage = () => {
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<EmailAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [importText, setImportText] = useState("");
  const [showHints, setShowHints] = useState(true);
  
  const { toast } = useToast();
  
  // Load email accounts
  useEffect(() => {
    const accounts = botService.getAllEmailAccounts();
    setEmailAccounts(accounts);
    setFilteredAccounts(accounts);
  }, []);
  
  // Filter accounts when search or status filter changes
  useEffect(() => {
    let filtered = [...emailAccounts];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(account => {
        if (statusFilter === "active") return account.status === "active";
        if (statusFilter === "inactive") return account.status === "inactive";
        if (statusFilter === "inUse") return account.isInUse;
        if (statusFilter === "available") return !account.isInUse;
        return true;
      });
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(account => 
        account.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredAccounts(filtered);
  }, [emailAccounts, searchQuery, statusFilter]);
  
  // Add new email account
  const handleAddEmail = () => {
    if (!newEmail || !newPassword) {
      toast({
        title: "Необходимо заполнить все поля",
        description: "Пожалуйста, введите адрес электронной почты и пароль.",
        variant: "destructive"
      });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast({
        title: "Неверный формат",
        description: "Пожалуйста, введите корректный адрес электронной почты.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const emailId = botService.addEmailAccount(newEmail, newPassword);
      
      if (emailId) {
        const accounts = botService.getAllEmailAccounts();
        setEmailAccounts(accounts);
        
        toast({
          title: "Аккаунт добавлен",
          description: `Электронная почта ${newEmail} успешно добавлена.`
        });
        
        setNewEmail("");
        setNewPassword("");
        setShowAddDialog(false);
      }
    } catch (error) {
      toast({
        title: "Ошибка при добавлении",
        description: "Не удалось добавить учетную запись электронной почты.",
        variant: "destructive"
      });
    }
  };
  
  // Import email accounts
  const handleImportEmails = () => {
    if (!importText.trim()) {
      toast({
        title: "Нет данных для импорта",
        description: "Пожалуйста, введите данные в формате email:password.",
        variant: "destructive"
      });
      return;
    }
    
    const lines = importText.split('\n');
    let importCount = 0;
    let errorCount = 0;
    
    lines.forEach(line => {
      const parts = line.trim().split(/[,:;|]|\s+/);
      if (parts.length >= 2) {
        const email = parts[0].trim();
        const password = parts[1].trim();
        
        if (email && password) {
          try {
            botService.addEmailAccount(email, password);
            importCount++;
          } catch (error) {
            errorCount++;
          }
        }
      }
    });
    
    if (importCount > 0) {
      const accounts = botService.getAllEmailAccounts();
      setEmailAccounts(accounts);
      
      toast({
        title: "Импорт завершен",
        description: `Успешно импортировано ${importCount} аккаунтов${errorCount > 0 ? `, не удалось импортировать ${errorCount}` : ''}.`
      });
      
      setImportText("");
      setShowImportDialog(false);
    } else {
      toast({
        title: "Импорт не выполнен",
        description: "Не удалось импортировать аккаунты. Проверьте формат данных.",
        variant: "destructive"
      });
    }
  };
  
  // Delete email account
  const handleDeleteEmail = (id: string) => {
    const account = emailAccounts.find(a => a.id === id);
    
    if (account?.isInUse) {
      toast({
        title: "Невозможно удалить",
        description: "Этот аккаунт используется ботом. Отключите его от бота перед удалением.",
        variant: "destructive"
      });
      return;
    }
    
    const success = botService.deleteEmailAccount(id);
    
    if (success) {
      const accounts = botService.getAllEmailAccounts();
      setEmailAccounts(accounts);
      
      toast({
        title: "Аккаунт удален",
        description: "Учетная запись электронной почты успешно удалена."
      });
    } else {
      toast({
        title: "Ошибка при удалении",
        description: "Не удалось удалить учетную запись электронной почты.",
        variant: "destructive"
      });
    }
  };
  
  // Export email accounts
  const handleExportEmails = () => {
    const exportData = emailAccounts.map(account => {
      return `${account.email}:${account.password || '[скрыто]'}`;
    }).join('\n');
    
    // Create download link
    const element = document.createElement('a');
    const file = new Blob([exportData], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `email-accounts-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Экспорт выполнен",
      description: "Учетные записи электронной почты успешно экспортированы."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <h1 className="text-3xl font-bold">Учетные записи электронной почты</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Import className="h-4 w-4 mr-2" />
            Импорт
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Добавить
          </Button>
        </div>
      </div>
      
      {showHints && (
        <InteractiveHint
          title="Управление электронной почтой"
          description="Добавляйте и управляйте учетными записями электронной почты для использования с ботами."
          onComplete={() => setShowHints(false)}
          highlightLevel="medium"
        >
          <div className="flex items-start gap-3">
            <Mail className="h-8 w-8 text-blue-500 mt-1" />
            <div>
              <h4 className="font-medium">Учетные записи электронной почты</h4>
              <p className="text-sm text-muted-foreground">
                Здесь вы можете добавлять и управлять учетными записями электронной почты, которые будут использоваться вашими ботами. Вы можете добавлять почты по одной или импортировать их массово.
              </p>
            </div>
          </div>
        </InteractiveHint>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Все учетные записи</CardTitle>
          <CardDescription>
            Управление учетными записями электронной почты для всех ботов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Фильтр" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Все аккаунты</SelectItem>
                    <SelectItem value="active">Активные</SelectItem>
                    <SelectItem value="inactive">Неактивные</SelectItem>
                    <SelectItem value="inUse">Используемые</SelectItem>
                    <SelectItem value="available">Доступные</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Последнее использование</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <Mail className="h-8 w-8 text-muted-foreground opacity-20 mx-auto mb-2" />
                      <p className="text-muted-foreground">Нет учетных записей электронной почты</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.email}</TableCell>
                      <TableCell>
                        <Badge variant={account.isInUse ? "default" : account.status === "active" ? "outline" : "secondary"}>
                          {account.isInUse ? "Используется" : account.status === "active" ? "Активен" : "Неактивен"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {account.lastUsed 
                          ? new Date(account.lastUsed).toLocaleDateString() 
                          : "Не использовался"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEmail(account.id)}
                          disabled={account.isInUse}
                          title={account.isInUse ? "Невозможно удалить используемый аккаунт" : "Удалить"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 flex justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Всего: {filteredAccounts.length} из {emailAccounts.length}
          </div>
          <Button variant="outline" size="sm" onClick={handleExportEmails} disabled={emailAccounts.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </CardFooter>
      </Card>
      
      {/* Add Email Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Добавить учетную запись</DialogTitle>
            <DialogDescription>
              Добавьте новую учетную запись электронной почты для использования с ботами.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="username@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddEmail}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Импорт учетных записей</DialogTitle>
            <DialogDescription>
              Вставьте список учетных записей в формате email:password, по одной на строку.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="import-text">Данные для импорта</Label>
              <textarea
                id="import-text"
                className="min-h-[150px] w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="user1@example.com:password1&#10;user2@example.com:password2&#10;user3@example.com:password3"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              ></textarea>
              <p className="text-xs text-muted-foreground">
                Поддерживаемые форматы: email:password, email,password, email|password или email password
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleImportEmails}>
              Импортировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailAccountsPage;
