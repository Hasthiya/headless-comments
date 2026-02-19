import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { MessageSquare, Smile, Hash } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props { tree: UseCommentTreeReturn; currentUser: CommentUser; }

const REACTION_EMOJIS = [
  { id: 'like', emoji: '👍' },
  { id: 'dislike', emoji: '👎' },
  { id: 'love', emoji: '❤️' },
  { id: 'haha', emoji: '😂' },
  { id: 'wow', emoji: '😮' },
  { id: 'sad', emoji: '😢' },
  { id: 'angry', emoji: '😡' },
];

const SlackMessage = ({ comment, tree, currentUser }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser }) => {
  const { isAuthor, edit, reply, reaction, showReplies, toggleReplies, deleteComment } = useComment(comment, {
    onEdit: async (id, c) => { tree.editComment(id, c); },
    onReply: async (id, c) => { tree.addReply(id, c); },
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
    onDelete: async (id) => { tree.deleteComment(id); },
  });
  const replies = comment.replies || [];

  return (
    <div className="group hover:bg-[#222529]/80 px-5 py-2 -mx-5 transition-colors relative">
      <div className="flex gap-2.5">
        <img src={comment.author.avatarUrl} alt="" className="w-9 h-9 rounded-lg mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold text-white">{comment.author.name}</span>
            <span className="text-[11px] text-[#ABABAD]">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          {edit.isEditing ? (
            <div className="mt-1">
              <textarea value={edit.editContent} onChange={e => edit.setEditContent(e.target.value)} className="w-full bg-[#222529] border border-[#565856] rounded-lg p-2.5 text-sm text-white focus:border-[#007A5A] outline-none transition-colors" />
              <div className="flex gap-2 mt-1.5">
                <button onClick={edit.submitEdit} className="text-xs bg-[#007A5A] text-white px-3 py-1.5 rounded-md font-medium hover:bg-[#148567] transition-colors">Save</button>
                <button onClick={edit.cancelEdit} className="text-xs text-[#ABABAD] hover:text-white transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-[15px] text-[#D1D2D3] leading-relaxed">{comment.content}</p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {comment.reactions?.filter(r => r.count > 0).map(r => (
              <button key={r.id} onClick={() => reaction.toggle(r.id)} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors ${r.isActive ? 'border-[#007A5A]/50 bg-[#007A5A]/15 text-[#1D9F73]' : 'border-[#565856]/50 text-[#D1D2D3] hover:bg-[#222529]'}`}>
                {r.emoji} {r.count}
              </button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-[#222529] text-[#ABABAD] transition-all">
                  <Smile className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1A1D21] border border-[#565856]/40 p-1 rounded-lg">
                <div className="flex gap-1">
                  {REACTION_EMOJIS.map(e => (
                    <DropdownMenuItem key={e.id} onClick={() => reaction.toggle(e.id)} className="cursor-pointer hover:bg-[#222529] rounded p-1.5 justify-center">
                      <span className="text-lg leading-none">{e.emoji}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {replies.length > 0 && (
            <button onClick={toggleReplies} className="flex items-center gap-2 mt-2 text-[13px] text-[#1D9BD1] font-medium hover:underline">
              <div className="flex -space-x-1">
                {replies.slice(0, 3).map(r => <img key={r.id} src={r.author.avatarUrl} alt="" className="w-5 h-5 rounded border-2 border-[#1A1D21]" />)}
              </div>
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
          {showReplies && (
            <div className="mt-3 border-l-2 border-[#565856]/30 pl-4 space-y-1">
              {replies.map(r => (
                <SlackReply key={r.id} comment={r} tree={tree} currentUser={currentUser} />
              ))}
              <div className="flex gap-2 items-center">
                <input value={reply.replyContent} onChange={e => reply.setReplyContent(e.target.value)} placeholder="Reply..." className="flex-1 bg-[#222529] border border-[#565856]/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#ABABAD] outline-none focus:border-[#007A5A] transition-colors" onKeyDown={e => { if (e.key === 'Enter') reply.submitReply(); }} />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Hover toolbar */}
      <div className="opacity-0 group-hover:opacity-100 absolute right-3 -top-3 flex items-center bg-[#1A1D21] border border-[#565856]/40 rounded-lg shadow-xl overflow-hidden transition-all">
        <button onClick={() => reaction.toggle('like')} className="p-2 hover:bg-[#222529] text-[#ABABAD] text-xs transition-colors">👍</button>
        <button onClick={reply.isReplying ? reply.cancelReply : reply.openReply} className="p-2 hover:bg-[#222529] text-[#ABABAD] transition-colors"><MessageSquare className="w-3.5 h-3.5" /></button>
        {isAuthor && <button onClick={() => edit.startEditing(comment.content)} className="p-2 hover:bg-[#222529] text-[#ABABAD] text-xs transition-colors">✏️</button>}
        {isAuthor && <button onClick={deleteComment} className="p-2 hover:bg-red-500/10 text-red-400 text-xs transition-colors">🗑️</button>}
      </div>
    </div>
  );
};

const SlackReply = ({ comment, tree, currentUser }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser }) => {
  const { reaction } = useComment(comment, {
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
  });

  return (
    <div className="flex gap-2 group/reply">
      <img src={comment.author.avatarUrl} alt="" className="w-7 h-7 rounded-lg shrink-0" />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-white">{comment.author.name}</span>
          <span className="text-[11px] text-[#ABABAD]">{formatRelativeTime(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-[#D1D2D3]">{comment.content}</p>
        {comment.reactions && comment.reactions.filter(r => r.count > 0).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {comment.reactions.filter(r => r.count > 0).map(r => (
              <button key={r.id} onClick={() => reaction.toggle(r.id)} className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition-colors ${r.isActive ? 'border-[#007A5A]/50 bg-[#007A5A]/15 text-[#1D9F73]' : 'border-[#565856]/50 text-[#D1D2D3] hover:bg-[#222529]'}`}>
                {r.emoji} {r.count}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SlackStyle = ({ tree, currentUser }: Props) => {
  const [text, setText] = useState('');

  return (
    <div className="bg-[#1A1D21] text-[#D1D2D3] p-5 rounded-2xl">
      <div className="border-b border-[#565856]/30 pb-3 mb-3 flex items-center gap-2">
        <Hash className="w-4 h-4 text-[#ABABAD]" />
        <span className="text-sm font-bold text-white">general</span>
        <span className="text-xs text-[#ABABAD] ml-1">|</span>
        <span className="text-xs text-[#ABABAD]">{tree.totalCount} messages</span>
      </div>
      <div className="space-y-0">
        {tree.comments.map(c => <SlackMessage key={c.id} comment={c} tree={tree} currentUser={currentUser} />)}
      </div>
      <div className="mt-4 border border-[#565856]/40 rounded-xl overflow-hidden focus-within:border-[#565856] transition-colors">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Message #general" className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder:text-[#ABABAD] outline-none" onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { tree.addComment(text.trim()); setText(''); } }} />
      </div>
    </div>
  );
};

export default SlackStyle;
