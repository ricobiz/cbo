
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { ApiStatusHeader } from "@/components/layout/ApiStatusHeader";
import { SidebarTrigger } from "@/components/layout/SidebarTrigger";
import { useIsMobile } from "@/hooks/use-mobile";
import { ApiConnectionIndicator } from "@/components/layout/ApiConnectionIndicator";
import { ApiStatus } from "@/components/ApiStatus";
import { BannerOffline } from "@/components/BannerOffline";

export function Header() {
  const isMobile = useIsMobile();
  
  return (
    <>
      <BannerOffline className="sticky top-0 z-50" />
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center">
            {isMobile && <SidebarTrigger />}
          </div>
          <div className="flex items-center gap-4">
            <ApiStatus />
            <ApiConnectionIndicator />
            <ApiStatusHeader />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>
    </>
  );
}
