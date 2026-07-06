import { useState } from 'react';
import { TimelinePeriod } from './TimelineBar';

interface HistoryCardProps {
  period: TimelinePeriod;
  onExploreMore?: (period: TimelinePeriod) => void;
}

export function HistoryCard({ period, onExploreMore }: HistoryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="group perspective-1000 w-full">
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`
          relative w-full rounded-3xl cursor-pointer transition-all duration-500 transform-style-3d
          border-2 border-slate-700/80 hover:border-amber-500/60
          bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
          p-6 shadow-2xl hover:shadow-amber-500/10
          ${isFlipped ? 'rotate-y-180 bg-slate-800' : ''}
        `}
      >
        {/* Mặt trước Thẻ kiến thức */}
        {!isFlipped ? (
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            <div className={`
              w-20 h-20 rounded-3xl bg-gradient-to-br ${period.color}
              flex items-center justify-center text-5xl shadow-lg shadow-amber-500/20
              group-hover:scale-110 transition-transform duration-300
            `}>
              {period.icon}
            </div>

            <span className="text-xs font-extrabold px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
              ⏳ Mốc Thời Gian: {period.year}
            </span>

            <h3 className="text-2xl font-bold text-white drop-shadow-sm">
              {period.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              {period.description}
            </p>

            <div className="pt-4 flex items-center gap-2 text-xs font-semibold text-amber-400 animate-pulse">
              <span>👆 Chạm để lật thẻ xem ghi nhớ nhanh!</span>
            </div>
          </div>
        ) : (
          /* Mặt sau Thẻ kiến thức (Ghi nhớ nhanh Flashcard) */
          <div className="flex flex-col items-center text-center space-y-4 py-4 rotate-y-180">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-2xl text-amber-400">
              💡
            </div>

            <h4 className="text-lg font-bold text-amber-300">
              Ghi Nhớ Nhanh: {period.title}
            </h4>

            <div className="w-full space-y-3 text-left">
              {/* Thẻ Ý nghĩa */}
              <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-amber-500/30 shadow-inner">
                <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-xs sm:text-sm mb-1.5 whitespace-nowrap">
                  <span>🎯</span>
                  <span>Ý nghĩa lịch sử:</span>
                </div>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed pl-1">
                  Là chặng đường hào hùng, định hình bản sắc văn hóa và ý chí độc lập của dân tộc Việt Nam.
                </p>
              </div>

              {/* Thẻ Trong SGK */}
              <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-teal-500/30 shadow-inner">
                <div className="flex items-center gap-1.5 text-teal-400 font-extrabold text-xs sm:text-sm mb-1.5 whitespace-nowrap">
                  <span>📚</span>
                  <span>Trong SGK Lớp 4 & 5:</span>
                </div>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed pl-1">
                  Bài học trọng tâm Lịch sử & Địa lý với những chiến tích vang dội ngàn năm.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition-all"
              >
                🔄 Lật lại thẻ
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExploreMore && onExploreMore(period);
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 hover:scale-105"
              >
                💬 Hỏi Cụ Rùa ngay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
