import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceCommand {
  text: string;
  timestamp: number;
  confidence: number;
  action: string;
}

export const VoiceCommandInterface: React.FC<{
  onCommand?: (command: string) => void;
  enabled?: boolean;
}> = ({ onCommand, enabled = true }) => {
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [confidence, setConfidence] = useState(0);

  const commandMap: Record<string, string> = {
    'navigate materials': '/materials',
    'navigate community': '/community',
    'navigate research': '/research',
    'navigate patents': '/patents',
    'navigate timeline': '/timeline',
    'show sovereign': '/sovereign',
    'show intelligence': '/sovereign',
    'play audio': 'audio-play',
    'stop audio': 'audio-stop',
    'increase volume': 'volume-up',
    'decrease volume': 'volume-down',
    'show help': 'help',
    'next section': 'next',
    'previous section': 'prev',
  };

  useEffect(() => {
    if (!enabled) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const conf = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          setTranscript(transcript);
          setConfidence(conf);

          // Check for command matches
          const lowerTranscript = transcript.toLowerCase();
          Object.entries(commandMap).forEach(([key, action]) => {
            if (lowerTranscript.includes(key)) {
              const command: VoiceCommand = {
                text: transcript,
                timestamp: Date.now(),
                confidence: conf,
                action,
              };

              setCommands((prev) => [...prev.slice(-5), command]);
              onCommand?.(action);
            }
          });
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        setTranscript(interimTranscript);
        setConfidence(0);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [enabled, onCommand]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="fixed bottom-20 left-4 z-50 w-80 max-w-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-black/80 to-black/60 rounded-lg border border-cyan-400/50 p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-cyan-400">Voice Command Interface</h4>
          <motion.button
            onClick={toggleListening}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              isListening
                ? 'bg-red-500/30 text-red-400 border border-red-400'
                : 'bg-cyan-400/20 text-cyan-400 border border-cyan-400'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isListening ? '● Recording' : '○ Listening'}
          </motion.button>
        </div>

        {isListening && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mb-3 h-1 bg-gradient-to-r from-cyan-400 to-magenta-400 rounded"
          />
        )}

        <div className="mb-3 p-3 bg-black/50 rounded border border-cyan-400/20 min-h-12">
          <p className="text-xs text-gold-400 font-mono break-words">
            {transcript || 'Waiting for voice input...'}
          </p>
          {confidence > 0 && (
            <div className="mt-2 text-xs text-green-400">
              Confidence: {(confidence * 100).toFixed(0)}%
            </div>
          )}
        </div>

        <div className="mb-3 text-xs text-cyan-400 font-mono space-y-1">
          <div>Try saying:</div>
          <div className="text-gold-400 ml-2">
            • "Navigate materials"
            <br />• "Show research"
            <br />• "Next section"
          </div>
        </div>

        <AnimatePresence>
          {commands.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border-t border-cyan-400/20 pt-3 mt-3"
            >
              <div className="text-xs text-cyan-400 mb-2">Recent Commands:</div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {commands.map((cmd, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs text-green-400 font-mono"
                  >
                    ✓ {cmd.action}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
