import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface Props { tree: UseCommentTreeReturn; currentUser: CommentUser; }

const TTComment = ({ comment, tree, currentUser }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser }) => {
  const { reply, reaction, showReplies, toggleReplies } = useComment(comment, {
    onReply: async (id, c) => { tree.addReply(id, c); },
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
  });
  const likeReaction = comment.reactions?.find(r => r.id === 'like');
  const replies = comment.replies || [];

  return (
    <div className="mb-5">
      <div className="flex gap-3">
        <img src={comment.author.avatarUrl} alt="" className="w-10 h-10 rounded-full shrink-0 ring-1 ring-white/10" />
        <div className="flex-1 min-w-0">
          <span className="text-[13px] font-bold text-white block">{comment.author.name}</span>
          <p className="text-[14px] text-[#E8E8E8] mt-0.5 leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-[#8A8B91]">
            <span>{formatRelativeTime(comment.createdAt)}</span>
            <button onClick={reply.isReplying ? reply.cancelReply : reply.openReply} className="font-medium hover:text-white transition-colors">Reply</button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
          <button onClick={() => reaction.toggle('like')} className="p-1.5 active:scale-125 transition-transform">
            <Heart className={`w-5 h-5 transition-colors ${likeReaction?.isActive ? 'text-[#FE2C55] fill-[#FE2C55]' : 'text-[#8A8B91] hover:text-[#FE2C55]'}`} />
          </button>
          <span className="text-[11px] text-[#8A8B91]">{likeReaction?.count || 0}</span>
        </div>
      </div>
      {reply.isReplying && (
        <div className="ml-13 mt-2.5 flex gap-2 items-center">
          <input value={reply.replyContent} onChange={e => reply.setReplyContent(e.target.value)} placeholder={`Reply to @${comment.author.name}`} className="flex-1 bg-[#2F2F2F] rounded-full px-4 py-2.5 text-sm text-white placeholder:text-[#8A8B91] outline-none focus:ring-1 focus:ring-[#FE2C55]/50 transition-all" autoFocus onKeyDown={e => { if (e.key === 'Enter') reply.submitReply(); }} />
          <button onClick={reply.submitReply} disabled={!reply.replyContent.trim()} className="text-sm font-bold text-[#FE2C55] disabled:opacity-40 transition-colors">Post</button>
        </div>
      )}
      {replies.length > 0 && (
        <div className="ml-13 mt-3">
          <button onClick={toggleReplies} className="text-xs font-medium text-[#8A8B91] flex items-center gap-2 hover:text-white transition-colors">
            <div className="w-6 h-px bg-[#8A8B91]" />
            {showReplies ? 'Hide' : 'View'} {replies.length} replies
          </button>
          {showReplies && (
            <div className="mt-3 space-y-3">
              {replies.map(r => (
                <TTReply key={r.id} comment={r} tree={tree} currentUser={currentUser} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TTReply = ({ comment, tree, currentUser }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser }) => {
  const { reaction } = useComment(comment, {
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
  });
  const likeReaction = comment.reactions?.find(r => r.id === 'like');

  return (
    <div className="flex gap-2.5">
      <img src={comment.author.avatarUrl} alt="" className="w-7 h-7 rounded-full shrink-0" />
      <div className="flex-1">
        <span className="text-xs font-bold text-white">{comment.author.name}</span>
        <p className="text-[13px] text-[#E8E8E8]">{comment.content}</p>
        <span className="text-[11px] text-[#8A8B91]">{formatRelativeTime(comment.createdAt)}</span>
      </div>
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <button onClick={() => reaction.toggle('like')} className="p-1 active:scale-125 transition-transform">
          <Heart className={`w-3.5 h-3.5 transition-colors ${likeReaction?.isActive ? 'text-[#FE2C55] fill-[#FE2C55]' : 'text-[#8A8B91] hover:text-[#FE2C55]'}`} />
        </button>
        {(likeReaction?.count ?? 0) > 0 && <span className="text-[10px] text-[#8A8B91]">{likeReaction?.count}</span>}
      </div>
    </div>
  );
};

const TikTokStyle = ({ tree, currentUser }: Props) => {
  const [text, setText] = useState('');

  return (
    <div className="bg-[#161823] text-white p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold">Comments ({tree.totalCount})</h3>
      </div>
      {tree.comments.map(c => <TTComment key={c.id} comment={c} tree={tree} currentUser={currentUser} />)}
      <div className="flex gap-2.5 items-center mt-4 pt-4 border-t border-[#2F2F2F]">
        <img src={currentUser.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
        <div className="flex-1 bg-[#2F2F2F] rounded-full flex items-center px-4">
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Add comment..." className="flex-1 bg-transparent text-sm text-white placeholder:text-[#8A8B91] outline-none py-2.5" onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { tree.addComment(text.trim()); setText(''); } }} />
          <button onClick={() => { if (text.trim()) { tree.addComment(text.trim()); setText(''); } }} disabled={!text.trim()} className="text-sm font-bold text-[#FE2C55] disabled:opacity-40 transition-colors">Post</button>
        </div>
      </div>
    </div>
  );
};

export default TikTokStyle;
