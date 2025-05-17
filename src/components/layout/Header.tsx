import { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "usehooks-ts";

import { SidebarTrigger } from "@/components/layout/SidebarTrigger";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { Bot } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher/LanguageSwitcher";
import { useTranslation } from "@/store/LanguageStore";

export function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          {isMobile && <SidebarTrigger />}
          <h1 className="text-lg font-semibold">{t('dashboard')}</h1>
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
