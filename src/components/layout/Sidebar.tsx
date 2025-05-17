import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SidebarTrigger } from "@/components/layout/SidebarTrigger";
import { useSidebar } from "@/store/SidebarStore";
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
  const { isOpen, toggleSidebar } = useSidebar();
  const { t } = useTranslation();
  
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold">AI-IaaS</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        <ul className="grid gap-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>{t('dashboard')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/campaigns"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <BarChart className="h-4 w-4" />
              <span>{t('campaigns')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bots"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <Bot className="h-4 w-4" />
              <span>{t('bots')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/content"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <FileText className="h-4 w-4" />
              <span>{t('content')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/scenarios"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <GitBranch className="h-4 w-4" />
              <span>{t('scenarios')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <LineChart className="h-4 w-4" />
              <span>{t('analytics')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/command"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <Terminal className="h-4 w-4" />
              <span>{t('command')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )
              }
            >
              <Settings className="h-4 w-4" />
              <span>{t('settings')}</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="border-t p-2">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent md:hidden"
        >
          <PanelLeftClose className="h-4 w-4" />
          <span>Свернуть</span>
        </button>
      </div>
    </aside>
  );
}
