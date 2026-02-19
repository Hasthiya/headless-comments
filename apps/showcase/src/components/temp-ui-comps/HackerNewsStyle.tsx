import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { tree: UseCommentTreeReturn; currentUser: CommentUser; }

const HNComment = ({ comment, tree, currentUser, depth = 0 }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser; depth?: number }) => {
  const { isAuthor, reply, reaction, showReplies, toggleReplies, deleteComment } = useComment(comment, {
    onReply: async (id, c) => { tree.addReply(id, c); },
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
    onDelete: async (id) => { tree.deleteComment(id); },
  });
  const likeReaction = comment.reactions?.find(r => r.id === 'like');
  const replies = comment.replies || [];

  return (
    <div className={depth > 0 ? 'ml-5 pl-4 border-l-2 border-[#FF6600]/10' : ''}>
      <div className="py-2">
        <div className="flex items-center gap-1.5 text-xs mb-1">
          <button onClick={() => reaction.toggle('like')} className={`hover:text-[#FF6600] transition-colors ${likeReaction?.isActive ? 'text-[#FF6600]' : 'text-[#828282]'}`}>
            <ChevronUp className="w-4 h-4" />
          </button>
          <span className="text-[#FF6600] font-medium hover:underline cursor-pointer">{comment.author.name}</span>
          <span className="text-[#828282]">{formatRelativeTime(comment.createdAt)}</span>
          {(likeReaction?.count ?? 0) > 0 && <span className="text-[#828282]">| {likeReaction?.count} points</span>}
        </div>
        <p className="text-[13px] text-[#828282] leading-relaxed ml-5">{comment.content}</p>
        <div className="flex items-center gap-3 ml-5 mt-1 text-xs text-[#828282]">
          <button onClick={reply.isReplying ? reply.cancelReply : reply.openReply} className="hover:underline hover:text-[#FF6600] transition-colors">reply</button>
          {isAuthor && <button onClick={deleteComment} className="hover:underline hover:text-red-500 transition-colors">delete</button>}
          {replies.length > 0 && <button onClick={toggleReplies} className="hover:underline hover:text-[#FF6600] transition-colors">[{showReplies ? '−' : '+'}] {replies.length}</button>}
        </div>
        {reply.isReplying && (
          <div className="ml-5 mt-2.5">
            <textarea value={reply.replyContent} onChange={e => reply.setReplyContent(e.target.value)} className="w-full bg-white text-[#222] text-sm p-2.5 border border-[#ccc] rounded font-mono min-h-[60px] focus:border-[#FF6600] outline-none transition-colors" autoFocus />
            <button onClick={reply.submitReply} disabled={!reply.replyContent.trim()} className="text-xs bg-[#F6F6EF] border border-[#ccc] px-3 py-1.5 mt-1.5 hover:bg-[#E6E6DF] disabled:opacity-40 rounded transition-colors">reply</button>
          </div>
        )}
      </div>
      {showReplies && replies.map(r => <HNComment key={r.id} comment={r} tree={tree} currentUser={currentUser} depth={depth + 1} />)}
    </div>
  );
};

const HackerNewsStyle = ({ tree, currentUser }: Props) => {
  const [text, setText] = useState('');

  return (
    <div className="bg-[#F6F6EF] text-[#000] p-5 rounded-2xl" style={{ fontFamily: 'Verdana, Geneva, sans-serif' }}>
      <div className="bg-[#FF6600] px-3 py-2 mb-5 flex items-center gap-2.5 rounded-lg">
        <span className="text-sm font-bold text-white border border-white w-5 h-5 flex items-center justify-center">Y</span>
        <span className="text-[13px] font-bold text-white">Hacker News</span>
      </div>
      <div className="mb-5">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Add comment..." className="w-full bg-white border border-[#ccc] text-sm text-[#222] p-2.5 font-mono min-h-[60px] rounded focus:border-[#FF6600] outline-none transition-colors" />
        <button onClick={() => { if (text.trim()) { tree.addComment(text.trim()); setText(''); } }} disabled={!text.trim()} className="text-xs bg-[#F6F6EF] border border-[#ccc] px-4 py-1.5 mt-1.5 hover:bg-[#E6E6DF] disabled:opacity-40 rounded transition-colors">add comment</button>
      </div>
      {tree.comments.map(c => <HNComment key={c.id} comment={c} tree={tree} currentUser={currentUser} />)}
    </div>
  );
};

export default HackerNewsStyle;
