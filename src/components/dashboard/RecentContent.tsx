
import { Check, Clock, MessageSquare, ThumbsUp, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ContentItem {
  id: string;
  title: string;
  platform: string;
  status: "pending" | "approved" | "rejected";
  timestamp: string;
  stats?: {
    likes?: number;
    comments?: number;
  };
}

export function RecentContent({ items }: { items: ContentItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div 
              key={item.id}
              className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium truncate max-w-[250px]">{item.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.platform}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.timestamp}
                    </span>
                  </div>
                </div>
                
                {item.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-green-500 hover:text-green-600 hover:bg-green-500/10">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-500/10">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Badge variant={item.status === "approved" ? "default" : "destructive"}>
                    {item.status === "approved" ? "Approved" : "Rejected"}
                  </Badge>
                )}
              </div>
              
              {item.stats && item.status === "approved" && (
                <div className="flex gap-4 mt-2">
                  {item.stats.likes !== undefined && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span>{item.stats.likes}</span>
                    </div>
                  )}
                  {item.stats.comments !== undefined && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      <span>{item.stats.comments}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
