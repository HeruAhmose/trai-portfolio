import { useEffect, useRef, useState } from 'react';

export interface AudioReactivityData {
  bass: number; // 0-1
  mid: number; // 0-1
  treble: number; // 0-1
  intensity: number; // 0-1
  dominantFrequency: 'bass' | 'mid' | 'treble';
  isPlaying: boolean;
}

const DEFAULT_AUDIO_DATA: AudioReactivityData = {
  bass: 0,
  mid: 0,
  treble: 0,
  intensity: 0,
  dominantFrequency: 'mid',
  isPlaying: false,
};

export const useAudioReactivity = (enabled: boolean = true) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [audioData, setAudioData] = useState<AudioReactivityData>(DEFAULT_AUDIO_DATA);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const mediaElementRef = useRef<HTMLMediaElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Initialize audio context
    const initAudioContext = () => {
      if (audioContextRef.current) return;

      const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      analyzer.smoothingTimeConstant = 0.8;
      analyzerRef.current = analyzer;

      const bufferLength = analyzer.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // Try to connect to existing audio elements
      const audioElements = document.querySelectorAll('audio');
      if (audioElements.length > 0) {
        const audioElement = audioElements[0] as HTMLMediaElement;
        mediaElementRef.current = audioElement;

        if (!sourceRef.current) {
          const source = audioContext.createMediaElementSource(audioElement);
          source.connect(analyzer);
          analyzer.connect(audioContext.destination);
          sourceRef.current = source;
        }
      }
    };

    // Analyze frequency data
    const analyzeFrequencies = () => {
      if (!analyzerRef.current || !dataArrayRef.current) return;

      if (dataArrayRef.current) {
        analyzerRef.current.getByteFrequencyData(dataArrayRef.current as any);
      }
      const data = dataArrayRef.current as Uint8Array;
      const length = data.length;

      // Split frequency range into bass, mid, treble
      const bassEnd = Math.floor(length * 0.1); // 0-10%
      const midEnd = Math.floor(length * 0.5); // 10-50%
      const trebleEnd = length; // 50-100%

      // Calculate average for each frequency range
      let bassSum = 0;
      for (let i = 0; i < bassEnd; i++) {
        bassSum += data[i];
      }
      const bass = bassSum / (bassEnd * 255);

      let midSum = 0;
      for (let i = bassEnd; i < midEnd; i++) {
        midSum += data[i];
      }
      const mid = midSum / ((midEnd - bassEnd) * 255);

      let trebleSum = 0;
      for (let i = midEnd; i < trebleEnd; i++) {
        trebleSum += data[i];
      }
      const treble = trebleSum / ((trebleEnd - midEnd) * 255);

      // Calculate overall intensity
      let totalSum = 0;
      for (let i = 0; i < length; i++) {
        totalSum += data[i];
      }
      const intensity = totalSum / (length * 255);

      // Determine dominant frequency
      const frequencies = { bass, mid, treble };
      const dominantFrequency = (
        Object.entries(frequencies).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
      ) as 'bass' | 'mid' | 'treble';

      // Check if audio is playing
      const isPlaying = mediaElementRef.current
        ? !mediaElementRef.current.paused && mediaElementRef.current.currentTime > 0
        : false;

      setAudioData({
        bass: Math.min(1, bass),
        mid: Math.min(1, mid),
        treble: Math.min(1, treble),
        intensity: Math.min(1, intensity),
        dominantFrequency,
        isPlaying,
      });
    };

    // Animation loop
    const animate = () => {
      analyzeFrequencies();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize on first interaction
    const handleUserInteraction = () => {
      if (!audioContextRef.current) {
        initAudioContext();
      }
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled]);

  return audioData;
};
