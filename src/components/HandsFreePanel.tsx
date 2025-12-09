import React, { useEffect, useRef } from 'react';
import { useHandsFree } from '../Context/HandsFreeContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Mic, MicOff, X, HelpCircle, ListChecks } from 'lucide-react';
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
    isSupported,
  } = useHandsFree();

  const accessibility = useSelector((state: RootState) => state.accessibility);

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleHelp = () => {
    speak(
      'Available commands: Go to home, store, recipes, cart, or accessibility. Say search for, followed by your query. Say scroll up, scroll down, scroll to top, or scroll to bottom. Say read this page, or read products. Say show my cart. Say exit hands-free mode to deactivate.'
    );
  };

  const handleClose = () => {
    speak('Hands-free mode deactivated.');
    toggleEnabled();
  };

  // always on Command Section
  const commandSections = [
    {
      title: 'Navigation',
      items: [
        'Go to home',
        'Go to store',
        'Go to recipes',
        'Go to cart',
        'Order history',
        'Accessibility',
        'About',
        'Login',
        'Register',
      ],
    },
    {
      title: 'Search',
      items: [
        'Search products for <item>',
        'Search store for <item>',
        'Search recipes for <dish>',
        'Find recipes for <dish>',
      ],
    },
    {
      title: 'Recipes (nested)',
      items: [
        'Go to recipes',
        'Search recipes for chicken',
        'Search recipes for vegan pasta',
        'Search recipes for dessert',
      ],
    },
    {
      title: 'Scrolling',
      items: ['Scroll up', 'Scroll down', 'Scroll to top', 'Scroll to bottom'],
    },
    {
      title: 'Reading',
      items: ['Read this page', 'Read products'],
    },
    {
      title: 'Cart',
      items: ['Show my cart', "What's in my cart", 'Cart summary'],
    },
    {
      title: 'Hands-free',
      items: ['Help', 'Exit hands-free mode', 'Start mic', 'Stop mic'],
    },
  ];

  // voice commands sidebar fix
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  // autoscroll accessibility voice cmd sidebar
  useEffect(() => {
    if (accessibility.reducedMotion) return;

    const node = scrollRef.current;
    if (!node) return;

    const id = window.setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;

      const { scrollTop, scrollHeight, clientHeight } = el;

      if (scrollTop + clientHeight >= scrollHeight - 1) {
        el.scrollTop = 0; 
      } else {
        el.scrollTop = scrollTop + 0.8; 
      }
    }, 40); // adjust speed (lower = faster)

    scrollIntervalRef.current = id;

    return () => {
      if (scrollIntervalRef.current !== null) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };
  }, [accessibility.reducedMotion]);

  // autoscroll sidebar reset scroll : Ctrl+Alt+X or ⌘+Option+X
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isWinReset = e.ctrlKey && e.altKey && key === 'x';
      const isMacReset = e.metaKey && e.altKey && key === 'x';

      if (isWinReset || isMacReset) {
        e.preventDefault();
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ❗ Important: hooks are all above this line
  if (!isEnabled) return null;

  return (
    <>
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
          fontSize:
            accessibility.fontSize === 'large'
              ? '1.1rem'
              : accessibility.fontSize === 'xlarge'
              ? '1.25rem'
              : '1rem',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`
                relative flex h-3 w-3
                ${isListening ? '' : 'opacity-50'}
              `}
            >
              {isListening && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isListening ? 'bg-primary' : 'bg-muted-foreground'
                }`}
              />
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
            className={`flex items-center gap-2 ${
              isListening ? 'animate-pulse' : ''
            }`}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            disabled={!isSupported.stt}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            {isListening ? 'Stop' : 'Start'} Mic
          </Button>

          <span className="text-sm text-muted-foreground">
            Say &quot;help&quot; for commands
          </span>
        </div>

        {/* Status / Live Region */}
        <div aria-live="polite" aria-atomic="true" className="text-sm">
          {statusMessage && (
            <p className="text-muted-foreground mb-1">{statusMessage}</p>
          )}
          {lastTranscript && (
            <p className="text-foreground bg-muted/50 rounded px-2 py-1 text-xs truncate">
              Last: &quot;{lastTranscript}&quot;
            </p>
          )}
        </div>

        {/* Keyboard shortcut hint */}
        <div className="mt-3 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Press{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">
              Ctrl
            </kbd>{' '}
            +{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">
              Alt
            </kbd>{' '}
            +{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">
              A
            </kbd>{' '}
            (Windows / Linux) or{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">
              ⌘
            </kbd>{' '}
            +{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">
              Option
            </kbd>{' '}
            +{' '}
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground font-mono">
              A
            </kbd>{' '}
            (macOS) to toggle
          </p>
        </div>
      </section>

      <aside
        className={`
          fixed top-50 right-4 z-40 w-80 max-w-[90vw]
          bg-background/80 backdrop-blur-lg border border-border/20 rounded-2xl shadow-2xl
          transform transition-all duration-300
          ${accessibility.highContrast ? 'high-contrast' : ''}
          ${accessibility.reducedMotion ? '' : 'animate-fade-in'}
          ${accessibility.dyslexiaFont ? 'font-[OpenDyslexic]' : ''}
        `}
        aria-label="Hands-free commands help"
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ListChecks className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Voice Commands
              </h3>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="space-y-4 max-h-[55vh] overflow-y-auto pr-3 -mr-3 custom-scrollbar"
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent, black 8px, black calc(100% - 8px), transparent)',
            }}
          >
            {commandSections.map((section) => (
              <div key={section.title} className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </p>
                <ul className="space-y-2">
                  {section.items.map((cmd) => (
                    <li
                      key={cmd}
                      className="
                        bg-muted/50 border border-transparent 
                        hover:bg-muted hover:border-border/30
                        rounded-lg px-3 py-2 text-sm text-foreground
                        transition-colors
                      "
                    >
                      {cmd}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default HandsFreePanel;
