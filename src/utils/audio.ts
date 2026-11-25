// Lightweight Web Audio API engine for subtle tactile clicks & ambient focus soundscapes

class SoundEngine {
  private ctx: AudioContext | null = null;
  private activeNodes: AudioNode[] = [];
  private masterGain: GainNode | null = null;
  private currentProfile: string | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playTactileClick(enabled: boolean): void {
    if (!enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(640, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.032);

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  public stopAmbient(): void {
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.25);
    }
    const nodesToStop = [...this.activeNodes];
    setTimeout(() => {
      nodesToStop.forEach((node) => {
        try {
          if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
            (node as OscillatorNode).stop();
          }
          node.disconnect();
        } catch {
          // ignore already stopped nodes
        }
      });
    }, 280);
    this.activeNodes = [];
    this.masterGain = null;
    this.currentProfile = null;
  }

  public startAmbient(profile: 'harmonic' | 'rain' | 'sub'): void {
    if (this.currentProfile === profile) return;
    this.stopAmbient();

    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(0.14, now + 0.8);
    master.connect(ctx.destination);
    this.masterGain = master;
    this.currentProfile = profile;

    if (profile === 'harmonic' || profile === 'sub') {
      const freqs = profile === 'harmonic' ? [110, 164.81, 220, 329.63] : [65.41, 98.0, 130.81];
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(profile === 'harmonic' ? 480 : 240, now);
      filter.connect(master);

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        oscGain.gain.setValueAtTime(0.22 / (idx + 1), now);
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start(now);
        this.activeNodes.push(osc, oscGain);
      });
      this.activeNodes.push(filter);
    } else {
      // Filtered pink/brown noise for gentle studio rain
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.025 * white) / 1.025;
        lastOut = output[i];
        output[i] *= 2.4;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(680, now);

      noise.connect(filter);
      filter.connect(master);
      noise.start(now);
      this.activeNodes.push(noise, filter);
    }
  }

  public getCurrentProfile(): string | null {
    return this.currentProfile;
  }
}

export const soundEngine = new SoundEngine();
