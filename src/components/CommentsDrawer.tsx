import { useState } from 'react';
import { X, Heart, Send, Smile, AtSign } from 'lucide-react';

interface CommentItem {
  id: string;
  user: string;
  avatarColor: string;
  timeAgo: string;
  text: string;
  likes: number;
  isLiked?: boolean;
}

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    user: 'lunar_drifter',
    avatarColor: 'bg-emerald-600',
    timeAgo: '2h',
    text: 'That rain hitting the asphalt with the headlight glowing... pure nostalgia 🌧️🏍️',
    likes: 42,
  },
  {
    id: 'c2',
    user: 'kaito.beats',
    avatarColor: 'bg-indigo-600',
    timeAgo: '4h',
    text: 'Antent - Hope hits different at 3 AM on an empty country road.',
    likes: 29,
  },
  {
    id: 'c3',
    user: 'rainy_tokyo',
    avatarColor: 'bg-teal-600',
    timeAgo: '6h',
    text: 'Lost in the moment, where the wind feels like a memory. Masterpiece animation!',
    likes: 18,
  },
  {
    id: 'c4',
    user: 'sakura_breeze',
    avatarColor: 'bg-rose-600',
    timeAgo: '8h',
    text: 'The reflection ripples on the wet puddle look so realistic wow',
    likes: 12,
  },
  {
    id: 'c5',
    user: 'cyber_wanderer',
    avatarColor: 'bg-amber-600',
    timeAgo: '12h',
    text: 'Need a 10 hour loop of this right now 🙏',
    likes: 9,
  },
];

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommentsDrawer({ isOpen, onClose }: CommentsDrawerProps) {
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');

  if (!isOpen) return null;

  const handleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      })
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: CommentItem = {
      id: `c_${Date.now()}`,
      user: 'you',
      avatarColor: 'bg-emerald-500',
      timeAgo: 'Just now',
      text: newComment.trim(),
      likes: 1,
      isLiked: true,
    };

    setComments([added, ...comments]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col text-slate-100 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-white">Comments</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
              {comments.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close comments"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full ${item.avatarColor} flex items-center justify-center font-bold text-xs text-white uppercase shrink-0`}
              >
                {item.user.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">
                    {item.user}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {item.timeAgo}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {item.text}
                </p>
              </div>
              <button
                onClick={() => handleLike(item.id)}
                className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-rose-400 transition"
                aria-label="Like comment"
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    item.isLiked
                      ? 'fill-rose-500 text-rose-500'
                      : 'stroke-slate-400'
                  }`}
                />
                <span className="text-[10px]">{item.likes}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Add comment bar */}
        <form
          onSubmit={handleAddComment}
          className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2"
        >
          <div className="flex items-center gap-1.5 text-slate-400 pl-1">
            <button
              type="button"
              className="p-1 hover:text-white"
              aria-label="Mention someone"
            >
              <AtSign className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1 hover:text-white"
              aria-label="Insert emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-slate-800/80 text-xs text-white placeholder-slate-500 px-3 py-2 rounded-full border border-slate-700/60 focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={!newComment.trim()}
            className="p-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-40 disabled:hover:bg-emerald-500 transition"
            aria-label="Post comment"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
