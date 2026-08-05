import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SoundReactiveEffectsProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  enabled?: boolean;
  showPrompt?: boolean;
  absolute?: boolean;
}

interface AudioAnalyzer {
  frequencyData: Uint8Array;
  waveformData: Uint8Array;
  bass: number;
  mid: number;
  treble: number;
  energy: number;
}

/**
 * Sound-reactive full-page effects
 * Analyzes audio input and animates:
 * - Background nebulas based on frequency
 * - Glow intensities based on energy
 * - Data visualization reactivity
 * - Particle system responsiveness
 */
export const SoundReactiveEffects: React.FC<SoundReactiveEffectsProps> = ({
  className = '',
  intensity = 'high',
  enabled = true,
  showPrompt = false,
  absolute = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);
  const [audioAnalyzer, setAudioAnalyzer] = useState<AudioAnalyzer>({
    frequencyData: new Uint8Array(256),
    waveformData: new Uint8Array(256),
    bass: 0,
    mid: 0,
    treble: 0,
    energy: 0,
  });

  useEffect(() => {
    if (!enabled || !canvasRef.current) return;

    const initAudio = async () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.85;

        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

        setIsListening(true);
      } catch (error) {
        console.warn('Microphone access denied:', error);
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (!isListening || !canvasRef.current || !analyserRef.current || !dataArrayRef.current)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current as Uint8Array;

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Get frequency data
      analyser.getByteFrequencyData(dataArray as any);

      // Calculate frequency bands
      const bass = dataArray.slice(0, 8).reduce((a, b) => a + b) / 8 / 255;
      const mid = dataArray.slice(8, 128).reduce((a, b) => a + b) / 120 / 255;
      const treble = dataArray.slice(128, 256).reduce((a, b) => a + b) / 128 / 255;
      const energy = (bass + mid + treble) / 3;

      setAudioAnalyzer({
        frequencyData: dataArray,
        waveformData: new Uint8Array(analyser.frequencyBinCount),
        bass,
        mid,
        treble,
        energy,
      });

      // Clear canvas with fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw frequency-responsive nebulas
      const colors = ['#FF0080', '#DAA520', '#00D9FF', '#228B22'];

      colors.forEach((color, index) => {
        const frequency = dataArray[index * 64] / 255;
        const x = (canvas.width / 4) * (index + 1);
        const y = canvas.height / 2;
        const size = 50 + frequency * 200;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `${color}${Math.floor(frequency * 255)
          .toString(16)
          .padStart(2, '0')}`);
        gradient.addColorStop(0.5, `${color}${Math.floor(frequency * 128)
          .toString(16)
          .padStart(2, '0')}`);
        gradient.addColorStop(1, `${color}00`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw frequency bars
      ctx.strokeStyle = '#00D9FF';
      ctx.lineWidth = 2;

      for (let i = 0; i < dataArray.length; i++) {
        const x = (i / dataArray.length) * canvas.width;
        const y = canvas.height - (dataArray[i] / 255) * canvas.height;

        if (i === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw waveform circles
      ctx.strokeStyle = `rgba(255, 0, 128, ${energy * 0.8})`;
      ctx.lineWidth = 2;

      for (let i = 0; i < 5; i++) {
        const radius = 50 + i * 30 + energy * 100;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw energy core
      const coreSize = 30 + energy * 100;
      const coreGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        coreSize
      );
      coreGradient.addColorStop(0, `rgba(255, 255, 255, ${energy})`);
      coreGradient.addColorStop(0.5, `rgba(0, 217, 255, ${energy * 0.5})`);
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, coreSize, 0, Math.PI * 2);
      ctx.fill();
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isListening]);

  return (
    <div className={`${absolute ? 'absolute' : 'fixed'} inset-0 -z-20 pointer-events-none ${className}`}>
      {/* Sound reactive canvas */}
      <motion.canvas
        ref={canvasRef}
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isListening ? 0.6 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Audio visualization overlay */}
      {isListening && (
        <motion.div
          className="fixed bottom-10 right-10 bg-background/80 backdrop-blur-sm border border-foreground/20 rounded-lg p-4 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-xs font-semibold text-afro-gold mb-3">Audio Analysis</p>

          <div className="space-y-2">
            {/* Bass visualization */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground/60 w-8">Bass</span>
              <div className="w-24 h-2 bg-background/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-afro-gold to-afro-sapphire"
                  animate={{ width: `${audioAnalyzer.bass * 100}%` }}
                  transition={{ duration: 0.05 }}
                />
              </div>
            </div>

            {/* Mid visualization */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground/60 w-8">Mid</span>
              <div className="w-24 h-2 bg-background/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-afro-sapphire to-afro-emerald"
                  animate={{ width: `${audioAnalyzer.mid * 100}%` }}
                  transition={{ duration: 0.05 }}
                />
              </div>
            </div>

            {/* Treble visualization */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground/60 w-8">Treble</span>
              <div className="w-24 h-2 bg-background/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-afro-emerald to-afro-gold"
                  animate={{ width: `${audioAnalyzer.treble * 100}%` }}
                  transition={{ duration: 0.05 }}
                />
              </div>
            </div>

            {/* Energy visualization */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground/60 w-8">Energy</span>
              <div className="w-24 h-2 bg-background/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-afro-pink to-afro-cyan"
                  animate={{ width: `${audioAnalyzer.energy * 100}%` }}
                  transition={{ duration: 0.05 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Microphone permission prompt */}
      {showPrompt && enabled && !isListening && !promptDismissed && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-background border border-foreground/20 rounded-lg p-8 max-w-md text-center">
            <p className="text-foreground/70 mb-4">
              Enable microphone access to activate sound-reactive effects
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gradient-to-r from-afro-gold to-afro-emerald text-black font-bold rounded-lg hover:scale-105 transition-transform"
              >
                Enable Microphone
              </button>
              <button
                onClick={() => setPromptDismissed(true)}
                className="px-6 py-2 border border-foreground/20 text-foreground/60 font-bold rounded-lg hover:scale-105 transition-transform"
              >
                Skip
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

/**
 * Hook for accessing audio analysis data
 */
export const useSoundReactiveData = () => {
  const [audioData, setAudioData] = useState<AudioAnalyzer>({
    frequencyData: new Uint8Array(256),
    waveformData: new Uint8Array(256),
    bass: 0,
    mid: 0,
    treble: 0,
    energy: 0,
  });

  return audioData;
};
