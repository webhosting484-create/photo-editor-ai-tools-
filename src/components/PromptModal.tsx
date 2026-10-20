import { useState } from 'react';
import { Sparkles, Copy, Check, X, Film, Image as ImageIcon, Music2, Terminal } from 'lucide-react';
import type { VFXConfig, ReelMetadata, PresetMood } from '../types/video.ts';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  vfx: VFXConfig;
  metadata: ReelMetadata;
  activePreset: PresetMood;
}

export function PromptModal({
  isOpen,
  onClose,
  vfx,
  metadata,
  activePreset,
}: PromptModalProps) {
  const [selectedTarget, setSelectedTarget] = useState<'video' | 'image' | 'music'>('video');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  // Oct 2026 AI Video Prompt (Grounded for Kling 3.0, Google Veo 3.1, Runway Gen-4.5, MiniMax H3, PixVerse V6, Pika 2.5)
  const videoPrompt = `Cinematic 2D anime lo-fi animation in the aesthetic style of Makoto Shinkai and Studio Ghibli. A relaxed young man in an open green plaid flannel shirt over a white t-shirt leans back peacefully against his vintage classic black motorcycle parked on a wet country road next to a vast green grassy field. On the left stands a massive ancient gnarled oak tree with lush dark green leaves overhanging the frame.

Atmosphere: A dark overcast twilight sky, glowing full moon softly illuminating through drifting storm clouds. ${
    vfx.rainIntensity > 30
      ? `Steady rainfall streaks falling diagonally at ${vfx.rainAngle || 12}° angle with droplets hitting the wet asphalt, creating expanding concentric water ripples in the puddle reflections.`
      : vfx.snow > 0
        ? `Quiet peaceful snowfall with soft winter mist drifting across the ground.`
        : vfx.fireflies > 0
          ? `Bioluminescent fireflies gently floating and glowing above the evening grass.`
          : `Gentle mist and subtle atmospheric breeze in the cool night air.`
  } The motorcycle circular headlight glows with a warm luminous volumetric light beam and anamorphic lens flare cutting through the moist rain haze. ${
    vfx.leavesPetals > 0
      ? `${vfx.leavesType === 'sakura' ? 'Cherry blossom sakura petals' : 'Dark green tree leaves'} gently flutter and drift downwards in the wind.`
      : ''
  }

Camera motion: ${
    vfx.cameraMotion === 'slow-zoom'
      ? 'Slow cinematic push-in zoom with gentle handheld camera sway.'
      : vfx.cameraMotion === 'pan-horizontal'
        ? 'Gentle horizontal tracking pan with multi-plane parallax depth.'
        : vfx.cameraMotion === 'orbit'
          ? 'Subtle circular orbit camera movement with depth parallax.'
          : 'Subtle breathing handheld camera drift with soft wind sway.'
  }

Technical: 4K resolution, 60fps fluid animation, photorealistic anime lighting, seamless loopable motion, masterpiece.
Negative prompt: low quality, jerky motion, artifacts, 3D render, distorted anatomy, overexposure.`;

  // Oct 2026 AI Image Prompt (Midjourney V8.2 & Niji 7 parameters)
  const imagePrompt = `/imagine prompt: Cinematic 2D anime masterwork illustration, Studio Ghibli and CoMix Wave Films aesthetic. A handsome young man in a green check flannel shirt, white tee, and black denim relaxes leaning against a retro black motorcycle on an asphalt countryside lane by an open green field. A giant mossy tree branches overhead. Moody overcast twilight night, glowing full moon behind atmospheric clouds, rainfall streaks, puddle reflections on the road with glowing headlight bloom, quiet romantic lo-fi mood, high aesthetic detail, 8k resolution, cinematic lighting --ar 9:16 --niji 7 --stylize 250`;

  // Oct 2026 Lo-Fi Music Prompt (Suno v6 / v6-mini & Udio)
  const musicPrompt = `[Style: Melancholic Lo-Fi Hip Hop, Chillhop]
[Key: ${activePreset.audio.musicalKey || 'F minor'}] [Tempo: ${activePreset.audio.bpm || 74} BPM]
[Instrumentation: Warm Rhodes electric piano playing ${activePreset.audio.voicing || '9th'} chord progression, gentle vinyl tape crackle, slow boom-bap drum groove with soft rim clicks, subtle filtered rain sounds in the background, deep warm sub-bass, atmospheric vocal chops]
[Mood: Nostalgic, peaceful solitude, late night motorcycle ride in the rain, soothing nighttime ambiance]
[Structure: Instrumental, seamlessly loopable]`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentPromptText =
    selectedTarget === 'video'
      ? videoPrompt
      : selectedTarget === 'image'
        ? imagePrompt
        : musicPrompt;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">AI Generation Prompts (Oct 2026)</h3>
              <p className="text-xs text-slate-400">
                Grounded prompts for Midjourney V8.2/Niji 7, Kling 3.0, Veo 3.1, Runway Gen-4.5 & Suno v6
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

        {/* Target Tabs */}
        <div className="flex items-center gap-2 mt-4 shrink-0">
          <button
            onClick={() => setSelectedTarget('video')}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              selectedTarget === 'video'
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-sm'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>AI Video (Kling 3 / Veo 3.1 / Gen-4.5)</span>
          </button>

          <button
            onClick={() => setSelectedTarget('image')}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              selectedTarget === 'image'
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-sm'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>AI Image (Midjourney V8.2 / Niji 7)</span>
          </button>

          <button
            onClick={() => setSelectedTarget('music')}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              selectedTarget === 'music'
                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-sm'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>Lo-Fi Music (Suno v6 / v6-mini)</span>
          </button>
        </div>

        {/* Prompt Content Box */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3">
          <div className="relative p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
              <span className="font-mono flex items-center gap-1 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                {selectedTarget === 'video'
                  ? 'Video Animation Prompt'
                  : selectedTarget === 'image'
                    ? 'Midjourney V8.2 / Niji 7 Prompt'
                    : 'Suno v6 Audio Prompt'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Preset: {activePreset.name} ({activePreset.code})
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line select-text">
              {currentPromptText}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">💡 Grounded Model Guidance (Oct 2026):</p>
            {selectedTarget === 'video' ? (
              <p>• <strong>Recommended Tools</strong>: Kling 3.0 (Turbo/Omni), Google Veo 3.1, Runway Gen-4.5, MiniMax H3, PixVerse V6, Pika 2.5.</p>
            ) : selectedTarget === 'image' ? (
              <p>• <strong>Recommended Tools</strong>: Midjourney V8.2 (default), Niji 7 (anime mode), Google Imagen 3, FLUX.1 [dev].</p>
            ) : (
              <p>• <strong>Recommended Tools</strong>: Suno v6 / v6-mini (supports instrumental tags), or DAW lo-fi Rhodes progression.</p>
            )}
          </div>
        </div>

        {/* Copy Button */}
        <div className="mt-4 pt-3 border-t border-slate-800 shrink-0 flex items-center gap-3">
          <button
            onClick={() => handleCopy(currentPromptText, selectedTarget)}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-98"
          >
            {copiedKey === selectedTarget ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Prompt Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
