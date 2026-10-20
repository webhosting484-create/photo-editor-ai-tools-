import { useState } from 'react';
import {
  Settings,
  X,
  Gauge,
  Volume2,
  Film,
  Accessibility,
  Palette,
  Shield,
  RotateCcw,
  Check,
} from 'lucide-react';
import type { AppSettings } from '../types/video.ts';

export const DEFAULT_SETTINGS: AppSettings = {
  renderer: 'auto',
  renderScale: 1.0,
  dprCap: 2,
  maxFps: 60,
  particleCap: 12000,
  adaptiveQuality: true,
  perfOverlay: false,

  startMuted: false,
  masterVolumeDb: -6,
  spatialAudio: false,

  exportResolution: '1080p',
  exportFps: 30,
  exportDuration: 10,
  seamlessLoop: true,
  bakeOverlay: false,
  includeAudio: true,
  filenameTemplate: '{title}_{preset}_{ratio}_{res}_{fps}',

  reducedMotion: false,
  photosensitiveSafeMode: false,
  audioCaptions: false,
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'perf' | 'audio' | 'export' | 'a11y' | 'privacy'>('perf');
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleResetSection = () => {
    if (activeTab === 'perf') {
      onUpdateSettings({
        renderer: DEFAULT_SETTINGS.renderer,
        renderScale: DEFAULT_SETTINGS.renderScale,
        dprCap: DEFAULT_SETTINGS.dprCap,
        maxFps: DEFAULT_SETTINGS.maxFps,
        particleCap: DEFAULT_SETTINGS.particleCap,
        adaptiveQuality: DEFAULT_SETTINGS.adaptiveQuality,
        perfOverlay: DEFAULT_SETTINGS.perfOverlay,
      });
    } else if (activeTab === 'audio') {
      onUpdateSettings({
        startMuted: DEFAULT_SETTINGS.startMuted,
        masterVolumeDb: DEFAULT_SETTINGS.masterVolumeDb,
        spatialAudio: DEFAULT_SETTINGS.spatialAudio,
      });
    } else if (activeTab === 'export') {
      onUpdateSettings({
        exportResolution: DEFAULT_SETTINGS.exportResolution,
        exportFps: DEFAULT_SETTINGS.exportFps,
        exportDuration: DEFAULT_SETTINGS.exportDuration,
        seamlessLoop: DEFAULT_SETTINGS.seamlessLoop,
        bakeOverlay: DEFAULT_SETTINGS.bakeOverlay,
        includeAudio: DEFAULT_SETTINGS.includeAudio,
        filenameTemplate: DEFAULT_SETTINGS.filenameTemplate,
      });
    } else if (activeTab === 'a11y') {
      onUpdateSettings({
        reducedMotion: DEFAULT_SETTINGS.reducedMotion,
        photosensitiveSafeMode: DEFAULT_SETTINGS.photosensitiveSafeMode,
        audioCaptions: DEFAULT_SETTINGS.audioCaptions,
      });
    }
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Application Settings</h3>
              <p className="text-xs text-slate-400">
                Configure renderer, audio engine, export pipeline & accessibility
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 mt-4 pb-2 border-b border-slate-800/60 shrink-0 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('perf')}
            className={`py-1.5 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition shrink-0 ${
              activeTab === 'perf'
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Performance</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`py-1.5 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition shrink-0 ${
              activeTab === 'audio'
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Audio</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`py-1.5 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition shrink-0 ${
              activeTab === 'export'
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Export Defaults</span>
          </button>

          <button
            onClick={() => setActiveTab('a11y')}
            className={`py-1.5 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition shrink-0 ${
              activeTab === 'a11y'
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>Accessibility</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-1.5 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition shrink-0 ${
              activeTab === 'privacy'
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Storage & Privacy</span>
          </button>
        </div>

        {/* Tab panels */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
          {activeTab === 'perf' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Rendering Backend</span>
                  <select
                    value={settings.renderer}
                    onChange={(e) => onUpdateSettings({ renderer: e.target.value as any })}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                  >
                    <option value="auto">Auto (WebGL2 / Canvas2D)</option>
                    <option value="webgl2">WebGL2 Accelerated</option>
                    <option value="canvas2d">Canvas2D Compatibility</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="font-semibold text-white">Target Max Framerate</div>
                    <div className="text-[11px] text-slate-400">Prevents device overheating</div>
                  </div>
                  <select
                    value={settings.maxFps}
                    onChange={(e) => onUpdateSettings({ maxFps: Number(e.target.value) as any })}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                  >
                    <option value={30}>30 FPS (Battery Saver)</option>
                    <option value={60}>60 FPS (Smooth Standard)</option>
                    <option value={120}>120 FPS (High Refresh)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="font-semibold text-white">Adaptive Quality Controller</div>
                    <div className="text-[11px] text-slate-400">Dynamically scales particles to avoid lag</div>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ adaptiveQuality: !settings.adaptiveQuality })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      settings.adaptiveQuality ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {settings.adaptiveQuality ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Start Muted</div>
                    <div className="text-[11px] text-slate-400">Respect browser autoplay constraints</div>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ startMuted: !settings.startMuted })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      settings.startMuted ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {settings.startMuted ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="font-semibold text-white">Brickwall Master Limiter</div>
                    <div className="text-[11px] text-slate-400">Prevents clipping distortion (-1 dBFS threshold)</div>
                  </div>
                  <span className="text-emerald-400 font-mono font-semibold">Active</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Default Resolution</span>
                  <select
                    value={settings.exportResolution}
                    onChange={(e) => onUpdateSettings({ exportResolution: e.target.value as any })}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                  >
                    <option value="720p">720p HD (Fast)</option>
                    <option value="1080p">1080p Full HD (Recommended)</option>
                    <option value="1440p">1440p 2K</option>
                    <option value="2160p">2160p 4K UHD</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="font-semibold text-white">Seamless Loop Export</div>
                    <div className="text-[11px] text-slate-400">Matches start and end frame for infinite replay</div>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ seamlessLoop: !settings.seamlessLoop })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      settings.seamlessLoop ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {settings.seamlessLoop ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'a11y' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Photosensitive Safe Mode (WCAG 2.3.1)</div>
                    <div className="text-[11px] text-slate-400">
                      Caps lightning & glitch flashes to &lt; 1 per 2 seconds, clamps luminance delta
                    </div>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ photosensitiveSafeMode: !settings.photosensitiveSafeMode })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      settings.photosensitiveSafeMode ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {settings.photosensitiveSafeMode ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="font-semibold text-white">Reduced Motion Mode</div>
                    <div className="text-[11px] text-slate-400">
                      Disables handheld camera shake and reduces particle speed
                    </div>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                      settings.reducedMotion ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {settings.reducedMotion ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="font-semibold text-white">Client-Side Private Architecture</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All rendering, image decoding, lo-fi synthesizer audio, and video recording happen 100% locally in your browser. No photos or video frames are ever sent to an external server.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 shrink-0 flex items-center justify-between text-xs">
          <button
            onClick={handleResetSection}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset This Section</span>
          </button>

          <div className="flex items-center gap-2">
            {savedToast && (
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <Check className="w-3.5 h-3.5" /> Reset to defaults
              </span>
            )}
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
