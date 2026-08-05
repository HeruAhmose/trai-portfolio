import { useCallback, useRef } from 'react';

type SoundPriority = 'low' | 'medium' | 'high';

interface QueuedSound {
  url: string;
  volume: number;
  priority: SoundPriority;
  id: string;
}

const PRIORITY_LEVELS = {
  low: 1,
  medium: 2,
  high: 3,
};

export const useAudioQueue = (enabled: boolean = true) => {
  const queueRef = useRef<QueuedSound[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);

  const playNextInQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    // Sort queue by priority (highest first)
    queueRef.current.sort(
      (a, b) => PRIORITY_LEVELS[b.priority] - PRIORITY_LEVELS[a.priority]
    );

    const nextSound = queueRef.current.shift();
    if (!nextSound) {
      isPlayingRef.current = false;
      return;
    }

    try {
      // Stop current audio if playing
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      }

      // Create and play new audio
      const audio = new Audio(nextSound.url);
      audio.volume = Math.min(1, Math.max(0, nextSound.volume));
      
      audio.onended = () => {
        isPlayingRef.current = false;
        playNextInQueue();
      };

      audio.onerror = () => {
        isPlayingRef.current = false;
        playNextInQueue();
      };

      currentAudioRef.current = audio;
      isPlayingRef.current = true;
      audio.play().catch(() => {
        isPlayingRef.current = false;
        playNextInQueue();
      });
    } catch (error) {
      console.warn('Failed to play queued sound', error);
      isPlayingRef.current = false;
      playNextInQueue();
    }
  }, []);

  const queueSound = useCallback(
    (url: string, volume: number = 0.5, priority: SoundPriority = 'medium') => {
      if (!enabled) return;

      const soundId = `${Date.now()}-${Math.random()}`;
      queueRef.current.push({ url, volume, priority, id: soundId });

      if (!isPlayingRef.current) {
        playNextInQueue();
      }
    },
    [enabled, playNextInQueue]
  );

  const clearQueue = useCallback(() => {
    queueRef.current = [];
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    isPlayingRef.current = false;
  }, []);

  return {
    queueSound,
    clearQueue,
    isPlaying: isPlayingRef.current,
  };
};

export default useAudioQueue;
