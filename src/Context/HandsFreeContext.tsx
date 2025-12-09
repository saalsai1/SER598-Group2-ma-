import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggleHandsFree, setHandsFree } from '@/redux/slices/accessibilitySlice';
import type { SpeechRecognitionEvent, SpeechRecognitionInstance, SpeechRecognitionConstructor } from '../types/speech';

interface HandsFreeContextType {
  isEnabled: boolean;
  isListening: boolean;
  statusMessage: string;
  lastTranscript: string;
  toggleEnabled: () => void;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  isSupported: { stt: boolean; tts: boolean };
}

const HandsFreeContext = createContext<HandsFreeContextType | null>(null);

export const useHandsFree = () => {
  const context = useContext(HandsFreeContext);
  if (!context) {
    throw new Error('useHandsFree must be used within a HandsFreeProvider');
  }
  return context;
};

// Get SpeechRecognition constructor from window
const getSpeechRecognition = (): SpeechRecognitionConstructor | null => {
  const w = window as Window & { 
    SpeechRecognition?: SpeechRecognitionConstructor; 
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

interface HandsFreeProviderProps {
  children: React.ReactNode;
  onCommand: (transcript: string) => void;
}

export const HandsFreeProvider: React.FC<HandsFreeProviderProps> = ({ children, onCommand }) => {
  const dispatch = useDispatch();
  const isEnabled = useSelector((state: RootState) => state.accessibility.handsFreeEnabled);
  
  const [isListening, setIsListening] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');
  const [isSupported, setIsSupported] = useState({ stt: false, tts: false });
  
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isEnabledRef = useRef(isEnabled);

  // Keep ref in sync with state
  useEffect(() => {
    isEnabledRef.current = isEnabled;
  }, [isEnabled]);

  // Get stored voice preference
  const getPreferredVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (!('speechSynthesis' in window)) return null;
    
    const storedVoiceName = localStorage.getItem('preferredVoice');
    const voices = window.speechSynthesis.getVoices();
    
    if (storedVoiceName) {
      const found = voices.find(v => v.name === storedVoiceName);
      if (found) return found;
    }
    
    // Default to first English voice
    return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  }, []);

  // Text-to-Speech function
  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getPreferredVoice();
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 1;
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
  }, [getPreferredVoice]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    const sttSupported = SpeechRecognitionAPI !== null;
    const ttsSupported = 'speechSynthesis' in window;
    setIsSupported({ stt: sttSupported, tts: ttsSupported });

    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setStatusMessage('Listening...');
      };

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          const transcript = result[0].transcript.trim();
          setLastTranscript(transcript);
          setStatusMessage(`Heard: "${transcript}"`);
          onCommand(transcript);
        }
      };

      recognitionRef.current.onerror = (event: Event & { error: string }) => {
        // Ignore "no-speech" and "aborted" errors
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setStatusMessage(`Error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        
        // Auto-restart if still enabled
        if (isEnabledRef.current) {
          restartTimeoutRef.current = setTimeout(() => {
            if (isEnabledRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {
                // Already started, ignore
              }
            }
          }, 300);
        }
      };
    }

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis?.cancel();
    };
  }, [onCommand]);

  // Handle enabling/disabling hands-free mode
  useEffect(() => {
    if (isEnabled) {
      setStatusMessage('Hands-free mode activated');
      speak('Hands-free mode activated. You can control the site with your voice. Say help to hear available commands.');
      
      // Start listening
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Already started
        }
      }
    } else {
      setStatusMessage('');
      setLastTranscript('');
      
      // Stop listening
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis?.cancel();
    }
  }, [isEnabled, speak]);

  // Global keyboard shortcut: Ctrl + Alt + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        dispatch(toggleHandsFree());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  const toggleEnabled = useCallback(() => {
    dispatch(toggleHandsFree());
  }, [dispatch]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && isEnabled) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started
      }
    }
  }, [isEnabled]);

  const stopListening = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    setIsListening(false);
  }, []);

  return (
    <HandsFreeContext.Provider
      value={{
        isEnabled,
        isListening,
        statusMessage,
        lastTranscript,
        toggleEnabled,
        startListening,
        stopListening,
        speak,
        isSupported,
      }}
    >
      {children}
    </HandsFreeContext.Provider>
  );
};
