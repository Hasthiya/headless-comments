import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { useState } from 'react';

interface Props { tree: UseCommentTreeReturn; currentUser: CommentUser; }

const MediumComment = ({ comment, tree, currentUser }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser }) => {
  const { isAuthor, edit, reply, reaction, showReplies, toggleReplies, deleteComment } = useComment(comment, {
    onEdit: async (id, c) => { tree.editComment(id, c); },
    onReply: async (id, c) => { tree.addReply(id, c); },
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
    onDelete: async (id) => { tree.deleteComment(id); },
  });
  const likeReaction = comment.reactions?.find(r => r.id === 'like');
  const replies = comment.replies || [];

  return (
    <div className="py-6 border-b border-[#E6E6E6]/80 last:border-0">
      <div className="flex items-center gap-3 mb-3">
        <img src={comment.author.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
        <div>
          <span className="text-sm font-medium text-[#242424] block hover:underline cursor-pointer">{comment.author.name}</span>
          <span className="text-xs text-[#6B6B6B]">{formatRelativeTime(comment.createdAt)}</span>
        </div>
      </div>
      {edit.isEditing ? (
        <div>
          <textarea value={edit.editContent} onChange={e => edit.setEditContent(e.target.value)} className="w-full border border-[#E6E6E6] rounded-lg p-4 text-[16px] text-[#242424] leading-[1.8] focus:border-[#1A8917] outline-none transition-colors" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }} />
          <div className="flex gap-2 mt-3">
            <button onClick={edit.submitEdit} className="text-sm bg-[#1A8917] text-white px-5 py-2 rounded-full font-medium hover:bg-[#0F730C] transition-colors">Save</button>
            <button onClick={edit.cancelEdit} className="text-sm text-[#6B6B6B] hover:text-[#242424] transition-colors">Cancel</button>
          </div>
        </div>
      ) : (
        <p className="text-[16px] text-[#242424] leading-[1.8]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{comment.content}</p>
      )}
      {!edit.isEditing && (
        <div className="flex items-center gap-5 mt-4">
          <button onClick={() => reaction.toggle('like')} className={`flex items-center gap-2 text-sm transition-colors ${likeReaction?.isActive ? 'text-[#1A8917]' : 'text-[#6B6B6B] hover:text-[#242424]'}`}>
            <span className="text-xl active:scale-125 transition-transform">👏</span>
            {(likeReaction?.count ?? 0) > 0 && <span className="font-medium">{likeReaction?.count}</span>}
          </button>
          <button onClick={reply.isReplying ? reply.cancelReply : reply.openReply} className="text-sm text-[#6B6B6B] hover:text-[#242424] transition-colors">Reply</button>
          {isAuthor && <button onClick={() => edit.startEditing(comment.content)} className="text-sm text-[#6B6B6B] hover:text-[#242424] transition-colors">Edit</button>}
          {isAuthor && <button onClick={deleteComment} className="text-sm text-[#6B6B6B] hover:text-red-500 transition-colors">Delete</button>}
        </div>
      )}
      {reply.isReplying && (
        <div className="mt-4 ml-13">
          <textarea value={reply.replyContent} onChange={e => reply.setReplyContent(e.target.value)} placeholder="Write a response..." className="w-full border-0 border-b-2 border-[#E6E6E6] text-[16px] text-[#242424] py-2 outline-none focus:border-[#1A8917] transition-colors" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }} autoFocus />
          <div className="flex justify-end gap-3 mt-3">
            <button onClick={reply.cancelReply} className="text-sm text-[#6B6B6B] hover:text-[#242424] transition-colors">Cancel</button>
            <button onClick={reply.submitReply} disabled={!reply.replyContent.trim()} className="text-sm bg-[#1A8917] text-white px-5 py-2 rounded-full font-medium disabled:opacity-40 hover:bg-[#0F730C] transition-colors">Respond</button>
          </div>
        </div>
      )}
      {replies.length > 0 && (
        <>
          <button onClick={toggleReplies} className="text-sm text-[#1A8917] font-medium mt-4 hover:text-[#0F730C] transition-colors">
            {showReplies ? 'Hide' : 'View'} {replies.length} responses
          </button>
          {showReplies && (
            <div className="ml-13 mt-3 border-l-2 border-[#E6E6E6] pl-5">
              {replies.map(r => (
                <MediumReply key={r.id} comment={r} tree={tree} currentUser={currentUser} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const MediumReply = ({ comment, tree, currentUser }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser }) => {
  const { reaction } = useComment(comment, {
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
  });
  const likeReaction = comment.reactions?.find(r => r.id === 'like');

  return (
    <div className="py-4">
      <div className="flex items-center gap-2.5 mb-2">
        <img src={comment.author.avatarUrl} alt="" className="w-7 h-7 rounded-full" />
        <span className="text-sm font-medium text-[#242424]">{comment.author.name}</span>
        <span className="text-xs text-[#6B6B6B]">{formatRelativeTime(comment.createdAt)}</span>
      </div>
      <p className="text-[15px] text-[#242424] leading-relaxed" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{comment.content}</p>
      <button onClick={() => reaction.toggle('like')} className={`flex items-center gap-1.5 mt-2 text-sm transition-colors ${likeReaction?.isActive ? 'text-[#1A8917]' : 'text-[#6B6B6B] hover:text-[#242424]'}`}>
        <span className="text-base active:scale-125 transition-transform">👏</span>
        {(likeReaction?.count ?? 0) > 0 && <span className="text-xs font-medium">{likeReaction?.count}</span>}
      </button>
    </div>
  );
};

const MediumStyle = ({ tree, currentUser }: Props) => {
  const [text, setText] = useState('');

  return (
    <div className="bg-white text-[#242424] p-6 rounded-2xl" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <h3 className="text-xl font-bold mb-5 tracking-tight">Responses ({tree.totalCount})</h3>
      <div className="mb-5 border border-[#E6E6E6] rounded-xl p-5">
        <div className="flex gap-3 items-start">
          <img src={currentUser.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What are your thoughts?" className="w-full text-[16px] text-[#242424] placeholder:text-[#B3B3B3] outline-none resize-none min-h-[70px]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }} />
            <div className="flex justify-end mt-2">
              <button onClick={() => { if (text.trim()) { tree.addComment(text.trim()); setText(''); } }} disabled={!text.trim()} className="text-sm bg-[#1A8917] text-white px-5 py-2 rounded-full font-medium disabled:opacity-40 hover:bg-[#0F730C] transition-colors">Respond</button>
            </div>
          </div>
        </div>
      </div>
      {tree.comments.map(c => <MediumComment key={c.id} comment={c} tree={tree} currentUser={currentUser} />)}
    </div>
  );
};

export default MediumStyle;
