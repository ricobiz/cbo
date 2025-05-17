
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AccountForm } from "./AccountForm";
import { AccountsList } from "./AccountsList";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// This type should match the form schema in AccountForm
export interface AccountData {
  id?: string;
  platform: string;
  username: string;
  password: string;
  url?: string;
  apiKey?: string;
  status?: "active" | "inactive" | "error";
  lastUsed?: string;
}

export function AccountManager() {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<AccountData | null>(null);
  const { toast } = useToast();

  const handleAddAccount = (account: Omit<AccountData, "id">) => {
    const newAccount: AccountData = {
      ...account,
      id: Date.now().toString(),
      status: "active",
      lastUsed: new Date().toISOString(),
    };
    
    setAccounts([...accounts, newAccount]);
    setShowAddForm(false);
    
    toast({
      title: "Аккаунт добавлен",
      description: `${account.platform}: ${account.username}`,
    });
  };
  
  const handleEditAccount = (account: AccountData) => {
    setEditingAccount(account);
  };
  
  const handleUpdateAccount = (updatedAccount: AccountData) => {
    setAccounts(accounts.map(acc => 
      acc.id === editingAccount?.id ? { ...updatedAccount, id: acc.id } : acc
    ));
    setEditingAccount(null);
    
    toast({
      title: "Аккаунт обновлен",
      description: `${updatedAccount.platform}: ${updatedAccount.username}`,
    });
  };
  
  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
    
    toast({
      title: "Аккаунт удален",
      description: "Аккаунт был успешно удален из системы",
    });
  };
  
  const handleTestAccount = (id: string) => {
    // In a real scenario, this would test the account connection
    toast({
      title: "Тестирование аккаунта",
      description: "Проверка подключения аккаунта...",
    });
    
    // Simulate testing delay
    setTimeout(() => {
      setAccounts(accounts.map(account => 
        account.id === id 
          ? { ...account, status: "active", lastUsed: new Date().toISOString() } 
          : account
      ));
      
      toast({
        title: "Тест успешен",
        description: "Аккаунт успешно подключен и готов к использованию",
      });
    }, 1500);
  };

  if (editingAccount) {
    return (
      <div className="space-y-4">
        <AccountForm 
          existingAccount={editingAccount} 
          onAccountAdded={handleUpdateAccount}
          onCancel={() => setEditingAccount(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showAddForm ? (
        <AccountForm 
          onAccountAdded={handleAddAccount} 
          onCancel={() => setShowAddForm(false)}
        />
      ) : accounts.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Ваши аккаунты</h2>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить аккаунт
            </Button>
          </div>
          <AccountsList 
            accounts={accounts} 
            onEdit={handleEditAccount} 
            onDelete={handleDeleteAccount}
            onTest={handleTestAccount}
          />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Добавьте аккаунты для автоматизации</CardTitle>
            <CardDescription>
              Добавьте аккаунты социальных сетей и других платформ для автоматической генерации контента и продвижения
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowAddForm(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Добавить первый аккаунт
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
