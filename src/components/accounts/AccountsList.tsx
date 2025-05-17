
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  PlayCircle, 
  Check, 
  AlertCircle, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram,
  Youtube,
  Music
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AccountData } from "./AccountManager";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface AccountsListProps {
  accounts: AccountData[];
  onEdit: (account: AccountData) => void;
  onDelete: (id: string) => void;
  onTest: (id: string) => void;
}

export function AccountsList({ accounts, onEdit, onDelete, onTest }: AccountsListProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      case "spotify":
        return <Music className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="border-green-500 text-green-500">Активен</Badge>;
      case "inactive":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Неактивен</Badge>;
      case "error":
        return <Badge variant="outline" className="border-red-500 text-red-500">Ошибка</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };
  
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "active":
        return <Check className="h-4 w-4 text-green-500" />;
      case "inactive":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  const formatLastUsed = (lastUsed?: string) => {
    if (!lastUsed) return "Никогда не использовался";
    
    try {
      return `Последнее использование: ${formatDistanceToNow(new Date(lastUsed), { 
        addSuffix: true,
        locale: ru
      })}`;
    } catch (e) {
      return "Дата недействительна";
    }
  };
  
  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <Card key={account.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {getPlatformIcon(account.platform) || (
                    <span className="font-medium uppercase">{account.platform.slice(0, 2)}</span>
                  )}
                </div>
                <div>
                  <div className="font-medium">{account.username}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    {getStatusIcon(account.status)}
                    <span className="capitalize">{account.platform}</span>
                    {account.url && <span>• {new URL(account.url).hostname}</span>}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="hidden sm:block">
                  {getStatusBadge(account.status)}
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(account)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Редактировать</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onTest(account.id!)}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Проверить подключение</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(account.id!)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Удалить</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            {account.lastUsed && (
              <div className="mt-2 text-xs text-muted-foreground">
                {formatLastUsed(account.lastUsed)}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
