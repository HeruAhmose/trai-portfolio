/**
 * useSovereignSound — synthesized interaction SFX via Web Audio API.
 *
 * One authority controls the experience: SoundPreferencesContext. Every effect
 * obeys the master opt-in, master volume and its per-effect preference. No
 * external audio assets or microphone access are required.
 */
import { useCallback } from 'react';
import { useSoundPreferences } from '@/contexts/SoundPreferencesContext';

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!sharedCtx) sharedCtx = new AudioContext();
    if (sharedCtx.state === 'suspended') void sharedCtx.resume();
    return sharedCtx;
  } catch {
    return null;
  }
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
  if (!ctx) return false;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (detune) osc.detune.setValueAtTime(detune, ctx.currentTime);

  if (filterFreq) {
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
    gain.connect(filter);
    filter.connect(ctx.destination);
  } else {
    gain.connect(ctx.destination);
  }

  osc.connect(gain);
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(Math.max(0.0001, volume), now + attack);
  gain.gain.setValueAtTime(Math.max(0.0001, volume), now + attack + sustain);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + sustain + release);
  osc.start(now);
  osc.stop(now + attack + sustain + release + 0.05);
  return true;
}

function announce(type: string) {
  window.dispatchEvent(new CustomEvent('trai:sfx', { detail: { type, at: performance.now() } }));
}

export function useSovereignSound() {
  const { preferences } = useSoundPreferences();
  const volume = Math.max(0, Math.min(1, preferences.masterVolume));

  // Compatibility no-op for older callers. Generic gestures no longer enable
  // audio; the explicit preference toggle is the only authority.
  const enable = useCallback(() => {}, []);

  const click = useCallback(() => {
    if (!preferences.enabled || !preferences.clickEnabled || volume <= 0) return;
    const played = playTone(880, 'sine', 0.005, 0.02, 0.12, 0.08 * volume);
    playTone(1320, 'sine', 0.005, 0.01, 0.08, 0.04 * volume, 5);
    if (played) announce('click');
  }, [preferences.enabled, preferences.clickEnabled, volume]);

  const hover = useCallback(() => {
    if (!preferences.enabled || !preferences.hoverEnabled || volume <= 0) return;
    const played = playTone(1760, 'sine', 0.003, 0.005, 0.06, 0.025 * volume);
    if (played) announce('hover');
  }, [preferences.enabled, preferences.hoverEnabled, volume]);

  const navigate = useCallback(() => {
    if (!preferences.enabled || !preferences.transitionEnabled || volume <= 0) return;
    [293.66, 369.99, 440].forEach((freq, i) => {
      window.setTimeout(
        () => playTone(freq, 'sine', 0.01, 0.05, 0.35, (0.07 - i * 0.01) * volume),
        i * 60
      );
    });
    announce('navigate');
  }, [preferences.enabled, preferences.transitionEnabled, volume]);

  const unlock = useCallback(() => {
    if (!preferences.enabled || !preferences.successEnabled || volume <= 0) return;
    playTone(440, 'sine', 0.01, 0.1, 0.6, 0.09 * volume);
    playTone(554.37, 'sine', 0.02, 0.08, 0.5, 0.06 * volume);
    playTone(659.25, 'sine', 0.04, 0.06, 0.4, 0.04 * volume);
    playTone(880, 'sine', 0.06, 0.04, 0.3, 0.025 * volume);
    announce('unlock');
  }, [preferences.enabled, preferences.successEnabled, volume]);

  const region = useCallback(() => {
    if (!preferences.enabled || !preferences.clickEnabled || volume <= 0) return;
    playTone(523.25, 'triangle', 0.005, 0.03, 0.2, 0.06 * volume);
    playTone(659.25, 'triangle', 0.01, 0.02, 0.15, 0.04 * volume, -8);
    announce('region');
  }, [preferences.enabled, preferences.clickEnabled, volume]);

  const chime = useCallback(() => {
    if (!preferences.enabled || !preferences.successEnabled || volume <= 0) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      window.setTimeout(
        () => playTone(freq, 'sine', 0.005, 0.02, 0.5, (0.05 - i * 0.008) * volume),
        i * 80
      );
    });
    announce('chime');
  }, [preferences.enabled, preferences.successEnabled, volume]);

  const error = useCallback(() => {
    if (!preferences.enabled || !preferences.errorEnabled || volume <= 0) return;
    const played = playTone(185, 'triangle', 0.005, 0.03, 0.28, 0.055 * volume, -12, 1200);
    playTone(138.59, 'sine', 0.01, 0.02, 0.34, 0.04 * volume, -8, 700);
    if (played) announce('error');
  }, [preferences.enabled, preferences.errorEnabled, volume]);

  const loading = useCallback(() => {
    if (!preferences.enabled || !preferences.loadingEnabled || volume <= 0) return;
    const played = playTone(392, 'sine', 0.004, 0.01, 0.12, 0.025 * volume, 0, 1800);
    if (played) announce('loading');
  }, [preferences.enabled, preferences.loadingEnabled, volume]);

  return { enable, click, hover, navigate, unlock, region, chime, error, loading };
}
