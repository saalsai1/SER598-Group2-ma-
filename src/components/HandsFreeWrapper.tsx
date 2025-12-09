import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HandsFreeProvider, useHandsFree } from '../Context/HandsFreeContext';
import { useVoiceCommands } from '../hooks/useVoiceCommands';
import HandsFreePanel from './HandsFreePanel';

// Wrapper that provides the context and handles commands
const HandsFreeCommandHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { parseCommand } = useVoiceCommands();
  const speakRef = React.useRef<((text: string) => void) | null>(null);

  const handleCommand = useCallback((transcript: string) => {
    console.log('Received command:', transcript);
    const result = parseCommand(transcript);
    
    // Use the speak function from context if available, which handles stopping recognition
    if (result.announcement) {
      // The speak function is passed through the provider and will be available via context
      // We'll handle the announcement in the provider's onCommand
      if (speakRef.current) {
        speakRef.current(result.announcement);
      }
    }
  }, [parseCommand]);

  return (
    <HandsFreeProvider onCommand={handleCommand}>
      <HandsFreeInner speakRef={speakRef}>
        {children}
      </HandsFreeInner>
    </HandsFreeProvider>
  );
};

// Inner component that accesses the speak function and stores it in the ref
const HandsFreeInner: React.FC<{ 
  children: React.ReactNode;
  speakRef: React.MutableRefObject<((text: string) => void) | null>;
}> = ({ children, speakRef }) => {
  const { speak } = useHandsFree();

  // Store speak function in ref so it's accessible to handleCommand
  React.useEffect(() => {
    speakRef.current = speak;
  }, [speak, speakRef]);

  return (
    <>
      {children}
      <HandsFreePanel />
    </>
  );
};

export default HandsFreeCommandHandler;
