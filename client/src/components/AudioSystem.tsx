import React, { useEffect, useRef, useState } from 'react';

export interface AudioConfig {
  soundscape: string;
  volume: number;
  loop: boolean;
  fadeIn: number;
  fadeOut: number;
}

export const AudioSystem: React.FC<{
  soundscapeUrl?: string;
  volume?: number;
  autoPlay?: boolean;
  loop?: boolean;
}> = ({
  soundscapeUrl,
  volume = 0.3,
  autoPlay = true,
  loop = true,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const audioSystemEnabled =
    import.meta.env.VITE_ENABLE_AUDIO_SYSTEM === "true";

  // Initialize audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = currentVolume;
    audio.loop = loop;

    if (audioSystemEnabled && autoPlay && soundscapeUrl) {
      audio.play().catch((err) => console.log('Audio autoplay prevented:', err));
    }

    return () => {
      audio.pause();
    };
  }, [soundscapeUrl, autoPlay, loop, audioSystemEnabled]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = currentVolume;
    }
  }, [currentVolume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((err) => console.log('Play error:', err));
      setIsPlaying(true);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={audioSystemEnabled ? soundscapeUrl : undefined}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          if (loop) {
            audioRef.current?.play();
          }
        }}
      />

      {/* Hidden by default, can be shown via CSS if needed */}
      <div className="hidden">
        <button onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={currentVolume}
          onChange={(e) => setCurrentVolume(parseFloat(e.target.value))}
        />
      </div>
    </>
  );
};

// Hook for managing audio across the app
export const useAudioSystem = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playSound = (url: string, volume: number = 0.5) => {
    if (!audioRef.current) {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.play().catch((err) => console.log('Audio play error:', err));
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  };

  return { playSound, stopSound, setVolume, audioRef };
};
