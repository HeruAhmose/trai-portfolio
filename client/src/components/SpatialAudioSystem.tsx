import React, { useEffect, useRef, useState } from 'react';

interface AudioSource {
  id: string;
  frequency: number;
  position: { x: number; y: number; z: number };
  volume: number;
  type: 'sine' | 'square' | 'sawtooth' | 'triangle';
}

export const SpatialAudioSystem: React.FC<{
  enabled?: boolean;
  masterVolume?: number;
}> = ({ enabled = true, masterVolume = 0.3 }) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeSources, setActiveSources] = useState<AudioSource[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const initializeAudio = async () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        // Create gain node for master volume
        const gainNode = audioContext.createGain();
        gainNode.gain.value = masterVolume;
        gainNode.connect(audioContext.destination);

        // Create panner for spatial audio
        const panner = audioContext.createStereoPanner();
        panner.connect(gainNode);
        pannerRef.current = panner;

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    };

    initializeAudio();
  }, [enabled, masterVolume]);

  const playTone = (source: AudioSource) => {
    if (!audioContextRef.current || !pannerRef.current) return;

    const { frequency, position, volume, type } = source;
    const audioContext = audioContextRef.current;

    try {
      // Create oscillator
      const oscillator = audioContext.createOscillator();
      oscillator.type = type;
      oscillator.frequency.value = frequency;

      // Create gain node for this source
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(pannerRef.current);

      // Update panner position based on source position
      const panValue = Math.max(-1, Math.min(1, position.x / 500));
      pannerRef.current.pan.value = panValue;

      // Start oscillator
      oscillator.start(audioContext.currentTime);

      // Store oscillator reference
      oscillatorsRef.current.set(source.id, oscillator);

      // Stop after 2 seconds
      oscillator.stop(audioContext.currentTime + 2);
      oscillatorsRef.current.delete(source.id);

      setActiveSources((prev) => [...prev, source]);
    } catch (error) {
      console.error('Failed to play tone:', error);
    }
  };

  const stopAllTones = () => {
    if (!audioContextRef.current) return;

    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop(audioContextRef.current!.currentTime);
      } catch (e) {
        // Already stopped
      }
    });

    oscillatorsRef.current.clear();
    setActiveSources([]);
  };

  const createSpatialAudio = (x: number, y: number) => {
    const source: AudioSource = {
      id: `audio-${Date.now()}`,
      frequency: 440 + x * 2, // Frequency varies with x position
      position: { x, y, z: 0 },
      volume: 0.2,
      type: 'sine',
    };

    playTone(source);
  };

  // Track mouse position for spatial audio
  useEffect(() => {
    if (!isInitialized) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 1000;
      const y = (e.clientY / window.innerHeight) * 1000;

      // Create subtle spatial audio feedback
      if (Math.random() > 0.95) {
        createSpatialAudio(x, y);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isInitialized]);

  return (
    <div className="fixed top-4 left-4 z-50 text-xs text-cyan-400 bg-black/50 px-3 py-2 rounded border border-cyan-400">
      <div>Spatial Audio: {isInitialized ? 'Active' : 'Initializing'}</div>
      <div>Active Sources: {activeSources.length}</div>
      <button
        onClick={stopAllTones}
        className="mt-2 px-2 py-1 bg-cyan-400/20 hover:bg-cyan-400/40 rounded text-xs transition-colors"
      >
        Stop Audio
      </button>
    </div>
  );
};
