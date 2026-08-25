import { useState, useEffect, useCallback } from 'react';
import { ChatWindow } from './chat/ChatWindow';

type ChatMode = 'normal' | 'expanded';

export function ScholarTurtleIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`${className} drop-shadow-sm`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradients */}
        <radialGradient id="shellGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="60%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064E3B" />
        </radialGradient>
        
        <linearGradient id="turtleSkin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="50%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <linearGradient id="scholarCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="ribbonRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>

        <linearGradient id="scrollParchment" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>

        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Feet / Paws */}
      <circle cx="34" cy="88" r="9" fill="url(#turtleSkin)" stroke="#047857" strokeWidth="2" />
      <circle cx="86" cy="88" r="9" fill="url(#turtleSkin)" stroke="#047857" strokeWidth="2" />
      <circle cx="22" cy="62" r="8" fill="url(#turtleSkin)" stroke="#047857" strokeWidth="2" />
      <circle cx="98" cy="62" r="8" fill="url(#turtleSkin)" stroke="#047857" strokeWidth="2" />

      {/* Small Tail */}
      <path d="M60 96 C57 106 63 106 60 96" fill="url(#turtleSkin)" stroke="#047857" strokeWidth="2" strokeLinecap="round" />

      {/* Main Shell */}
      <ellipse cx="60" cy="70" rx="38" ry="30" fill="url(#shellGlow)" stroke="#FDE047" strokeWidth="3" filter="url(#softShadow)" />

      {/* Golden Đông Sơn / Bronze Drum Sun Motif on Shell */}
      <circle cx="60" cy="70" r="14" fill="#047857" stroke="#FDE047" strokeWidth="1.8" strokeDasharray="3 2" />
      {/* Sun Rays */}
      <path d="M60 56 L60 48 M60 84 L60 92 M46 70 L38 70 M74 70 L82 70 M50 60 L44 54 M70 60 L76 54 M50 80 L44 86 M70 80 L76 86" stroke="#FEF08A" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="60" cy="70" r="5" fill="#FDE047" />

      {/* Head */}
      <circle cx="60" cy="40" r="22" fill="url(#turtleSkin)" stroke="#047857" strokeWidth="2.5" filter="url(#softShadow)" />

      {/* Cute Rosy Cheeks */}
      <circle cx="43" cy="46" r="4.5" fill="#F43F5E" opacity="0.6" />
      <circle cx="77" cy="46" r="4.5" fill="#F43F5E" opacity="0.6" />

      {/* Glasses Frames (Scholar) */}
      <circle cx="51" cy="38" r="7.5" fill="rgba(255,255,255,0.75)" stroke="#78350F" strokeWidth="2" />
      <circle cx="69" cy="38" r="7.5" fill="rgba(255,255,255,0.75)" stroke="#78350F" strokeWidth="2" />
      <path d="M58.5 38 L61.5 38" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

      {/* Big Sparkling Pupils */}
      <circle cx="51" cy="38" r="4" fill="#1E293B" />
      <circle cx="52.5" cy="36.5" r="1.5" fill="#FFFFFF" />
      <circle cx="50" cy="39.5" r="0.8" fill="#FFFFFF" />

      <circle cx="69" cy="38" r="4" fill="#1E293B" />
      <circle cx="70.5" cy="36.5" r="1.5" fill="#FFFFFF" />
      <circle cx="68" cy="39.5" r="0.8" fill="#FFFFFF" />

      {/* Happy Open Smile */}
      <path d="M54 48 Q60 55 66 48" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" fill="#DC2626" />

      {/* Scholar Cap (Mũ Trạng Nguyên / Tiến Sĩ) */}
      {/* Back wings / Cánh chuồn */}
      <ellipse cx="32" cy="18" rx="14" ry="4" fill="url(#scholarCapGrad)" stroke="#78350F" strokeWidth="1.5" transform="rotate(-15 32 18)" />
      <ellipse cx="88" cy="18" rx="14" ry="4" fill="url(#scholarCapGrad)" stroke="#78350F" strokeWidth="1.5" transform="rotate(15 88 18)" />
      
      {/* Cap Center */}
      <path d="M42 22 L60 12 L78 22 L60 27 Z" fill="url(#scholarCapGrad)" stroke="#78350F" strokeWidth="2" />
      {/* Red Ribbon Band */}
      <path d="M46 22 L74 22 L70 26 L50 26 Z" fill="url(#ribbonRed)" />
      {/* Jewel in center */}
      <circle cx="60" cy="22" r="3" fill="#EF4444" stroke="#FEF08A" strokeWidth="1" />

      {/* Small Book / Scroll in Hand */}
      <g transform="translate(68, 76) rotate(-10)">
        <rect x="0" y="0" width="18" height="12" rx="3" fill="url(#scrollParchment)" stroke="#B45309" strokeWidth="1.5" />
        <line x1="4" y1="4" x2="14" y2="4" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />
        <line x1="4" y1="8" x2="11" y2="8" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function TerraBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('normal');
  const [showTooltip, setShowTooltip] = useState(true);
  const [sessionKey, setSessionKey] = useState(() => Date.now().toString());

  const handleNewChat = () => {
    localStorage.removeItem('chat_session_id');
    setSessionKey(Date.now().toString());
  };

  const isExpanded = mode === 'expanded';
  const toggleMode = () => setMode((m) => (m === 'normal' ? 'expanded' : 'normal'));

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isExpanded) {
          setMode('normal');
        } else {
          setIsOpen(false);
        }
      }
    },
    [isExpanded]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = isOpen && isExpanded ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isExpanded]);

  return (
    <>
      {/* Backdrop khi mở rộng toàn màn hình */}
      {isOpen && isExpanded && (
        <div
          className="fixed inset-0 z-[200] bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setMode('normal')}
          aria-hidden="true"
        />
      )}

      {/* Main Chat Dialog Box */}
      {isOpen && (
        <div
          role={isExpanded ? 'dialog' : undefined}
          aria-modal={isExpanded ? 'true' : undefined}
          aria-label="Cụ Rùa Thông Thái Chat"
          className={`
            fixed flex flex-col bg-[#FCFBF7] border-2 border-amber-300 rounded-[2rem] overflow-hidden
            transition-all duration-300 ease-out shadow-2xl shadow-amber-950/20
            ${
              isExpanded
                ? 'z-[201] inset-2 sm:inset-6 md:inset-10 lg:inset-14 shadow-amber-500/20 animate-in zoom-in-95 fade-in duration-200'
                : 'z-[100] bottom-24 right-4 sm:right-6 shadow-2xl shadow-amber-600/30 animate-in slide-in-from-bottom-6 fade-in duration-200'
            }
          `}
          style={
            isExpanded
              ? undefined
              : {
                  width: 'clamp(340px, calc(100vw - 2rem), 440px)',
                  height: 'clamp(480px, calc(100vh - 7.5rem), 640px)',
                }
          }
        >
          <ChatHeader
            mode={mode}
            onToggleMode={toggleMode}
            onClose={() => {
              setIsOpen(false);
              setMode('normal');
            }}
            onNewChat={handleNewChat}
          />
          <div className="flex-1 overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30">
            <ChatWindow key={sessionKey} />
          </div>
        </div>
      )}

      {/* Floating Action Mascot Button (FAB) */}
      <div className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[202] flex items-center gap-3 ${isExpanded ? 'hidden' : ''}`}>
        {/* Playful Welcome Tooltip */}
        {!isOpen && showTooltip && (
          <div className="hidden sm:flex items-center gap-2 bg-white text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl border-2 border-amber-300 text-xs font-black animate-bounce relative">
            <span className="text-amber-500">✨</span>
            <span>Hỏi Cụ Rùa Lịch Sử Lớp 4-5 nào!</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-slate-600 font-bold ml-1 text-sm transition-colors"
              title="Đóng thông báo"
            >
              ✕
            </button>
            <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-amber-300" />
          </div>
        )}

        {/* Pulse ring effect */}
        {!isOpen && (
          <span className="absolute right-0 bottom-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-400 opacity-30 animate-ping pointer-events-none" />
        )}

        <button
          onClick={() => {
            setIsOpen((o) => !o);
            setShowTooltip(false);
          }}
          aria-label={isOpen ? 'Đóng khung trò chuyện Cụ Rùa' : 'Mở khung trò chuyện Cụ Rùa'}
          className={`
            relative rounded-full flex items-center justify-center
            shadow-2xl transition-all duration-300 transform border-4
            hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400
            ${
              isOpen
                ? 'w-12 h-12 sm:w-14 sm:h-14 bg-amber-600 border-amber-300 text-white shadow-amber-900/40'
                : 'w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 border-amber-200 text-slate-950 shadow-amber-500/50 hover:shadow-amber-500/70'
            }
          `}
          title="Trò chuyện cùng Cụ Rùa Thông Thái"
        >
          {isOpen ? (
            <span className="text-xl sm:text-2xl font-black text-white leading-none mb-0.5">✕</span>
          ) : (
            <div className="w-13 h-13 sm:w-16 sm:h-16 flex items-center justify-center p-1">
              <ScholarTurtleIcon className="w-full h-full" />
            </div>
          )}
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
  onNewChat?: () => void;
}

function ChatHeader({ mode, onToggleMode, onClose, onNewChat }: ChatHeaderProps) {
  const isExpanded = mode === 'expanded';

  return (
    <div className="
      bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400
      px-4 py-3 flex items-center justify-between
      text-slate-950 shrink-0 select-none border-b-2 border-amber-400/40 shadow-sm
    ">
      {/* Left: Mascot Avatar + Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-11 h-11 bg-white/90 rounded-2xl flex items-center justify-center shadow-md border-2 border-amber-300 p-1">
            <ScholarTurtleIcon className="w-full h-full" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-black text-base leading-tight text-slate-950">
              Cụ Rùa Thông Thái
            </p>
            <span className="text-[10px] font-black px-2 py-0.5 bg-red-600 text-white rounded-full uppercase tracking-wider shadow-sm">
              Sử Học AI
            </span>
          </div>
          <p className="text-[11px] font-bold text-amber-950/80 mt-0.5 leading-tight flex items-center gap-1">
            <span>📜</span> Sách Giáo Khoa Lớp 4 & 5
          </p>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1.5">
        {onNewChat && (
          <button
            onClick={onNewChat}
            title="Tạo đoạn chat mới"
            className="
              w-8 h-8 flex items-center justify-center rounded-xl
              text-slate-900 hover:text-white hover:bg-emerald-600
              transition-all duration-150 text-sm font-black border border-amber-600/20 bg-white/30
            "
          >
            ➕
          </button>
        )}

        <button
          onClick={onToggleMode}
          title={isExpanded ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
          className="
            w-8 h-8 flex items-center justify-center rounded-xl
            text-slate-900 hover:text-black hover:bg-white/40
            transition-all duration-150 text-sm font-black border border-amber-600/20 bg-white/30
          "
        >
          {isExpanded ? '🗗' : '🗖'}
        </button>

        <button
          onClick={onClose}
          title="Đóng khung chat"
          className="
            w-8 h-8 flex items-center justify-center rounded-xl
            text-slate-900 hover:text-white hover:bg-rose-600
            transition-all duration-150 text-base font-black leading-none border border-amber-600/20 bg-white/30
          "
        >
          ✕
        </button>
      </div>
    </div>
  );
}
