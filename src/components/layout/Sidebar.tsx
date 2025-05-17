
import { NavLink } from "react-router-dom";
import { SidebarTrigger } from "@/components/layout/SidebarTrigger";
import { useSidebarStore } from "@/store/SidebarStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart,
  Bot,
  FileText,
  GitBranch,
  LineChart,
  Settings,
  PanelLeftClose,
  Terminal,
} from "lucide-react";
import { useTranslation } from "@/store/LanguageStore";

export function Sidebar() {
  const { isOpen, toggle } = useSidebarStore();
  const { t } = useTranslation();
  
  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "dashboard" },
    { path: "/campaigns", icon: BarChart, label: "campaigns" },
    { path: "/bots", icon: Bot, label: "bots" },
    { path: "/content", icon: FileText, label: "content" },
    { path: "/scenarios", icon: GitBranch, label: "scenarios" },
    { path: "/analytics", icon: LineChart, label: "analytics" },
    { path: "/command", icon: Terminal, label: "command" },
    { path: "/settings", icon: Settings, label: "settings" }
  ];
  
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex h-14 items-center border-b px-4">
        <NavLink to="/" className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold">AI-IaaS</span>
        </NavLink>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        <ul className="grid gap-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{t(item.label)}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t p-2">
        <button
          onClick={toggle}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent md:hidden"
        >
          <PanelLeftClose className="h-4 w-4" />
          <span>{t('collapse')}</span>
        </button>
      </div>
    </aside>
  );
}
