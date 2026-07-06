import { useState, useEffect, useCallback } from 'react';
import { ChatWindow } from './chat/ChatWindow';

type ChatMode = 'normal' | 'expanded';

export function TerraBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('normal');

  const isExpanded = mode === 'expanded';
  const toggleMode = () => setMode(m => m === 'normal' ? 'expanded' : 'normal');

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isExpanded) { setMode('normal'); }
      else { setIsOpen(false); }
    }
  }, [isExpanded]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = (isOpen && isExpanded) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, isExpanded]);

  return (
    <>
      {/* Backdrop khi mở rộng */}
      {isOpen && isExpanded && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setMode('normal')}
          aria-hidden="true"
        />
      )}

      {/* Main Chat Box */}
      {isOpen && (
        <div
          role={isExpanded ? 'dialog' : undefined}
          aria-modal={isExpanded ? 'true' : undefined}
          aria-label="Cụ Rùa Thông Thái Chat"
          className={`
            fixed flex flex-col bg-slate-900 border-2 border-amber-500/50 rounded-3xl overflow-hidden
            transition-all duration-300 ease-in-out
            ${
              isExpanded
                ? 'z-[201] inset-3 sm:inset-6 md:inset-10 lg:inset-16 shadow-[0_32px_80px_-8px_rgba(245,158,11,0.3)] animate-in zoom-in-95 fade-in duration-200'
                : 'z-[100] bottom-[5.5rem] right-4 sm:right-6 shadow-2xl shadow-amber-950/60 animate-in slide-in-from-bottom-4 fade-in duration-200'
            }
          `}
          style={
            isExpanded
              ? undefined
              : {
                  width: 'clamp(330px, calc(100vw - 2rem), 440px)',
                  height: 'clamp(420px, calc(100vh - 9rem), 640px)',
                }
          }
        >
          <ChatHeader
            mode={mode}
            onToggleMode={toggleMode}
            onClose={() => { setIsOpen(false); setMode('normal'); }}
          />
          <div className="flex-1 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/95 to-indigo-950/50">
            <ChatWindow />
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[202]">
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-amber-500 opacity-40 animate-ping pointer-events-none" />
        )}
        <button
          onClick={() => setIsOpen(o => !o)}
          aria-label={isOpen ? "Đóng Cụ Rùa" : "Hỏi Cụ Rùa"}
          className={`
            relative w-16 h-16 rounded-3xl flex items-center justify-center text-3xl
            shadow-xl transition-all duration-300 transform border-2 border-amber-300/40
            hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400
            ${isOpen
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 shadow-slate-900/60 rotate-90'
              : 'bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-600/50 hover:shadow-amber-500/70'}
          `}
          title="Trò chuyện cùng Cụ Rùa Thông Thái"
        >
          <span className="transition-transform duration-300">
            {isOpen ? '✕' : '🐢'}
          </span>
        </button>
      </div>
    </>
  );
}

export const HistoryChatWidget = TerraBotWidget;

interface ChatHeaderProps {
  mode: ChatMode;
  onToggleMode: () => void;
  onClose: () => void;
}

function ChatHeader({ mode, onToggleMode, onClose }: ChatHeaderProps) {
  const isExpanded = mode === 'expanded';

  return (
    <div className="
      bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700
      px-5 py-3.5 flex items-center justify-between
      text-white shrink-0 select-none border-b border-amber-500/30
    ">
      {/* Left: Mascot Avatar + Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/30">
            🐢
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-amber-700 rounded-full" />
        </div>
        <div>
          <p className="font-extrabold text-base leading-tight text-amber-100 drop-shadow-sm">
            Cụ Rùa Thông Thái
          </p>
          <p className="text-[11px] font-semibold text-amber-200/90 leading-tight">
            📜 Trợ lý Lịch sử SGK Lớp 4 & 5
          </p>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleMode}
          title={isExpanded ? "Thu nhỏ" : "Mở rộng toàn màn hình"}
          className="
            w-8 h-8 flex items-center justify-center rounded-xl
            text-white/80 hover:text-white hover:bg-white/20
            transition-all duration-150 text-sm font-bold
          "
        >
          {isExpanded ? "🗗" : "🗖"}
        </button>

        <div className="w-px h-5 bg-white/20 mx-1" />

        <button
          onClick={onClose}
          title="Đóng khung chat"
          className="
            w-8 h-8 flex items-center justify-center rounded-xl
            text-white/80 hover:text-white hover:bg-red-500/40
            transition-all duration-150 text-lg font-bold leading-none
          "
        >
          ✕
        </button>
      </div>
    </div>
  );
}
