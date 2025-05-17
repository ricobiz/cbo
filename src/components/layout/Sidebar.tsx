
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Bot,
  Layers,
  Settings,
  MessageSquare,
  Rocket,
  Menu,
  X,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: <Home className="w-5 h-5" />
  },
  {
    title: "Campaigns",
    href: "/campaigns",
    icon: <Rocket className="w-5 h-5" />
  },
  {
    title: "Bots",
    href: "/bots",
    icon: <Bot className="w-5 h-5" />
  },
  {
    title: "Content",
    href: "/content",
    icon: <MessageSquare className="w-5 h-5" />
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    title: "Scenarios",
    href: "/scenarios",
    icon: <Layers className="w-5 h-5" />
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="w-5 h-5" />
  }
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <div className="lg:hidden flex items-center p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent glow"></div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Influence
              </h2>
            </div>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                  location.pathname === item.href
                    ? "bg-sidebar-accent text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <div className="p-4 rounded-lg bg-sidebar-accent/50 space-y-2">
              <h4 className="text-sm font-medium">Upgrade to Pro</h4>
              <p className="text-xs text-sidebar-foreground/70">
                Get unlimited campaigns and advanced analytics
              </p>
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
