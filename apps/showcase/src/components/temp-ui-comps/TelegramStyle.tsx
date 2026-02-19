import type { CommentUser, UseCommentTreeReturn, Comment } from '@hasthiya_/headless-comments-react';
import { formatRelativeTime } from '@hasthiya_/headless-comments-react';
import { useState } from 'react';

interface Props { tree: UseCommentTreeReturn; currentUser: CommentUser; }

const TGMessage = ({ comment, currentUser }: { comment: Comment; currentUser: CommentUser }) => {
  const isOwn = comment.author.id === currentUser.id;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1.5`}>
      {!isOwn && <img src={comment.author.avatarUrl} alt="" className="w-8 h-8 rounded-full mr-2 mt-auto shrink-0 ring-1 ring-white/10" />}
      <div className={`max-w-[70%] rounded-2xl px-3.5 py-2 shadow-sm ${isOwn ? 'bg-[#2B5278] rounded-br-md' : 'bg-[#182533] rounded-bl-md'}`}>
        {!isOwn && <p className="text-xs font-medium text-[#6AB3F3] mb-0.5">{comment.author.name}</p>}
        <p className="text-[14px] text-white leading-relaxed">{comment.content}</p>
        <p className={`text-[10px] text-right mt-1 ${isOwn ? 'text-[#6BB5E0]' : 'text-[#6E7F8D]'}`}>
          {formatRelativeTime(comment.createdAt)}
          {isOwn && ' ✓✓'}
        </p>
      </div>
    </div>
  );
};

const TelegramStyle = ({ tree, currentUser }: Props) => {
  const [text, setText] = useState('');

  return (
    <div className="bg-[#0E1621] rounded-2xl overflow-hidden">
      <div className="bg-[#17212B] px-4 py-3.5 flex items-center gap-3 border-b border-[#0E1621]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2AABEE] to-[#229ED9] flex items-center justify-center text-white font-bold text-sm shadow-lg">CT</div>
        <div>
          <p className="text-sm font-medium text-white">Comment Thread</p>
          <p className="text-[11px] text-[#6E7F8D]">{tree.totalCount} messages</p>
        </div>
      </div>
      <div className="p-4 space-y-0.5 min-h-[200px]">
        {tree.comments.map(c => <TGMessage key={c.id} comment={c} currentUser={currentUser} />)}
      </div>
      <div className="bg-[#17212B] px-3 py-2.5 flex items-center gap-2.5">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Write a message..." className="flex-1 bg-transparent text-sm text-white placeholder:text-[#6E7F8D] outline-none px-2 py-2" onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { tree.addComment(text.trim()); setText(''); } }} />
        <button onClick={() => { if (text.trim()) { tree.addComment(text.trim()); setText(''); } }} className="w-9 h-9 rounded-full flex items-center justify-center text-[#6AB3F3] hover:bg-white/5 transition-colors">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" /></svg>
        </button>
      </div>
    </div>
  );
};

export default TelegramStyle;
