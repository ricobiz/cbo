
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebarStore } from "@/store/SidebarStore";
import { useIsMobile } from "@/hooks/use-mobile";

export function SidebarTrigger() {
  const { isOpen, toggle } = useSidebarStore();
  const isMobile = useIsMobile();

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggle} 
      className="mr-2 border-primary/30 hover:bg-primary/10"
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
