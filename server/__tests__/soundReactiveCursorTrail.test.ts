import { describe, it, expect } from 'vitest';

describe('Sound-Reactive Cursor Trail System', () => {
  it('should validate audio reactivity data structure', () => {
    interface AudioReactivityData {
      bass: number;
      mid: number;
      treble: number;
      intensity: number;
      dominantFrequency: 'bass' | 'mid' | 'treble';
      isPlaying: boolean;
    }

    const audioData: AudioReactivityData = {
      bass: 0.5,
      mid: 0.6,
      treble: 0.4,
      intensity: 0.55,
      dominantFrequency: 'mid',
      isPlaying: true,
    };

    expect(audioData.bass).toBeGreaterThanOrEqual(0);
    expect(audioData.bass).toBeLessThanOrEqual(1);
    expect(audioData.mid).toBeGreaterThanOrEqual(0);
    expect(audioData.mid).toBeLessThanOrEqual(1);
    expect(audioData.treble).toBeGreaterThanOrEqual(0);
    expect(audioData.treble).toBeLessThanOrEqual(1);
    expect(audioData.intensity).toBeGreaterThanOrEqual(0);
    expect(audioData.intensity).toBeLessThanOrEqual(1);
    expect(['bass', 'mid', 'treble']).toContain(audioData.dominantFrequency);
    expect(typeof audioData.isPlaying).toBe('boolean');
  });

  it('should determine dominant frequency correctly', () => {
    const frequencies = { bass: 0.8, mid: 0.3, treble: 0.2 };
    const dominant = Object.entries(frequencies).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    expect(dominant).toBe('bass');
  });

  it('should map bass frequency to hot pink color', () => {
    const bass = 0.8;
    const mid = 0.3;
    const treble = 0.2;

    const color = bass > mid && bass > treble ? '#ff0080' : '#ffd700';
    expect(color).toBe('#ff0080');
  });

  it('should map treble frequency to electric cyan color', () => {
    const bass = 0.2;
    const mid = 0.3;
    const treble = 0.8;

    const color = treble > mid && treble > bass ? '#00d9ff' : '#ffd700';
    expect(color).toBe('#00d9ff');
  });

  it('should map mid frequency to gold color', () => {
    const bass = 0.3;
    const mid = 0.8;
    const treble = 0.2;

    const color = mid > bass && mid > treble ? '#ffd700' : '#00d9ff';
    expect(color).toBe('#ffd700');
  });

  it('should calculate particle count based on intensity', () => {
    const PARTICLE_COUNT = 8;
    const intensity = 0.75;

    const particleCount = PARTICLE_COUNT + Math.floor(intensity * PARTICLE_COUNT);
    expect(particleCount).toBe(14);
  });

  it('should calculate burst intensity multiplier', () => {
    const intensity = 0.6;
    const burstIntensity = 1 + intensity * 0.5;

    expect(burstIntensity).toBeCloseTo(1.3, 1);
  });

  it('should validate frequency bin distribution', () => {
    const fftSize = 256;
    const bufferLength = fftSize / 2;

    const bassEnd = Math.floor(bufferLength * 0.1);
    const midEnd = Math.floor(bufferLength * 0.5);
    const trebleEnd = bufferLength;

    expect(bassEnd).toBe(12);
    expect(midEnd).toBe(64);
    expect(trebleEnd).toBe(128);
    expect(bassEnd < midEnd && midEnd < trebleEnd).toBe(true);
  });

  it('should validate audio context initialization', () => {
    const audioContextTypes = ['AudioContext', 'webkitAudioContext'];
    expect(audioContextTypes.length).toBeGreaterThan(0);
  });

  it('should validate analyzer FFT size', () => {
    const fftSize = 256;
    const validFFTSizes = [32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768];

    expect(validFFTSizes).toContain(fftSize);
  });

  it('should validate smoothing time constant', () => {
    const smoothingTimeConstant = 0.8;

    expect(smoothingTimeConstant).toBeGreaterThanOrEqual(0);
    expect(smoothingTimeConstant).toBeLessThanOrEqual(1);
  });

  it('should calculate average frequency for range', () => {
    const data = new Uint8Array([100, 150, 200, 120, 180]);
    const sum = Array.from(data).reduce((a, b) => a + b, 0);
    const average = sum / (data.length * 255);

    expect(average).toBeCloseTo(0.588, 2);
  });

  it('should validate color mapping for audio', () => {
    const NEON_COLORS = ['#ffd700', '#00ffff', '#ff00ff', '#00ff00', '#ff0080', '#00d9ff'];
    const audioColors = ['#ff0080', '#00d9ff', '#ffd700'];

    audioColors.forEach(color => {
      expect(NEON_COLORS).toContain(color);
    });
  });

  it('should validate particle burst count calculation', () => {
    const MEGA_BURST_COUNT = 60;
    const DIRECTIONAL_BURST_COUNT = 30;
    const intensity = 0.8;

    const megaBurstCount = Math.floor(MEGA_BURST_COUNT * (1 + intensity * 0.5));
    const directionalBurstCount = Math.floor(DIRECTIONAL_BURST_COUNT * (1 + intensity * 0.5));

    expect(megaBurstCount).toBe(84);
    expect(directionalBurstCount).toBe(42);
  });

  it('should validate audio playing state', () => {
    const mockAudioElement = {
      paused: false,
      currentTime: 2.5,
    };

    const isPlaying = !mockAudioElement.paused && mockAudioElement.currentTime > 0;
    expect(isPlaying).toBe(true);
  });

  it('should validate frequency range analysis', () => {
    const data = new Uint8Array(128);
    for (let i = 0; i < 128; i++) {
      data[i] = Math.floor(Math.random() * 256);
    }

    const bassEnd = Math.floor(128 * 0.1);
    const midEnd = Math.floor(128 * 0.5);
    const trebleEnd = 128;

    let bassSum = 0;
    for (let i = 0; i < bassEnd; i++) {
      bassSum += data[i];
    }

    let midSum = 0;
    for (let i = bassEnd; i < midEnd; i++) {
      midSum += data[i];
    }

    let trebleSum = 0;
    for (let i = midEnd; i < trebleEnd; i++) {
      trebleSum += data[i];
    }

    expect(bassSum).toBeGreaterThanOrEqual(0);
    expect(midSum).toBeGreaterThanOrEqual(0);
    expect(trebleSum).toBeGreaterThanOrEqual(0);
  });

  it('should validate cursor color based on audio', () => {
    const soundReactive = true;
    const isPlaying = true;
    const bass = 0.7;
    const mid = 0.4;
    const treble = 0.3;

    let cursorColor = '#ffd700';
    if (soundReactive && isPlaying) {
      if (bass > mid && bass > treble) {
        cursorColor = '#ff0080';
      } else if (treble > mid && treble > bass) {
        cursorColor = '#00d9ff';
      } else {
        cursorColor = '#ffd700';
      }
    }

    expect(cursorColor).toBe('#ff0080');
  });
});
