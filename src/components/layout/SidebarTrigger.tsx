
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebarStore } from "@/store/SidebarStore";

export function SidebarTrigger() {
  const { toggle } = useSidebarStore();

  return (
    <Button variant="outline" size="icon" onClick={toggle} className="mr-2">
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
