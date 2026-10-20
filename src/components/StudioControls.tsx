import { useState, useRef } from 'react';
import {
  Sliders,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Upload,
  RotateCcw,
  Sparkles,
  Camera,
  Layers,
  Music,
  CloudRain,
  Eye,
  EyeOff,
  Video,
  Settings,
  Lightbulb,
  Compass,
} from 'lucide-react';
import type {
  VFXConfig,
  AudioConfig,
  AspectRatio,
  PresetMood,
  ReelMetadata,
  ColorFilter,
  CameraMotion,
  ExtraAmbienceType,
} from '../types/video.ts';
import { PRESET_MOODS } from '../utils/vfxEngine.ts';

interface StudioControlsProps {
  vfx: VFXConfig;
  onUpdateVFX: (vfx: Partial<VFXConfig>) => void;
  audio: AudioConfig;
  onUpdateAudio: (audio: Partial<AudioConfig>) => void;
  aspectRatio: AspectRatio;
  onChangeAspectRatio: (ratio: AspectRatio) => void;
  isCleanView: boolean;
  onToggleCleanView: () => void;
  onSelectPreset: (preset: PresetMood) => void;
  activePresetId: string;
  metadata: ReelMetadata;
  onUpdateMetadata: (meta: Partial<ReelMetadata>) => void;
  onUploadCustomImage: (dataUrl: string) => void;
  onResetToDefaultImage: () => void;
  isDefaultImage: boolean;
  onOpenRecorder: () => void;
  onOpenPromptModal: () => void;
  onOpenAnchorsEditor: () => void;
  onOpenSettings: () => void;
}

export function StudioControls({
  vfx,
  onUpdateVFX,
  audio,
  onUpdateAudio,
  aspectRatio,
  onChangeAspectRatio,
  isCleanView,
  onToggleCleanView,
  onSelectPreset,
  activePresetId,
  metadata,
  onUpdateMetadata,
  onUploadCustomImage,
  onResetToDefaultImage,
  isDefaultImage,
  onOpenRecorder,
  onOpenPromptModal,
  onOpenAnchorsEditor,
  onOpenSettings,
}: StudioControlsProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'vfx' | 'audio' | 'meta'>('presets');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onUploadCustomImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const ASPECT_RATIOS: AspectRatio[] = [
    '9:16',
    '16:9',
    '1:1',
    '4:5',
    '3:4',
    '2:3',
    '2.39:1',
  ];

  return (
    <div className="w-full bg-slate-900/95 border-t border-slate-800/80 backdrop-blur-xl text-slate-200 shadow-2xl flex flex-col z-30">
      {/* Top Quick Bar: Presets + Key Actions */}
      <div className="px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        {/* Play/Pause & Sound Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateAudio({ isPlaying: !audio.isPlaying })}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition shadow-md ${
              audio.isPlaying
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {audio.isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{audio.isPlaying ? 'Playing' : 'Play Live'}</span>
          </button>

          <button
            onClick={() => onUpdateAudio({ isMuted: !audio.isMuted })}
            className={`p-2 rounded-xl border text-xs transition ${
              audio.isMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title={audio.isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={audio.isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {audio.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio}
              onClick={() => onChangeAspectRatio(ratio)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition shrink-0 ${
                aspectRatio === ratio
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>

        {/* Quick Tools & Record Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAnchorsEditor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition"
            title="Edit scene anchors (light source, horizon, puddle zone, foliage)"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Anchors</span>
          </button>

          <button
            onClick={onOpenPromptModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold transition"
            title="View & copy AI generation prompts"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">AI Prompts</span>
          </button>

          <button
            onClick={onToggleCleanView}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
              isCleanView
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Toggle between Social Reel UI and Clean Cinematic Video"
          >
            {isCleanView ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isCleanView ? 'Clean Cut' : 'Reel UI'}</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Application Settings"
            aria-label="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenRecorder}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:brightness-110 text-white font-bold text-xs transition shadow-md shadow-rose-600/30"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Record Video</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="px-4 border-b border-slate-800 flex items-center gap-4 text-xs font-semibold text-slate-400">
        <button
          onClick={() => setActiveTab('presets')}
          className={`py-2 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'presets'
              ? 'border-emerald-400 text-emerald-400 font-bold'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>12 Atmospheric Presets</span>
        </button>

        <button
          onClick={() => setActiveTab('vfx')}
          className={`py-2 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'vfx'
              ? 'border-emerald-400 text-emerald-400 font-bold'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>VFX & Weather Stack</span>
        </button>

        <button
          onClick={() => setActiveTab('audio')}
          className={`py-2 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'audio'
              ? 'border-emerald-400 text-emerald-400 font-bold'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Lo-Fi Composer & Mix</span>
        </button>

        <button
          onClick={() => setActiveTab('meta')}
          className={`py-2 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'meta'
              ? 'border-emerald-400 text-emerald-400 font-bold'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Reel Details</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-4 overflow-x-auto max-h-56 overflow-y-auto">
        {/* PRESETS TAB (12 Presets) */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select from 12 Grounded Atmospheric Presets
              </span>
              {!isDefaultImage && (
                <button
                  onClick={onResetToDefaultImage}
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore Motorcycle Image</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {PRESET_MOODS.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate pr-1">
                        {preset.name}
                      </span>
                      <span className="text-[9px] font-mono px-1 rounded bg-slate-800 text-emerald-400 shrink-0">
                        {preset.code}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-1 leading-tight">
                      {preset.subtitle.split('·')[0]} · {preset.subtitle.split('·')[1]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Photo Upload Bar */}
            <div className="pt-2 flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Animate any photo with living weather & lights
                  </div>
                  <div className="text-[10px] text-slate-400">
                    JPG, PNG, WebP supported with intelligent auto-crop and scene anchors
                  </div>
                </div>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VFX & WEATHER STACK TAB */}
        {activeTab === 'vfx' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {/* Precipitation & Wind */}
            <div className="space-y-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs">
              <div className="flex items-center justify-between font-semibold text-white">
                <span className="flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rain Intensity</span>
                </span>
                <span className="font-mono text-emerald-400">{vfx.rainIntensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={vfx.rainIntensity}
                onChange={(e) => onUpdateVFX({ rainIntensity: Number(e.target.value) })}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-slate-300">
                <span>Snow Particles</span>
                <span className="font-mono text-slate-400">{vfx.snow}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={vfx.snow}
                onChange={(e) => onUpdateVFX({ snow: Number(e.target.value) })}
                className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-slate-300">
                <span>Wind Velocity</span>
                <span className="font-mono text-slate-400">{vfx.windSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={vfx.windSpeed}
                onChange={(e) => onUpdateVFX({ windSpeed: Number(e.target.value) })}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Atmosphere & Sky Particles */}
            <div className="space-y-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Foliage / Sakura</span>
                <span className="font-mono text-slate-400">{vfx.leavesPetals}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={vfx.leavesPetals}
                onChange={(e) => onUpdateVFX({ leavesPetals: Number(e.target.value) })}
                className="w-full accent-pink-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-slate-300">
                <span>Fireflies Glow</span>
                <span className="font-mono text-slate-400">{vfx.fireflies}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={vfx.fireflies}
                onChange={(e) => onUpdateVFX({ fireflies: Number(e.target.value) })}
                className="w-full accent-lime-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />

              <div className="flex items-center justify-between text-slate-300">
                <span>Bonfire Embers</span>
                <span className="font-mono text-slate-400">{vfx.embers}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={vfx.embers}
                onChange={(e) => onUpdateVFX({ embers: Number(e.target.value) })}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Lightning & Flash Guard */}
            <div className="space-y-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs">
              <div className="flex items-center justify-between font-semibold text-white">
                <span>Lightning Strikes</span>
                <button
                  onClick={() => onUpdateVFX({ lightningEnabled: !vfx.lightningEnabled })}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                    vfx.lightningEnabled ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {vfx.lightningEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <span>Strike Distance</span>
                <span className="font-mono text-slate-400">{vfx.lightningDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="15"
                step="0.5"
                disabled={!vfx.lightningEnabled}
                value={vfx.lightningDistanceKm}
                onChange={(e) => onUpdateVFX({ lightningDistanceKm: Number(e.target.value) })}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-30"
              />

              <div className="flex items-center justify-between text-slate-300 pt-1">
                <span>WCAG Safe Mode</span>
                <button
                  onClick={() => onUpdateVFX({ photosensitiveSafeMode: !vfx.photosensitiveSafeMode })}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                    vfx.photosensitiveSafeMode ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {vfx.photosensitiveSafeMode ? 'ACTIVE' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Camera Motion & Cinematic Bars */}
            <div className="space-y-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs">
              <div className="text-xs font-semibold text-white">Camera Movement</div>
              <select
                value={vfx.cameraMotion}
                onChange={(e) => onUpdateVFX({ cameraMotion: e.target.value as CameraMotion })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
              >
                <option value="subtle-breathe">Subtle Breathe</option>
                <option value="slow-zoom">Slow Zoom Push</option>
                <option value="pan-horizontal">Horizontal Pan</option>
                <option value="pan-vertical">Vertical Pan</option>
                <option value="handheld-shake">Handheld Shake</option>
                <option value="orbit">Orbit Drift</option>
                <option value="dolly-in">Dolly In</option>
                <option value="static">Static Locked</option>
              </select>

              <div className="text-xs font-semibold text-white pt-1">Color Grading</div>
              <select
                value={vfx.colorFilter}
                onChange={(e) => onUpdateVFX({ colorFilter: e.target.value as ColorFilter })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
              >
                <option value="midnight-lofi">Midnight Lo-Fi</option>
                <option value="golden-hour">Golden Hour</option>
                <option value="neon-night">Neon Night</option>
                <option value="film-noir">Film Noir</option>
                <option value="retro-tape">Retro Tape '95</option>
                <option value="none">Original Image</option>
              </select>
            </div>
          </div>
        )}

        {/* AUDIO & COMPOSER TAB */}
        {activeTab === 'audio' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between font-semibold text-white">
                <span>Master Volume</span>
                <span className="font-mono text-emerald-400">{audio.masterVolumeDb} dB</span>
              </div>
              <input
                type="range"
                min="-60"
                max="6"
                value={audio.masterVolumeDb}
                onChange={(e) => onUpdateAudio({ masterVolumeDb: Number(e.target.value) })}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between font-semibold text-white">
                <span>Lo-Fi Rhodes Keys</span>
                <span className="font-mono text-emerald-400">{audio.lofiMusicVolumeDb} dB</span>
              </div>
              <input
                type="range"
                min="-60"
                max="6"
                value={audio.lofiMusicVolumeDb}
                onChange={(e) => onUpdateAudio({ lofiMusicVolumeDb: Number(e.target.value) })}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between font-semibold text-white">
                <span>Tempo / BPM</span>
                <span className="font-mono text-emerald-400">{audio.bpm} BPM</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={audio.bpm}
                onChange={(e) => onUpdateAudio({ bpm: Number(e.target.value) })}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2">
              <div className="font-semibold text-white">Extra Ambience Track</div>
              <select
                value={audio.extraAmbience}
                onChange={(e) => onUpdateAudio({ extraAmbience: e.target.value as ExtraAmbienceType })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
              >
                <option value="none">None</option>
                <option value="rain-on-roof">Rain on Roof</option>
                <option value="rain-on-window">Rain on Window</option>
                <option value="city-night">City Night</option>
                <option value="cafe-murmur">Café Murmur</option>
                <option value="crickets">Evening Crickets</option>
                <option value="distant-train">Distant Train</option>
                <option value="wind-chimes">Wind Chimes</option>
              </select>
            </div>
          </div>
        )}

        {/* REEL DETAILS TAB */}
        {activeTab === 'meta' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                Creator Name
              </label>
              <input
                type="text"
                value={metadata.creatorName}
                onChange={(e) => onUpdateMetadata({ creatorName: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                Audio Track Title
              </label>
              <input
                type="text"
                value={metadata.audioTrack}
                onChange={(e) => onUpdateMetadata({ audioTrack: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                Reel Caption
              </label>
              <input
                type="text"
                value={metadata.caption}
                onChange={(e) => onUpdateMetadata({ caption: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
