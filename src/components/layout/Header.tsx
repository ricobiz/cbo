
import { useMediaQuery } from "usehooks-ts";
import { SidebarTrigger } from "@/components/layout/SidebarTrigger";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { LanguageSwitcher } from "@/components/language-switcher/LanguageSwitcher";
import { useTranslation } from "@/store/LanguageStore";
import { useLocation } from "react-router-dom";

export function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useTranslation();
  const location = useLocation();
  
  // Function to get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return t('dashboard');
    if (path === '/content') return t('content');
    if (path === '/campaigns') return t('campaigns');
    if (path === '/bots') return t('bots');
    if (path === '/scenarios') return t('scenarios');
    if (path === '/analytics') return t('analytics');
    if (path === '/command') return t('command');
    if (path === '/settings') return t('settings');
    return t('dashboard');
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          {isMobile && <SidebarTrigger />}
          <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
