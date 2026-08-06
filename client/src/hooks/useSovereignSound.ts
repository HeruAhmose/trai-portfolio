/**
 * useSovereignSound — sovereign interaction sound effects via Web Audio API.
 * Activates on first user gesture. All sounds are synthesized — no audio files needed.
 * Provides: click, hover, navigate, unlock, chime, and pulse effects.
 */
import { useRef, useCallback } from 'react';

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!sharedCtx) sharedCtx = new AudioContext();
    if (sharedCtx.state === 'suspended') sharedCtx.resume();
    return sharedCtx;
  } catch { return null; }
}

function playTone(
  freq: number,
  type: OscillatorType,
  attack: number,
  sustain: number,
  release: number,
  volume: number,
  detune = 0,
  filterFreq?: number
) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (detune) osc.detune.setValueAtTime(detune, ctx.currentTime);

  let node: AudioNode = gain;
  if (filterFreq) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
    gain.connect(filter);
    filter.connect(ctx.destination);
    node = gain;
  } else {
    gain.connect(ctx.destination);
  }

  osc.connect(gain);
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + attack);
  gain.gain.setValueAtTime(volume, now + attack + sustain);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + sustain + release);
  osc.start(now);
  osc.stop(now + attack + sustain + release + 0.05);
}

export function useSovereignSound() {
  const enabledRef = useRef(false);

  const enable = useCallback(() => { enabledRef.current = true; }, []);

  /** Soft gold click — felt, not heard */
  const click = useCallback(() => {
    if (!enabledRef.current) return;
    playTone(880, 'sine', 0.005, 0.02, 0.12, 0.08);
    playTone(1320, 'sine', 0.005, 0.01, 0.08, 0.04, 5);
  }, []);

  /** Hover shimmer — barely perceptible */
  const hover = useCallback(() => {
    if (!enabledRef.current) return;
    playTone(1760, 'sine', 0.003, 0.005, 0.06, 0.025);
  }, []);

  /** Navigate — deeper portal entry */
  const navigate = useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    // Ascending triad: D → F# → A
    [293.66, 369.99, 440].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'sine', 0.01, 0.05, 0.35, 0.07 - i * 0.01), i * 60);
    });
  }, []);

  /** Unlock / reveal — organ card expansion */
  const unlock = useCallback(() => {
    if (!enabledRef.current) return;
    // Gold shimmer sweep
    playTone(440, 'sine', 0.01, 0.1, 0.6, 0.09);
    playTone(554.37, 'sine', 0.02, 0.08, 0.5, 0.06);
    playTone(659.25, 'sine', 0.04, 0.06, 0.4, 0.04);
    playTone(880, 'sine', 0.06, 0.04, 0.3, 0.025);
  }, []);

  /** Region select — map interaction */
  const region = useCallback(() => {
    if (!enabledRef.current) return;
    playTone(523.25, 'triangle', 0.005, 0.03, 0.2, 0.06);
    playTone(659.25, 'triangle', 0.01, 0.02, 0.15, 0.04, -8);
  }, []);

  /** Chime — section reveal */
  const chime = useCallback(() => {
    if (!enabledRef.current) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 'sine', 0.005, 0.02, 0.5, 0.05 - i * 0.008), i * 80);
    });
  }, []);

  return { enable, click, hover, navigate, unlock, region, chime };
}
