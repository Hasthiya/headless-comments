import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface Props { tree: UseCommentTreeReturn; currentUser: CommentUser; }

const IGComment = ({ comment, tree, currentUser, depth = 0 }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser; depth?: number }) => {
  const { isAuthor, reply, reaction, showReplies, toggleReplies, deleteComment } = useComment(comment, {
    onReply: async (id, c) => { tree.addReply(id, c); },
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
    onDelete: async (id) => { tree.deleteComment(id); },
  });
  const likeReaction = comment.reactions?.find(r => r.id === 'like');
  const replies = comment.replies || [];

  return (
    <div className={`${depth > 0 ? 'ml-14' : ''} mb-4`}>
      <div className="flex gap-3 items-start">
        <img src={comment.author.avatarUrl} alt="" className="w-9 h-9 rounded-full ring-2 ring-gradient-to-br ring-pink-500/20" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] leading-snug">
            <span className="font-semibold text-white mr-2">{comment.author.name}</span>
            <span className="text-[#E0E0E0]">{comment.content}</span>
          </p>
          <div className="flex items-center gap-4 mt-1.5 text-xs text-[#A8A8A8]">
            <span>{formatRelativeTime(comment.createdAt)}</span>
            {(likeReaction?.count ?? 0) > 0 && <span className="font-semibold">{likeReaction?.count} likes</span>}
            <button onClick={reply.isReplying ? reply.cancelReply : reply.openReply} className="font-semibold hover:text-white transition-colors">Reply</button>
            {isAuthor && <button onClick={deleteComment} className="font-semibold text-red-400/80 hover:text-red-400 transition-colors">Delete</button>}
          </div>
        </div>
        <button onClick={() => reaction.toggle('like')} className="mt-2 shrink-0 active:scale-125 transition-transform">
          <Heart className={`w-4 h-4 transition-colors ${likeReaction?.isActive ? 'text-[#ED4956] fill-[#ED4956]' : 'text-[#A8A8A8] hover:text-[#ED4956]'}`} />
        </button>
      </div>
      {reply.isReplying && (
        <div className="ml-12 mt-2.5 flex gap-2">
          <input value={reply.replyContent} onChange={e => reply.setReplyContent(e.target.value)} placeholder={`Reply to @${comment.author.name}...`} className="flex-1 bg-transparent border-b border-[#363636] pb-1.5 text-sm text-white placeholder:text-[#A8A8A8] outline-none focus:border-[#A8A8A8] transition-colors" autoFocus onKeyDown={e => { if (e.key === 'Enter') reply.submitReply(); }} />
          <button onClick={reply.submitReply} disabled={!reply.replyContent.trim()} className="text-xs font-bold text-[#0095F6] disabled:opacity-40">Post</button>
        </div>
      )}
      {replies.length > 0 && (
        <div className="ml-14 mt-3">
          {!showReplies && (
            <button onClick={toggleReplies} className="text-xs text-[#A8A8A8] font-semibold flex items-center gap-3 group">
              <div className="w-6 h-px bg-[#A8A8A8] group-hover:w-8 transition-all" />
              View {replies.length} replies
            </button>
          )}
          {showReplies && (
            <>
              {replies.map(r => <IGComment key={r.id} comment={r} tree={tree} currentUser={currentUser} depth={depth + 1} />)}
              <button onClick={toggleReplies} className="text-xs text-[#A8A8A8] font-semibold mt-1">Hide replies</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const InstagramStyle = ({ tree, currentUser }: Props) => {
  const [text, setText] = useState('');

  return (
    <div className="bg-black text-white p-5 rounded-2xl font-sans">
      <div className="space-y-0">
        {tree.comments.map(c => <IGComment key={c.id} comment={c} tree={tree} currentUser={currentUser} />)}
      </div>
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#262626]">
        <img src={currentUser.avatarUrl} alt="" className="w-9 h-9 rounded-full" />
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-transparent text-sm text-white placeholder:text-[#A8A8A8] outline-none" onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { tree.addComment(text.trim()); setText(''); } }} />
        <button onClick={() => { if (text.trim()) { tree.addComment(text.trim()); setText(''); } }} disabled={!text.trim()} className="text-sm font-bold text-[#0095F6] disabled:opacity-40 hover:text-white transition-colors">Post</button>
      </div>
    </div>
  );
};

export default InstagramStyle;
