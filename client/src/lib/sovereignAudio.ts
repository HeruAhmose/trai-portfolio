/**
 * Sovereign Audio Engine
 * ----------------------------------------------------------------------------
 * Why the old toggle could never make sound:
 *   `useState(false)` flipped a label and nothing else. No AudioContext was ever
 *   constructed, and browsers refuse to start one outside a user gesture anyway.
 *
 * This engine constructs (or resumes) the AudioContext *inside* the click that
 * enables it, which is the only moment the browser will allow. Every voice is
 * synthesised procedurally — no sample files, so nothing can 404.
 *
 * Tuning is derived from the brand rather than chosen arbitrarily: the interval
 * set is built on 1.618 (φ) scaled into audible ratios, so the sound design and
 * the cultivation geometry come from the same number.
 */

type Ctx = AudioContext & { _unlocked?: boolean };

const PHI = 1.618033988749;

/** φ-derived scale: a root and intervals folded from the golden ratio. */
const ROOT = 146.83; // D3
const STEPS = [1, PHI / 1.5, PHI, PHI * 1.25, PHI * 1.5, PHI * PHI];

class SovereignAudio {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private padGain: GainNode | null = null;
  private padNodes: OscillatorNode[] = [];
  private _enabled = false;
  private _reduced = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this._reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.addEventListener('visibilitychange', () => {
        if (!this.ctx) return;
        if (document.hidden) this.ctx.suspend().catch(() => {});
        else if (this._enabled) this.ctx.resume().catch(() => {});
      });
    }
  }

  get enabled() {
    return this._enabled;
  }

  /** Must be called from inside a user gesture handler. */
  async enable(): Promise<boolean> {
    try {
      if (!this.ctx) {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return false;
        this.ctx = new AC() as Ctx;
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.0001;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      this._enabled = true;
      this.ramp(this.master!.gain, 0.5, 0.6);
      if (!this._reduced) this.startPad();
      this.chime();
      return true;
    } catch {
      return false;
    }
  }

  disable() {
    if (!this.ctx || !this.master) {
      this._enabled = false;
      return;
    }
    this._enabled = false;
    this.ramp(this.master.gain, 0.0001, 0.4);
    window.setTimeout(() => this.stopPad(), 450);
  }

  async toggle(): Promise<boolean> {
    if (this._enabled) {
      this.disable();
      return false;
    }
    return this.enable();
  }

  // ---------------------------------------------------------------- helpers
  private ramp(p: AudioParam, to: number, secs: number) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    p.cancelScheduledValues(t);
    p.setValueAtTime(Math.max(p.value, 0.0001), t);
    p.exponentialRampToValueAtTime(Math.max(to, 0.0001), t + secs);
  }

  private voice(
    freq: number,
    opts: {
      type?: OscillatorType;
      dur?: number;
      gain?: number;
      attack?: number;
      detune?: number;
      filter?: number;
      slideTo?: number;
    } = {}
  ) {
    if (!this.ctx || !this.master || !this._enabled) return;
    const { type = 'sine', dur = 0.5, gain = 0.14, attack = 0.008, detune = 0, filter, slideTo } = opts;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    if (detune) osc.detune.value = detune;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    let tail: AudioNode = g;
    if (filter) {
      const f = this.ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = filter;
      f.Q.value = 0.8;
      g.connect(f);
      tail = f;
    }
    osc.connect(g);
    tail.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  // ---------------------------------------------------------------- ambient
  private startPad() {
    if (!this.ctx || !this.master || this.padNodes.length) return;
    const t = this.ctx.currentTime;
    this.padGain = this.ctx.createGain();
    this.padGain.gain.setValueAtTime(0.0001, t);
    this.padGain.gain.exponentialRampToValueAtTime(0.05, t + 4);

    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 520;
    this.padGain.connect(filt);
    filt.connect(this.master);

    [ROOT / 2, (ROOT / 2) * PHI, ROOT].forEach((f, i) => {
      const o = this.ctx!.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sine';
      o.frequency.value = f;
      o.detune.value = (i - 1) * 6;
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.value = 0.05 + i * 0.017;
      lfoGain.gain.value = 1.6;
      lfo.connect(lfoGain);
      lfoGain.connect(o.detune);
      o.connect(this.padGain!);
      o.start(t);
      lfo.start(t);
      this.padNodes.push(o, lfo);
    });
  }

  private stopPad() {
    this.padNodes.forEach((n) => {
      try {
        n.stop();
      } catch {
        /* already stopped */
      }
    });
    this.padNodes = [];
    this.padGain = null;
  }

  // ---------------------------------------------------------------- voices
  /** Light tick on hover. Deliberately quiet and short. */
  hover(index = 0) {
    this.voice(ROOT * 4 * STEPS[index % STEPS.length], {
      type: 'sine',
      dur: 0.11,
      gain: 0.045,
      filter: 3200,
    });
  }

  /** Selecting a region or list item. */
  select(index = 0) {
    const f = ROOT * 2 * STEPS[index % STEPS.length];
    this.voice(f, { type: 'triangle', dur: 0.26, gain: 0.1, filter: 2600 });
    this.voice(f * PHI, { type: 'sine', dur: 0.34, gain: 0.05, attack: 0.03, filter: 2400 });
  }

  /** Opening an organ portal — a rising drone with a fifth above. */
  portalOpen(index = 0) {
    const f = ROOT * STEPS[index % STEPS.length];
    this.voice(f, { type: 'sawtooth', dur: 1.1, gain: 0.1, attack: 0.05, filter: 900, slideTo: f * 1.5 });
    this.voice(f * 2, { type: 'sine', dur: 1.3, gain: 0.07, attack: 0.12, filter: 1800 });
    this.voice(f * 3, { type: 'sine', dur: 0.9, gain: 0.03, attack: 0.2, filter: 2600 });
  }

  /** Closing a portal — the same shape, falling. */
  portalClose(index = 0) {
    const f = ROOT * 2 * STEPS[index % STEPS.length];
    this.voice(f, { type: 'triangle', dur: 0.5, gain: 0.08, filter: 1400, slideTo: f / PHI });
  }

  /** Confirmation chime when sound is first enabled. */
  chime() {
    [0, 2, 4].forEach((s, i) =>
      window.setTimeout(
        () =>
          this.voice(ROOT * 2 * STEPS[s], {
            type: 'sine',
            dur: 0.7,
            gain: 0.09,
            attack: 0.02,
            filter: 2800,
          }),
        i * 110
      )
    );
  }
}

export const sovereignAudio = new SovereignAudio();
export default sovereignAudio;
