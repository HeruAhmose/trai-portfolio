import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SovereignAudioEngine — local Web Audio ambient soundscape.
 *
 * The AudioContext may be prepared silently on a user gesture to satisfy browser
 * autoplay policy, but audible output is strictly controlled by the explicit
 * SoundPreferences opt-in. No microphone or external audio assets are used.
 */
export const SovereignAudioEngine: React.FC<{
  enabled: boolean;
  masterVolume: number;
  onToggle: () => void;
}> = ({ enabled, masterVolume, onToggle }) => {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [contextState, setContextState] = useState<AudioContextState | 'uninitialized'>('uninitialized');
  const [showPrompt, setShowPrompt] = useState(true);

  const initAudio = useCallback(() => {
    if (ctxRef.current) return ctxRef.current;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      const convolver = ctx.createConvolver();
      const reverbLen = Math.floor(ctx.sampleRate * 2.5);
      const reverbBuf = ctx.createBuffer(2, reverbLen, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = reverbBuf.getChannelData(ch);
        for (let i = 0; i < reverbLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 2);
        }
      }
      convolver.buffer = reverbBuf;
      convolver.connect(master);

      const frequencies = [
        { freq: 36.7, type: 'sine' as OscillatorType },
        { freq: 73.4, type: 'sine' as OscillatorType },
        { freq: 110.0, type: 'sine' as OscillatorType },
        { freq: 146.8, type: 'triangle' as OscillatorType },
        { freq: 220.0, type: 'sine' as OscillatorType },
        { freq: 293.7, type: 'sine' as OscillatorType },
      ];

      nodesRef.current = frequencies.map(({ freq, type }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime((Math.random() - 0.5) * 8, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        osc.connect(gain);
        gain.connect(convolver);
        gain.connect(master);
        osc.start();
        return { osc, gain };
      });

      ctx.onstatechange = () => setContextState(ctx.state);
      setInitialized(true);
      setContextState(ctx.state);
      window.dispatchEvent(new CustomEvent('trai:audio-ready', { detail: { state: ctx.state } }));
      return ctx;
    } catch (error) {
      console.warn('[SovereignAudio] Init failed:', error);
      return null;
    }
  }, []);

  // Prepare Web Audio silently on the first real gesture. This prevents the old
  // two-click bug while keeping audible output off until explicit opt-in.
  useEffect(() => {
    const prepare = () => {
      initAudio();
      window.removeEventListener('pointerdown', prepare, true);
      window.removeEventListener('keydown', prepare, true);
    };
    window.addEventListener('pointerdown', prepare, true);
    window.addEventListener('keydown', prepare, true);
    return () => {
      window.removeEventListener('pointerdown', prepare, true);
      window.removeEventListener('keydown', prepare, true);
    };
  }, [initAudio]);

  useEffect(() => {
    if (!initialized || !masterGainRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const master = masterGainRef.current;
    const now = ctx.currentTime;
    const boundedVolume = Math.max(0, Math.min(1, masterVolume));
    const targetMaster = boundedVolume * 0.55;

    if (enabled) {
      if (ctx.state === 'suspended') {
        void ctx.resume().then(() => setContextState(ctx.state));
      }
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(targetMaster, now + 1.4);
      const oscillatorLevels = [0.18, 0.12, 0.08, 0.06, 0.04, 0.025];
      nodesRef.current.forEach(({ gain }, i) => {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(oscillatorLevels[i] || 0.04, now + 1.8 + i * 0.18);
      });
      setShowPrompt(false);
      window.dispatchEvent(new CustomEvent('trai:audio-enabled', { detail: { volume: boundedVolume } }));
    } else {
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.5);
    }
  }, [enabled, initialized, masterVolume]);

  useEffect(() => {
    if (!initialized || !ctxRef.current) return;
    const ctx = ctxRef.current;
    let rafId: number;
    let t = 0;
    const breathe = () => {
      if (!enabled || !masterGainRef.current) {
        rafId = requestAnimationFrame(breathe);
        return;
      }
      t += 0.003;
      const boundedVolume = Math.max(0, Math.min(1, masterVolume));
      const target = boundedVolume * (0.55 + Math.sin(t) * 0.016);
      masterGainRef.current.gain.setTargetAtTime(target, ctx.currentTime, 0.5);
      rafId = requestAnimationFrame(breathe);
    };
    rafId = requestAnimationFrame(breathe);
    return () => cancelAnimationFrame(rafId);
  }, [initialized, enabled, masterVolume]);

  useEffect(() => {
    return () => {
      nodesRef.current.forEach(({ osc }) => {
        try { osc.stop(); } catch {}
      });
      void ctxRef.current?.close();
    };
  }, []);

  const handleToggle = () => {
    if (!initialized) initAudio();
    setShowPrompt(false);
    onToggle();
  };

  return (
    <>
      <motion.button
        data-sovereign-audio-control="true"
        data-audio-enabled={enabled ? 'true' : 'false'}
        data-audio-initialized={initialized ? 'true' : 'false'}
        data-audio-context-state={contextState}
        onClick={handleToggle}
        aria-label={enabled ? 'Mute sound' : 'Enable sound'}
        aria-pressed={enabled}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 border px-3 py-2 text-xs font-mono transition-all"
        style={{
          background: enabled ? 'rgba(216,170,67,0.15)' : 'rgba(5,7,9,0.88)',
          borderColor: enabled ? 'rgba(216,170,67,0.5)' : 'rgba(216,170,67,0.25)',
          color: enabled ? '#d8aa43' : 'rgba(244,240,230,0.55)',
          backdropFilter: 'blur(10px)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {enabled ? (
          <span className="flex h-3 items-end gap-0.5" aria-hidden="true">
            {[1, 2, 3, 4].map(i => (
              <motion.span
                key={i}
                className="w-0.5 rounded-full bg-[#d8aa43]"
                animate={{ height: ['4px', `${6 + i * 2}px`, '4px'] }}
                transition={{ duration: 0.6 + i * 0.15, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
              />
            ))}
          </span>
        ) : (
          <span className="flex h-3 w-3 items-center justify-center text-[10px]" aria-hidden="true">♪</span>
        )}
        <span>{enabled ? 'Sound On' : 'Sound Off'}</span>
      </motion.button>

      <AnimatePresence>
        {showPrompt && !enabled && (
          <motion.div
            data-audio-opt-in-prompt="true"
            className="fixed bottom-32 right-4 z-40 max-w-[210px] border border-[#d8aa43]/20 p-3 text-xs font-sans leading-relaxed text-[#f4f0e6]/60"
            style={{ background: 'rgba(5,7,9,0.92)', backdropFilter: 'blur(10px)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 1.2 }}
          >
            Sound is off by default. Enable the local ceremonial soundscape when you want it.
            <button onClick={() => setShowPrompt(false)} className="mt-2 block text-[#d8aa43]/70 transition-colors hover:text-[#d8aa43]">
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
