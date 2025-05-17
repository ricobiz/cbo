
import { useOnline } from "@/hooks/useOnline";
import { AlertCircle, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function BannerOffline({ className }: { className?: string }) {
  const isOnline = useOnline();
  
  if (isOnline) return null;
  
  return (
    <div className={cn("bg-red-500/90 text-white py-2 px-4 flex items-center justify-center gap-2 text-sm", className)}>
      <WifiOff className="h-4 w-4" />
      <span>Нет подключения к интернету</span>
      <AlertCircle className="h-4 w-4" />
    </div>
  );
}
