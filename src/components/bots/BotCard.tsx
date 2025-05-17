
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot } from "@/services/types/bot";
import { Bot as BotIcon, ExternalLink } from "lucide-react";

export interface BotCardProps {
  bot: Bot;
  onClick?: () => void;
}

export function BotCard({ bot, onClick }: BotCardProps) {
  const statusColors = {
    running: "bg-green-500",
    paused: "bg-amber-500",
    idle: "bg-slate-400",
    error: "bg-red-500",
    "setup-required": "bg-blue-500",
    active: "bg-green-500"
  };

  const statusLabels = {
    running: "Активен",
    paused: "Приостановлен",
    idle: "Простаивает",
    error: "Ошибка",
    "setup-required": "Требуется настройка",
    active: "Активен"
  };

  const getStatusColor = () => {
    return statusColors[bot.status] || "bg-slate-400";
  };

  const getStatusLabel = () => {
    return statusLabels[bot.status] || bot.status;
  };

  return (
    <Card className="overflow-hidden border hover:border-primary transition-all cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{bot.name}</CardTitle>
          <Badge className={`${getStatusColor()} text-white`}>
            {getStatusLabel()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground capitalize">{bot.type} · {bot.platform}</p>
      </CardHeader>
      <CardContent className="pb-3">
        {bot.description && <p className="text-sm">{bot.description}</p>}
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center">
          <BotIcon className="h-3.5 w-3.5 mr-1" />
          <span>ID: {bot.id.substring(0, 8)}</span>
        </div>
        {bot.lastActive && (
          <span>
            Активность: {new Date(bot.lastActive).toLocaleDateString()}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
