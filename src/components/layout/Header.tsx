
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Menu } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Header = ({ toggleSidebar, isSidebarCollapsed }: HeaderProps) => {
  return (
    <header className="border-b bg-background p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative">
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
