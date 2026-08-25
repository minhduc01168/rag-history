import React from 'react';
import { ScholarTurtleIcon } from '../TerraBotWidget';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  agent?: string;
  sources?: string[];
}

interface MessageBubbleProps {
  message: Message;
}

/** Loại bỏ các ký tự Markdown cơ bản để hiển thị plain text */
export function stripMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*\*|\*|__|_)/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s+/gm, '')
    .trim();
}

/** Rút gọn tên file dài: "sgk_lich_su_lop_4.pdf" → "sgk_lich_su...lop_4.pdf" */
function shortenFilename(name: string, maxLen = 32): string {
  const text = stripMarkdown(name);
  if (text.length <= maxLen) return text;
  const ext = text.lastIndexOf('.') > 0 ? text.slice(text.lastIndexOf('.')) : '';
  const base = text.slice(0, text.lastIndexOf('.') > 0 ? text.lastIndexOf('.') : text.length);
  const keep = maxLen - ext.length - 3;
  return base.slice(0, Math.max(keep, 8)) + '...' + ext;
}

/** Parse inline Markdown (**bold**, *italic*, `code`, [link](url)) */
export function parseInlineMarkdown(text: string, isUser: boolean = false): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className={`font-black ${isUser ? 'text-white' : 'text-amber-950'}`}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} className="italic font-semibold">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className={`px-1.5 py-0.5 rounded text-xs font-mono font-bold ${
            isUser ? 'bg-white/20 text-white' : 'bg-amber-100/90 text-amber-950 border border-amber-200'
          }`}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={match.index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-black underline transition-colors ${
              isUser ? 'text-white hover:text-amber-200' : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            {linkMatch[1]}
          </a>
        );
      }
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

/** Render formatted message blocks with kid-friendly styling */
function FormattedMessageText({ text, isUser }: { text: string; isUser: boolean }) {
  const paragraphs = text.split(/\n\n+/);

  return (
    <div className="space-y-2.5 text-[13.5px] sm:text-sm leading-relaxed font-medium">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');

        return (
          <p key={pIdx} className={isUser ? 'text-white font-medium' : 'text-slate-800'}>
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {parseInlineMarkdown(line, isUser)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex items-start gap-2.5 mb-4 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      } animate-in fade-in slide-in-from-bottom-2 duration-200`}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-sm font-black shadow-md border-2 border-white">
            👶
          </div>
        ) : (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-amber-300 p-0.5 flex items-center justify-center shadow-md">
            <ScholarTurtleIcon className="w-full h-full" />
          </div>
        )}
      </div>

      {/* Bubble Container */}
      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 transition-all shadow-md ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-blue-500/15'
            : 'bg-white text-slate-900 rounded-tl-xs border border-amber-200 shadow-amber-950/5'
        }`}
      >
        {/* Bot Agent label */}
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[11px] font-black text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 shadow-xs">
              🐢 {message.agent || 'Cụ Rùa Thông Thái'}
            </span>
          </div>
        )}

        {/* Message text */}
        <FormattedMessageText text={message.text} isUser={isUser} />

        {/* Source citations */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3.5 pt-2.5 border-t border-amber-100">
            <p className="text-[10px] text-amber-900 uppercase tracking-wider mb-1.5 font-black flex items-center gap-1">
              <span>📜</span> Nguồn bài học SGK:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {message.sources.map((source, idx) => {
                const linkMatch = source.match(/\[([^\]]+)\]\(([^)]+)\)/);
                if (linkMatch) {
                  return (
                    <a
                      key={idx}
                      href={linkMatch[2]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full text-[11px] text-amber-950 font-bold transition-all shadow-xs"
                    >
                      <span>📖</span>
                      <span className="max-w-[180px] truncate">{shortenFilename(linkMatch[1])}</span>
                    </a>
                  );
                }
                const cleanSource = stripMarkdown(source);
                return (
                  <span
                    key={idx}
                    title={cleanSource}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] text-amber-950 font-bold shadow-xs"
                  >
                    <span>📜</span>
                    <span className="max-w-[180px] truncate">{shortenFilename(cleanSource)}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div className={`text-[10px] mt-2 font-medium ${isUser ? 'text-blue-100 text-right' : 'text-slate-400'}`}>
          {message.timestamp.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
