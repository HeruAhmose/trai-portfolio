import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

interface VoiceCommandIntegrationProps {
  onCommand?: (command: string) => void;
  enabled?: boolean;
  className?: string;
}

interface BrowserSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

const COMMANDS: Readonly<Record<string, string>> = {
  "next project": "next",
  "previous project": "prev",
  "show metrics": "metrics",
  "play sound": "sound",
  "stop sound": "stop-sound",
  home: "home",
  about: "about",
  contact: "contact",
  "dark mode": "dark-theme",
  "light mode": "light-theme",
};

function resolveCommand(text: string): string {
  const normalized = text.toLowerCase().trim();

  for (const [phrase, command] of Object.entries(COMMANDS)) {
    if (normalized.includes(phrase)) {
      return command;
    }
  }

  return "";
}

/**
 * Silent interactive voice-command input.
 *
 * Speech recognition remains available as an input method. Command results
 * are reported visually and never synthesized into browser speech.
 */
export const VoiceCommandIntegration: React.FC<
  VoiceCommandIntegrationProps
> = ({
  onCommand,
  enabled = true,
  className = "",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [recognitionAvailable, setRecognitionAvailable] = useState(true);

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const clearTranscriptTimerRef = useRef<number | null>(null);

  const processCommand = (text: string) => {
    const normalized = text.toLowerCase().trim();
    const executedCommand = resolveCommand(normalized);

    setTranscript(normalized);

    if (executedCommand) {
      setFeedback(`Executing: ${executedCommand}`);
      onCommand?.(executedCommand);
    } else {
      setFeedback(`Command not recognized: "${normalized}"`);
    }

    if (clearTranscriptTimerRef.current !== null) {
      window.clearTimeout(clearTranscriptTimerRef.current);
    }

    clearTranscriptTimerRef.current = window.setTimeout(() => {
      setTranscript("");
    }, 2000);
  };

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const browserWindow = window as typeof window & {
      SpeechRecognition?: BrowserSpeechRecognitionConstructor;
      webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
    };

    const RecognitionConstructor =
      browserWindow.SpeechRecognition ??
      browserWindow.webkitSpeechRecognition;

    if (!RecognitionConstructor) {
      setRecognitionAvailable(false);
      setFeedback("Voice input is not supported in this browser.");
      return undefined;
    }

    setRecognitionAvailable(true);

    const recognition = new RecognitionConstructor();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setFeedback("Listening...");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";

      for (
        let resultIndex = event.resultIndex;
        resultIndex < event.results.length;
        resultIndex += 1
      ) {
        const resultText = event.results[resultIndex][0].transcript;

        if (event.results[resultIndex].isFinal) {
          processCommand(resultText);
        } else {
          interimTranscript += resultText;
        }
      }

      if (interimTranscript) {
        setTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      setFeedback(`Voice input error: ${event.error}`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;

      if (clearTranscriptTimerRef.current !== null) {
        window.clearTimeout(clearTranscriptTimerRef.current);
        clearTranscriptTimerRef.current = null;
      }
    };
  }, [enabled]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      setFeedback("Voice input is unavailable.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setFeedback("Voice input paused.");
      return;
    }

    recognition.start();
    setIsListening(true);
    setFeedback("Listening...");
  };

  if (!enabled) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 ${className}`}
      data-trai-silent-command-input="v5.4.8"
    >
      <div
        className="pointer-events-none absolute bottom-[-24px] right-[-24px] h-32 w-32 rounded-full border border-afro-gold/15"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute right-1/2 top-1/2 h-20 w-20 -translate-y-1/2 translate-x-1/2 rounded-full border border-cyan-300/20"
        animate={
          isListening
            ? {
                scale: [1, 1.55, 1],
                opacity: [0.25, 0.7, 0.25],
                rotate: [0, 180, 360],
              }
            : {
                scale: 1,
                opacity: 0.18,
                rotate: 0,
              }
        }
        transition={{
          duration: 2.1,
          repeat: isListening ? Infinity : 0,
          ease: "easeInOut",
        }}
        aria-hidden
      />

      <motion.button
        type="button"
        onClick={toggleListening}
        disabled={!recognitionAvailable}
        aria-label={
          recognitionAvailable
            ? isListening
              ? "Stop voice command input"
              : "Start voice command input"
            : "Voice command input unavailable"
        }
        aria-pressed={isListening}
        className={`relative grid h-14 w-14 place-items-center overflow-hidden rounded-full border font-bold transition-all ${
          isListening
            ? "border-cyan-200/70 bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 text-white shadow-[0_0_34px_rgba(34,211,238,0.7)]"
            : recognitionAvailable
              ? "border-afro-gold/60 bg-gradient-to-br from-afro-gold to-afro-sapphire text-black shadow-[0_0_24px_rgba(218,165,32,0.45)]"
              : "cursor-not-allowed border-white/10 bg-background/70 text-foreground/35"
        }`}
        whileHover={recognitionAvailable ? { scale: 1.1, rotateZ: 2 } : {}}
        whileTap={recognitionAvailable ? { scale: 0.94 } : {}}
        animate={
          isListening
            ? {
                boxShadow: [
                  "0 0 18px rgba(34,211,238,0.35)",
                  "0 0 42px rgba(34,211,238,0.8)",
                  "0 0 18px rgba(34,211,238,0.35)",
                ],
              }
            : {}
        }
        transition={{
          duration: 0.7,
          repeat: isListening ? Infinity : 0,
        }}
      >
        <span
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_18%,rgba(255,255,255,0.35)_48%,transparent_76%)] opacity-40"
          aria-hidden
        />
        {isListening ? (
          <Mic className="relative z-10 h-6 w-6" />
        ) : (
          <MicOff className="relative z-10 h-6 w-6" />
        )}
      </motion.button>

      {(transcript || feedback) && (
        <motion.div
          className="absolute bottom-20 right-0 w-72 max-w-[80vw] overflow-hidden rounded-xl border border-afro-gold/40 bg-background/95 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl"
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          aria-live="polite"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent"
            aria-hidden
          />

          <p className="font-mono text-[9px] tracking-[0.25em] text-cyan-300/70">
            SILENT COMMAND LINK
          </p>

          {transcript && (
            <p className="mt-2 text-sm font-semibold text-afro-gold">
              <span className={isListening ? "animate-pulse" : ""}>●</span>{" "}
              {transcript}
            </p>
          )}

          {feedback && (
            <p className="mt-2 text-xs leading-relaxed text-foreground/70">
              {feedback}
            </p>
          )}
        </motion.div>
      )}

      <motion.div
        className="absolute bottom-20 left-0 w-64 max-w-[75vw] rounded-xl border border-foreground/15 bg-background/95 p-3 text-xs text-foreground/70 shadow-xl backdrop-blur-xl"
        initial={{ opacity: 0, x: 8 }}
        whileHover={{ opacity: 1, x: 0 }}
        animate={{ opacity: isListening ? 1 : 0.18 }}
      >
        <p className="mb-2 font-semibold text-afro-gold">
          Interactive voice input
        </p>
        <ul className="space-y-1">
          <li>• "Next project" — navigate forward</li>
          <li>• "Show metrics" — display analytics</li>
          <li>• "Play sound" — request optional sound</li>
          <li>• "Dark mode" — switch theme</li>
          <li>• "Home" — go to homepage</li>
        </ul>
        <p className="mt-2 font-mono text-[9px] tracking-[0.12em] text-cyan-300/55">
          INPUT ONLY /// NO NARRATOR
        </p>
      </motion.div>
    </div>
  );
};

export default VoiceCommandIntegration;
