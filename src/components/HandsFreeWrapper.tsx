import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HandsFreeProvider, useHandsFree } from '../Context/HandsFreeContext';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import HandsFreePanel from './HandsFreePanel';

// Inner component that uses both contexts
const HandsFreeInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { speak } = useHandsFree();
  const { parseCommand } = useVoiceCommands();

  // This is called when we receive a voice command
  const handleCommand = useCallback((transcript: string) => {
    const result = parseCommand(transcript);
    
    // Speak the announcement
    if (result.announcement) {
      speak(result.announcement);
    }
  }, [parseCommand, speak]);

  // We need to pass the handleCommand up to the provider, but since we're inside,
  // we need a different approach. Let's use a ref pattern.
  return (
    <>
      {children}
      <HandsFreePanel />
    </>
  );
};

// Wrapper that provides the context and handles commands
const HandsFreeCommandHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { parseCommand } = useVoiceCommands();

  const handleCommand = useCallback((transcript: string) => {
    const result = parseCommand(transcript);
    
    // Speak the announcement using the context's speak function
    // We'll handle this differently - the speak function needs to be called
    // after the command is parsed
    if (result.announcement && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // Get preferred voice from localStorage
      const storedVoiceName = localStorage.getItem('preferredVoice');
      const voices = window.speechSynthesis.getVoices();
      let voice = voices.find(v => v.name === storedVoiceName);
      if (!voice) {
        voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      }
      
      const utterance = new SpeechSynthesisUtterance(result.announcement);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.rate = 1;
      utterance.pitch = 1;
      
      window.speechSynthesis.speak(utterance);
    }
  }, [parseCommand]);

  return (
    <HandsFreeProvider onCommand={handleCommand}>
      {children}
      <HandsFreePanel />
    </HandsFreeProvider>
  );
};

export default HandsFreeCommandHandler;
