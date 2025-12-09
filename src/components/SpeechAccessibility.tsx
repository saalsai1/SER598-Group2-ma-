import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggleAutoRead } from '@/redux/slices/accessibilitySlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Volume2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SpeechRecognitionEvent, SpeechRecognitionInstance, SpeechRecognitionConstructor } from '@/types/speech';

// Get SpeechRecognition constructor from window
const getSpeechRecognition = (): SpeechRecognitionConstructor | null => {
  const w = window as Window & { 
    SpeechRecognition?: SpeechRecognitionConstructor; 
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

const SpeechAccessibility: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState({ stt: false, tts: false });
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const autoReadEnabled = useSelector((state: RootState) => state.accessibility.autoReadEnabled);

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    const sttSupported = SpeechRecognitionAPI !== null;
    const ttsSupported = 'speechSynthesis' in window;
    setIsSupported({ stt: sttSupported, tts: ttsSupported });

    // Initialize Speech Recognition if supported
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript = transcript;
          } else {
            setSearchText(transcript);
          }
        }

        if (finalTranscript) {
          setSearchText(finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis?.cancel();
    };
  }, [toast]);

  // Toggle Speech-to-Text listening
  const toggleListening = () => {
    if (!isSupported.stt) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setSearchText('');
      recognitionRef.current?.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak now. Press Enter to search.",
      });
    }
  };

  // Handle search on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchText.trim()) {
      // Stop listening if active
      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
      }
      
      // Navigate to store with search query
      navigate(`/store?search=${encodeURIComponent(searchText.trim())}`);
      
      toast({
        title: "Searching...",
        description: `Searching for "${searchText.trim()}"`,
      });
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchText.trim()) {
      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
      }
      navigate(`/store?search=${encodeURIComponent(searchText.trim())}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Voice Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Browser Support Warning */}
        {(!isSupported.stt || !isSupported.tts) && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            {!isSupported.stt && <p>⚠️ Speech-to-Text is not supported in your browser.</p>}
            {!isSupported.tts && <p>⚠️ Text-to-Speech is not supported in your browser.</p>}
            <p className="mt-1">Try using Chrome, Edge, or Safari for full support.</p>
          </div>
        )}

        {/* Search Input with Voice */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Speak or type to search... Press Enter to search"
              className="pl-10"
              aria-label="Voice search input"
            />
          </div>
          
          {/* Voice Input Button */}
          <Button
            onClick={toggleListening}
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            className={`transition-all ${isListening ? 'animate-pulse ring-2 ring-destructive' : ''}`}
            disabled={!isSupported.stt}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={!searchText.trim()}
            aria-label="Search"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Status Indicator */}
        {isListening && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
            Listening... Speak now, then press Enter to search
          </div>
        )}

        {/* Auto-Read Option */}
        <div className="flex items-center space-x-2 pt-4 border-t">
          <Checkbox
            id="auto-read"
            checked={autoReadEnabled}
            onCheckedChange={() => dispatch(toggleAutoRead())}
            disabled={!isSupported.tts}
          />
          <Label htmlFor="auto-read" className="text-sm cursor-pointer">
            Auto-read search results aloud
          </Label>
        </div>
        {autoReadEnabled && (
          <p className="text-xs text-muted-foreground">
            When enabled, search results will be automatically read aloud after searching.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeechAccessibility;
