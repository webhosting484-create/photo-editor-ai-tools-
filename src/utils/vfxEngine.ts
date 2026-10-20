import type {
  VFXConfig,
  AudioConfig,
  PresetMood,
  SceneAnchorsConfig,
} from '../types/video.ts';

export const DEFAULT_ANCHORS: SceneAnchorsConfig = {
  lights: [
    {
      id: 'headlight-1',
      type: 'headlight',
      x: 0.325,
      y: 0.598,
      intensity: 100,
      colorTempKelvin: 4200,
      coneAngle: 45,
      flicker: 'vintage',
      flickerRate: 18,
    },
  ],
  horizonY: 0.52,
  groundPlaneY: 0.68,
  puddleZone: { x: 0.05, y: 0.65, width: 0.9, height: 0.35 },
  foliageZone: { x: 0.0, y: 0.0, width: 0.55, height: 0.45 },
};

export const DEFAULT_VFX_CONFIG: VFXConfig = {
  rainIntensity: 45,
  windSpeed: 10,
  rainAngle: 12,
  lensDroplets: 15,
  puddleRipples: true,
  wetness: 70,

  snow: 0,
  fogDensity: 20,
  leavesPetals: 20,
  leavesType: 'leaves',
  fireflies: 0,
  embers: 0,
  dustMotes: 5,
  godRays: 0,
  shootingStars: 0.5,
  aurora: 0,
  stars: 40,

  moonPhase: 0.9,
  moonGlow: true,
  cloudCoverage: 50,
  cloudSpeed: 0.8,
  driftingClouds: true,

  lightningEnabled: false,
  lightningFrequency: 0.5,
  lightningDistanceKm: 9.0,
  photosensitiveSafeMode: false,

  cameraMotion: 'subtle-breathe',
  cameraSpeed: 1.0,
  shakeIntensity: 0,
  depthParallax: 30,
  colorFilter: 'midnight-lofi',
  exposureEV: -0.3,
  saturation: 85,
  bloom: 30,
  grainIntensity: 25,
  vignette: 40,
  scanlines: 0,
  letterbox239: false,

  autoCropPhoneBezel: true,
};

export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  isPlaying: false,
  isMuted: false,
  masterVolumeDb: -6,

  bpm: 74,
  musicalKey: 'F minor',
  chordProgression: 'ii-V-I',
  voicing: '9th',
  swing: 58,
  vinylCrackle: 35,
  tapeWowFlutter: 20,
  muffleLpHz: 8000,
  reverbMix: 30,
  lofiMusicVolumeDb: -12,

  rainVolumeDb: -14,
  thunderVolumeDb: -16,
  engineVolumeDb: -22,
  windVolumeDb: -22,
  extraAmbience: 'none',
  extraAmbienceVolumeDb: -60,

  spatialAudio: false,
  limiterEnabled: true,
};

/**
 * 12 Built-in Presets Grounded in Oct 2026 Specification Table
 */
export const PRESET_MOODS: PresetMood[] = [
  {
    id: 'midnight-solitude',
    name: 'Midnight Solitude',
    code: 'MS',
    subtitle: 'F minor · 74 BPM · Gentle night rain, moon glow, soft lo-fi keys',
    iconName: 'Moon',
    vfx: {
      rainIntensity: 45,
      windSpeed: 10,
      lensDroplets: 15,
      puddleRipples: true,
      wetness: 70,
      snow: 0,
      fogDensity: 20,
      leavesPetals: 20,
      leavesType: 'leaves',
      fireflies: 0,
      embers: 0,
      dustMotes: 5,
      godRays: 0,
      shootingStars: 0.5,
      aurora: 0,
      stars: 40,
      moonPhase: 0.9,
      cloudCoverage: 50,
      lightningEnabled: false,
      colorFilter: 'midnight-lofi',
      exposureEV: -0.3,
      saturation: 85,
      bloom: 30,
      grainIntensity: 25,
      vignette: 40,
      scanlines: 0,
      letterbox239: false,
    },
    audio: {
      bpm: 74,
      musicalKey: 'F minor',
      chordProgression: 'ii-V-I',
      voicing: '9th',
      swing: 58,
      vinylCrackle: 35,
      tapeWowFlutter: 20,
      muffleLpHz: 8000,
      reverbMix: 30,
      rainVolumeDb: -14,
      thunderVolumeDb: -16,
      engineVolumeDb: -22,
      windVolumeDb: -22,
      extraAmbience: 'none',
    },
  },
  {
    id: 'thunderstorm-downpour',
    name: 'Thunder & Downpour',
    code: 'TD',
    subtitle: 'D minor · 82 BPM · Heavy storm, lightning strikes, distant boom',
    iconName: 'CloudLightning',
    vfx: {
      rainIntensity: 95,
      windSpeed: 45,
      lensDroplets: 50,
      puddleRipples: true,
      wetness: 100,
      fogDensity: 30,
      leavesPetals: 35,
      leavesType: 'leaves',
      dustMotes: 0,
      moonPhase: 0.6,
      cloudCoverage: 95,
      lightningEnabled: true,
      lightningFrequency: 6.0,
      lightningDistanceKm: 2.5,
      colorFilter: 'film-noir',
      exposureEV: -0.6,
      saturation: 60,
      bloom: 25,
      grainIntensity: 30,
      vignette: 50,
      scanlines: 0,
      letterbox239: true,
      shakeIntensity: 4,
    },
    audio: {
      bpm: 82,
      musicalKey: 'D minor',
      chordProgression: 'i-VI-III-VII',
      voicing: '7th',
      swing: 50,
      vinylCrackle: 20,
      tapeWowFlutter: 15,
      muffleLpHz: 6500,
      reverbMix: 35,
      rainVolumeDb: -6,
      thunderVolumeDb: -4,
      engineVolumeDb: -28,
      windVolumeDb: -12,
      extraAmbience: 'rain-on-roof',
      extraAmbienceVolumeDb: -14,
    },
  },
  {
    id: 'golden-hour-memory',
    name: 'Golden Hour Memory',
    code: 'GH',
    subtitle: 'A♭ major · 80 BPM · Amber sunbeams, gentle breeze, acoustic warmth',
    iconName: 'Sun',
    vfx: {
      rainIntensity: 0,
      windSpeed: 5,
      lensDroplets: 0,
      puddleRipples: false,
      wetness: 10,
      fogDensity: 10,
      leavesPetals: 25,
      leavesType: 'leaves',
      dustMotes: 45,
      godRays: 60,
      moonPhase: 0.3,
      cloudCoverage: 30,
      lightningEnabled: false,
      colorFilter: 'golden-hour',
      exposureEV: +0.2,
      saturation: 115,
      bloom: 45,
      grainIntensity: 15,
      vignette: 25,
      scanlines: 0,
    },
    audio: {
      bpm: 80,
      musicalKey: 'A♭ major',
      chordProgression: 'I-vi-IV-V',
      voicing: '9th',
      swing: 55,
      vinylCrackle: 30,
      tapeWowFlutter: 20,
      muffleLpHz: 11000,
      reverbMix: 20,
      rainVolumeDb: -60,
      thunderVolumeDb: -60,
      engineVolumeDb: -30,
      windVolumeDb: -24,
      extraAmbience: 'cafe-murmur',
      extraAmbienceVolumeDb: -20,
    },
  },
  {
    id: 'neon-alley-rain',
    name: 'Neon Alley Rain',
    code: 'NA',
    subtitle: 'C♯ dorian · 88 BPM · Cyberpunk neon glow, wet reflections, synth pulse',
    iconName: 'Zap',
    vfx: {
      rainIntensity: 70,
      windSpeed: 20,
      lensDroplets: 35,
      puddleRipples: true,
      wetness: 90,
      fogDensity: 25,
      leavesPetals: 0,
      dustMotes: 10,
      cloudCoverage: 70,
      lightningEnabled: true,
      lightningFrequency: 1.0,
      lightningDistanceKm: 7.0,
      colorFilter: 'neon-night',
      exposureEV: -0.2,
      saturation: 135,
      bloom: 65,
      grainIntensity: 15,
      vignette: 30,
      scanlines: 10,
    },
    audio: {
      bpm: 88,
      musicalKey: 'C♯ dorian',
      chordProgression: 'iii-vi-ii-V',
      voicing: '11th',
      swing: 62,
      vinylCrackle: 25,
      tapeWowFlutter: 15,
      muffleLpHz: 10000,
      reverbMix: 30,
      rainVolumeDb: -10,
      thunderVolumeDb: -14,
      engineVolumeDb: -20,
      windVolumeDb: -24,
      extraAmbience: 'city-night',
      extraAmbienceVolumeDb: -18,
    },
  },
  {
    id: 'magnetic-tape-95',
    name: 'Magnetic Tape \'95',
    code: 'MT',
    subtitle: 'E♭ major · 76 BPM · Retro VHS scanlines, analog wow & flutter, tape hiss',
    iconName: 'Tv',
    vfx: {
      rainIntensity: 40,
      windSpeed: 10,
      lensDroplets: 10,
      puddleRipples: true,
      wetness: 60,
      fogDensity: 15,
      leavesPetals: 15,
      leavesType: 'leaves',
      dustMotes: 20,
      cloudCoverage: 45,
      lightningEnabled: false,
      colorFilter: 'retro-tape',
      exposureEV: 0,
      saturation: 90,
      bloom: 25,
      grainIntensity: 45,
      vignette: 45,
      scanlines: 70,
    },
    audio: {
      bpm: 76,
      musicalKey: 'E♭ major',
      chordProgression: 'ii-V-I',
      voicing: '7th',
      swing: 54,
      vinylCrackle: 60,
      tapeWowFlutter: 55,
      muffleLpHz: 5500,
      reverbMix: 20,
      rainVolumeDb: -16,
      thunderVolumeDb: -18,
      engineVolumeDb: -24,
      windVolumeDb: -22,
      extraAmbience: 'rain-on-window',
      extraAmbienceVolumeDb: -18,
    },
  },
  {
    id: 'sakura-dusk-drift',
    name: 'Sakura Dusk Drift',
    code: 'SD',
    subtitle: 'G major · 72 BPM · Pink cherry blossom petals swirling in the twilight breeze',
    iconName: 'Flower2',
    vfx: {
      rainIntensity: 0,
      windSpeed: 25,
      lensDroplets: 0,
      puddleRipples: false,
      wetness: 20,
      fogDensity: 10,
      leavesPetals: 70,
      leavesType: 'sakura',
      dustMotes: 25,
      godRays: 35,
      stars: 15,
      moonPhase: 0.7,
      cloudCoverage: 25,
      lightningEnabled: false,
      colorFilter: 'golden-hour',
      exposureEV: +0.1,
      saturation: 110,
      bloom: 40,
      grainIntensity: 15,
      vignette: 25,
    },
    audio: {
      bpm: 72,
      musicalKey: 'G major',
      chordProgression: 'I-vi-IV-V',
      voicing: '9th',
      swing: 52,
      vinylCrackle: 25,
      tapeWowFlutter: 20,
      muffleLpHz: 10000,
      reverbMix: 30,
      rainVolumeDb: -60,
      thunderVolumeDb: -60,
      engineVolumeDb: -60,
      windVolumeDb: -16,
      extraAmbience: 'wind-chimes',
      extraAmbienceVolumeDb: -16,
    },
  },
  {
    id: 'first-snow-platform',
    name: 'First Snow Platform',
    code: 'FS',
    subtitle: 'D major · 70 BPM · Quiet snowfall, winter mist, distant train rhythm',
    iconName: 'Snowflake',
    vfx: {
      rainIntensity: 0,
      windSpeed: 15,
      lensDroplets: 5,
      puddleRipples: false,
      wetness: 40,
      snow: 55,
      fogDensity: 25,
      leavesPetals: 0,
      dustMotes: 0,
      stars: 10,
      moonPhase: 0.95,
      cloudCoverage: 80,
      lightningEnabled: false,
      colorFilter: 'midnight-lofi',
      exposureEV: +0.3,
      saturation: 80,
      bloom: 35,
      grainIntensity: 20,
      vignette: 30,
    },
    audio: {
      bpm: 70,
      musicalKey: 'D major',
      chordProgression: 'vi-IV-I-V',
      voicing: '9th',
      swing: 50,
      vinylCrackle: 30,
      tapeWowFlutter: 15,
      muffleLpHz: 9000,
      reverbMix: 40,
      rainVolumeDb: -60,
      thunderVolumeDb: -60,
      engineVolumeDb: -26,
      windVolumeDb: -14,
      extraAmbience: 'distant-train',
      extraAmbienceVolumeDb: -16,
    },
  },
  {
    id: 'firefly-summer-field',
    name: 'Firefly Summer Field',
    code: 'FF',
    subtitle: 'C lydian · 68 BPM · Bioluminescent fireflies rising above the grass',
    iconName: 'Sparkles',
    vfx: {
      rainIntensity: 0,
      windSpeed: 5,
      lensDroplets: 0,
      puddleRipples: false,
      wetness: 0,
      fogDensity: 10,
      leavesPetals: 10,
      leavesType: 'leaves',
      fireflies: 75,
      stars: 60,
      shootingStars: 1.0,
      moonPhase: 1.0,
      cloudCoverage: 10,
      lightningEnabled: false,
      colorFilter: 'golden-hour',
      exposureEV: -0.2,
      saturation: 105,
      bloom: 55,
      grainIntensity: 20,
      vignette: 35,
    },
    audio: {
      bpm: 68,
      musicalKey: 'C lydian',
      chordProgression: 'I-vi-IV-V',
      voicing: '11th',
      swing: 56,
      vinylCrackle: 20,
      tapeWowFlutter: 15,
      muffleLpHz: 9500,
      reverbMix: 25,
      rainVolumeDb: -60,
      thunderVolumeDb: -60,
      engineVolumeDb: -60,
      windVolumeDb: -26,
      extraAmbience: 'crickets',
      extraAmbienceVolumeDb: -16,
    },
  },
  {
    id: 'misty-dawn-pass',
    name: 'Misty Dawn Pass',
    code: 'MD',
    subtitle: 'B♭ major · 66 BPM · Deep morning fog, sunbeams, 2.39:1 widescreen',
    iconName: 'CloudFog',
    vfx: {
      rainIntensity: 10,
      windSpeed: 8,
      lensDroplets: 10,
      puddleRipples: false,
      wetness: 50,
      fogDensity: 70,
      leavesPetals: 15,
      leavesType: 'leaves',
      dustMotes: 20,
      godRays: 55,
      moonPhase: 0.2,
      cloudCoverage: 60,
      lightningEnabled: false,
      colorFilter: 'midnight-lofi',
      exposureEV: +0.2,
      saturation: 75,
      bloom: 30,
      grainIntensity: 15,
      vignette: 20,
      letterbox239: true,
    },
    audio: {
      bpm: 66,
      musicalKey: 'B♭ major',
      chordProgression: 'ii-V-I',
      voicing: '9th',
      swing: 48,
      vinylCrackle: 15,
      tapeWowFlutter: 10,
      muffleLpHz: 12000,
      reverbMix: 45,
      rainVolumeDb: -24,
      thunderVolumeDb: -60,
      engineVolumeDb: -60,
      windVolumeDb: -18,
      extraAmbience: 'none',
    },
  },
  {
    id: 'aurora-overpass',
    name: 'Aurora Overpass',
    code: 'AO',
    subtitle: 'E minor · 75 BPM · Luminous northern lights curtains across night sky',
    iconName: 'Compass',
    vfx: {
      rainIntensity: 0,
      windSpeed: 10,
      lensDroplets: 0,
      puddleRipples: false,
      wetness: 30,
      snow: 15,
      fogDensity: 15,
      aurora: 80,
      stars: 70,
      shootingStars: 2.0,
      moonPhase: 0.4,
      cloudCoverage: 15,
      lightningEnabled: false,
      colorFilter: 'neon-night',
      exposureEV: -0.1,
      saturation: 120,
      bloom: 50,
      grainIntensity: 10,
      vignette: 30,
    },
    audio: {
      bpm: 75,
      musicalKey: 'E minor',
      chordProgression: 'i-VI-III-VII',
      voicing: '11th',
      swing: 52,
      vinylCrackle: 20,
      tapeWowFlutter: 15,
      muffleLpHz: 11000,
      reverbMix: 50,
      rainVolumeDb: -60,
      thunderVolumeDb: -60,
      engineVolumeDb: -30,
      windVolumeDb: -16,
      extraAmbience: 'wind-chimes',
      extraAmbienceVolumeDb: -18,
    },
  },
  {
    id: 'rooftop-starfall',
    name: 'Rooftop Starfall',
    code: 'RS',
    subtitle: 'A minor · 70 BPM · Crystal clear night sky, meteor showers, city ambience',
    iconName: 'Star',
    vfx: {
      rainIntensity: 0,
      windSpeed: 12,
      wetness: 20,
      fogDensity: 5,
      dustMotes: 5,
      stars: 90,
      shootingStars: 6.0,
      moonPhase: 0.15,
      cloudCoverage: 5,
      lightningEnabled: false,
      colorFilter: 'midnight-lofi',
      exposureEV: -0.4,
      saturation: 90,
      bloom: 40,
      grainIntensity: 20,
      vignette: 45,
    },
    audio: {
      bpm: 70,
      musicalKey: 'A minor',
      chordProgression: 'vi-IV-I-V',
      voicing: '9th',
      swing: 55,
      vinylCrackle: 30,
      tapeWowFlutter: 20,
      muffleLpHz: 8500,
      reverbMix: 35,
      rainVolumeDb: -60,
      thunderVolumeDb: -60,
      engineVolumeDb: -60,
      windVolumeDb: -20,
      extraAmbience: 'city-night',
      extraAmbienceVolumeDb: -16,
    },
  },
  {
    id: 'ember-festival-night',
    name: 'Ember Festival Night',
    code: 'EF',
    subtitle: 'D mixolydian · 84 BPM · Warm bonfire embers floating into the dusk',
    iconName: 'Flame',
    vfx: {
      rainIntensity: 0,
      windSpeed: 18,
      wetness: 10,
      fogDensity: 20,
      embers: 65,
      dustMotes: 30,
      godRays: 15,
      stars: 20,
      moonPhase: 0.75,
      cloudCoverage: 30,
      lightningEnabled: false,
      colorFilter: 'golden-hour',
      exposureEV: -0.1,
      saturation: 120,
      bloom: 55,
      grainIntensity: 25,
      vignette: 35,
    },
    audio: {
      bpm: 84,
      musicalKey: 'D mixolydian',
      chordProgression: 'I-vi-IV-V',
      voicing: '7th',
      swing: 60,
      vinylCrackle: 25,
      tapeWowFlutter: 15,
      muffleLpHz: 10000,
      reverbMix: 25,
      rainVolumeDb: -60,
      thunderVolumeDb: -60,
      engineVolumeDb: -60,
      windVolumeDb: -24,
      extraAmbience: 'cafe-murmur',
      extraAmbienceVolumeDb: -18,
    },
  },
];

/**
 * WCAG 2.3.1 Flash Guard:
 * Tracks flash timestamps over a rolling 1000ms window.
 * Never allows more than 3 flashes in 1000ms.
 * In Photosensitive Safe Mode, limits to 1 flash per 2000ms.
 */
export class FlashGuard {
  private flashTimestamps: number[] = [];

  public canFlash(currentTimeSec: number, safeMode: boolean): boolean {
    const windowStart = currentTimeSec - 1.0;
    this.flashTimestamps = this.flashTimestamps.filter((t) => t >= windowStart);

    if (safeMode) {
      const last = this.flashTimestamps[this.flashTimestamps.length - 1];
      if (last !== undefined && currentTimeSec - last < 2.0) {
        return false;
      }
    }

    if (this.flashTimestamps.length >= 3) {
      return false; // Violates WCAG 2.3.1
    }

    this.flashTimestamps.push(currentTimeSec);
    return true;
  }

  public reset() {
    this.flashTimestamps = [];
  }
}

/**
 * Calculates physical flash-to-bang thunder delay based on distance (km)
 * Speed of sound in dry air @ 20°C ≈ 0.343 km/s (~343 m/s)
 */
export function calculateThunderDelaySec(distanceKm: number): number {
  const SPEED_OF_SOUND_KM_PER_S = 0.343;
  return Math.max(0.2, distanceKm / SPEED_OF_SOUND_KM_PER_S);
}

/**
 * Converts Kelvin color temperature (1800K to 12000K) to normalized RGB [r, g, b]
 * based on Tanner Helland's algorithm
 */
export function kelvinToRgb(kelvin: number): [number, number, number] {
  const temp = Math.max(1800, Math.min(12000, kelvin)) / 100;
  let r = 0, g = 0, b = 0;

  // Red
  if (temp <= 66) {
    r = 255;
  } else {
    r = temp - 60;
    r = 329.698727446 * Math.pow(r, -0.1332047592);
    r = Math.max(0, Math.min(255, r));
  }

  // Green
  if (temp <= 66) {
    g = temp;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
  } else {
    g = temp - 60;
    g = 288.1221695283 * Math.pow(g, -0.0755148492);
  }
  g = Math.max(0, Math.min(255, g));

  // Blue
  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = temp - 10;
    b = 138.5177312231 * Math.log(b) - 305.0447927307;
    b = Math.max(0, Math.min(255, b));
  }

  return [r / 255, g / 255, b / 255];
}

/**
 * Decibels to linear gain conversion
 */
export function dbToGain(db: number): number {
  if (db <= -58) return 0;
  return Math.pow(10, db / 20);
}

export function updateRaindrop(
  x: number,
  y: number,
  speed: number,
  wind: number,
  width: number,
  height: number
): { x: number; y: number; hitGround: boolean } {
  const nextX = x + wind * 0.25;
  const nextY = y + speed;

  if (nextY > height) {
    return {
      x: (nextX + width) % width,
      y: -10,
      hitGround: true,
    };
  }

  return {
    x: (nextX + width) % width,
    y: nextY,
    hitGround: false,
  };
}

export function updateRipple(
  radius: number,
  maxRadius: number,
  expansionSpeed: number
): { radius: number; alpha: number; isAlive: boolean } {
  const nextRadius = radius + expansionSpeed;
  if (nextRadius >= maxRadius) {
    return { radius: maxRadius, alpha: 0, isAlive: false };
  }
  const progress = nextRadius / maxRadius;
  const alpha = Math.max(0, 1 - progress);
  return { radius: nextRadius, alpha, isAlive: true };
}

export function calculateCameraTransform(
  timeSeconds: number,
  motion: string,
  speedMultiplier: number,
  shakePx = 0
): { scale: number; translateX: number; translateY: number; rotateDeg: number } {
  const t = timeSeconds * speedMultiplier;
  let shakeX = 0;
  let shakeY = 0;
  if (shakePx > 0) {
    shakeX = (Math.sin(t * 14.3) + Math.cos(t * 22.1)) * 0.5 * shakePx;
    shakeY = (Math.cos(t * 16.7) + Math.sin(t * 29.4)) * 0.5 * shakePx;
  }

  switch (motion) {
    case 'subtle-breathe':
      return {
        scale: 1.03 + Math.sin(t * 0.4) * 0.02,
        translateX: Math.sin(t * 0.3) * 6 + shakeX,
        translateY: Math.cos(t * 0.25) * 4 + shakeY,
        rotateDeg: Math.sin(t * 0.2) * 0.25,
      };
    case 'slow-zoom':
      return {
        scale: 1.0 + (Math.sin(t * 0.15) * 0.5 + 0.5) * 0.08,
        translateX: Math.sin(t * 0.1) * 4 + shakeX,
        translateY: -Math.abs(Math.sin(t * 0.15)) * 8 + shakeY,
        rotateDeg: 0,
      };
    case 'pan-horizontal':
      return {
        scale: 1.05,
        translateX: Math.sin(t * 0.2) * 15 + shakeX,
        translateY: Math.cos(t * 0.15) * 3 + shakeY,
        rotateDeg: 0,
      };
    case 'pan-vertical':
      return {
        scale: 1.05,
        translateX: Math.sin(t * 0.15) * 4 + shakeX,
        translateY: Math.sin(t * 0.2) * 14 + shakeY,
        rotateDeg: 0,
      };
    case 'handheld-shake':
      return {
        scale: 1.04,
        translateX: (Math.sin(t * 2.1) * 8 + Math.cos(t * 5.3) * 4) + shakeX,
        translateY: (Math.cos(t * 1.9) * 6 + Math.sin(t * 4.7) * 3) + shakeY,
        rotateDeg: Math.sin(t * 1.4) * 0.4,
      };
    case 'orbit':
      return {
        scale: 1.06,
        translateX: Math.cos(t * 0.25) * 12 + shakeX,
        translateY: Math.sin(t * 0.25) * 6 + shakeY,
        rotateDeg: Math.sin(t * 0.25) * 0.5,
      };
    case 'dolly-in':
      return {
        scale: 1.0 + ((t * 0.04) % 0.15),
        translateX: shakeX,
        translateY: shakeY,
        rotateDeg: 0,
      };
    case 'static':
    default:
      return {
        scale: 1.0,
        translateX: shakeX,
        translateY: shakeY,
        rotateDeg: 0,
      };
  }
}

export function calculateImageCropBounds(
  imgWidth: number,
  imgHeight: number,
  autoCrop: boolean
): { sx: number; sy: number; sWidth: number; sHeight: number } {
  if (!autoCrop) {
    return { sx: 0, sy: 0, sWidth: imgWidth, sHeight: imgHeight };
  }

  // Top status bar ~5.2%, bottom android bar ~6.5%
  const topCropRatio = 0.052;
  const bottomCropRatio = 0.065;

  const sy = imgHeight * topCropRatio;
  const sHeight = imgHeight * (1 - topCropRatio - bottomCropRatio);
  const sx = 0;
  const sWidth = imgWidth;

  return { sx, sy, sWidth, sHeight };
}

export function getPresetMoodById(id: string): PresetMood {
  const found = PRESET_MOODS.find((p) => p.id === id);
  return found || PRESET_MOODS[0];
}

/**
 * Draws procedural anime night fallback scene so canvas is never blank
 */
export function drawProceduralFallbackScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number
) {
  // 1. Twilight sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
  skyGrad.addColorStop(0, '#0a141d');
  skyGrad.addColorStop(0.5, '#122326');
  skyGrad.addColorStop(1, '#1b322a');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h * 0.65);

  // 2. Distant rolling anime hills
  ctx.fillStyle = '#0d1d18';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.55);
  ctx.bezierCurveTo(w * 0.3, h * 0.50, w * 0.7, h * 0.58, w, h * 0.52);
  ctx.lineTo(w, h * 0.68);
  ctx.lineTo(0, h * 0.68);
  ctx.closePath();
  ctx.fill();

  // 3. Wet grassy field & road
  const groundGrad = ctx.createLinearGradient(0, h * 0.52, 0, h);
  groundGrad.addColorStop(0, '#1c3629');
  groundGrad.addColorStop(0.3, '#14271e');
  groundGrad.addColorStop(1, '#0b1611');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, h * 0.52, w, h * 0.48);

  // 4. Moon disc & glow
  const moonX = w * 0.62;
  const moonY = h * 0.18;
  const moonGlow = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 120);
  moonGlow.addColorStop(0, 'rgba(235, 245, 255, 0.4)');
  moonGlow.addColorStop(0.5, 'rgba(180, 220, 255, 0.12)');
  moonGlow.addColorStop(1, 'rgba(180, 220, 255, 0)');
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, 120, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#eef6fc';
  ctx.beginPath();
  ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
  ctx.fill();

  // 5. Stylized silhouette of tree on the left
  ctx.fillStyle = '#07100b';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(w * 0.18, h);
  ctx.bezierCurveTo(w * 0.16, h * 0.65, w * 0.12, h * 0.35, 0, h * 0.22);
  ctx.closePath();
  ctx.fill();

  // Overhanging branch
  ctx.beginPath();
  ctx.moveTo(0, h * 0.24);
  ctx.bezierCurveTo(w * 0.25, h * 0.18, w * 0.45, h * 0.28, w * 0.6, h * 0.32);
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#07100b';
  ctx.stroke();
}
