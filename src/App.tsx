import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Video,
  Play,
  Pause,
  Film,
  Keyboard,
  Settings as SettingsIcon,
  Lightbulb,
} from 'lucide-react';
import type {
  VFXConfig,
  AudioConfig,
  AspectRatio,
  PresetMood,
  ReelMetadata,
  SceneAnchorsConfig,
  AppSettings,
} from './types/video.ts';
import {
  DEFAULT_VFX_CONFIG,
  DEFAULT_AUDIO_CONFIG,
  DEFAULT_ANCHORS,
  PRESET_MOODS,
  getPresetMoodById,
} from './utils/vfxEngine.ts';
import { soundscape } from './utils/audioSynthesizer.ts';
import { VideoCanvas, type VideoCanvasRef } from './components/VideoCanvas.tsx';
import { SocialOverlay } from './components/SocialOverlay.tsx';
import { StudioControls } from './components/StudioControls.tsx';
import { CommentsDrawer } from './components/CommentsDrawer.tsx';
import { VideoRecorderModal } from './components/VideoRecorderModal.tsx';
import { PromptModal } from './components/PromptModal.tsx';
import { AnchorsEditor } from './components/AnchorsEditor.tsx';
import { SettingsModal, DEFAULT_SETTINGS } from './components/SettingsModal.tsx';
import { ShortcutsModal } from './components/ShortcutsModal.tsx';

const DEFAULT_IMAGE_PATH = '/assets/aistudio/5962797646906855394_5de01964.jpg';

const DEFAULT_METADATA: ReelMetadata = {
  creatorName: 'Cinematic Sky',
  verified: true,
  audioTrack: '🎵 e you again · Antent · hope',
  caption: 'Lost in the moment, where the wind feels like a memory... 🌧️🏍️ #lofi #rain #cinematic #anime #nightride',
  likes: 15,
  commentsCount: 72,
  sharesCount: 158,
  savesCount: 158,
};

export default function App() {
  const [imageSrc, setImageSrc] = useState<string>(DEFAULT_IMAGE_PATH);
  const [vfx, setVfx] = useState<VFXConfig>(DEFAULT_VFX_CONFIG);
  const [audio, setAudio] = useState<AudioConfig>(DEFAULT_AUDIO_CONFIG);
  const [anchors, setAnchors] = useState<SceneAnchorsConfig>(DEFAULT_ANCHORS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [metadata, setMetadata] = useState<ReelMetadata>(DEFAULT_METADATA);
  const [activePresetId, setActivePresetId] = useState<string>('midnight-solitude');
  const [isCleanView, setIsCleanView] = useState(false);

  // Modals state
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isAnchorsOpen, setIsAnchorsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const canvasRef = useRef<VideoCanvasRef | null>(null);

  // Sync audio synthesizer state whenever audio config changes
  useEffect(() => {
    soundscape.updateConfig(audio);
  }, [audio]);

  // Support ?autostart=1 query param (Ultra Mode requirement)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      soundscape.init();
      setAudio((prev) => ({ ...prev, isPlaying: true }));
    }
  }, []);

  const handleTogglePlay = useCallback(() => {
    soundscape.init();
    setAudio((prev) => {
      const nextPlaying = !prev.isPlaying;
      return { ...prev, isPlaying: nextPlaying };
    });
  }, []);

  const handleToggleMute = useCallback(() => {
    soundscape.init();
    setAudio((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const handleSelectPreset = useCallback((preset: PresetMood) => {
    setActivePresetId(preset.id);
    setVfx((prev) => ({ ...prev, ...preset.vfx }));
    setAudio((prev) => {
      const updated = { ...prev, ...preset.audio };
      soundscape.updateConfig(updated);
      return updated;
    });
  }, []);

  const handleTriggerManualLightning = useCallback(() => {
    soundscape.init();
    soundscape.triggerThunder(vfx.lightningDistanceKm || 5.0);
  }, [vfx.lightningDistanceKm]);

  // Global Keyboard Shortcuts (Phase 13: Space, R, C, L, M, 1-9, ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setIsRecorderOpen(true);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsCleanView((prev) => !prev);
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleTriggerManualLightning();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMute();
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(true);
      } else if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key, 10) - 1;
        if (PRESET_MOODS[index]) {
          handleSelectPreset(PRESET_MOODS[index]!);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleToggleMute, handleTriggerManualLightning, handleSelectPreset]);

  const handleUpdateVFX = useCallback((patch: Partial<VFXConfig>) => {
    setVfx((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleUpdateAudio = useCallback((patch: Partial<AudioConfig>) => {
    soundscape.init();
    setAudio((prev) => {
      const updated = { ...prev, ...patch };
      soundscape.updateConfig(updated);
      return updated;
    });
  }, []);

  const handleEnsurePlaying = useCallback(() => {
    soundscape.init();
    setAudio((prev) => {
      if (!prev.isPlaying) {
        const next = { ...prev, isPlaying: true };
        soundscape.updateConfig(next);
        return next;
      }
      return prev;
    });
  }, []);

  const handleUploadCustomImage = useCallback((dataUrl: string) => {
    setImageSrc(dataUrl);
  }, []);

  const handleResetToDefault = useCallback(() => {
    setImageSrc(DEFAULT_IMAGE_PATH);
  }, []);

  return (
    <div className="flex flex-col min-h-screen sm:h-screen w-screen bg-slate-950 text-slate-100 overflow-y-auto sm:overflow-hidden font-sans select-none">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0 sticky top-0 sm:static">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-emerald-400">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-wide">
                Cinematic Sky
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Engine v2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Anime Photo to Living Video Animator & Generator
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Keyboard shortcuts (or press ?)"
            aria-label="Shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsAnchorsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-750 hover:border-amber-500/50 text-slate-200 hover:text-white font-semibold text-xs transition shadow-sm"
            title="Position light sources and puddle geometry on any photo"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Anchors</span>
          </button>

          <button
            onClick={() => setIsPromptModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-750 hover:border-emerald-500/50 text-slate-200 hover:text-white font-semibold text-xs transition shadow-sm"
            title="Generate AI video and image prompts (Oct 2026 models)"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">AI Prompts</span>
          </button>

          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
              audio.isPlaying
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {audio.isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsRecorderOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:brightness-110 text-white font-bold text-xs transition shadow-md shadow-rose-600/20 active:scale-95"
          >
            <Video className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Video</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </header>

      {/* Main Video Viewport Center Stage */}
      <main className="flex-1 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-radial from-slate-900/60 to-slate-950 min-h-[520px] sm:min-h-0 py-4">
        {/* Device Container Frame */}
        <div
          className={`relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80 bg-black flex items-center justify-center transition-all duration-300 ${
            aspectRatio === '9:16'
              ? 'h-[520px] sm:h-full max-h-[82vh] aspect-[9/16]'
              : aspectRatio === '16:9'
                ? 'w-full max-w-4xl aspect-[16/9]'
                : aspectRatio === '1:1'
                  ? 'h-[460px] sm:h-full max-h-[75vh] aspect-square'
                  : aspectRatio === '4:5'
                    ? 'h-[500px] sm:h-full max-h-[80vh] aspect-[4/5]'
                    : aspectRatio === '3:4'
                      ? 'h-[500px] sm:h-full max-h-[80vh] aspect-[3/4]'
                      : aspectRatio === '2:3'
                        ? 'h-[520px] sm:h-full max-h-[80vh] aspect-[2/3]'
                        : 'w-full max-w-4xl aspect-[2.39/1]'
          }`}
        >
          {/* Living 2D Procedural VFX Canvas */}
          <VideoCanvas
            ref={canvasRef}
            imageSrc={imageSrc}
            vfx={vfx}
            anchors={anchors}
            aspectRatio={aspectRatio}
            isPlaying={audio.isPlaying}
          />

          {/* Social Media Reel Overlay Interface */}
          <SocialOverlay
            metadata={metadata}
            isPlaying={audio.isPlaying}
            isMuted={audio.isMuted}
            onTogglePlay={handleTogglePlay}
            onToggleMute={handleToggleMute}
            onOpenComments={() => setIsCommentsOpen(true)}
            onToggleCleanView={() => setIsCleanView(!isCleanView)}
            isCleanView={isCleanView}
          />
        </div>
      </main>

      {/* Studio Controls Drawer (Presets, VFX, Audio, Details) */}
      <StudioControls
        vfx={vfx}
        onUpdateVFX={handleUpdateVFX}
        audio={audio}
        onUpdateAudio={handleUpdateAudio}
        aspectRatio={aspectRatio}
        onChangeAspectRatio={setAspectRatio}
        isCleanView={isCleanView}
        onToggleCleanView={() => setIsCleanView(!isCleanView)}
        onSelectPreset={handleSelectPreset}
        activePresetId={activePresetId}
        metadata={metadata}
        onUpdateMetadata={(patch) => setMetadata((prev) => ({ ...prev, ...patch }))}
        onUploadCustomImage={handleUploadCustomImage}
        onResetToDefaultImage={handleResetToDefault}
        isDefaultImage={imageSrc === DEFAULT_IMAGE_PATH}
        onOpenRecorder={() => setIsRecorderOpen(true)}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
        onOpenAnchorsEditor={() => setIsAnchorsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Interactive Comments Drawer */}
      <CommentsDrawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
      />

      {/* Video Recorder & Exporter Modal */}
      <VideoRecorderModal
        isOpen={isRecorderOpen}
        onClose={() => setIsRecorderOpen(false)}
        canvasRef={canvasRef}
        isPlaying={audio.isPlaying}
        onEnsurePlaying={handleEnsurePlaying}
      />

      {/* AI Prompt Generator Modal */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        vfx={vfx}
        metadata={metadata}
        activePreset={getPresetMoodById(activePresetId)}
      />

      {/* Scene Anchors Geometry Editor */}
      <AnchorsEditor
        isOpen={isAnchorsOpen}
        onClose={() => setIsAnchorsOpen(false)}
        anchors={anchors}
        onUpdateAnchors={setAnchors}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(patch) => setSettings((prev) => ({ ...prev, ...patch }))}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
