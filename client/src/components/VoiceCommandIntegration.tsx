import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceCommandIntegrationProps {
  onCommand?: (command: string) => void;
  enabled?: boolean;
  className?: string;
}

/**
 * Voice command integration component
 * Features:
 * - Speech-to-text recognition
 * - Text-to-speech feedback
 * - Command parsing and execution
 * - Visual feedback
 */
export const VoiceCommandIntegration: React.FC<VoiceCommandIntegrationProps> = ({
  onCommand,
  enabled = true,
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!enabled) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognitionRef.current.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          processCommand(transcript);
        } else {
          interimTranscript += transcript;
        }
      }
      setTranscript(interimTranscript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setFeedback(`Error: ${event.error}`);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [enabled]);

  const processCommand = (text: string) => {
    const command = text.toLowerCase().trim();
    setTranscript(command);

    // Parse commands
    const commands: Record<string, string> = {
      'next project': 'next',
      'previous project': 'prev',
      'show metrics': 'metrics',
      'play sound': 'sound',
      'stop sound': 'stop-sound',
      'home': 'home',
      'about': 'about',
      'contact': 'contact',
      'dark mode': 'dark-theme',
      'light mode': 'light-theme',
    };

    let executedCommand = '';
    for (const [key, value] of Object.entries(commands)) {
      if (command.includes(key)) {
        executedCommand = value;
        break;
      }
    }

    if (executedCommand) {
      setFeedback(`Executing: ${executedCommand}`);
      if (onCommand) {
        onCommand(executedCommand);
      }
      speak(`Executing ${executedCommand}`);
    } else {
      setFeedback(`Command not recognized: "${command}"`);
      speak(`Sorry, I didn't understand that command`);
    }

    // Clear transcript after processing
    setTimeout(() => setTranscript(''), 2000);
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!enabled) return null;

  return (
    <div className={`fixed bottom-8 right-8 z-50 ${className}`}>
      {/* Microphone button */}
      <motion.button
        onClick={toggleListening}
        className={`p-4 rounded-full font-bold transition-all ${
          isListening
            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-[0_0_30px_rgba(255,0,80,0.8)]'
            : 'bg-gradient-to-r from-afro-gold to-afro-sapphire text-black shadow-[0_0_20px_rgba(218,165,32,0.6)]'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isListening ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.6, repeat: isListening ? Infinity : 0 } as any}
      >
        {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
      </motion.button>

      {/* Feedback display */}
      {(transcript || feedback) && (
        <motion.div
          className="absolute bottom-20 right-0 bg-background/95 border border-afro-gold/50 rounded-lg p-4 max-w-xs shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {transcript && (
            <p className="text-sm text-afro-gold font-semibold mb-2">
              <span className="animate-pulse">●</span> {transcript}
            </p>
          )}
          {feedback && (
            <p className="text-xs text-foreground/70">{feedback}</p>
          )}
        </motion.div>
      )}

      {/* Help text */}
      <motion.div
        className="absolute bottom-20 left-0 bg-background/95 border border-foreground/20 rounded-lg p-3 max-w-xs text-xs text-foreground/70"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <p className="font-semibold text-afro-gold mb-2">Voice Commands:</p>
        <ul className="space-y-1">
          <li>• "Next project" - Navigate to next</li>
          <li>• "Show metrics" - Display analytics</li>
          <li>• "Play sound" - Enable sound effects</li>
          <li>• "Dark mode" - Switch theme</li>
          <li>• "Home" - Go to homepage</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default VoiceCommandIntegration;
