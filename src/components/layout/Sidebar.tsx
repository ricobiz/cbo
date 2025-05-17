
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Bot,
  Command,
  CreditCard,
  FileCode,
  HardDrive,
  Home,
  Mail,
  MessageSquare,
  Route,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { pathname } = useLocation();
  
  const links = [
    {
      name: "Дашборд",
      path: "/",
      icon: <Home className="h-4 w-4" />,
    },
    {
      name: "Кампании",
      path: "/campaigns",
      icon: <Route className="h-4 w-4" />
    },
    {
      name: "Боты",
      path: "/bots",
      icon: <Bot className="h-4 w-4" />
    },
    {
      name: "Аккаунты",
      path: "/accounts",
      icon: <User className="h-4 w-4" />
    },
    {
      name: "Генератор контента",
      path: "/content",
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      name: "Командный центр",
      path: "/command",
      icon: <Command className="h-4 w-4" />
    },
    {
      name: "Аналитика",
      path: "/analytics",
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      name: "Email аккаунты",
      path: "/email-accounts",
      icon: <Mail className="h-4 w-4" />
    },
    {
      name: "Прокси",
      path: "/proxy",
      icon: <HardDrive className="h-4 w-4" />
    },
    {
      name: "Сценарии",
      path: "/scenarios",
      icon: <FileCode className="h-4 w-4" />
    },
    {
      name: "Тарифы",
      path: "/billing",
      icon: <CreditCard className="h-4 w-4" />
    },
    {
      name: "Настройки",
      path: "/settings",
      icon: <Settings className="h-4 w-4" />
    },
  ];

  return (
    <div className={cn("min-h-screen border-r bg-sidebar", className)}>
      <ScrollArea className="h-full overflow-y-auto pt-5 pb-12">
        <div className="px-4">
          <Link to="/" className="flex h-10 items-center justify-start px-2">
            <span className="font-semibold text-xl flex items-center text-sidebar-foreground">
              <Bot className="h-6 w-6 mr-2" />
              AutoPromo
            </span>
          </Link>
        </div>
        <div className="space-y-4 py-4">
          <div className="px-4 py-2">
            <h2 className="mb-2 text-sm font-medium text-sidebar-foreground">Навигация</h2>
            <div className="space-y-1">
              {links.map((link) => (
                <Button
                  key={link.path}
                  variant={pathname === link.path ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === link.path
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground font-normal hover:bg-sidebar-accent/50"
                  )}
                  asChild
                >
                  <Link to={link.path}>
                    {link.icon}
                    <span className="ml-2">{link.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="py-4">
          <Separator className="bg-sidebar-border" />
          <div className="px-4 flex justify-between items-center py-3">
            <div className="text-sm text-sidebar-foreground opacity-70">
              © 2025 AutoPromo
            </div>
            <ThemeToggle />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
