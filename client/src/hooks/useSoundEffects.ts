import { useCallback, useRef } from 'react';

const SOUND_EFFECTS = {
  click: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-click_39687cb8.wav',
  hover: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-hover_723ca378.wav',
  success: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-success_ebcb4c1d.wav',
  error: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-error_a27efddc.wav',
  transition: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-transition_41820513.wav',
  loading: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-loading_9362e7d1.wav',
} as const;

type SoundEffectType = keyof typeof SOUND_EFFECTS;

export const useSoundEffects = (enabled: boolean = true) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((type: SoundEffectType, volume: number = 0.5) => {
    if (!enabled) return;

    try {
      const audio = new Audio(SOUND_EFFECTS[type]);
      audio.volume = Math.min(1, Math.max(0, volume));
      audio.play().catch(() => {
        // Silently fail if audio can't play (e.g., user hasn't interacted yet)
      });
    } catch (error) {
      console.warn(`Failed to play sound effect: ${type}`, error);
    }
  }, [enabled]);

  const playClick = useCallback(() => playSound('click', 0.6), [playSound]);
  const playHover = useCallback(() => playSound('hover', 0.4), [playSound]);
  const playSuccess = useCallback(() => playSound('success', 0.7), [playSound]);
  const playError = useCallback(() => playSound('error', 0.7), [playSound]);
  const playTransition = useCallback(() => playSound('transition', 0.5), [playSound]);
  const playLoading = useCallback(() => playSound('loading', 0.6), [playSound]);

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

export default useSoundEffects;
