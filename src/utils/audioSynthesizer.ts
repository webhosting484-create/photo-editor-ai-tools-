import type { AudioConfig, ExtraAmbienceType } from '../types/video.ts';
import { dbToGain, calculateThunderDelaySec } from './vfxEngine.ts';

// Musical scale & chord voicing tables for all 12 preset keys
const SCALE_CHORDS_MAP: Record<string, number[][]> = {
  'F minor': [
    [174.61, 207.65, 261.63, 311.13, 392.0],  // Fm9
    [116.54, 155.56, 174.61, 233.08, 293.66], // Bbm9
    [130.81, 164.81, 196.0, 246.94, 329.63],  // C7(b9)
    [174.61, 220.0, 261.63, 329.63],          // Fmaj7
  ],
  'D minor': [
    [146.83, 174.61, 220.0, 261.63, 329.63], // Dm9
    [116.54, 174.61, 220.0, 293.66],         // Bbmaj7
    [130.81, 164.81, 196.0, 261.63],         // C7
    [110.0, 164.81, 196.0, 246.94],          // Am7
  ],
  'A♭ major': [
    [207.65, 261.63, 311.13, 392.0],         // Abmaj7
    [138.59, 174.61, 207.65, 277.18],        // Fm7
    [155.56, 196.0, 233.08, 311.13],         // Bbm7
    [155.56, 207.65, 246.94, 311.13],        // Eb7
  ],
  'C♯ dorian': [
    [138.59, 164.81, 207.65, 246.94, 329.63], // C#m9
    [146.83, 185.0, 220.0, 293.66],          // D#m7
    [164.81, 207.65, 246.94, 329.63],        // Emaj7
    [110.0, 164.81, 220.0, 277.18],          // A7
  ],
  'E♭ major': [
    [155.56, 196.0, 233.08, 293.66],         // Ebmaj7
    [174.61, 207.65, 261.63, 349.23],        // Fm9
    [196.0, 233.08, 293.66, 349.23],         // Gm7
    [138.59, 174.61, 207.65, 277.18],        // Abmaj7
  ],
  'G major': [
    [196.0, 246.94, 293.66, 369.99],         // Gmaj7
    [164.81, 196.0, 246.94, 329.63],         // Em7
    [146.83, 174.61, 220.0, 293.66],         // Am7
    [146.83, 196.0, 246.94, 293.66],         // D7
  ],
  'D major': [
    [146.83, 185.0, 220.0, 277.18],          // Dmaj7
    [185.0, 220.0, 277.18, 329.63],          // F#m7
    [196.0, 246.94, 293.66, 369.99],         // Gmaj7
    [110.0, 164.81, 220.0, 277.18],          // A7
  ],
  'C lydian': [
    [130.81, 164.81, 196.0, 246.94, 369.99], // Cmaj7(#11)
    [146.83, 185.0, 220.0, 293.66],          // D7
    [164.81, 196.0, 246.94, 329.63],         // Em7
    [174.61, 220.0, 261.63, 329.63],         // F#dim7
  ],
  'B♭ major': [
    [116.54, 146.83, 174.61, 220.0, 293.66], // Bbmaj9
    [130.81, 155.56, 196.0, 261.63],        // Cm7
    [146.83, 174.61, 220.0, 293.66],        // Dm7
    [155.56, 196.0, 233.08, 293.66],        // Ebmaj7
  ],
  'E minor': [
    [164.81, 196.0, 246.94, 293.66, 369.99], // Em9
    [130.81, 164.81, 196.0, 246.94],         // Cmaj7
    [146.83, 196.0, 220.0, 293.66],         // Gmaj7
    [146.83, 174.61, 220.0, 293.66],        // D7
  ],
  'A minor': [
    [110.0, 164.81, 196.0, 261.63, 329.63],  // Am9
    [174.61, 220.0, 261.63, 329.63],         // Fmaj7
    [130.81, 164.81, 196.0, 246.94],         // Cmaj7
    [146.83, 196.0, 246.94, 293.66],         // G7
  ],
  'D mixolydian': [
    [146.83, 185.0, 220.0, 261.63],          // D7
    [164.81, 196.0, 246.94, 329.63],         // Em7
    [196.0, 246.94, 293.66, 369.99],         // Gmaj7
    [130.81, 164.81, 196.0, 261.63],         // Cmaj7
  ],
};

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  private masterGain: GainNode | null = null;
  private masterLimiter: DynamicsCompressorNode | null = null;
  private muffleFilter: BiquadFilterNode | null = null;
  private mediaStreamDest: MediaStreamAudioDestinationNode | null = null;

  // Track Gains
  private rainGain: GainNode | null = null;
  private lofiGain: GainNode | null = null;
  private thunderGain: GainNode | null = null;
  private engineGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private extraAmbienceGain: GainNode | null = null;

  // Sources
  private rainSource: AudioBufferSourceNode | null = null;
  private windSource: AudioBufferSourceNode | null = null;
  private vinylSource: AudioBufferSourceNode | null = null;
  private extraAmbienceSource: AudioBufferSourceNode | null = null;

  // Engine Osc
  private engineOsc: OscillatorNode | null = null;
  private engineSubOsc: OscillatorNode | null = null;

  // Chord Scheduler
  private chordTimer: number | null = null;
  private currentChordIndex = 0;
  private activeKey = 'F minor';
  private activeBpm = 74;

  public init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    // Master bus chain: Muffle Filter -> Limiter -> Master Gain -> Destination
    this.muffleFilter = this.ctx.createBiquadFilter();
    this.muffleFilter.type = 'lowpass';
    this.muffleFilter.frequency.value = 8000;

    this.masterLimiter = this.ctx.createDynamicsCompressor();
    this.masterLimiter.threshold.setValueAtTime(-1.0, this.ctx.currentTime);
    this.masterLimiter.ratio.setValueAtTime(20.0, this.ctx.currentTime);
    this.masterLimiter.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.masterLimiter.release.setValueAtTime(0.1, this.ctx.currentTime);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(dbToGain(-6), this.ctx.currentTime);

    this.mediaStreamDest = this.ctx.createMediaStreamDestination();

    this.muffleFilter.connect(this.masterLimiter);
    this.masterLimiter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.connect(this.mediaStreamDest);

    // Setup track modules
    this.setupRain();
    this.setupLoFi();
    this.setupThunder();
    this.setupEngine();
    this.setupWind();
    this.setupExtraAmbience('none');

    this.isInitialized = true;
  }

  private setupRain() {
    if (!this.ctx || !this.muffleFilter) return;

    const bufferSize = this.ctx.sampleRate * 4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    this.rainSource = this.ctx.createBufferSource();
    this.rainSource.buffer = noiseBuffer;
    this.rainSource.loop = true;

    const rainHp = this.ctx.createBiquadFilter();
    rainHp.type = 'highpass';
    rainHp.frequency.value = 350;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 2400;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(dbToGain(-14), this.ctx.currentTime);

    this.rainSource.connect(rainHp);
    rainHp.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.muffleFilter);

    try {
      this.rainSource.start(0);
    } catch {}
  }

  private setupLoFi() {
    if (!this.ctx || !this.muffleFilter) return;

    this.lofiGain = this.ctx.createGain();
    this.lofiGain.gain.setValueAtTime(dbToGain(-12), this.ctx.currentTime);
    this.lofiGain.connect(this.muffleFilter);

    this.startChordScheduler();
  }

  private startChordScheduler() {
    if (this.chordTimer) {
      clearInterval(this.chordTimer);
    }

    // Schedule 4 bars based on BPM (e.g. 74 BPM => 4 beats = ~3.24s)
    const intervalMs = Math.round((60000 / this.activeBpm) * 4);
    this.playNextChord();
    this.chordTimer = window.setInterval(() => {
      this.playNextChord();
    }, intervalMs);
  }

  private playNextChord() {
    if (!this.ctx || !this.lofiGain || this.ctx.state === 'suspended') return;

    const chordsList = SCALE_CHORDS_MAP[this.activeKey] || SCALE_CHORDS_MAP['F minor']!;
    const chord = chordsList[this.currentChordIndex % chordsList.length]!;
    this.currentChordIndex++;

    const now = this.ctx.currentTime;
    const duration = (60 / this.activeBpm) * 3.8;

    chord.forEach((freq, noteIdx) => {
      if (!this.ctx || !this.lofiGain) return;

      const osc = this.ctx.createOscillator();
      const oscOvertone = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // FM Rhodes electric piano emulation
      osc.type = noteIdx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      oscOvertone.type = 'sine';
      oscOvertone.frequency.setValueAtTime(freq * 2.003, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + duration);

      const peakVol = 0.08 / Math.sqrt(chord.length);
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(peakVol, now + 0.12 + noteIdx * 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      oscOvertone.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.lofiGain);

      osc.start(now + noteIdx * 0.03);
      oscOvertone.start(now + noteIdx * 0.03);

      osc.stop(now + duration + 0.1);
      oscOvertone.stop(now + duration + 0.1);
    });
  }

  private setupThunder() {
    if (!this.ctx || !this.muffleFilter) return;

    this.thunderGain = this.ctx.createGain();
    this.thunderGain.gain.setValueAtTime(dbToGain(-16), this.ctx.currentTime);
    this.thunderGain.connect(this.muffleFilter);
  }

  /**
   * Triggers thunderclap with physical distance sound delay
   */
  public triggerThunder(distanceKm = 5.0) {
    if (!this.ctx || !this.thunderGain || this.ctx.state === 'suspended') return;

    const delay = calculateThunderDelaySec(distanceKm);
    const triggerTime = this.ctx.currentTime + delay;

    // Sub rumble oscillator
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, triggerTime);
    subOsc.frequency.exponentialRampToValueAtTime(30, triggerTime + 2.8);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.001, triggerTime);
    subGain.gain.linearRampToValueAtTime(0.35, triggerTime + 0.15);
    subGain.gain.exponentialRampToValueAtTime(0.001, triggerTime + 3.0);

    subOsc.connect(subGain);
    subGain.connect(this.thunderGain);

    subOsc.start(triggerTime);
    subOsc.stop(triggerTime + 3.2);

    // Deep lowpass noise rumble
    const bufferSize = Math.floor(this.ctx.sampleRate * 2.8);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    // Farther distance attenuates high frequencies
    const cutoff = Math.max(50, 160 - distanceKm * 8);
    filter.frequency.setValueAtTime(cutoff, triggerTime);
    filter.frequency.exponentialRampToValueAtTime(45, triggerTime + 2.6);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, triggerTime);
    noiseGain.gain.linearRampToValueAtTime(0.3, triggerTime + 0.25);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, triggerTime + 2.8);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.thunderGain);

    noiseSource.start(triggerTime);
    noiseSource.stop(triggerTime + 3.0);
  }

  private setupEngine() {
    if (!this.ctx || !this.muffleFilter) return;

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(dbToGain(-22), this.ctx.currentTime);

    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.setValueAtTime(40, this.ctx.currentTime);

    this.engineSubOsc = this.ctx.createOscillator();
    this.engineSubOsc.type = 'triangle';
    this.engineSubOsc.frequency.setValueAtTime(80, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 140;

    const subGain = this.ctx.createGain();
    subGain.gain.value = 0.5;

    this.engineOsc.connect(filter);
    this.engineSubOsc.connect(subGain);
    subGain.connect(filter);

    filter.connect(this.engineGain);
    this.engineGain.connect(this.muffleFilter);

    try {
      this.engineOsc.start();
      this.engineSubOsc.start();
    } catch {}
  }

  private setupWind() {
    if (!this.ctx || !this.muffleFilter) return;

    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    this.windSource = this.ctx.createBufferSource();
    this.windSource.buffer = noiseBuffer;
    this.windSource.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 450;
    windFilter.Q.value = 1.0;

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(dbToGain(-22), this.ctx.currentTime);

    this.windSource.connect(windFilter);
    windFilter.connect(this.windGain);
    this.windGain.connect(this.muffleFilter);

    try {
      this.windSource.start();
    } catch {}
  }

  private setupExtraAmbience(type: ExtraAmbienceType) {
    if (!this.ctx || !this.muffleFilter) return;

    if (!this.extraAmbienceGain) {
      this.extraAmbienceGain = this.ctx.createGain();
      this.extraAmbienceGain.gain.setValueAtTime(dbToGain(-60), this.ctx.currentTime);
      this.extraAmbienceGain.connect(this.muffleFilter);
    }
  }

  public updateConfig(config: AudioConfig) {
    if (!this.ctx || !this.isInitialized) return;

    if (config.isPlaying && this.ctx.state === 'suspended') {
      this.ctx.resume();
    } else if (!config.isPlaying && this.ctx.state === 'running') {
      this.ctx.suspend();
    }

    const now = this.ctx.currentTime;
    const isMuted = config.isMuted || !config.isPlaying;

    if (this.masterGain) {
      const vol = isMuted ? 0 : dbToGain(config.masterVolumeDb);
      this.masterGain.gain.setTargetAtTime(vol, now, 0.05);
    }

    if (this.muffleFilter) {
      this.muffleFilter.frequency.setTargetAtTime(config.muffleLpHz || 8000, now, 0.05);
    }

    if (this.rainGain) {
      this.rainGain.gain.setTargetAtTime(dbToGain(config.rainVolumeDb), now, 0.05);
    }

    if (this.lofiGain) {
      this.lofiGain.gain.setTargetAtTime(dbToGain(config.lofiMusicVolumeDb), now, 0.05);
    }

    if (this.thunderGain) {
      this.thunderGain.gain.setTargetAtTime(dbToGain(config.thunderVolumeDb), now, 0.05);
    }

    if (this.engineGain) {
      this.engineGain.gain.setTargetAtTime(dbToGain(config.engineVolumeDb), now, 0.05);
    }

    if (this.windGain) {
      this.windGain.gain.setTargetAtTime(dbToGain(config.windVolumeDb), now, 0.05);
    }

    if (this.extraAmbienceGain) {
      this.extraAmbienceGain.gain.setTargetAtTime(dbToGain(config.extraAmbienceVolumeDb), now, 0.05);
    }

    // Update BPM & key if changed
    if (config.bpm !== this.activeBpm || config.musicalKey !== this.activeKey) {
      this.activeBpm = config.bpm || 74;
      this.activeKey = config.musicalKey || 'F minor';
      this.startChordScheduler();
    }
  }

  public getAudioStreamDestination(): MediaStreamAudioDestinationNode | null {
    return this.mediaStreamDest;
  }

  public destroy() {
    if (this.chordTimer) {
      clearInterval(this.chordTimer);
      this.chordTimer = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.isInitialized = false;
  }
}

export const soundscape = new SoundscapeEngine();
