export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5' | '3:4' | '2:3' | '2.39:1' | '21:9';

export type ColorFilter =
  | 'none'
  | 'midnight-lofi'
  | 'golden-hour'
  | 'neon-night'
  | 'film-noir'
  | 'retro-tape'
  | 'emerald-rain';

export type CameraMotion =
  | 'subtle-breathe'
  | 'slow-zoom'
  | 'pan-horizontal'
  | 'pan-vertical'
  | 'handheld-shake'
  | 'orbit'
  | 'dolly-in'
  | 'static';

export type LightFlickerType = 'none' | 'vintage' | 'candle' | 'neon';

export interface SceneAnchor {
  id: string;
  type: 'headlight' | 'point' | 'spot';
  x: number; // 0 to 1
  y: number; // 0 to 1
  intensity: number; // 0 to 200%
  colorTempKelvin: number; // 1800 to 12000 K
  coneAngle: number; // 5 to 90 deg
  flicker: LightFlickerType;
  flickerRate: number; // 0 to 30
}

export interface SceneAnchorsConfig {
  lights: SceneAnchor[];
  horizonY: number; // 0 to 1
  groundPlaneY: number; // 0 to 1
  puddleZone: { x: number; y: number; width: number; height: number };
  foliageZone: { x: number; y: number; width: number; height: number };
}

export interface VFXConfig {
  // Rain & Water
  rainIntensity: number; // 0 to 100%
  windSpeed: number; // -100 to 100
  rainAngle: number; // degrees
  lensDroplets: number; // 0 to 100%
  puddleRipples: boolean;
  wetness: number; // 0 to 100%
  
  // Extra Weather & Particles
  snow: number; // 0 to 100%
  fogDensity: number; // 0 to 100%
  leavesPetals: number; // 0 to 100%
  leavesType: 'leaves' | 'sakura';
  fireflies: number; // 0 to 100%
  embers: number; // 0 to 100%
  dustMotes: number; // 0 to 100%
  godRays: number; // 0 to 100%
  shootingStars: number; // 0 to 10/min
  aurora: number; // 0 to 100%
  stars: number; // 0 to 100%

  // Sky & Moon
  moonPhase: number; // 0 to 1
  moonGlow: boolean;
  cloudCoverage: number; // 0 to 100%
  cloudSpeed: number; // 0.1 to 3
  driftingClouds: boolean;

  // Lightning & Flash Guard (WCAG 2.3.1)
  lightningEnabled: boolean;
  lightningFrequency: number; // 0 to 12/min
  lightningDistanceKm: number; // 0.5 to 15 km
  photosensitiveSafeMode: boolean; // Caps flashes < 1 per 2s and clamps luminance delta

  // Camera & Post
  cameraMotion: CameraMotion;
  cameraSpeed: number;
  shakeIntensity: number; // 0 to 20 px
  depthParallax: number; // 0 to 100%
  colorFilter: ColorFilter;
  exposureEV: number; // -3 to +3
  saturation: number; // 0 to 200%
  bloom: number; // 0 to 100%
  grainIntensity: number; // 0 to 100%
  vignette: number; // 0 to 100%
  scanlines: number; // 0 to 100%
  letterbox239: boolean; // 2.39:1 cinematic anamorphic bars

  // Cropping & Frame
  autoCropPhoneBezel: boolean;
}

export type ExtraAmbienceType =
  | 'none'
  | 'rain-on-roof'
  | 'rain-on-window'
  | 'city-night'
  | 'cafe-murmur'
  | 'crickets'
  | 'distant-train'
  | 'wind-chimes';

export interface AudioConfig {
  isPlaying: boolean;
  isMuted: boolean;
  masterVolumeDb: number; // -60 to +6 dB
  
  // Lo-Fi Beats & Theory
  bpm: number; // 60 to 100
  musicalKey: string; // e.g. "F minor", "D minor", "Ab major"
  chordProgression: string; // "ii-V-I", "i-VI-III-VII", "I-vi-IV-V", "iii-vi-ii-V"
  voicing: '7th' | '9th' | '11th';
  swing: number; // 0 to 75%
  vinylCrackle: number; // 0 to 100%
  tapeWowFlutter: number; // 0 to 100%
  muffleLpHz: number; // 400 to 20000 Hz
  reverbMix: number; // 0 to 100%
  lofiMusicVolumeDb: number; // -60 to +6 dB

  // Ambience tracks (in dB)
  rainVolumeDb: number; // -60 to +6 dB
  thunderVolumeDb: number; // -60 to +6 dB
  engineVolumeDb: number; // -60 to +6 dB
  windVolumeDb: number; // -60 to +6 dB
  extraAmbience: ExtraAmbienceType;
  extraAmbienceVolumeDb: number; // -60 to +6 dB

  // Settings
  spatialAudio: boolean;
  limiterEnabled: boolean;
}

export interface PresetMood {
  id: string;
  name: string;
  code: string;
  subtitle: string;
  iconName: string;
  vfx: Partial<VFXConfig>;
  audio: Partial<AudioConfig>;
}

export interface ReelMetadata {
  creatorName: string;
  verified: boolean;
  audioTrack: string;
  caption: string;
  likes: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
}

export interface AppSettings {
  // Performance
  renderer: 'auto' | 'webgl2' | 'canvas2d';
  renderScale: number; // 0.5 to 1.0
  dprCap: number; // 1 to 3
  maxFps: 30 | 60 | 120;
  particleCap: number; // 1000 to 50000
  adaptiveQuality: boolean;
  perfOverlay: boolean;

  // Audio
  startMuted: boolean;
  masterVolumeDb: number;
  spatialAudio: boolean;

  // Export
  exportResolution: '720p' | '1080p' | '1440p' | '2160p';
  exportFps: 24 | 30 | 60;
  exportDuration: number; // 5, 10, 15, 30, 60, etc
  seamlessLoop: boolean;
  bakeOverlay: boolean;
  includeAudio: boolean;
  filenameTemplate: string;

  // Accessibility
  reducedMotion: boolean;
  photosensitiveSafeMode: boolean;
  audioCaptions: boolean;
}
