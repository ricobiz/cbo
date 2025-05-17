
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Bot, 
  BarChart3, 
  FileText, 
  Settings, 
  ClipboardList,
  Command,
  Sparkles
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  isCollapsed?: boolean;
}

export function Sidebar({ isCollapsed = false }: SidebarProps) {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  
  // Define menu items
  const menuItems = [
    {
      href: "/",
      icon: Home,
      title: "Dashboard",
    },
    {
      href: "/bots",
      icon: Bot,
      title: "Bots",
    },
    {
      href: "/campaigns",
      icon: ClipboardList,
      title: "Campaigns",
    },
    {
      href: "/content",
      icon: FileText,
      title: "Content",
    },
    {
      href: "/analytics",
      icon: BarChart3,
      title: "Analytics",
    },
    {
      href: "/command",
      icon: Sparkles,
      title: "AI Command",
      isPrimary: true,
    },
    {
      href: "/settings",
      icon: Settings,
      title: "Settings",
      isBottom: true,
    },
  ];

  // Determine which items are for the main nav vs bottom nav
  const mainNavItems = menuItems.filter(item => !item.isBottom);
  const bottomNavItems = menuItems.filter(item => item.isBottom);

  return (
    <aside 
      className={cn(
        "h-screen flex flex-col bg-background pb-12 transition-all shadow-md",
        isCollapsed ? "w-[80px]" : "w-[240px]"
      )}
    >
      <ScrollArea className="flex-1">
        <div className="px-4 py-6">
          <div className="flex flex-col gap-2">
            {mainNavItems.map((item, index) => (
              <NavItem
                key={index}
                href={item.href}
                icon={item.icon}
                title={item.title}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
                isPrimary={item.isPrimary}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto px-4 py-4 border-t">
        <div className="flex flex-col gap-2">
          {bottomNavItems.map((item, index) => (
            <NavItem
              key={index}
              href={item.href}
              icon={item.icon}
              title={item.title}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

interface NavItemProps {
  href: string;
  icon: React.FC<{ className?: string }>;
  title: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  isPrimary?: boolean;
  onClick?: () => void;
}

function NavItem({ 
  href, 
  icon: Icon, 
  title, 
  isActive, 
  isCollapsed,
  isPrimary,
  onClick 
}: NavItemProps) {
  const linkContent = (
    <Button
      variant={isActive ? "secondary" : isPrimary ? "default" : "ghost"}
      size={isCollapsed ? "icon" : "default"}
      className={cn(
        "w-full justify-start", 
        isCollapsed && "h-10 w-10",
        isPrimary && !isActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
      )}
      onClick={onClick}
    >
      <Icon className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "mr-2")} />
      {!isCollapsed && <span>{title}</span>}
    </Button>
  );
  
  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link to={href}>{linkContent}</Link>
        </TooltipTrigger>
        <TooltipContent side="right">{title}</TooltipContent>
      </Tooltip>
    );
  }
  
  return <Link to={href}>{linkContent}</Link>;
}

export default Sidebar;
