
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
import { BotStatus, BotType } from '@/services/types/bot';

interface BotDetailsProps {
  id: string;
  name: string;
  description?: string;
  status: BotStatus;
  type: BotType;
  lastRun?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart?: () => void;
  onStop?: () => void;
}

export function BotDetails({ 
  id, 
  name, 
  description, 
  status, 
  type, 
  lastRun,
  open, 
  onOpenChange, 
  onStart, 
  onStop 
}: BotDetailsProps) {
  const [configOpen, setConfigOpen] = React.useState(false);
  
  const getTypeLabel = () => {
    switch (type) {
      case 'content': return 'Content Bot';
      case 'interaction': return 'Interaction Bot';
      case 'view': return 'View Bot';  
      case 'parser': return 'Parser Bot'; 
      case 'custom': return 'Custom Bot';
      default: return 'Bot';
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BotIcon className="h-5 w-5" /> {name}
            </DialogTitle>
            <DialogDescription>
              {getTypeLabel()} · {description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {lastRun && (
              <p className="text-sm text-muted-foreground">
                Last run: {new Date(lastRun).toLocaleString()}
              </p>
            )}
            
            <div className="flex space-x-2">
              {status !== 'active' && status !== 'running' ? (
                <Button onClick={onStart} className="flex-1">
                  <Play className="h-4 w-4 mr-2" /> Start Bot
                </Button>
              ) : (
                <Button onClick={onStop} variant="outline" className="flex-1">
                  <Pause className="h-4 w-4 mr-2" /> Stop Bot
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => {
                  onOpenChange(false);
                  setConfigOpen(true);
                }}
              >
                <Settings className="h-4 w-4 mr-2" /> Configure
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <AdvancedConfigForm 
        botId={id}
        open={configOpen}
        onOpenChange={setConfigOpen}
      />
    </>
  );
}
