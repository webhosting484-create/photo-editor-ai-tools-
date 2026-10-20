import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Space', desc: 'Play / Pause live animation and audio' },
  { key: 'R', desc: 'Open Video Recording & Export studio' },
  { key: 'C', desc: 'Toggle Clean Cut mode (hide / show reel UI)' },
  { key: 'L', desc: 'Trigger manual lightning bolt & thunderclap' },
  { key: 'M', desc: 'Mute / Unmute generative soundtrack' },
  { key: '1 - 9', desc: 'Quick-switch between atmospheric presets' },
  { key: '?', desc: 'Open this keyboard shortcuts guide' },
];

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-400">Pro-workflow hotkeys for fast live control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close shortcuts"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {SHORTCUTS.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
            >
              <span className="text-slate-300 font-medium">{sc.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono font-bold text-emerald-400 text-[11px] shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
