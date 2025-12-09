import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggleHandsFree, setHandsFree } from '@/redux/slices/accessibilitySlice';
import type { SpeechRecognitionEvent, SpeechRecognitionInstance, SpeechRecognitionConstructor } from '../types/Speech';

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
  const isSpeakingRef = useRef(false); // Track if system is currently speaking

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
    
    console.log('System speaking:', text);
    isSpeakingRef.current = true; // Mark that system is speaking
    
    // ABORT recognition completely while speaking to prevent the system from hearing itself
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort(); // Use abort instead of stop to terminate immediately
        setIsListening(false);
        console.log('Recognition aborted for speaking');
      } catch (e) {
        console.log('Recognition abort error:', e);
      }
    }
    
    // Clear any restart timeouts
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getPreferredVoice();
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 1;
    utterance.pitch = 1;
    
    // Resume listening after speech ends with longer delay
    utterance.onend = () => {
      console.log('System finished speaking, waiting before resuming...');
      // Wait longer before marking as not speaking to ensure system voice is completely done
      setTimeout(() => {
        console.log('Marked as not speaking, will restart recognition');
        isSpeakingRef.current = false;
        
        // ALWAYS restart if hands-free is still enabled
        if (isEnabledRef.current && recognitionRef.current) {
          // Wait even longer before restarting recognition
          setTimeout(() => {
            try {
              recognitionRef.current?.start();
              console.log('Recognition restarted after speaking');
              setIsListening(true);
            } catch (e) {
              console.log('Recognition restart error (might already be running):', e);
            }
          }, 500); // 500ms delay before resuming
        }
      }, 300); // 300ms buffer after speech ends
    };
    
    utterance.onerror = () => {
      console.error('Speech synthesis error');
      isSpeakingRef.current = false;
      // Try to restart recognition even on error
      if (isEnabledRef.current && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch (e) {
            console.log('Could not restart after error:', e);
          }
        }, 500);
      }
    };
    
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
      recognitionRef.current.continuous = true; // Changed to true for continuous listening
      recognitionRef.current.interimResults = true; // Enable interim results
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setStatusMessage('Listening...');
      };

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          const transcript = result[0].transcript.trim();
          console.log('Final transcript:', transcript);
          
          // Ignore commands while system is speaking to prevent hearing its own voice
          if (isSpeakingRef.current) {
            console.log('Ignoring transcript while system is speaking:', transcript);
            return;
          }
          
          setLastTranscript(transcript);
          setStatusMessage(`Heard: "${transcript}"`);
          onCommand(transcript);
        }
      };

      recognitionRef.current.onerror = (event: Event & { error: string }) => {
        console.error('Speech recognition error:', event.error);
        
        // Handle errors appropriately
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setStatusMessage('Microphone access denied. Please allow microphone access.');
          setIsListening(false);
        } else if (event.error === 'no-speech') {
          // Just restart, don't show error
          console.log('No speech detected, continuing to listen...');
        } else if (event.error === 'aborted') {
          // Intentional stop, don't show error
          console.log('Recognition aborted');
        } else if (event.error === 'network') {
          setStatusMessage('Network error. Please check your connection.');
          setIsListening(false);
        } else {
          setStatusMessage(`Error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended, isSpeaking:', isSpeakingRef.current);
        setIsListening(false);
        
        // DON'T auto-restart if system is speaking
        if (isSpeakingRef.current) {
          console.log('Not restarting - system is speaking');
          return;
        }
        
        // Auto-restart if still enabled (with a small delay to avoid rapid restart loops)
        if (isEnabledRef.current) {
          console.log('Auto-restarting recognition...');
          restartTimeoutRef.current = setTimeout(() => {
            // Double-check we're not speaking before restarting
            if (isEnabledRef.current && recognitionRef.current && !isSpeakingRef.current) {
              try {
                recognitionRef.current.start();
                console.log('Recognition restarted successfully');
              } catch (e) {
                console.error('Failed to restart recognition:', e);
                // If already started, this is fine
                if ((e as Error).message?.includes('already started')) {
                  setIsListening(true);
                }
              }
            } else if (isSpeakingRef.current) {
              console.log('Skipped restart - system started speaking');
            }
          }, 500); // Increased delay to 500ms for more reliable restart
        }
      };
    }

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
      window.speechSynthesis?.cancel();
    };
  }, [onCommand]);

  // Handle enabling/disabling hands-free mode
  useEffect(() => {
    if (isEnabled) {
      setStatusMessage('Hands-free mode activated');
      isSpeakingRef.current = true; // Mark as speaking
      
      // Abort recognition during announcement
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
          setIsListening(false);
        } catch (e) {
          console.log('Recognition not running, starting fresh');
        }
      }
      
      // Clear any timeouts
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      
      // Cancel any ongoing speech
      window.speechSynthesis?.cancel();
      
      // Create announcement utterance
      const utterance = new SpeechSynthesisUtterance('Hands-free mode activated. You can control the site with your voice. Say help to hear available commands.');
      const voice = getPreferredVoice();
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = 1;
      utterance.pitch = 1;
      
      // Start listening ONLY after the announcement finishes
      utterance.onend = () => {
        console.log('Announcement finished, waiting before starting recognition');
        setTimeout(() => {
          isSpeakingRef.current = false; // Mark as done speaking
          console.log('Marked as not speaking after announcement');
          
          if (isEnabledRef.current && recognitionRef.current) {
            restartTimeoutRef.current = setTimeout(() => {
              try {
                recognitionRef.current?.start();
                console.log('Recognition started after announcement');
              } catch (e) {
                console.error('Failed to start recognition:', e);
              }
            }, 800); // Wait 800ms after marking not speaking
          }
        }, 500); // Extra buffer time increased to 500ms
      };
      
      utterance.onerror = () => {
        console.error('Announcement speech error');
        isSpeakingRef.current = false;
      };
      
      window.speechSynthesis.speak(utterance);
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
  }, [isEnabled, getPreferredVoice]);

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
