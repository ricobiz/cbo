
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/store/LanguageStore";
import { useToast } from "@/components/ui/use-toast";

export function UserMenu() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    toast({
      title: t('loggedOut') || "Logged out",
      description: t('successfullyLoggedOut') || "You have been successfully logged out."
    });
    // В будущем здесь будет логика выхода из системы
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={t('user') || "User"} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{t('userName') || "User Name"}</p>
            <p className="text-xs text-muted-foreground">user@example.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleNavigate("/settings?tab=profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>{t('profile') || "Profile"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('settings') || "Settings"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleNavigate("/billing")}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>{t('billing') || "Billing"}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout') || "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
