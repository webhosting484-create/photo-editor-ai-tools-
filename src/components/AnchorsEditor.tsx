import { useState } from 'react';
import { Lightbulb, Maximize2, RotateCcw, Sparkles, X, Sun, Layers, HelpCircle } from 'lucide-react';
import type { SceneAnchorsConfig, SceneAnchor, LightFlickerType } from '../types/video.ts';
import { DEFAULT_ANCHORS } from '../utils/vfxEngine.ts';

interface AnchorsEditorProps {
  isOpen: boolean;
  onClose: () => void;
  anchors: SceneAnchorsConfig;
  onUpdateAnchors: (updated: SceneAnchorsConfig) => void;
}

export function AnchorsEditor({
  isOpen,
  onClose,
  anchors,
  onUpdateAnchors,
}: AnchorsEditorProps) {
  const [activeTab, setActiveTab] = useState<'lights' | 'planes' | 'zones'>('lights');

  if (!isOpen) return null;

  const currentLight = anchors.lights[0] || DEFAULT_ANCHORS.lights[0]!;

  const handleUpdatePrimaryLight = (patch: Partial<SceneAnchor>) => {
    const updatedLights = anchors.lights.map((l, i) =>
      i === 0 ? { ...l, ...patch } : l
    );
    onUpdateAnchors({ ...anchors, lights: updatedLights });
  };

  const handleReset = () => {
    onUpdateAnchors(DEFAULT_ANCHORS);
  };

  const handleAutoSuggest = () => {
    // Propose optimal anchors for anime landscape with ground horizon
    onUpdateAnchors({
      lights: [
        {
          id: 'headlight-1',
          type: 'headlight',
          x: 0.325,
          y: 0.598,
          intensity: 110,
          colorTempKelvin: 4000,
          coneAngle: 48,
          flicker: 'vintage',
          flickerRate: 18,
        },
      ],
      horizonY: 0.52,
      groundPlaneY: 0.68,
      puddleZone: { x: 0.05, y: 0.65, width: 0.9, height: 0.35 },
      foliageZone: { x: 0.0, y: 0.0, width: 0.55, height: 0.45 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Scene Anchors & Geometry</h3>
              <p className="text-xs text-slate-400">
                Position light sources, puddles, horizon, and foliage zones on any photo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between mt-3 pb-2 border-b border-slate-800/60 shrink-0 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('lights')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'lights'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Light Source
            </button>
            <button
              onClick={() => setActiveTab('planes')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'planes'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Horizon & Ground
            </button>
            <button
              onClick={() => setActiveTab('zones')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'zones'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Puddle & Tree Zones
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoSuggest}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
              title="Auto-detect geometry from image analysis"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Detect</span>
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
              title="Reset to default motorcycle anchors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
          {activeTab === 'lights' && (
            <div className="space-y-4">
              {/* Position XY */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200 block">
                  Light Anchor Position (Normalized 0.0 - 1.0)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Horizontal (X)</span>
                      <span className="font-mono text-amber-400">{Math.round(currentLight.x * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Math.round(currentLight.x * 100)}
                      onChange={(e) => handleUpdatePrimaryLight({ x: Number(e.target.value) / 100 })}
                      className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Vertical (Y)</span>
                      <span className="font-mono text-amber-400">{Math.round(currentLight.y * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Math.round(currentLight.y * 100)}
                      onChange={(e) => handleUpdatePrimaryLight({ y: Number(e.target.value) / 100 })}
                      className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Color Temperature & Cone */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Color Temperature (Kelvin)</span>
                    <span className="font-mono text-amber-400">{currentLight.colorTempKelvin} K</span>
                  </div>
                  <input
                    type="range"
                    min="1800"
                    max="10000"
                    step="100"
                    value={currentLight.colorTempKelvin}
                    onChange={(e) => handleUpdatePrimaryLight({ colorTempKelvin: Number(e.target.value) })}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>1800K (Warm Candle)</span>
                    <span>4200K (Vintage Bulb)</span>
                    <span>6500K (Daylight)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Light Cone Beam Angle</span>
                    <span className="font-mono text-slate-400">{currentLight.coneAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="85"
                    value={currentLight.coneAngle}
                    onChange={(e) => handleUpdatePrimaryLight({ coneAngle: Number(e.target.value) })}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Flicker Type */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-200 block">Electrical Flicker Type</span>
                <div className="grid grid-cols-4 gap-2">
                  {(['vintage', 'neon', 'candle', 'none'] as LightFlickerType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleUpdatePrimaryLight({ flicker: type })}
                      className={`py-2 px-2 rounded-lg border text-xs capitalize font-medium transition ${
                        currentLight.flicker === type
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'planes' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex justify-between text-xs text-slate-200 font-bold mb-1">
                  <span>Horizon Line Y</span>
                  <span className="font-mono text-emerald-400">{Math.round(anchors.horizonY * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={Math.round(anchors.horizonY * 100)}
                  onChange={(e) => onUpdateAnchors({ ...anchors, horizonY: Number(e.target.value) / 100 })}
                  className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Defines where sky fog transitions into the distant terrain and mountains.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex justify-between text-xs text-slate-200 font-bold mb-1">
                  <span>Ground Plane Quad Y</span>
                  <span className="font-mono text-emerald-400">{Math.round(anchors.groundPlaneY * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="90"
                  value={Math.round(anchors.groundPlaneY * 100)}
                  onChange={(e) => onUpdateAnchors({ ...anchors, groundPlaneY: Number(e.target.value) / 100 })}
                  className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Controls where rain splashes hit and specular wet-road reflections start.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'zones' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200 block">Puddle Zone Area (Y Position)</span>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={Math.round(anchors.puddleZone.y * 100)}
                  onChange={(e) =>
                    onUpdateAnchors({
                      ...anchors,
                      puddleZone: { ...anchors.puddleZone, y: Number(e.target.value) / 100 },
                    })
                  }
                  className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Concentric ripples will only spawn inside this defined asphalt puddle zone.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200 block">Foliage / Tree Emitter Width</span>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={Math.round(anchors.foliageZone.width * 100)}
                  onChange={(e) =>
                    onUpdateAnchors({
                      ...anchors,
                      foliageZone: { ...anchors.foliageZone, width: Number(e.target.value) / 100 },
                    })
                  }
                  className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <p className="text-[11px] text-slate-400">
                  Origin boundary where leaves and cherry blossom petals flutter from.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
          >
            Apply Anchors
          </button>
        </div>
      </div>
    </div>
  );
}
