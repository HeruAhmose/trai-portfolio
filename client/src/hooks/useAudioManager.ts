import { useCallback } from 'react';
import { useSovereignSound } from './useSovereignSound';

type SoundType = 'click' | 'hover' | 'success' | 'error' | 'transition' | 'loading';

/**
 * Compatibility facade for components that still use the older AudioManager API.
 * All effects now route into the same synthesized sovereign SFX engine, so they
 * obey the explicit master opt-in and never fetch third-party WAV assets.
 */
export const useAudioManager = (enabled: boolean = true) => {
  const sound = useSovereignSound();

  const playSound = useCallback((soundType: SoundType, _volume: number = 0.5) => {
    if (!enabled) return;
    switch (soundType) {
      case 'click':
        sound.click();
        break;
      case 'hover':
        sound.hover();
        break;
      case 'success':
        sound.chime();
        break;
      case 'error':
        sound.error();
        break;
      case 'transition':
        sound.navigate();
        break;
      case 'loading':
        sound.loading();
        break;
    }
  }, [enabled, sound]);

  const playClick = useCallback(() => playSound('click'), [playSound]);
  const playHover = useCallback(() => playSound('hover'), [playSound]);
  const playSuccess = useCallback(() => playSound('success'), [playSound]);
  const playError = useCallback(() => playSound('error'), [playSound]);
  const playTransition = useCallback(() => playSound('transition'), [playSound]);
  const playLoading = useCallback(() => playSound('loading'), [playSound]);

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

export default useAudioManager;
