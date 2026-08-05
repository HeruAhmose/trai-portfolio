import { useEffect, useRef, useState, useCallback } from 'react';

export interface AudioCue {
  name: string;
  frequency?: number;
  duration: number;
  type: 'sine' | 'square' | 'sawtooth' | 'triangle';
  volume: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

export interface AudioSystemConfig {
  masterVolume: number;
  enabled: boolean;
}

export const useAudioSystem = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.3);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());

  // Initialize Web Audio API context
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
    }
    return audioContextRef.current;
  }, []);

  // Generate a cyberpunk boot-up sound
  const playBootUpSound = useCallback(async () => {
    const ctx = initAudioContext();
    if (!ctx || isMuted) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(masterVolume * 0.5, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 2);

    // Create multiple oscillators for complex boot sound
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

      osc.type = 'square';
      osc.frequency.setValueAtTime(200 + i * 150, now);
      osc.frequency.exponentialRampToValueAtTime(50 + i * 100, now + 0.5);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(100, now);
      filter.frequency.linearRampToValueAtTime(2000, now + 0.3);

      osc.connect(filter);
      filter.connect(gainNode);

      osc.start(now);
      osc.stop(now + 2);
    }
  }, [initAudioContext, isMuted, masterVolume]);

  // Generate section transition sound
  const playSectionTransition = useCallback(async () => {
    const ctx = initAudioContext();
    if (!ctx || isMuted) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(masterVolume * 0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

    // Ascending tone sweep
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.4);

    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.4);

    // Second harmonic
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(600, now + 0.2);
    osc2.frequency.exponentialRampToValueAtTime(1800, now + 0.6);

    osc2.connect(gainNode);
    osc2.start(now + 0.2);
    osc2.stop(now + 0.6);
  }, [initAudioContext, isMuted, masterVolume]);

  // Generate UI interaction click sound
  const playClickSound = useCallback(async () => {
    const ctx = initAudioContext();
    if (!ctx || isMuted) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(masterVolume * 0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.1);
  }, [initAudioContext, isMuted, masterVolume]);

  // Generate hover sound
  const playHoverSound = useCallback(async () => {
    const ctx = initAudioContext();
    if (!ctx || isMuted) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(masterVolume * 0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.15);

    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.15);
  }, [initAudioContext, isMuted, masterVolume]);

  // Generate success/completion sound
  const playSuccessSound = useCallback(async () => {
    const ctx = initAudioContext();
    if (!ctx || isMuted) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(masterVolume * 0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    // Three ascending tones
    const frequencies = [523.25, 659.25, 783.99]; // C, E, G
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      osc.connect(gainNode);
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.2);
    });
  }, [initAudioContext, isMuted, masterVolume]);

  // Generate error/warning sound
  const playErrorSound = useCallback(async () => {
    const ctx = initAudioContext();
    if (!ctx || isMuted) return;

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(masterVolume * 0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    // Two descending tones
    const osc1 = ctx.createOscillator();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(400, now + 0.2);

    osc1.connect(gainNode);
    osc1.start(now);
    osc1.stop(now + 0.2);

    const osc2 = ctx.createOscillator();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(600, now + 0.25);
    osc2.frequency.exponentialRampToValueAtTime(300, now + 0.45);

    osc2.connect(gainNode);
    osc2.start(now + 0.25);
    osc2.stop(now + 0.45);
  }, [initAudioContext, isMuted, masterVolume]);

  // Toggle mute state
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Update master volume
  const setVolume = useCallback((volume: number) => {
    setMasterVolume(Math.max(0, Math.min(1, volume)));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isMuted,
    masterVolume,
    toggleMute,
    setVolume,
    playBootUpSound,
    playSectionTransition,
    playClickSound,
    playHoverSound,
    playSuccessSound,
    playErrorSound,
  };
};
