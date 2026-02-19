import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { Heart, MessageCircle, Repeat2, BarChart3, Bookmark, Share } from 'lucide-react';
import { useState } from 'react';

interface Props { tree: UseCommentTreeReturn; currentUser: CommentUser; }

const Tweet = ({ comment, tree, currentUser, depth = 0 }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser; depth?: number }) => {
  const { isAuthor, reply, reaction, showReplies, toggleReplies, deleteComment } = useComment(comment, {
    onReply: async (id, c) => { tree.addReply(id, c); },
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
    onDelete: async (id) => { tree.deleteComment(id); },
  });
  const likeReaction = comment.reactions?.find(r => r.id === 'like');
  const replies = comment.replies || [];

  return (
    <div>
      <div className="flex gap-3 px-4 py-3 border-b border-[#2F3336] hover:bg-white/[0.02] transition-colors">
        <div className="flex flex-col items-center shrink-0">
          <img src={comment.author.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
          {replies.length > 0 && showReplies && <div className="w-0.5 flex-1 bg-[#333639] mt-1 rounded-full" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-[15px] font-bold text-[#E7E9EA]">{comment.author.name}</span>
            {comment.author.isVerified && (
              <svg viewBox="0 0 22 22" className="w-4.5 h-4.5 text-[#1D9BF0]" fill="currentColor"><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.706 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/></svg>
            )}
            <span className="text-[15px] text-[#71767B]">@{comment.author.name.toLowerCase().replace(' ', '')} · {formatRelativeTime(comment.createdAt)}</span>
          </div>
          <p className="text-[15px] text-[#E7E9EA] leading-relaxed mt-1">{comment.content}</p>
          <div className="flex items-center justify-between mt-3 max-w-[400px] -ml-2">
            <button onClick={reply.isReplying ? reply.cancelReply : reply.openReply} className="flex items-center gap-1 text-[#71767B] hover:text-[#1D9BF0] group/btn transition-colors">
              <div className="p-2 rounded-full group-hover/btn:bg-[#1D9BF0]/10 transition-colors"><MessageCircle className="w-[18px] h-[18px]" /></div>
              {replies.length > 0 && <span className="text-[13px]">{replies.length}</span>}
            </button>
            <button className="flex items-center gap-1 text-[#71767B] hover:text-[#00BA7C] group/btn transition-colors">
              <div className="p-2 rounded-full group-hover/btn:bg-[#00BA7C]/10 transition-colors"><Repeat2 className="w-[18px] h-[18px]" /></div>
            </button>
            <button onClick={() => reaction.toggle('like')} className={`flex items-center gap-1 group/btn transition-colors ${likeReaction?.isActive ? 'text-[#F91880]' : 'text-[#71767B] hover:text-[#F91880]'}`}>
              <div className="p-2 rounded-full group-hover/btn:bg-[#F91880]/10 transition-colors"><Heart className={`w-[18px] h-[18px] ${likeReaction?.isActive ? 'fill-current' : ''}`} /></div>
              {(likeReaction?.count ?? 0) > 0 && <span className="text-[13px]">{likeReaction?.count}</span>}
            </button>
            <button className="text-[#71767B] hover:text-[#1D9BF0] group/btn transition-colors">
              <div className="p-2 rounded-full group-hover/btn:bg-[#1D9BF0]/10 transition-colors"><BarChart3 className="w-[18px] h-[18px]" /></div>
            </button>
            <div className="flex items-center gap-0">
              <button className="text-[#71767B] hover:text-[#1D9BF0] p-2 rounded-full hover:bg-[#1D9BF0]/10 transition-colors"><Bookmark className="w-[18px] h-[18px]" /></button>
              <button className="text-[#71767B] hover:text-[#1D9BF0] p-2 rounded-full hover:bg-[#1D9BF0]/10 transition-colors"><Share className="w-[18px] h-[18px]" /></button>
            </div>
          </div>
          {reply.isReplying && (
            <div className="flex gap-3 mt-3 pt-3 border-t border-[#2F3336]">
              <img src={currentUser.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <textarea value={reply.replyContent} onChange={e => reply.setReplyContent(e.target.value)} placeholder="Post your reply" className="w-full bg-transparent text-[15px] text-[#E7E9EA] placeholder:text-[#71767B] outline-none resize-none min-h-[50px]" autoFocus />
                <div className="flex justify-end">
                  <button onClick={reply.submitReply} disabled={!reply.replyContent.trim()} className="bg-[#1D9BF0] text-white text-sm font-bold px-5 py-2 rounded-full disabled:opacity-50 hover:bg-[#1A8CD8] transition-colors">Reply</button>
                </div>
              </div>
            </div>
          )}
        </div>
        {isAuthor && <button onClick={deleteComment} className="text-lg text-[#71767B] hover:text-red-400 self-start transition-colors">×</button>}
      </div>
      {replies.length > 0 && !showReplies && (
        <button onClick={toggleReplies} className="text-sm text-[#1D9BF0] px-4 py-2.5 hover:bg-[#1D9BF0]/10 w-full text-left font-medium transition-colors">Show replies</button>
      )}
      {showReplies && replies.map(r => <Tweet key={r.id} comment={r} tree={tree} currentUser={currentUser} depth={depth + 1} />)}
    </div>
  );
};

const TwitterStyle = ({ tree, currentUser }: Props) => {
  const [text, setText] = useState('');

  return (
    <div className="bg-black text-[#E7E9EA] rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-[#2F3336]">
        <div className="flex gap-3">
          <img src={currentUser.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What is happening?!" className="w-full bg-transparent text-xl text-[#E7E9EA] placeholder:text-[#71767B] outline-none resize-none min-h-[50px]" />
            <div className="flex justify-end pt-3 border-t border-[#2F3336]">
              <button onClick={() => { if (text.trim()) { tree.addComment(text.trim()); setText(''); } }} disabled={!text.trim()} className="bg-[#1D9BF0] text-white text-[15px] font-bold px-6 py-2 rounded-full disabled:opacity-50 hover:bg-[#1A8CD8] transition-colors">Post</button>
            </div>
          </div>
        </div>
      </div>
      {tree.comments.map(c => <Tweet key={c.id} comment={c} tree={tree} currentUser={currentUser} />)}
    </div>
  );
};

export default TwitterStyle;
