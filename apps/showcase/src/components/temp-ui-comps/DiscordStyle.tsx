import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { Hash, SmilePlus } from 'lucide-react';
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

const roleColors: Record<string, string> = {
  'Sarah Chen': '#EB459E', 'Alex Rivera': '#57F287', 'Jordan Park': '#FEE75C',
  'Maya Patel': '#ED4245', 'Chris Lee': '#5865F2',
};

const DiscordMessage = ({ comment, tree, currentUser }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser }) => {
  const { isAuthor, edit, reply, reaction, deleteComment } = useComment(comment, {
    onEdit: async (id, c) => { tree.editComment(id, c); },
    onReply: async (id, c) => { tree.addReply(id, c); },
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
    onDelete: async (id) => { tree.deleteComment(id); },
  });
  const nameColor = roleColors[comment.author.name] || '#FFFFFF';
  const replies = comment.replies || [];

  return (
    <>
      <div className="group flex gap-4 hover:bg-[#2E3035]/50 px-4 py-1.5 -mx-4 rounded-md transition-colors relative">
        <img src={comment.author.avatarUrl} alt="" className="w-10 h-10 rounded-full mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-medium hover:underline cursor-pointer" style={{ color: nameColor }}>{comment.author.name}</span>
            <span className="text-[11px] text-[#949BA4]">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          {edit.isEditing ? (
            <div className="mt-1">
              <textarea value={edit.editContent} onChange={e => edit.setEditContent(e.target.value)} className="w-full bg-[#383A40] rounded-lg p-2.5 text-sm text-[#DBDEE1] mt-1 outline-none border border-transparent focus:border-[#5865F2] transition-colors" />
              <div className="flex gap-2 mt-1 text-xs">
                <span className="text-[#949BA4]">escape to</span>
                <button onClick={edit.cancelEdit} className="text-[#00A8FC] hover:underline">cancel</button>
                <span className="text-[#949BA4]">· enter to</span>
                <button onClick={edit.submitEdit} className="text-[#00A8FC] hover:underline">save</button>
              </div>
            </div>
          ) : (
            <p className="text-[15px] text-[#DBDEE1] leading-relaxed">{comment.content}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {comment.reactions?.filter(r => r.count > 0).map(r => (
              <button key={r.id} onClick={() => reaction.toggle(r.id)} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors ${r.isActive ? 'bg-[#5865F2]/20 border border-[#5865F2]/50 text-[#DEE0FC]' : 'bg-[#2B2D31] border border-transparent hover:border-[#4E5058] text-[#B5BAC1]'}`}>
                {r.emoji} <span>{r.count}</span>
              </button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-7 h-7 rounded-md bg-[#2B2D31] hover:border-[#4E5058] border border-transparent text-[#B5BAC1] transition-colors opacity-0 group-hover:opacity-100">
                  <SmilePlus className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#2B2D31] border border-[#1E1F22] p-1 rounded-lg">
                <div className="flex gap-1">
                  {REACTION_EMOJIS.map(e => (
                    <DropdownMenuItem key={e.id} onClick={() => reaction.toggle(e.id)} className="cursor-pointer hover:bg-[#383A40] rounded p-1.5 justify-center">
                      <span className="text-lg leading-none">{e.emoji}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Hover actions */}
        <div className="opacity-0 group-hover:opacity-100 absolute right-2 -top-4 flex bg-[#2B2D31] border border-[#1E1F22] rounded-lg shadow-xl overflow-hidden transition-all">
          <button onClick={() => reaction.toggle('like')} className="px-2.5 py-1.5 hover:bg-[#36373D] text-sm transition-colors">👍</button>
          {isAuthor && <button onClick={() => edit.startEditing(comment.content)} className="px-2.5 py-1.5 hover:bg-[#36373D] text-sm transition-colors">✏️</button>}
          {isAuthor && <button onClick={deleteComment} className="px-2.5 py-1.5 hover:bg-[#36373D] text-sm text-red-400 transition-colors">🗑️</button>}
        </div>
      </div>
      {replies.map(r => (
        <DiscordReply key={r.id} comment={r} tree={tree} currentUser={currentUser} />
      ))}
    </>
  );
};

const DiscordReply = ({ comment, tree, currentUser }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser }) => {
  const { reaction } = useComment(comment, {
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
  });
  const nameColor = roleColors[comment.author.name] || '#FFFFFF';

  return (
    <div className="ml-14 flex gap-3 hover:bg-[#2E3035]/50 px-4 py-1 -mx-4 rounded-md transition-colors group/reply">
      <img src={comment.author.avatarUrl} alt="" className="w-6 h-6 rounded-full mt-0.5 shrink-0" />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium" style={{ color: nameColor }}>{comment.author.name}</span>
          <span className="text-[11px] text-[#949BA4]">{formatRelativeTime(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-[#DBDEE1]">{comment.content}</p>
        {comment.reactions && comment.reactions.filter(r => r.count > 0).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {comment.reactions.filter(r => r.count > 0).map(r => (
              <button key={r.id} onClick={() => reaction.toggle(r.id)} className={`flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-md transition-colors ${r.isActive ? 'bg-[#5865F2]/20 border border-[#5865F2]/50 text-[#DEE0FC]' : 'bg-[#2B2D31] border border-transparent hover:border-[#4E5058] text-[#B5BAC1]'}`}>
                {r.emoji} {r.count}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DiscordStyle = ({ tree, currentUser }: Props) => {
  const [text, setText] = useState('');

  return (
    <div className="bg-[#313338] text-[#DBDEE1] p-5 rounded-2xl">
      <div className="flex items-center gap-2.5 border-b border-[#3F4147] pb-3 mb-4">
        <Hash className="w-5 h-5 text-[#949BA4]" />
        <span className="text-base font-semibold text-white">general</span>
        <span className="text-xs text-[#949BA4] border-l border-[#3F4147] pl-2.5 ml-0.5">Free-form conversation</span>
      </div>
      <div className="space-y-1">
        {tree.comments.map(c => (
          <div key={c.id} className="relative">
            <DiscordMessage comment={c} tree={tree} currentUser={currentUser} />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="bg-[#383A40] rounded-xl overflow-hidden">
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Message #general" className="w-full bg-transparent px-4 py-3 text-sm text-[#DBDEE1] placeholder:text-[#6D6F78] outline-none" onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { tree.addComment(text.trim()); setText(''); } }} />
        </div>
      </div>
    </div>
  );
};

export default DiscordStyle;
