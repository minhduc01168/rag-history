import { useState, KeyboardEvent } from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const { t } = useLanguage();

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-white/95 backdrop-blur-md border-t-2 border-amber-300/80 shadow-sm">
      <div className="relative flex-1 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('bot.placeholder')}
          disabled={disabled}
          className="
            w-full h-11 rounded-2xl
            bg-amber-50/80 border-2 border-amber-300/80
            pl-4 pr-10 text-sm text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white
            transition-all shadow-inner
          "
        />
        {message.trim().length > 0 && (
          <button
            type="button"
            onClick={() => setMessage('')}
            className="absolute right-3 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-[10px] font-black transition-colors"
            title="Xóa nội dung"
          >
            ✕
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className={`
          w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 shrink-0 shadow-md
          ${disabled || !message.trim()
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/30 hover:scale-105 active:scale-95 border-2 border-amber-300 font-black'}
        `}
        aria-label={t('bot.send')}
        title={t('bot.send')}
      >
        <span className="text-lg leading-none">🚀</span>
      </button>
    </div>
  );
}
