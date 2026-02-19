import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { useSortedComments } from '@hasthiya_/headless-comments-react/headless';
import { ArrowBigUp, ArrowBigDown, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface Props { tree: UseCommentTreeReturn; currentUser: CommentUser; }

const RedditComment = ({ comment, tree, currentUser, depth = 0 }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser; depth?: number }) => {
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
    <div className={depth > 0 ? 'ml-3 pl-4 border-l-[2px] border-white/[0.08] hover:border-white/20 transition-colors' : ''}>
      <div className="py-2.5 group">
        <div className="flex items-center gap-2 text-xs mb-1.5">
          <img src={comment.author.avatarUrl} alt="" className="w-6 h-6 rounded-full ring-1 ring-white/10" />
          <span className="font-semibold text-[#D7DADC]">{comment.author.name}</span>
          <span className="text-[#818384]">· {formatRelativeTime(comment.createdAt)}</span>
        </div>
        {edit.isEditing ? (
          <div className="ml-8">
            <textarea value={edit.editContent} onChange={e => edit.setEditContent(e.target.value)} className="w-full bg-[#1A1A1B] border border-[#343536] rounded-xl p-3 text-sm text-[#D7DADC] focus:border-[#FF4500]/50 outline-none transition-colors" />
            <div className="flex gap-2 mt-2">
              <button onClick={edit.submitEdit} className="text-xs text-white bg-[#FF4500] px-4 py-1.5 rounded-full font-medium hover:bg-[#FF5722] transition-colors">Save</button>
              <button onClick={edit.cancelEdit} className="text-xs text-[#818384] hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-[14px] text-[#D7DADC]/90 leading-relaxed mb-2 ml-8">{comment.content}</p>
        )}
        {!edit.isEditing && (
          <div className="flex items-center gap-0.5 text-xs text-[#818384] ml-7">
            <div className="flex items-center bg-[#272729] rounded-full">
              <button onClick={() => reaction.toggle('like')} className={`flex items-center gap-0.5 px-2 py-1.5 rounded-l-full hover:bg-[#FF4500]/10 transition-colors ${likeReaction?.isActive ? 'text-[#FF4500]' : ''}`}>
                <ArrowBigUp className="w-5 h-5" />
              </button>
              <span className={`text-xs font-medium px-1 ${netScore > 0 ? 'text-[#FF4500]' : netScore < 0 ? 'text-[#7193FF]' : ''}`}>{netScore}</span>
              <button onClick={() => reaction.toggle('dislike')} className={`px-2 py-1.5 rounded-r-full hover:bg-[#7193FF]/10 transition-colors ${dislikeReaction?.isActive ? 'text-[#7193FF]' : ''}`}>
                <ArrowBigDown className="w-5 h-5" />
              </button>
            </div>
            <button onClick={reply.isReplying ? reply.cancelReply : reply.openReply} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#272729] transition-colors">
              <MessageSquare className="w-4 h-4" /> Reply
            </button>
            {isAuthor && (
              <>
                <button onClick={() => edit.startEditing(comment.content)} className="px-3 py-1.5 hover:bg-[#272729] rounded-full transition-colors">Edit</button>
                <button onClick={deleteComment} className="px-3 py-1.5 hover:bg-red-500/10 rounded-full text-red-400 transition-colors">Delete</button>
              </>
            )}
          </div>
        )}
        {reply.isReplying && (
          <div className="mt-3 ml-8">
            <textarea value={reply.replyContent} onChange={e => reply.setReplyContent(e.target.value)} placeholder="What are your thoughts?" className="w-full bg-[#1A1A1B] border border-[#343536] rounded-xl p-3 text-sm text-[#D7DADC] placeholder:text-[#818384] min-h-[80px] focus:border-[#FF4500]/50 outline-none transition-colors" autoFocus />
            <div className="flex gap-2 mt-2 justify-end">
              <button onClick={reply.cancelReply} className="text-xs text-[#818384] px-4 py-1.5 rounded-full hover:text-white transition-colors">Cancel</button>
              <button onClick={reply.submitReply} disabled={!reply.replyContent.trim()} className="text-xs bg-[#FF4500] text-white px-4 py-1.5 rounded-full font-medium disabled:opacity-40 hover:bg-[#FF5722] transition-colors">Reply</button>
            </div>
          </div>
        )}
      </div>
      {replies.length > 0 && (
        <>
          <button onClick={toggleReplies} className="text-xs text-[#FF4500] font-medium mb-1 ml-8 hover:text-[#FF5722] transition-colors">{showReplies ? 'Hide' : 'Show'} {replies.length} replies</button>
          {showReplies && replies.map(r => <RedditComment key={r.id} comment={r} tree={tree} currentUser={currentUser} depth={depth + 1} />)}
        </>
      )}
    </div>
  );
};

const RedditStyle = ({ tree, currentUser }: Props) => {
  const { sortedComments, sortOrder, setSortOrder } = useSortedComments(tree.comments, 'newest');
  const [text, setText] = useState('');

  return (
    <div className="bg-[#0E1113] text-[#D7DADC] p-5 rounded-2xl">
      <div className="flex gap-2 mb-5">
        {(['newest', 'oldest', 'popular'] as const).map(o => (
          <button key={o} onClick={() => setSortOrder(o)} className={`text-xs px-4 py-1.5 rounded-full capitalize font-medium transition-all ${sortOrder === o ? 'bg-[#FF4500] text-white shadow-lg shadow-[#FF4500]/20' : 'text-[#818384] hover:bg-[#272729]'}`}>
            {o === 'popular' ? 'top' : o}
          </button>
        ))}
      </div>
      <div className="mb-5">
        <div className="flex gap-3 items-start">
          <img src={currentUser.avatarUrl} alt="" className="w-8 h-8 rounded-full ring-1 ring-white/10" />
          <div className="flex-1">
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What are your thoughts?" className="w-full bg-[#1A1A1B] border border-[#343536] rounded-xl p-3 text-sm text-[#D7DADC] placeholder:text-[#818384] min-h-[80px] focus:border-[#FF4500]/50 outline-none transition-colors" />
            <div className="flex justify-end mt-2">
              <button onClick={() => { if (text.trim()) { tree.addComment(text.trim()); setText(''); } }} disabled={!text.trim()} className="text-xs font-semibold bg-[#FF4500] text-white px-5 py-2 rounded-full disabled:opacity-40 hover:bg-[#FF5722] transition-colors shadow-lg shadow-[#FF4500]/20">Comment</button>
            </div>
          </div>
        </div>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {sortedComments.map(c => <RedditComment key={c.id} comment={c} tree={tree} currentUser={currentUser} />)}
      </div>
    </div>
  );
};

export default RedditStyle;
