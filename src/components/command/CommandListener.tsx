
import { useEffect } from 'react';

interface CommandListenerProps {
  onCommandSelected: (command: string) => void;
}

export function CommandListener({ onCommandSelected }: CommandListenerProps) {
  useEffect(() => {
    const handleCommandSelected = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.command) {
        onCommandSelected(customEvent.detail.command);
      }
    };
    
    document.addEventListener('ai-command-selected', handleCommandSelected);
    
    return () => {
      document.removeEventListener('ai-command-selected', handleCommandSelected);
    };
  }, [onCommandSelected]);
  
  return null; // This is a non-visual component
}
