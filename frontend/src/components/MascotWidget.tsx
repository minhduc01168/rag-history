import { useState, useEffect } from 'react';
import { ScholarTurtleIcon } from './TerraBotWidget';

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

  const sampleQuestions = [
    "Trống đồng Đông Sơn được phát hiện ở đâu và có chi tiết như thế nào?",
    "Vua Hùng đã dựng nước Văn Lang thế nào?",
    "Vì sao Hai Bà Trưng lại cưỡi voi ra trận?",
    "Kế cọc nhọn trên sông Bạch Đằng năm 938 là gì?",
  ];

  const getMoodBadge = () => {
    switch (mood) {
      case 'happy': return '🐢 Cụ Rùa rất vui!';
      case 'thinking': return '🐢 Cụ đang suy ngẫm...';
      case 'excited': return '🐢 Hào hứng khám phá!';
      default: return '🐢 Cụ Rùa Thông Thái';
    }
  };

  return (
    <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-xl shadow-amber-500/10 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        {/* Mascot Avatar & Animation */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div
            className={`
            w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500
            flex items-center justify-center p-2
            shadow-lg shadow-amber-500/25 border-4 border-white
            transition-transform duration-500
            ${isTalking || mood === 'excited' ? 'animate-bounce scale-105' : 'hover:scale-105'}
          `}
          >
            <ScholarTurtleIcon className="w-full h-full drop-shadow-md" />
          </div>
          <span className="mt-2.5 text-xs font-black px-3 py-1 bg-amber-100 text-amber-950 border border-amber-300 rounded-full shadow-xs">
            {getMoodBadge()}
          </span>
        </div>

        {/* Speech Bubble */}
        <div className="flex-1 bg-gradient-to-br from-amber-50/90 to-yellow-50/60 border border-amber-200 rounded-2xl p-5 relative shadow-xs">
          {/* Bubble Arrow (desktop left, mobile top) */}
          <div className="hidden md:block absolute -left-2.5 top-8 w-5 h-5 bg-amber-50 border-l border-b border-amber-200 transform rotate-45" />
          <div className="md:hidden absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-amber-50 border-l border-t border-amber-200 transform rotate-45" />

          <p className="text-slate-900 text-sm sm:text-base leading-relaxed font-bold">
            {bubbleText}
          </p>

          {/* Quick Suggestion Chips */}
          <div className="mt-4 pt-4 border-t border-amber-200/80">
            <p className="text-xs font-black text-amber-950 mb-2 flex items-center gap-1.5">
              <span>💡</span> Gợi ý câu hỏi cho Cụ Rùa:
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onAskMascot && onAskMascot(q)}
                  className="text-xs font-bold bg-white hover:bg-amber-400 text-slate-800 hover:text-slate-950 border border-amber-300 shadow-xs px-3 py-1.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-left"
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
