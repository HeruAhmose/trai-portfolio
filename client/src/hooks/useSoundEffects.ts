import { useCallback } from 'react';

type SoundEffectType =
  | 'click'
  | 'hover'
  | 'success'
  | 'error'
  | 'transition'
  | 'loading';

export const useSoundEffects = (enabled: boolean = true) => {
  const playSound = useCallback(
    (_type: SoundEffectType, _volume: number = 0.5) => {
      if (!enabled) return;
    },
    [enabled],
  );

  const playClick = useCallback(() => playSound('click', 0.6), [playSound]);
  const playHover = useCallback(() => playSound('hover', 0.4), [playSound]);
  const playSuccess = useCallback(() => playSound('success', 0.7), [playSound]);
  const playError = useCallback(() => playSound('error', 0.7), [playSound]);
  const playTransition = useCallback(
    () => playSound('transition', 0.5),
    [playSound],
  );
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
