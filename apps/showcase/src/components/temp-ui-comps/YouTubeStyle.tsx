import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { useSortedComments } from '@hasthiya_/headless-comments-react/headless';
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { tree: UseCommentTreeReturn; currentUser: CommentUser; }

const YTComment = ({ comment, tree, currentUser, depth = 0 }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser; depth?: number }) => {
  const { isAuthor, edit, reply, reaction, showReplies, toggleReplies, deleteComment } = useComment(comment, {
    onEdit: async (id, c) => { tree.editComment(id, c); },
    onReply: async (id, c) => { tree.addReply(id, c); },
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
    onDelete: async (id) => { tree.deleteComment(id); },
  });
  const likeReaction = comment.reactions?.find(r => r.id === 'like');
  const dislikeReaction = comment.reactions?.find(r => r.id === 'dislike');
  const replies = comment.replies || [];

  return (
    <div className={`${depth > 0 ? 'ml-14' : ''} mb-5`}>
      <div className="flex gap-3">
        <img src={comment.author.avatarUrl} alt="" className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[13px] font-medium text-white">{comment.author.name}</span>
            <span className="text-xs text-[#AAAAAA]">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          {edit.isEditing ? (
            <div>
              <textarea value={edit.editContent} onChange={e => edit.setEditContent(e.target.value)} className="w-full bg-transparent border-b-2 border-white/30 text-sm text-white py-1.5 outline-none focus:border-[#3EA6FF] transition-colors" />
              <div className="flex justify-end gap-2 mt-3">
                <button onClick={edit.cancelEdit} className="text-sm text-[#AAAAAA] px-4 py-2 rounded-full hover:bg-white/10 transition-colors">Cancel</button>
                <button onClick={edit.submitEdit} className="text-sm bg-[#3EA6FF] text-black font-medium px-4 py-2 rounded-full hover:bg-[#65B8FF] transition-colors">Save</button>
              </div>
            </div>
          ) : (
            <p className="text-[14px] text-[#F1F1F1] leading-relaxed">{comment.content}</p>
          )}
          {!edit.isEditing && (
            <div className="flex items-center gap-1 mt-2">
              <button onClick={() => reaction.toggle('like')} className={`flex items-center gap-1.5 p-2 rounded-full hover:bg-white/10 transition-colors ${likeReaction?.isActive ? 'text-[#3EA6FF]' : 'text-[#AAAAAA]'}`}>
                <ThumbsUp className="w-4 h-4" />
                {(likeReaction?.count ?? 0) > 0 && <span className="text-xs">{likeReaction?.count}</span>}
              </button>
              <button onClick={() => reaction.toggle('dislike')} className={`p-2 rounded-full hover:bg-white/10 transition-colors ${dislikeReaction?.isActive ? 'text-white' : 'text-[#AAAAAA]'}`}><ThumbsDown className="w-4 h-4" /></button>
              <button onClick={reply.isReplying ? reply.cancelReply : reply.openReply} className="text-xs font-medium text-[#AAAAAA] hover:bg-white/10 px-3 py-2 rounded-full transition-colors">Reply</button>
              {isAuthor && <button onClick={() => edit.startEditing(comment.content)} className="text-xs text-[#AAAAAA] hover:bg-white/10 px-3 py-2 rounded-full transition-colors">Edit</button>}
              {isAuthor && <button onClick={deleteComment} className="text-xs text-red-400/80 hover:bg-red-400/10 px-3 py-2 rounded-full transition-colors">Delete</button>}
            </div>
          )}
          {reply.isReplying && (
            <div className="flex gap-3 mt-3">
              <img src={currentUser.avatarUrl} alt="" className="w-7 h-7 rounded-full mt-1" />
              <div className="flex-1">
                <input value={reply.replyContent} onChange={e => reply.setReplyContent(e.target.value)} placeholder="Add a reply..." className="w-full bg-transparent border-b-2 border-white/20 text-sm text-white py-1.5 outline-none placeholder:text-[#AAAAAA] focus:border-white transition-colors" autoFocus onKeyDown={e => { if (e.key === 'Enter') reply.submitReply(); }} />
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={reply.cancelReply} className="text-sm text-[#AAAAAA] px-4 py-2 rounded-full hover:bg-white/10 transition-colors">Cancel</button>
                  <button onClick={reply.submitReply} disabled={!reply.replyContent.trim()} className="text-sm bg-[#3EA6FF] text-black font-medium px-4 py-2 rounded-full disabled:opacity-40 disabled:bg-white/10 disabled:text-[#AAAAAA] hover:bg-[#65B8FF] transition-colors">Reply</button>
                </div>
              </div>
            </div>
          )}
          {replies.length > 0 && (
            <button onClick={toggleReplies} className="flex items-center gap-1.5 text-sm font-medium text-[#3EA6FF] mt-2 hover:bg-[#3EA6FF]/10 px-3 py-1.5 rounded-full -ml-3 transition-colors">
              {showReplies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {replies.length} replies
            </button>
          )}
          {showReplies && replies.map(r => <YTComment key={r.id} comment={r} tree={tree} currentUser={currentUser} depth={depth + 1} />)}
        </div>
      </div>
    </div>
  );
};

const YouTubeStyle = ({ tree, currentUser }: Props) => {
  const { sortedComments, sortOrder, setSortOrder } = useSortedComments(tree.comments, 'popular');
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div className="bg-[#0F0F0F] text-white p-5 rounded-2xl">
      <div className="flex items-center gap-6 mb-5">
        <h3 className="text-base font-bold">{tree.totalCount} Comments</h3>
        <button onClick={() => setSortOrder(sortOrder === 'popular' ? 'newest' : 'popular')} className="flex items-center gap-1.5 text-sm text-[#AAAAAA] hover:text-white transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" /></svg>
          Sort by
        </button>
      </div>
      <div className="flex gap-3 mb-6">
        <img src={currentUser.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <input value={text} onChange={e => setText(e.target.value)} onFocus={() => setFocused(true)} placeholder="Add a comment..." className="w-full bg-transparent border-b-2 border-white/10 text-sm text-white py-2 outline-none placeholder:text-[#AAAAAA] focus:border-white transition-colors" />
          {focused && (
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => { setFocused(false); setText(''); }} className="text-sm text-[#AAAAAA] px-4 py-2 rounded-full hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => { if (text.trim()) { tree.addComment(text.trim()); setText(''); setFocused(false); } }} disabled={!text.trim()} className="text-sm bg-[#3EA6FF] text-black font-medium px-4 py-2 rounded-full disabled:opacity-40 disabled:bg-white/10 disabled:text-[#AAAAAA] hover:bg-[#65B8FF] transition-colors">Comment</button>
            </div>
          )}
        </div>
      </div>
      {sortedComments.map(c => <YTComment key={c.id} comment={c} tree={tree} currentUser={currentUser} />)}
    </div>
  );
};

export default YouTubeStyle;
