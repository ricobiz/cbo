
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Menu, PanelLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Header = ({ toggleSidebar, isSidebarCollapsed }: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="border-b bg-background p-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Sidebar toggle button - always visible and prominent */}
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={toggleSidebar} 
          className="flex items-center justify-center"
          aria-label={isSidebarCollapsed ? "Открыть меню" : "Закрыть меню"}
          title={isSidebarCollapsed ? "Открыть меню" : "Закрыть меню"}
        >
          {isMobile || isSidebarCollapsed ? 
            <Menu className="h-5 w-5" /> : 
            <PanelLeft className="h-5 w-5" />
          }
        </Button>
        
        <div className="relative md:flex hidden">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md border bg-background px-8 py-2 text-sm"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
