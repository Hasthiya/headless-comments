import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { ThumbsUp, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface Props { tree: UseCommentTreeReturn; currentUser: CommentUser; }

const FBComment = ({ comment, tree, currentUser, depth = 0 }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser; depth?: number }) => {
  const { isAuthor, edit, reply, reaction, showReplies, toggleReplies, deleteComment } = useComment(comment, {
    onEdit: async (id, c) => { tree.editComment(id, c); },
    onReply: async (id, c) => { tree.addReply(id, c); },
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
    onDelete: async (id) => { tree.deleteComment(id); },
  });
  const likeReaction = comment.reactions?.find(r => r.id === 'like');
  const replies = comment.replies || [];

  return (
    <div className={`${depth > 0 ? 'ml-12' : ''} mb-3`}>
      <div className="flex gap-2.5">
        <img src={comment.author.avatarUrl} alt="" className="w-9 h-9 rounded-full mt-0.5 shrink-0 ring-1 ring-white/5" />
        <div className="flex-1">
          <div className="bg-[#3A3B3C] rounded-2xl px-3.5 py-2.5 inline-block max-w-full relative group">
            <span className="text-[13px] font-semibold text-[#E4E6EB] block">{comment.author.name}</span>
            {edit.isEditing ? (
              <div className="mt-1">
                <textarea value={edit.editContent} onChange={e => edit.setEditContent(e.target.value)} className="w-full bg-[#242526] rounded-lg p-2.5 text-sm text-[#E4E6EB] outline-none border border-[#4E4F50] focus:border-[#2D88FF] transition-colors" />
                <div className="flex gap-2 mt-1.5">
                  <button onClick={edit.submitEdit} className="text-xs text-[#2D88FF] font-semibold">Save</button>
                  <button onClick={edit.cancelEdit} className="text-xs text-[#B0B3B8]">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-[15px] text-[#E4E6EB] leading-snug">{comment.content}</p>
            )}
            {(likeReaction?.count ?? 0) > 0 && (
              <div className="absolute -bottom-2.5 right-3 bg-[#3A3B3C] rounded-full px-2 py-0.5 flex items-center gap-1 shadow-lg border border-white/5">
                <div className="w-4 h-4 rounded-full bg-[#2D88FF] flex items-center justify-center">
                  <ThumbsUp className="w-2.5 h-2.5 text-white" fill="white" />
                </div>
                <span className="text-[11px] text-[#B0B3B8] font-medium">{likeReaction?.count}</span>
              </div>
            )}
          </div>
          {!edit.isEditing && (
            <div className="flex items-center gap-4 mt-1.5 ml-3 text-xs font-semibold text-[#B0B3B8]">
              <div className="relative group">
                <button onClick={() => reaction.toggle('like')} className={`hover:underline transition-colors ${likeReaction?.isActive ? 'text-[#2D88FF]' : ''}`}>Like</button>
                <div className="absolute bottom-6 left-0 bg-white shadow-xl rounded-full px-2 py-1 flex gap-1 transform scale-0 group-hover:scale-100 transition-transform origin-bottom-left z-20 border border-black/5">
                  <button onClick={() => reaction.toggle('like')} className="text-xl hover:scale-125 transition-transform p-1">👍</button>
                  <button onClick={() => reaction.toggle('love')} className="text-xl hover:scale-125 transition-transform p-1">❤️</button>
                  <button onClick={() => reaction.toggle('haha')} className="text-xl hover:scale-125 transition-transform p-1">😂</button>
                  <button onClick={() => reaction.toggle('wow')} className="text-xl hover:scale-125 transition-transform p-1">😮</button>
                  <button onClick={() => reaction.toggle('sad')} className="text-xl hover:scale-125 transition-transform p-1">😢</button>
                  <button onClick={() => reaction.toggle('angry')} className="text-xl hover:scale-125 transition-transform p-1">😡</button>
                </div>
              </div>
              <button onClick={reply.isReplying ? reply.cancelReply : reply.openReply} className="hover:underline">Reply</button>
              {isAuthor && <button onClick={() => edit.startEditing(comment.content)} className="hover:underline">Edit</button>}
              {isAuthor && <button onClick={deleteComment} className="hover:underline text-red-400/80">Delete</button>}
              <span className="text-[#65676B] font-normal">{formatRelativeTime(comment.createdAt)}</span>
            </div>
          )}
          {reply.isReplying && (
            <div className="flex gap-2 mt-2.5 items-center">
              <img src={currentUser.avatarUrl} alt="" className="w-7 h-7 rounded-full ring-1 ring-white/5" />
              <div className="flex-1 bg-[#3A3B3C] rounded-full px-4 flex items-center">
                <input value={reply.replyContent} onChange={e => reply.setReplyContent(e.target.value)} placeholder={`Reply to ${comment.author.name}...`} className="flex-1 bg-transparent py-2 text-sm text-[#E4E6EB] placeholder:text-[#B0B3B8] outline-none" onKeyDown={e => { if (e.key === 'Enter') reply.submitReply(); }} autoFocus />
                <button onClick={reply.submitReply} disabled={!reply.replyContent.trim()} className="text-xs font-semibold text-[#2D88FF] disabled:opacity-40">Post</button>
              </div>
            </div>
          )}
          {replies.length > 0 && (
            <>
              {!showReplies && (
                <button onClick={toggleReplies} className="flex items-center gap-1.5 text-xs font-semibold text-[#B0B3B8] mt-2 ml-3 hover:underline">
                  <MessageCircle className="w-3.5 h-3.5" /> {replies.length} replies
                </button>
              )}
              {showReplies && (
                <div className="mt-2">
                  {replies.map(r => <FBComment key={r.id} comment={r} tree={tree} currentUser={currentUser} depth={depth + 1} />)}
                  <button onClick={toggleReplies} className="text-xs text-[#B0B3B8] ml-3 hover:underline font-semibold">Hide replies</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const FacebookStyle = ({ tree, currentUser }: Props) => {
  const [text, setText] = useState('');

  return (
    <div className="bg-[#242526] text-[#E4E6EB] p-5 rounded-2xl">
      <div className="flex gap-2.5 mb-5 items-center">
        <img src={currentUser.avatarUrl} alt="" className="w-9 h-9 rounded-full ring-1 ring-white/5" />
        <div className="flex-1 bg-[#3A3B3C] rounded-full px-4 flex items-center">
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Write a comment..." className="flex-1 bg-transparent py-2.5 text-sm text-[#E4E6EB] placeholder:text-[#B0B3B8] outline-none" onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { tree.addComment(text.trim()); setText(''); } }} />
        </div>
      </div>
      {tree.comments.map(c => <FBComment key={c.id} comment={c} tree={tree} currentUser={currentUser} />)}
    </div>
  );
};

export default FacebookStyle;
