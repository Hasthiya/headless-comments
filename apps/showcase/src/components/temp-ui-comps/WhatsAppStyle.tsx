import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useComment } from '@hasthiya_/headless-comments-react/headless';
import { CheckCheck } from 'lucide-react';
import { useState } from 'react';

interface Props { tree: UseCommentTreeReturn; currentUser: CommentUser; }

const WAMessage = ({ comment, tree, currentUser, isOwn = false }: { comment: Comment; tree: UseCommentTreeReturn; currentUser: CommentUser; isOwn?: boolean }) => {
  const { reaction } = useComment(comment, {
    onReaction: async (id, rid) => { tree.toggleReaction(id, rid); },
  });
  const likeReaction = comment.reactions?.find(r => r.id === 'like');

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1.5`}>
      <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 relative shadow-sm ${isOwn ? 'bg-[#005C4B] rounded-tr-md' : 'bg-[#202C33] rounded-tl-md'}`}>
        {!isOwn && <p className="text-xs font-medium text-[#06CF9C] mb-0.5">{comment.author.name}</p>}
        <p className="text-[14px] text-[#E9EDEF] leading-relaxed inline">{comment.content}</p>
        <span className="text-[10px] text-[#8696A0] ml-3 float-right mt-2 flex items-center gap-0.5">
          {formatRelativeTime(comment.createdAt)}
          {isOwn && <CheckCheck className="w-4 h-4 text-[#53BDEB]" />}
        </span>
        {(likeReaction?.count ?? 0) > 0 && (
          <div className="absolute -bottom-3 right-2 bg-[#1F2C34] rounded-full px-2 py-0.5 flex items-center gap-1 text-xs shadow-md border border-white/5">
            ❤️ {likeReaction?.count}
          </div>
        )}
      </div>
    </div>
  );
};

const WhatsAppStyle = ({ tree, currentUser }: Props) => {
  const [text, setText] = useState('');

  return (
    <div className="bg-[#0B141A] rounded-2xl overflow-hidden" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23111B21\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
      <div className="bg-[#202C33] px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white font-bold text-sm">CT</div>
        <div>
          <p className="text-sm font-medium text-[#E9EDEF]">Comment Thread</p>
          <p className="text-[11px] text-[#8696A0]">{tree.totalCount} messages</p>
        </div>
      </div>
      <div className="p-4 space-y-1 min-h-[200px]">
        {tree.comments.map(c => (
          <WAMessage key={c.id} comment={c} tree={tree} currentUser={currentUser} isOwn={c.author.id === currentUser.id} />
        ))}
      </div>
      <div className="bg-[#202C33] px-3 py-2.5 flex items-center gap-2.5">
        <div className="flex-1 bg-[#2A3942] rounded-full px-4 py-2.5">
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message" className="w-full bg-transparent text-sm text-[#E9EDEF] placeholder:text-[#8696A0] outline-none" onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { tree.addComment(text.trim()); setText(''); } }} />
        </div>
        <button onClick={() => { if (text.trim()) { tree.addComment(text.trim()); setText(''); } }} className="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center text-white shrink-0 hover:bg-[#06CF9C] transition-colors shadow-lg">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" /></svg>
        </button>
      </div>
    </div>
  );
};

export default WhatsAppStyle;
