import { useEffect, useRef, useCallback } from 'react';

const SOUND_URLS = {
  click: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-click_39687cb8.wav',
  hover: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-hover_723ca378.wav',
  success: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-success_ebcb4c1d.wav',
  error: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-error_a27efddc.wav',
  transition: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-transition_41820513.wav',
  loading: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029216973/UgWHTjVZwvkJrG87DtM3NE/sfx-loading_9362e7d1.wav',
} as const;

type SoundType = keyof typeof SOUND_URLS;

interface AudioCache {
  [key: string]: AudioBuffer;
}

export const useAudioManager = (enabled: boolean = true) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<AudioCache>({});
  const playingSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContextRef.current = audioContext;
          console.log('✓ Web Audio API initialized');
        } catch (error) {
          console.error('✗ Failed to initialize Web Audio API:', error);
        }
      }
    };

    // Initialize on first user interaction
    const handleUserInteraction = () => {
      initAudioContext();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Preload audio buffers
  const preloadSound = useCallback(async (soundType: SoundType) => {
    if (!enabled || audioBuffersRef.current[soundType]) return;

    try {
      const response = await fetch(SOUND_URLS[soundType]);
      const arrayBuffer = await response.arrayBuffer();
      
      if (audioContextRef.current) {
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        audioBuffersRef.current[soundType] = audioBuffer;
        console.log(`✓ Preloaded ${soundType}`);
      }
    } catch (error) {
      console.error(`✗ Failed to preload ${soundType}:`, error);
    }
  }, [enabled]);

  // Play sound using Web Audio API
  const playSound = useCallback((soundType: SoundType, volume: number = 0.5) => {
    if (!enabled || !audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      const audioBuffer = audioBuffersRef.current[soundType];

      if (!audioBuffer) {
        console.warn(`Audio buffer not loaded for ${soundType}`);
        return;
      }

      // Resume context if suspended (required by browser autoplay policy)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create nodes
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();

      source.buffer = audioBuffer;
      gainNode.gain.value = Math.min(1, Math.max(0, volume));

      // Connect and play
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      source.start(0);

      // Track for cleanup
      playingSourcesRef.current.push(source);

      // Cleanup when finished
      source.onended = () => {
        playingSourcesRef.current = playingSourcesRef.current.filter(s => s !== source);
      };

      console.log(`▶ Playing ${soundType} at ${(volume * 100).toFixed(0)}%`);
    } catch (error) {
      console.error(`✗ Failed to play ${soundType}:`, error);
    }
  }, [enabled]);

  // Convenience methods
  const playClick = useCallback(() => {
    preloadSound('click');
    playSound('click', 0.6);
  }, [playSound, preloadSound]);

  const playHover = useCallback(() => {
    preloadSound('hover');
    playSound('hover', 0.4);
  }, [playSound, preloadSound]);

  const playSuccess = useCallback(() => {
    preloadSound('success');
    playSound('success', 0.7);
  }, [playSound, preloadSound]);

  const playError = useCallback(() => {
    preloadSound('error');
    playSound('error', 0.7);
  }, [playSound, preloadSound]);

  const playTransition = useCallback(() => {
    preloadSound('transition');
    playSound('transition', 0.5);
  }, [playSound, preloadSound]);

  const playLoading = useCallback(() => {
    preloadSound('loading');
    playSound('loading', 0.6);
  }, [playSound, preloadSound]);

  // Preload all sounds on mount
  useEffect(() => {
    if (enabled) {
      Object.keys(SOUND_URLS).forEach(key => {
        preloadSound(key as SoundType);
      });
    }
  }, [enabled, preloadSound]);

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
