import { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Check,
  Music2,
  Search,
  User,
  ChevronLeft,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import type { ReelMetadata } from '../types/video.ts';

interface SocialOverlayProps {
  metadata: ReelMetadata;
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onOpenComments: () => void;
  onToggleCleanView: () => void;
  isCleanView: boolean;
}

export function SocialOverlay({
  metadata,
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
  onOpenComments,
  onToggleCleanView,
  isCleanView,
}: SocialOverlayProps) {
  const [likes, setLikes] = useState(metadata.likes || 1245);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedCount, setSavedCount] = useState(metadata.savesCount || 158);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  const handleSave = () => {
    if (isSaved) {
      setSavedCount((prev) => prev - 1);
      setIsSaved(false);
    } else {
      setSavedCount((prev) => prev + 1);
      setIsSaved(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2200);
  };

  if (isCleanView) {
    return (
      <div className="absolute top-4 left-4 z-20 pointer-events-auto">
        <button
          onClick={onToggleCleanView}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium hover:bg-black/80 hover:text-white transition shadow-lg"
          title="Show Social Overlay"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Show Reel UI</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between text-white select-none z-20 overflow-hidden font-sans">
      {/* Top Mobile Status & Navigation Bar (matches screenshot) */}
      <div className="w-full bg-gradient-to-b from-black/75 via-black/30 to-transparent pt-2.5 pb-8 px-4 flex flex-col pointer-events-auto">
        {/* Status bar */}
        <div className="flex items-center justify-between text-xs font-semibold text-white/95 tracking-wide mb-2">
          <span>3:09</span>
          <div className="flex items-center gap-2 text-white/90">
            <span className="text-[10px] tracking-tighter">5G</span>
            <div className="w-5 h-2.5 border border-white/80 rounded-sm p-[1px] flex items-center">
              <div className="h-full bg-white/90 w-[24%]" />
            </div>
            <span className="text-[11px] font-bold">24%</span>
          </div>
        </div>

        {/* Top App Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onToggleCleanView}
            className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white/90 backdrop-blur-sm transition"
            aria-label="Clean view toggle"
            title="Switch to Clean View"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition"
              aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
              title={isMuted ? 'Unmute soundscape' : 'Mute soundscape'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition"
              aria-label="Search reels"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition"
              aria-label="Profile"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Center Tap-to-Play Area (middle click/tap) */}
      <div
        onClick={onTogglePlay}
        className="flex-1 w-full pointer-events-auto cursor-pointer flex items-center justify-center"
      >
        {!isPlaying && (
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 shadow-2xl animate-pulse">
            <div className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[18px] border-l-white ml-1" />
          </div>
        )}
      </div>

      {/* Bottom & Right Interaction Rows */}
      <div className="w-full bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-12 pb-3 px-4 flex items-end justify-between pointer-events-auto">
        {/* Creator Info & Caption (Bottom Left) */}
        <div className="flex-1 pr-4 max-w-[80%] flex flex-col gap-2">
          {/* Creator handle & follow button */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full ring-2 ring-emerald-400/80 p-0.5 overflow-hidden bg-slate-900 shadow">
              <img
                src="/assets/aistudio/5962797646906855394_5de01964.jpg"
                alt="Creator Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white drop-shadow-md">
                {metadata.creatorName}
              </span>
              {metadata.verified && (
                <div className="w-3.5 h-3.5 rounded-full bg-sky-500 flex items-center justify-center text-[9px] font-black text-white">
                  ✓
                </div>
              )}
            </div>

            <button
              onClick={() => setIsFollowed(!isFollowed)}
              className={`text-xs font-semibold px-3 py-1 rounded-full border transition backdrop-blur-md ${
                isFollowed
                  ? 'bg-white/20 border-white/30 text-white/90'
                  : 'bg-white text-black border-white hover:bg-slate-100'
              }`}
            >
              {isFollowed ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Music track ticker */}
          <div className="flex items-center gap-2 text-xs font-medium text-white/90 drop-shadow">
            <Music2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <div className="overflow-hidden whitespace-nowrap">
              <span className="inline-block animate-marquee">
                {metadata.audioTrack}
              </span>
            </div>
          </div>

          {/* Caption */}
          <div className="text-xs text-white/90 leading-relaxed drop-shadow">
            <p className={isCaptionExpanded ? '' : 'line-clamp-2'}>
              {metadata.caption}
            </p>
            <button
              onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
              className="text-white/60 hover:text-white font-medium text-[11px] mt-0.5"
            >
              {isCaptionExpanded ? 'less' : '... more'}
            </button>
          </div>
        </div>

        {/* Right Action Icons Column (Cleanly positioned with subtle backdrop to replace static baked-in icons) */}
        <div className="flex flex-col items-center gap-4 pb-2 z-10">
          {/* Like */}
          <button
            onClick={handleLike}
            className="group flex flex-col items-center gap-0.5 transition transform active:scale-90"
            aria-label="Like video"
          >
            <div
              className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition ${
                isLiked
                  ? 'bg-rose-500/30 text-rose-500 scale-110'
                  : 'bg-black/60 text-white hover:bg-black/80'
              }`}
            >
              <Heart
                className={`w-6 h-6 transition ${
                  isLiked ? 'fill-rose-500 stroke-rose-500' : 'stroke-white'
                }`}
              />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {likes}
            </span>
          </button>

          {/* Comments */}
          <button
            onClick={onOpenComments}
            className="group flex flex-col items-center gap-0.5 transition transform active:scale-90"
            aria-label="View comments"
          >
            <div className="p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md shadow-lg transition">
              <MessageCircle className="w-6 h-6 stroke-white" />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {metadata.commentsCount}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="group flex flex-col items-center gap-0.5 transition transform active:scale-90"
            aria-label="Share video"
          >
            <div className="p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md shadow-lg transition">
              <Share2 className="w-6 h-6 stroke-white" />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {metadata.sharesCount}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={handleSave}
            className="group flex flex-col items-center gap-0.5 transition transform active:scale-90"
            aria-label="Bookmark reel"
          >
            <div
              className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition ${
                isSaved
                  ? 'bg-amber-500/30 text-amber-400'
                  : 'bg-black/60 text-white hover:bg-black/80'
              }`}
            >
              <Bookmark
                className={`w-6 h-6 transition ${
                  isSaved ? 'fill-amber-400 stroke-amber-400' : 'stroke-white'
                }`}
              />
            </div>
            <span className="text-[11px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {savedCount}
            </span>
          </button>

          {/* More options */}
          <button
            onClick={onToggleCleanView}
            className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md shadow-lg transition"
            aria-label="Reel options"
            title="Clean view"
          >
            <MoreVertical className="w-5 h-5 text-white/90" />
          </button>

          {/* Spinning Audio Vinyl Disc */}
          <div
            onClick={onTogglePlay}
            className={`w-9 h-9 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-black p-1 border-2 border-slate-700 shadow-xl cursor-pointer ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
            title="Toggle Play / Sound"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-black border border-white/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Share Toast */}
      {shareToast && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-full border border-emerald-500/50 flex items-center gap-2 shadow-2xl backdrop-blur-md animate-bounce z-50">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">Video Link Copied!</span>
        </div>
      )}
    </div>
  );
}
