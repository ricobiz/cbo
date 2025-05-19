
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface HistoryItem {
  title: string;
  content: string;
  platform: string;
  timestamp: Date;
}

interface GenerationHistoryProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
}

export function GenerationHistory({ history, onSelectItem }: GenerationHistoryProps) {
  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - new Date(date).getTime()) / 60000);
    
    if (minutes < 1) return "Только что";
    if (minutes < 60) return `${minutes} минут назад`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} часов назад`;
    
    const days = Math.floor(hours / 24);
    return `${days} дней назад`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>История</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            У вас пока нет сгенерированного контента
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div 
                key={index} 
                className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer"
                onClick={() => onSelectItem(item)}
              >
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Сгенерировано {formatTimeAgo(new Date(item.timestamp))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
