import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Props { tree: UseCommentTreeReturn; currentUser: CommentUser; }

const SOComment = ({ comment, tree, currentUser, depth = 0 }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser; depth?: number }) => {
  const { isAuthor, edit, reply, reaction, showReplies, toggleReplies, deleteComment } = useComment(comment, {
    onEdit: async (id, c) => { tree.editComment(id, c); },
    onReply: async (id, c) => { tree.addReply(id, c); },
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
    onDelete: async (id) => { tree.deleteComment(id); },
  });
  const likeReaction = comment.reactions?.find(r => r.id === 'like');
  const dislikeReaction = comment.reactions?.find(r => r.id === 'dislike');
  const netScore = (likeReaction?.count ?? 0) - (dislikeReaction?.count ?? 0);
  const replies = comment.replies || [];

  return (
    <div className={`border-b border-[#3B4045]/60 py-5 last:border-0 ${depth > 0 ? 'ml-6 border-l border-[#3B4045]/30 pl-4' : ''}`}>
      <div className="flex gap-5">
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <button onClick={() => reaction.toggle('like')} className={`p-1 rounded hover:bg-white/5 transition-colors ${likeReaction?.isActive ? 'text-[#F48024]' : 'text-[#6A737C]'}`}>
            <ChevronUp className="w-7 h-7" />
          </button>
          <span className={`text-xl font-medium ${netScore > 0 ? 'text-[#F48024]' : netScore < 0 ? 'text-[#cf4844]' : 'text-[#ACBCC3]'}`}>{netScore}</span>
          <button onClick={() => reaction.toggle('dislike')} className={`p-1 rounded hover:bg-white/5 transition-colors ${dislikeReaction?.isActive ? 'text-[#cf4844]' : 'text-[#6A737C]'}`}>
            <ChevronDown className="w-7 h-7" />
          </button>
        </div>
        <div className="flex-1">
          {edit.isEditing ? (
            <div>
              <textarea value={edit.editContent} onChange={e => edit.setEditContent(e.target.value)} className="w-full bg-[#1E1E1E] border border-[#3B4045] rounded-lg p-3 text-sm text-[#D1D5DB] font-mono min-h-[100px] focus:border-[#0A95FF] outline-none transition-colors" />
              <div className="flex gap-2 mt-3">
                <button onClick={edit.submitEdit} className="text-sm bg-[#0A95FF] text-white px-4 py-2 rounded-md font-medium hover:bg-[#0074CC] transition-colors">Save edits</button>
                <button onClick={edit.cancelEdit} className="text-sm text-[#6A737C] px-4 py-2 rounded-md border border-[#3B4045] hover:border-[#6A737C] transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-[15px] text-[#D1D5DB] leading-relaxed">{comment.content}</p>
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3 text-xs text-[#6A737C]">
              <button onClick={reply.isReplying ? reply.cancelReply : reply.openReply} className="hover:text-[#ACBCC3] transition-colors">add a comment</button>
              {isAuthor && <button onClick={() => edit.startEditing(comment.content)} className="hover:text-[#ACBCC3] transition-colors">edit</button>}
              {isAuthor && <button onClick={deleteComment} className="hover:text-red-400 transition-colors">delete</button>}
            </div>
            <div className="flex items-center gap-2.5 bg-[#2D6085]/20 rounded-lg px-3 py-2">
              <span className="text-xs text-[#6A737C]">answered {formatRelativeTime(comment.createdAt)}</span>
              <img src={comment.author.avatarUrl} alt="" className="w-5 h-5 rounded" />
              <span className="text-xs text-[#0A95FF] font-medium hover:underline cursor-pointer">{comment.author.name}</span>
            </div>
          </div>
          {reply.isReplying && (
            <div className="mt-4 border-t border-[#3B4045]/40 pt-4">
              <textarea value={reply.replyContent} onChange={e => reply.setReplyContent(e.target.value)} placeholder="Add a comment..." className="w-full bg-[#1E1E1E] border border-[#3B4045] rounded-lg p-3 text-sm text-[#D1D5DB] min-h-[60px] focus:border-[#0A95FF] outline-none transition-colors" autoFocus />
              <button onClick={reply.submitReply} disabled={!reply.replyContent.trim()} className="text-sm bg-[#0A95FF] text-white px-4 py-2 rounded-md mt-2 disabled:opacity-40 font-medium hover:bg-[#0074CC] transition-colors">Add Comment</button>
            </div>
          )}
          {replies.length > 0 && (
            <div className="mt-4 border-t border-[#3B4045]/40 pt-3">
              <button onClick={toggleReplies} className="text-xs text-[#6A737C] hover:text-[#ACBCC3] mb-2 transition-colors">
                {showReplies ? 'hide' : 'show'} {replies.length} {replies.length === 1 ? 'comment' : 'comments'}
              </button>
              {showReplies && replies.map(r => (
                <SOComment key={r.id} comment={r} tree={tree} currentUser={currentUser} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StackOverflowStyle = ({ tree, currentUser }: Props) => {
  const [text, setText] = useState('');

  return (
    <div className="bg-[#1B1B1B] text-[#D1D5DB] p-5 rounded-2xl" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#3B4045]/60">
        <h3 className="text-lg text-[#ACBCC3] font-medium">{tree.totalCount} Answers</h3>
        <div className="ml-auto text-xs text-[#6A737C]">Sorted by: <span className="text-[#ACBCC3] font-medium">Votes</span></div>
      </div>
      {tree.comments.map(c => <SOComment key={c.id} comment={c} tree={tree} currentUser={currentUser} />)}
      <div className="mt-6">
        <h3 className="text-base text-[#ACBCC3] mb-3 font-medium">Your Answer</h3>
        <textarea value={text} onChange={e => setText(e.target.value)} className="w-full bg-[#1E1E1E] border border-[#3B4045] rounded-lg p-3 text-sm text-[#D1D5DB] min-h-[120px] font-mono focus:border-[#0A95FF] outline-none transition-colors" />
        <button onClick={() => { if (text.trim()) { tree.addComment(text.trim()); setText(''); } }} disabled={!text.trim()} className="mt-3 bg-[#0A95FF] text-white text-sm px-5 py-2.5 rounded-md hover:bg-[#0074CC] disabled:opacity-40 font-medium transition-colors">Post Your Answer</button>
      </div>
    </div>
  );
};

export default StackOverflowStyle;
