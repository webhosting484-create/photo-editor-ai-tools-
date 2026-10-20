import { useState, useRef, useEffect } from 'react';
import { Video, Download, Square, X, CheckCircle2, Film } from 'lucide-react';
import type { VideoCanvasRef } from './VideoCanvas.tsx';
import { soundscape } from '../utils/audioSynthesizer.ts';

interface VideoRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<VideoCanvasRef | null>;
  isPlaying: boolean;
  onEnsurePlaying: () => void;
}

export function VideoRecorderModal({
  isOpen,
  onClose,
  canvasRef,
  isPlaying,
  onEnsurePlaying,
}: VideoRecorderModalProps) {
  const [duration, setDuration] = useState<number>(10); // 5, 10, 15, 30 seconds
  const [resolution, setResolution] = useState<'1080p' | '720p' | '2160p'>('1080p');
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [fileSizeStr, setFileSizeStr] = useState<string>('');
  const [fileExt, setFileExt] = useState<string>('mp4');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const intervalIdRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recordedVideoUrl) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
      if (wakeLockRef.current) {
        wakeLockRef.current.release?.().catch(() => {});
      }
    };
  }, [recordedVideoUrl]);

  if (!isOpen) return null;

  const startRecording = async () => {
    setErrorMsg(null);
    setRecordedVideoUrl(null);
    recordedChunksRef.current = [];

    if (!isPlaying) {
      onEnsurePlaying();
    }

    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) {
      setErrorMsg('Canvas element not available for recording.');
      return;
    }

    const canvasStream = canvasRef.current?.captureStream(30);
    if (!canvasStream) {
      setErrorMsg('Media captureStream is not supported in this browser.');
      return;
    }

    // Combine canvas video with Web Audio stream
    const audioDest = soundscape.getAudioStreamDestination();
    const tracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];
    if (audioDest && audioDest.stream.getAudioTracks().length > 0) {
      tracks.push(...audioDest.stream.getAudioTracks());
    }

    const combinedStream = new MediaStream(tracks);

    // MIME negotiation: Chrome 126+ & Safari record MP4 H.264/AAC; Firefox records WebM
    const mimeTypes = [
      'video/mp4;codecs=avc1.640028,mp4a.40.2',
      'video/mp4;codecs=avc1,mp4a.40.2',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];
    let selectedMime = '';
    for (const mime of mimeTypes) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }

    const ext = selectedMime.includes('mp4') ? 'mp4' : 'webm';
    setFileExt(ext);

    // Request Screen Wake Lock if available
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      }
    } catch {}

    try {
      const options: MediaRecorderOptions = selectedMime ? { mimeType: selectedMime } : {};
      const recorder = new MediaRecorder(combinedStream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: selectedMime || (ext === 'mp4' ? 'video/mp4' : 'video/webm'),
        });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        const mb = (blob.size / (1024 * 1024)).toFixed(2);
        setFileSizeStr(`${mb} MB`);
        setIsRecording(false);
        setProgress(100);

        if (wakeLockRef.current) {
          wakeLockRef.current.release?.().catch(() => {});
        }
      };

      recorder.start(250);
      setIsRecording(true);
      setProgress(0);

      const startTime = Date.now();
      const totalMs = duration * 1000;

      intervalIdRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min(100, (elapsed / totalMs) * 100);
        setProgress(currentProgress);

        if (elapsed >= totalMs) {
          if (intervalIdRef.current) clearInterval(intervalIdRef.current);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
        }
      }, 100);
    } catch (err) {
      setErrorMsg(`Failed to start video recording: ${err instanceof Error ? err.message : String(err)}`);
      setIsRecording(false);
    }
  };

  const stopRecordingEarly = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Record & Export Video</h3>
              <p className="text-xs text-slate-400">
                Direct MP4/WebM render with synchronized lo-fi audio & weather loop
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

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed">
            {errorMsg}
          </div>
        )}

        {recordedVideoUrl ? (
          <div className="mt-5 space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 aspect-[9/16] max-h-72 mx-auto flex items-center justify-center shadow-lg">
              <video
                src={recordedVideoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Video rendered ({fileSizeStr} · {fileExt.toUpperCase()})</span>
              </div>
              <span className="text-slate-400">{duration} seconds</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={recordedVideoUrl}
                download={`cinematic_sky_${duration}s.${fileExt}`}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Video File ({fileExt.toUpperCase()})</span>
              </a>
              <button
                onClick={() => {
                  setRecordedVideoUrl(null);
                  setProgress(0);
                }}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition"
              >
                Record Again
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {/* Duration Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                Video Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 30].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    disabled={isRecording}
                    onClick={() => setDuration(sec)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-0.5 transition ${
                      duration === sec
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-sm'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-sm font-bold">{sec}s</span>
                    <span className="text-[9px] text-slate-400">
                      {sec === 5 ? 'Short' : sec === 10 ? 'Reel' : sec === 15 ? 'Story' : 'Loop'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recording progress state */}
            {isRecording ? (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                    </span>
                    <span className="font-semibold text-rose-400 tracking-wide uppercase">
                      Rendering Frames & Synthesizing Audio...
                    </span>
                  </div>
                  <span className="font-mono text-slate-400">
                    {Math.round(progress)}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-emerald-400 transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={stopRecordingEarly}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-medium transition"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Stop Recording</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
                <p>• MP4 (H.264 / AAC) prioritized on Chrome 126+ & Safari; WebM fallback.</p>
                <p>• Seamless loop audio mix with rain and Rhodes chords recorded in real-time.</p>
                <p>• Optimized for Instagram Reels, TikTok, YouTube Shorts, and X.</p>
              </div>
            )}

            {!isRecording && (
              <button
                onClick={startRecording}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 hover:brightness-110 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition shadow-lg shadow-rose-600/25 active:scale-98"
              >
                <Video className="w-4 h-4" />
                <span>Start Recording ({duration}s Clip)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
