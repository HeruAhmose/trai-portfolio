/**
 * Comprehensive Sound Design System
 * Provides immersive audio experience with multiple sound layers
 */

export interface SoundConfig {
  enabled: boolean;
  masterVolume: number;
  effectsVolume: number;
  ambientVolume: number;
  musicVolume: number;
}

class SoundDesignService {
  private audioContext: AudioContext | null = null;
  private config: SoundConfig = {
    enabled: true,
    masterVolume: 0.7,
    effectsVolume: 0.6,
    ambientVolume: 0.4,
    musicVolume: 0.5,
  };

  private oscillators: Map<string, OscillatorNode> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();
  private ambientLoop: AudioBufferSourceNode | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext(): void {
    try {
      const audioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new audioContextClass();
    } catch (error) {
      console.warn('AudioContext not supported:', error);
    }
  }

  /**
   * Play UI interaction sound
   */
  playUISound(type: 'click' | 'hover' | 'success' | 'error' | 'warning'): void {
    if (!this.config.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const frequencies: Record<string, number> = {
      click: 800,
      hover: 600,
      success: 1200,
      error: 300,
      warning: 900,
    };

    const durations: Record<string, number> = {
      click: 0.1,
      hover: 0.08,
      success: 0.3,
      error: 0.2,
      warning: 0.15,
    };

    osc.frequency.value = frequencies[type];
    gain.gain.setValueAtTime(this.config.effectsVolume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + durations[type]);

    osc.start(now);
    osc.stop(now + durations[type]);
  }

  /**
   * Play page transition sound
   */
  playTransitionSound(): void {
    if (!this.config.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Create a sweep effect
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const startFreq = 400 + i * 200;
      const endFreq = 1200 + i * 200;

      osc.frequency.setValueAtTime(startFreq, now + i * 0.05);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + i * 0.05 + 0.15);

      gain.gain.setValueAtTime(this.config.effectsVolume * 0.3, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.15);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.15);
    }
  }

  /**
   * Play project reveal sound
   */
  playRevealSound(): void {
    if (!this.config.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Ascending pitch sweep
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(1600, now + 0.4);

    gain.gain.setValueAtTime(this.config.effectsVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  /**
   * Play voice command recognition sound
   */
  playVoiceRecognitionSound(success: boolean): void {
    if (!this.config.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    if (success) {
      // Ascending double beep for success
      const frequencies = [600, 900];
      frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = freq;
        gain.gain.setValueAtTime(this.config.effectsVolume * 0.3, now + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.1);

        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 0.1);
      });
    } else {
      // Descending buzz for error
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);

      gain.gain.setValueAtTime(this.config.effectsVolume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.start(now);
      osc.stop(now + 0.2);
    }
  }

  /**
   * Play 3D interaction sound
   */
  play3DInteractionSound(): void {
    if (!this.config.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Create a 3D-like spatial sound
    for (let i = 0; i < 2; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(800 + i * 400, now);
      osc.frequency.exponentialRampToValueAtTime(600 + i * 300, now + 0.2);

      gain.gain.setValueAtTime(this.config.effectsVolume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.start(now);
      osc.stop(now + 0.2);
    }
  }

  /**
   * Play ambient background sound
   */
  playAmbientSound(): void {
    if (!this.config.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Create a low ambient drone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = 60; // Deep bass
    gain.gain.setValueAtTime(this.config.ambientVolume * 0.1, now);

    osc.start(now);
    this.oscillators.set('ambient', osc);
    this.gainNodes.set('ambient', gain);
  }

  /**
   * Stop ambient sound
   */
  stopAmbientSound(): void {
    const osc = this.oscillators.get('ambient');
    if (osc) {
      const gain = this.gainNodes.get('ambient');
      if (gain && this.audioContext) {
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        osc.stop(this.audioContext.currentTime + 0.5);
      }
      this.oscillators.delete('ambient');
      this.gainNodes.delete('ambient');
    }
  }

  /**
   * Play notification sound
   */
  playNotificationSound(): void {
    if (!this.config.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Double ascending beep
    const frequencies = [800, 1200];
    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.value = freq;
      gain.gain.setValueAtTime(this.config.effectsVolume * 0.4, now + index * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.15 + 0.15);

      osc.start(now + index * 0.15);
      osc.stop(now + index * 0.15 + 0.15);
    });
  }

  /**
   * Update sound configuration
   */
  updateConfig(config: Partial<SoundConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): SoundConfig {
    return { ...this.config };
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.config.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Toggle sound on/off
   */
  toggleSound(): void {
    this.config.enabled = !this.config.enabled;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stopAmbientSound();
    this.oscillators.clear();
    this.gainNodes.clear();
  }
}

// Singleton instance
export const soundDesignService = new SoundDesignService();
