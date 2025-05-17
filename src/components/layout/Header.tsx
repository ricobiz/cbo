import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { UserMenu } from "@/components/UserMenu";
import { ApiStatusHeader } from "@/components/layout/ApiStatusHeader";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          {/* Left side content */}
        </div>
        <div className="flex items-center gap-4">
          <ApiStatusHeader />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
