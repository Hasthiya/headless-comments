import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { Smile } from 'lucide-react';
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

const GHComment = ({ comment, tree, currentUser }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser }) => {
  const { isAuthor, edit, reply, reaction, deleteComment } = useComment(comment, {
    onEdit: async (id, c) => { tree.editComment(id, c); },
    onReply: async (id, c) => { tree.addReply(id, c); },
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
    onDelete: async (id) => { tree.deleteComment(id); },
  });
  const replies = comment.replies || [];

  return (
    <div className="mb-4">
      <div className="border border-[#30363D] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between bg-[#161B22] px-4 py-2.5 border-b border-[#30363D]">
          <div className="flex items-center gap-2.5 text-sm">
            <img src={comment.author.avatarUrl} alt="" className="w-6 h-6 rounded-full ring-1 ring-white/10" />
            <span className="font-semibold text-[#E6EDF3] hover:underline cursor-pointer">{comment.author.name}</span>
            <span className="text-[#8B949E]">commented {formatRelativeTime(comment.createdAt)}</span>
          </div>
          {isAuthor && (
            <div className="flex gap-1.5">
              <span className="text-[10px] font-medium text-[#8B949E] border border-[#30363D] rounded-full px-2 py-0.5">Author</span>
              <button onClick={() => edit.startEditing(comment.content)} className="text-xs text-[#8B949E] hover:text-[#58A6FF] transition-colors">Edit</button>
              <button onClick={deleteComment} className="text-xs text-[#8B949E] hover:text-red-400 transition-colors">Delete</button>
            </div>
          )}
        </div>
        <div className="bg-[#0D1117] px-4 py-4">
          {edit.isEditing ? (
            <div>
              <textarea value={edit.editContent} onChange={e => edit.setEditContent(e.target.value)} className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg p-3 text-sm text-[#E6EDF3] font-mono min-h-[100px] focus:border-[#58A6FF] outline-none transition-colors" />
              <div className="flex gap-2 mt-3">
                <button onClick={edit.submitEdit} className="text-xs bg-[#238636] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2EA043] transition-colors">Update comment</button>
                <button onClick={edit.cancelEdit} className="text-xs text-[#8B949E] px-4 py-2 rounded-lg border border-[#30363D] hover:border-[#8B949E] transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#E6EDF3] leading-relaxed">{comment.content}</p>
          )}
        </div>
        <div className="bg-[#0D1117] px-4 py-2.5 border-t border-[#30363D] flex items-center gap-2">
          {comment.reactions?.filter(r => r.count > 0).map(r => (
            <button key={r.id} onClick={() => reaction.toggle(r.id)} className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border transition-colors ${r.isActive ? 'border-[#58A6FF]/50 bg-[#58A6FF]/10 text-[#58A6FF]' : 'border-[#30363D] text-[#8B949E] hover:border-[#8B949E]'}`}>
              {r.emoji} {r.count}
            </button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border border-[#30363D] text-[#8B949E] hover:border-[#8B949E] transition-colors">
                <Smile className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#161B22] border border-[#30363D] p-1 rounded-lg">
              <div className="flex gap-1">
                {REACTION_EMOJIS.map(e => (
                  <DropdownMenuItem key={e.id} onClick={() => reaction.toggle(e.id)} className="cursor-pointer hover:bg-[#30363D] rounded p-1.5 justify-center">
                    <span className="text-lg leading-none">{e.emoji}</span>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {replies.map(r => (
        <GHReply key={r.id} comment={r} tree={tree} currentUser={currentUser} />
      ))}
    </div>
  );
};

const GHReply = ({ comment, tree, currentUser }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser }) => {
  const { reaction } = useComment(comment, {
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
  });

  return (
    <div className="ml-10 mt-3 relative before:absolute before:left-[-20px] before:top-0 before:bottom-0 before:w-0.5 before:bg-[#30363D] before:rounded-full">
      <div className="border border-[#30363D] rounded-xl overflow-hidden">
        <div className="flex items-center bg-[#161B22] px-3.5 py-2 border-b border-[#30363D] text-xs gap-2.5">
          <img src={comment.author.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
          <span className="font-semibold text-[#E6EDF3]">{comment.author.name}</span>
          <span className="text-[#8B949E]">{formatRelativeTime(comment.createdAt)}</span>
        </div>
        <div className="bg-[#0D1117] px-3.5 py-3">
          <p className="text-sm text-[#E6EDF3]">{comment.content}</p>
        </div>
        {comment.reactions && comment.reactions.filter(r => r.count > 0).length > 0 && (
          <div className="bg-[#0D1117] px-3.5 py-2 border-t border-[#30363D] flex items-center gap-1.5">
            {comment.reactions.filter(r => r.count > 0).map(r => (
              <button key={r.id} onClick={() => reaction.toggle(r.id)} className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border transition-colors ${r.isActive ? 'border-[#58A6FF]/50 bg-[#58A6FF]/10 text-[#58A6FF]' : 'border-[#30363D] text-[#8B949E] hover:border-[#8B949E]'}`}>
                {r.emoji} {r.count}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const GitHubStyle = ({ tree, currentUser }: Props) => {
  const [text, setText] = useState('');

  return (
    <div className="bg-[#0D1117] text-[#E6EDF3] p-5 rounded-2xl">
      {tree.comments.map(c => <GHComment key={c.id} comment={c} tree={tree} currentUser={currentUser} />)}
      <div className="border border-[#30363D] rounded-xl overflow-hidden mt-5">
        <div className="bg-[#161B22] px-4 py-2.5 border-b border-[#30363D] flex items-center gap-3">
          <button className="text-xs text-[#E6EDF3] font-medium border-b-2 border-[#F78166] pb-1.5 -mb-[11px]">Write</button>
          <button className="text-xs text-[#8B949E] hover:text-[#E6EDF3] transition-colors">Preview</button>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Leave a comment" className="w-full bg-[#0D1117] px-4 py-3 text-sm text-[#E6EDF3] placeholder:text-[#484F58] outline-none min-h-[100px] font-mono" />
        <div className="bg-[#161B22] px-4 py-3 border-t border-[#30363D] flex justify-end">
          <button onClick={() => { if (text.trim()) { tree.addComment(text.trim()); setText(''); } }} disabled={!text.trim()} className="text-sm bg-[#238636] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2EA043] disabled:opacity-40 transition-colors">Comment</button>
        </div>
      </div>
    </div>
  );
};

export default GitHubStyle;
