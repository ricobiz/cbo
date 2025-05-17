
import { useOnline } from "@/hooks/useOnline";
import { AlertCircle, WifiOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function BannerOffline({ className }: { className?: string }) {
  const isOnline = useOnline();
  const [dismissed, setDismissed] = useState(false);
  
  // Если онлайн или баннер уже был закрыт, ничего не показываем
  if (isOnline || dismissed) return null;
  
  return (
    <div className={cn(
      "bg-red-500/90 text-white py-2 px-4 flex items-center justify-center gap-2 text-sm relative",
      className
    )}>
      <WifiOff className="h-4 w-4" />
      <span>Нет подключения к интернету</span>
      <AlertCircle className="h-4 w-4" />
      
      <button 
        onClick={() => setDismissed(true)}
        className="absolute right-2 p-1 hover:bg-red-600/50 rounded-full"
        aria-label="Закрыть"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
