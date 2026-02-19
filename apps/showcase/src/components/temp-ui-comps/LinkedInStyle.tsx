import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { ThumbsUp, MessageCircle, Globe, Send } from 'lucide-react';
import { useState } from 'react';

interface Props { tree: UseCommentTreeReturn; currentUser: CommentUser; }

const LIComment = ({ comment, tree, currentUser, depth = 0 }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser; depth?: number }) => {
  const { isAuthor, edit, reply, reaction, showReplies, toggleReplies, deleteComment } = useComment(comment, {
    onEdit: async (id, c) => { tree.editComment(id, c); },
    onReply: async (id, c) => { tree.addReply(id, c); },
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
    onDelete: async (id) => { tree.deleteComment(id); },
  });
  const likeReaction = comment.reactions?.find(r => r.id === 'like');
  const replies = comment.replies || [];

  return (
    <div className={`${depth > 0 ? 'ml-12' : ''} mb-1`}>
      <div className="flex gap-3 py-3">
        <img src={comment.author.avatarUrl} alt="" className="w-10 h-10 rounded-full shrink-0 ring-1 ring-white/5" />
        <div className="flex-1">
          <div className="mb-0.5">
            <span className="text-sm font-semibold text-white hover:text-[#70B5F9] cursor-pointer transition-colors">{comment.author.name}</span>
            <p className="text-xs text-[#FFFFFF99] leading-snug">Software Engineer · 3rd+</p>
            <span className="text-[11px] text-[#FFFFFF66] flex items-center gap-1">{formatRelativeTime(comment.createdAt)} · <Globe className="w-3 h-3 inline" /></span>
          </div>
          {edit.isEditing ? (
            <div className="mt-2">
              <textarea value={edit.editContent} onChange={e => edit.setEditContent(e.target.value)} className="w-full bg-[#1D2226] border border-[#38434F] rounded-lg p-3 text-sm text-white outline-none focus:border-[#0A66C2] transition-colors" />
              <div className="flex gap-2 mt-2">
                <button onClick={edit.submitEdit} className="text-xs bg-[#0A66C2] text-white px-4 py-1.5 rounded-full font-medium hover:bg-[#004182] transition-colors">Save</button>
                <button onClick={edit.cancelEdit} className="text-xs text-[#FFFFFF99] hover:text-white transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-[#FFFFFFE6] mt-1.5 leading-relaxed">{comment.content}</p>
          )}
          {(likeReaction?.count ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 mt-2 pb-2 border-b border-[#38434F]/50">
              <span className="text-sm">👍</span>
              <span className="text-xs text-[#FFFFFF99]">{likeReaction?.count}</span>
            </div>
          )}
          {!edit.isEditing && (
            <div className="flex items-center gap-1 mt-1.5 -ml-2">
              <div className="relative group">
                <button onClick={() => reaction.toggle('like')} className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-md hover:bg-white/5 font-semibold transition-colors ${likeReaction?.isActive ? 'text-[#0A66C2]' : 'text-[#FFFFFF99]'}`}>
                  <ThumbsUp className="w-4 h-4" /> Like
                </button>
                <div className="absolute bottom-10 left-[-10px] bg-white text-black shadow-xl rounded-full px-3 py-1.5 flex gap-2 transform scale-0 group-hover:scale-100 transition-all origin-bottom-left z-20 border border-white/20">
                  <button onClick={() => reaction.toggle('like')} className="text-xl hover:scale-125 transition-transform">👍</button>
                  <button onClick={() => reaction.toggle('love')} className="text-xl hover:scale-125 transition-transform">❤️</button>
                  <button onClick={() => reaction.toggle('haha')} className="text-xl hover:scale-125 transition-transform">😂</button>
                  <button onClick={() => reaction.toggle('wow')} className="text-xl hover:scale-125 transition-transform">💡</button>
                  <button onClick={() => reaction.toggle('sad')} className="text-xl hover:scale-125 transition-transform">🤔</button>
                </div>
              </div>
              <button onClick={reply.isReplying ? reply.cancelReply : reply.openReply} className="flex items-center gap-1.5 text-xs text-[#FFFFFF99] px-3 py-2 rounded-md hover:bg-white/5 font-semibold transition-colors">
                <MessageCircle className="w-4 h-4" /> Comment
              </button>
              {isAuthor && (
                <>
                  <button onClick={() => edit.startEditing(comment.content)} className="text-xs text-[#FFFFFF99] px-3 py-2 rounded-md hover:bg-white/5 transition-colors">Edit</button>
                  <button onClick={deleteComment} className="text-xs text-red-400/70 px-3 py-2 rounded-md hover:bg-red-400/10 transition-colors">Delete</button>
                </>
              )}
            </div>
          )}
          {reply.isReplying && (
            <div className="flex gap-2.5 mt-3">
              <img src={currentUser.avatarUrl} alt="" className="w-8 h-8 rounded-full ring-1 ring-white/5" />
              <div className="flex-1 border border-[#38434F] rounded-full flex items-center px-4 focus-within:border-[#0A66C2] transition-colors">
                <input value={reply.replyContent} onChange={e => reply.setReplyContent(e.target.value)} placeholder="Add a reply..." className="flex-1 bg-transparent text-sm text-white placeholder:text-[#FFFFFF66] outline-none py-2.5" onKeyDown={e => { if (e.key === 'Enter') reply.submitReply(); }} autoFocus />
                <button onClick={reply.submitReply} disabled={!reply.replyContent.trim()} className="text-[#0A66C2] disabled:opacity-40 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {replies.length > 0 && (
            <>
              {!showReplies && <button onClick={toggleReplies} className="text-xs font-semibold text-[#FFFFFF99] mt-2 hover:text-white hover:underline transition-colors">{replies.length} replies</button>}
              {showReplies && (
                <div className="mt-2">
                  {replies.map(r => <LIComment key={r.id} comment={r} tree={tree} currentUser={currentUser} depth={depth + 1} />)}
                  <button onClick={toggleReplies} className="text-xs text-[#FFFFFF99] hover:underline transition-colors">Hide replies</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const LinkedInStyle = ({ tree, currentUser }: Props) => {
  const [text, setText] = useState('');

  return (
    <div className="bg-[#1B1F23] text-white p-5 rounded-2xl">
      <div className="flex gap-2.5 mb-5">
        <img src={currentUser.avatarUrl} alt="" className="w-10 h-10 rounded-full ring-1 ring-white/5" />
        <div className="flex-1 border border-[#38434F] rounded-full flex items-center px-4 focus-within:border-[#0A66C2] transition-colors">
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-transparent text-sm text-white placeholder:text-[#FFFFFF66] outline-none py-3" onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { tree.addComment(text.trim()); setText(''); } }} />
          <button onClick={() => { if (text.trim()) { tree.addComment(text.trim()); setText(''); } }} disabled={!text.trim()} className="text-[#0A66C2] disabled:opacity-40 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      {tree.comments.map(c => <LIComment key={c.id} comment={c} tree={tree} currentUser={currentUser} />)}
    </div>
  );
};

export default LinkedInStyle;
