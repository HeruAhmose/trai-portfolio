import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SovereignAudioEngine — Web Audio API ambient soundscape
 * Synthesizes a deep, ceremonial ambient drone using oscillators.
 * Activates on first user interaction (browser autoplay policy).
 * No external audio files required.
 */
export const SovereignAudioEngine: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  const initAudio = useCallback(() => {
    if (ctxRef.current) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      // Reverb convolver for depth
      const convolver = ctx.createConvolver();
      const reverbLen = ctx.sampleRate * 3;
      const reverbBuf = ctx.createBuffer(2, reverbLen, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = reverbBuf.getChannelData(ch);
        for (let i = 0; i < reverbLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 2);
        }
      }
      convolver.buffer = reverbBuf;
      convolver.connect(master);

      // Sovereign drone — deep ceremonial tones (D minor pentatonic)
      const frequencies = [
        { freq: 36.7, type: 'sine' as OscillatorType, vol: 0.18 },   // D1 — deep sub
        { freq: 73.4, type: 'sine' as OscillatorType, vol: 0.12 },   // D2 — bass
        { freq: 110.0, type: 'sine' as OscillatorType, vol: 0.08 },  // A2 — fifth
        { freq: 146.8, type: 'triangle' as OscillatorType, vol: 0.06 }, // D3 — mid
        { freq: 220.0, type: 'sine' as OscillatorType, vol: 0.04 },  // A3 — shimmer
        { freq: 293.7, type: 'sine' as OscillatorType, vol: 0.025 }, // D4 — high shimmer
      ];

      const nodes = frequencies.map(({ freq, type, vol }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        // Slight detune for warmth
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        osc.connect(gain);
        gain.connect(convolver);
        gain.connect(master); // dry signal
        osc.start();
        return { osc, gain };
      });

      nodesRef.current = nodes;
      setInitialized(true);
    } catch (e) {
      console.warn('[SovereignAudio] Init failed:', e);
    }
  }, []);

  // Fade in/out based on enabled state
  useEffect(() => {
    if (!initialized || !masterGainRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const master = masterGainRef.current;
    const now = ctx.currentTime;

    if (enabled) {
      // Resume context if suspended
      if (ctx.state === 'suspended') ctx.resume();
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0.7, now + 2.5);
      // Fade in each oscillator with stagger
      nodesRef.current.forEach(({ gain }, i) => {
        const vol = [0.18, 0.12, 0.08, 0.06, 0.04, 0.025][i] || 0.04;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(vol, now + 3 + i * 0.4);
      });
    } else {
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 1.5);
    }
  }, [enabled, initialized]);

  // Slow breathing modulation on the master gain
  useEffect(() => {
    if (!initialized || !ctxRef.current) return;
    const ctx = ctxRef.current;
    let rafId: number;
    let t = 0;
    const breathe = () => {
      if (!enabled || !masterGainRef.current) { rafId = requestAnimationFrame(breathe); return; }
      t += 0.003;
      // Very subtle breathing — ±3% amplitude
      const breath = 0.7 + Math.sin(t) * 0.021;
      masterGainRef.current.gain.setTargetAtTime(breath, ctx.currentTime, 0.5);
      rafId = requestAnimationFrame(breathe);
    };
    rafId = requestAnimationFrame(breathe);
    return () => cancelAnimationFrame(rafId);
  }, [initialized, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      nodesRef.current.forEach(({ osc }) => { try { osc.stop(); } catch {} });
      ctxRef.current?.close();
    };
  }, []);

  const handleToggle = () => {
    if (!initialized) initAudio();
    setShowPrompt(false);
    onToggle();
  };

  return (
    <>
      {/* Sound toggle button — fixed bottom right, above gamification HUD */}
      <motion.button
        onClick={handleToggle}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 px-3 py-2 border text-xs font-mono transition-all"
        style={{
          background: enabled ? 'rgba(216,170,67,0.15)' : 'rgba(5,7,9,0.85)',
          borderColor: enabled ? 'rgba(216,170,67,0.5)' : 'rgba(216,170,67,0.2)',
          color: enabled ? '#d8aa43' : 'rgba(244,240,230,0.4)',
          backdropFilter: 'blur(8px)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        {/* Animated bars when playing */}
        {enabled ? (
          <span className="flex gap-0.5 items-end h-3">
            {[1, 2, 3, 4].map(i => (
              <motion.span
                key={i}
                className="w-0.5 rounded-full"
                style={{ background: '#d8aa43' }}
                animate={{ height: ['4px', `${6 + i * 2}px`, '4px'] }}
                transition={{ duration: 0.6 + i * 0.15, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
              />
            ))}
          </span>
        ) : (
          <span className="w-3 h-3 flex items-center justify-center text-[10px]">♪</span>
        )}
        <span>{enabled ? 'Sound On' : 'Sound Off'}</span>
      </motion.button>

      {/* First-time prompt */}
      <AnimatePresence>
        {showPrompt && !enabled && (
          <motion.div
            className="fixed bottom-32 right-4 z-40 max-w-[180px] p-3 border border-[#d8aa43]/20 text-xs font-sans text-[#f4f0e6]/50 leading-relaxed"
            style={{ background: 'rgba(5,7,9,0.9)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 3 }}
          >
            Enable ambient sound for the full sovereign experience.
            <button onClick={() => setShowPrompt(false)} className="block mt-2 text-[#d8aa43]/60 hover:text-[#d8aa43] transition-colors">Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
