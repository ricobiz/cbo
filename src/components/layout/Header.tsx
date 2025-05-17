
import { Bell, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-medium">AI Influence as a Service</h1>
        <Badge variant="outline" className="text-xs">BETA</Badge>
      </div>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              <div className="flex items-start gap-4 p-3 hover:bg-accent/50 rounded-md cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Campaign "Spotify Growth" completed</p>
                  <p className="text-xs text-muted-foreground">Target reached: 10,000 listens</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 hover:bg-accent/50 rounded-md cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Content generation completed</p>
                  <p className="text-xs text-muted-foreground">15 posts ready for review</p>
                  <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">View all</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
              </Avatar>
              <span>Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>API Keys</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
