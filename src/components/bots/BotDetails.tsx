
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot as BotIcon, Play, Pause, Settings } from 'lucide-react';
import { AdvancedConfigForm } from './AdvancedConfigForm';
import { Bot, BotStatus, BotType } from '@/services/types/bot';

export interface BotDetailsProps {
  bot: Bot;
  onBack: () => void;
}

export function BotDetails({ bot, onBack }: BotDetailsProps) {
  const [configOpen, setConfigOpen] = React.useState(false);
  
  const getTypeLabel = () => {
    switch (bot.type) {
      case 'content': return 'Content Bot';
      case 'interaction': return 'Interaction Bot';
      case 'view': return 'View Bot';  
      case 'parser': return 'Parser Bot'; 
      case 'custom': return 'Custom Bot';
      default: return 'Bot';
    }
  };

  const handleStart = () => {
    // Implementation for starting the bot
  };

  const handleStop = () => {
    // Implementation for stopping the bot
  };
  
  return (
    <>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BotIcon className="h-5 w-5" /> {bot.name}
          </h2>
          <p className="text-muted-foreground">
            {getTypeLabel()} · {bot.description}
          </p>
        </div>
        
        {bot.lastRun && (
          <p className="text-sm text-muted-foreground">
            Last run: {new Date(bot.lastRun).toLocaleString()}
          </p>
        )}
        
        <div className="flex space-x-2">
          {bot.status !== 'active' && bot.status !== 'running' ? (
            <Button onClick={handleStart} className="flex-1">
              <Play className="h-4 w-4 mr-2" /> Start Bot
            </Button>
          ) : (
            <Button onClick={handleStop} variant="outline" className="flex-1">
              <Pause className="h-4 w-4 mr-2" /> Stop Bot
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={() => setConfigOpen(true)}
          >
            <Settings className="h-4 w-4 mr-2" /> Configure
          </Button>
        </div>
      </div>
      
      {configOpen && (
        <AdvancedConfigForm 
          botId={bot.id}
          open={configOpen}
          onOpenChange={setConfigOpen}
        />
      )}
    </>
  );
}
