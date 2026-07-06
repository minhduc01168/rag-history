import { useState, useEffect } from 'react';

interface MascotWidgetProps {
  message?: string;
  mood?: 'happy' | 'thinking' | 'excited' | 'default';
  onAskMascot?: (query: string) => void;
}

export function MascotWidget({
  message = "Chào mừng cháu đến với Sân chơi Lịch sử! Cụ Rùa đã sống hàng nghìn năm, chứng kiến biết bao chiến công oanh liệt của cha ông ta. Cháu muốn hỏi Cụ điều gì nào?",
  mood = 'default',
  onAskMascot,
}: MascotWidgetProps) {
  const [bubbleText, setBubbleText] = useState(message);
  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    setBubbleText(message);
    setIsTalking(true);
    const timer = setTimeout(() => setIsTalking(false), 2000);
    return () => clearTimeout(timer);
  }, [message]);

  const getMascotEmoji = () => {
    switch (mood) {
      case 'happy': return '🐢✨';
      case 'thinking': return '🐢🤔';
      case 'excited': return '🐢🎉';
      default: return '🐢📜';
    }
  };

  const sampleQuestions = [
    "Vua Hùng đã dựng nước Văn Lang thế nào?",
    "Vì sao Hai Bà Trưng lại cưỡi voi ra trận?",
    "Kế cọc nhọn trên sông Bạch Đằng năm 938 là gì?",
    "Cụ Rùa ơi, hãy kể về Hào khí Đông A nhà Trần đi!",
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-950/90 via-slate-900/90 to-slate-900/90 backdrop-blur-md border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        {/* Mascot Avatar & Animation */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className={`
            w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600
            flex items-center justify-center text-5xl sm:text-6xl
            shadow-xl shadow-amber-500/20 border-4 border-amber-200
            transition-transform duration-500
            ${isTalking ? 'animate-bounce scale-110' : 'hover:scale-105'}
          `}>
            {getMascotEmoji()}
          </div>
          <span className="mt-2 text-xs font-bold px-3 py-1 bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-full shadow-sm">
            Cụ Rùa Thông Thái
          </span>
        </div>

        {/* Speech Bubble */}
        <div className="flex-1 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative shadow-inner">
          {/* Bubble Arrow (desktop left, mobile top) */}
          <div className="hidden md:block absolute -left-3 top-8 w-6 h-6 bg-slate-800 border-l border-b border-slate-700/80 transform rotate-45" />
          <div className="md:hidden absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-800 border-l border-t border-slate-700/80 transform rotate-45" />

          <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-medium">
            {bubbleText}
          </p>

          {/* Quick Suggestion Chips */}
          <div className="mt-4 pt-4 border-t border-slate-700/60">
            <p className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1.5">
              <span>💡</span> Gợi ý câu hỏi cho Cụ Rùa:
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onAskMascot && onAskMascot(q)}
                  className="text-xs bg-slate-700/70 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-600 hover:border-amber-500/40 px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
