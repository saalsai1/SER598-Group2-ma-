import React from 'react';
import { useHandsFree } from '../Context/HandsFreeContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Mic, MicOff, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HandsFreePanel: React.FC = () => {
  const { 
    isEnabled, 
    isListening, 
    statusMessage, 
    lastTranscript,
    toggleEnabled, 
    startListening, 
    stopListening,
    speak,
    isSupported 
  } = useHandsFree();
  
  const accessibility = useSelector((state: RootState) => state.accessibility);

  if (!isEnabled) return null;

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleHelp = () => {
    speak('Available commands: Go to home, store, recipes, cart, or accessibility. Say search for, followed by your query. Say scroll up, scroll down, scroll to top, or scroll to bottom. Say read this page, or read products. Say show my cart. Say exit hands-free mode to deactivate.');
  };

  const handleClose = () => {
    speak('Hands-free mode deactivated.');
    toggleEnabled();
  };

  return (
    <section
      role="region"
      aria-label="Hands-free voice control"
      className={`
        fixed bottom-4 left-1/2 -translate-x-1/2 z-50
        bg-card border border-border rounded-xl shadow-lg
        p-4 min-w-[320px] max-w-[90vw]
        ${accessibility.highContrast ? 'high-contrast' : ''}
        ${accessibility.reducedMotion ? '' : 'animate-fade-in'}
        ${accessibility.dyslexiaFont ? 'font-[OpenDyslexic]' : ''}
      `}
      style={{
        fontSize: accessibility.fontSize === 'large' ? '1.1rem' : accessibility.fontSize === 'xlarge' ? '1.25rem' : '1rem',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className={`
            relative flex h-3 w-3
            ${isListening ? '' : 'opacity-50'}
          `}>
            {isListening && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isListening ? 'bg-primary' : 'bg-muted-foreground'}`} />
          </div>
          <span className="font-semibold text-foreground">
            {isListening ? 'Listening...' : 'Idle'}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHelp}
            aria-label="Get help with voice commands"
            className="h-8 w-8"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            aria-label="Close hands-free mode"
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mic Control */}
      <div className="flex items-center gap-3 mb-3">
        <Button
          onClick={handleMicToggle}
          variant={isListening ? 'destructive' : 'default'}
          size="sm"
          className={`flex items-center gap-2 ${isListening ? 'animate-pulse' : ''}`}
          aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          disabled={!isSupported.stt}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {isListening ? 'Stop' : 'Start'} Mic
        </Button>
        
        <span className="text-sm text-muted-foreground">
          Say "help" for commands
        </span>
      </div>

      {/* Status / Live Region */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="text-sm"
      >
        {statusMessage && (
          <p className="text-muted-foreground mb-1">{statusMessage}</p>
        )}
        {lastTranscript && (
          <p className="text-foreground bg-muted/50 rounded px-2 py-1 text-xs truncate">
            Last: "{lastTranscript}"
          </p>
        )}
      </div>

      {/* Keyboard shortcut hint */}
      <div className="mt-3 pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">Alt</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">A</kbd> to toggle
        </p>
      </div>
    </section>
  );
};

export default HandsFreePanel;
