import { useCallback, useRef } from 'react';
import { useAudioQueue } from './useAudioQueue';

const SOUND_EFFECTS = {
  click: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-click_a4a000b4.wav',
  hover: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-hover_e99af15c.wav',
  success: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-success_60150a51.wav',
  error: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-error_9e734c19.wav',
  transition: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-transition_9aef9d45.wav',
  loading: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-loading_aa68a527.wav',
} as const;

type SoundEffectType = keyof typeof SOUND_EFFECTS;

// Debounce delays (ms) - prevents same sound from playing too frequently
const DEBOUNCE_DELAYS: Record<SoundEffectType, number> = {
  click: 100,
  hover: 150,
  success: 300,
  error: 300,
  transition: 200,
  loading: 500,
};

export const useDebouncedSounds = (enabled: boolean = true) => {
  const { queueSound } = useAudioQueue(enabled);
  const lastPlayedRef = useRef<Record<SoundEffectType, number>>({
    click: 0,
    hover: 0,
    success: 0,
    error: 0,
    transition: 0,
    loading: 0,
  });

  const playSound = useCallback(
    (type: SoundEffectType, volume: number = 0.5, priority: 'low' | 'medium' | 'high' = 'medium') => {
      if (!enabled) return;

      const now = Date.now();
      const lastPlayed = lastPlayedRef.current[type];
      const debounceDelay = DEBOUNCE_DELAYS[type];

      // Check if enough time has passed since last play
      if (now - lastPlayed < debounceDelay) {
        return;
      }

      lastPlayedRef.current[type] = now;
      queueSound(SOUND_EFFECTS[type], volume, priority);
    },
    [enabled, queueSound]
  );

  const playClick = useCallback(() => playSound('click', 0.6, 'medium'), [playSound]);
  const playHover = useCallback(() => playSound('hover', 0.4, 'low'), [playSound]);
  const playSuccess = useCallback(() => playSound('success', 0.7, 'high'), [playSound]);
  const playError = useCallback(() => playSound('error', 0.7, 'high'), [playSound]);
  const playTransition = useCallback(() => playSound('transition', 0.5, 'medium'), [playSound]);
  const playLoading = useCallback(() => playSound('loading', 0.6, 'low'), [playSound]);

  return {
    playSound,
    playClick,
    playHover,
    playSuccess,
    playError,
    playTransition,
    playLoading,
  };
};

export default useDebouncedSounds;
