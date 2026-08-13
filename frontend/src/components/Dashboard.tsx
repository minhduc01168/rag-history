import { useState } from 'react';
import { TimelineBar, TimelinePeriod } from './TimelineBar';
import { MascotWidget } from './MascotWidget';
import { HistoryCard } from './HistoryCard';
import { QuizWidget } from './QuizWidget';

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimelinePeriod | null>(null);
  const [mascotMessage, setMascotMessage] = useState(
    "Chào mừng cháu đến với Sân chơi Lịch sử! Chạm vào các mốc thời gian bên dưới để cùng Cụ Rùa ngược dòng thời gian nhé!"
  );
  const [mascotMood, setMascotMood] = useState<'default' | 'happy' | 'thinking' | 'excited'>('default');

  const handleSelectPeriod = (period: TimelinePeriod) => {
    setSelectedPeriod(period);
    setMascotMood('excited');
    setMascotMessage(
      `Hoan hô! Cháu vừa chọn mốc "${period.title}" (${period.year}). Cháu có muốn thử tài ghi nhớ nhanh hay đố vui về giai đoạn hào hùng này không nào?`
    );
  };

  const handleAskMascot = (question: string) => {
    setMascotMood('thinking');
    setMascotMessage(`Cháu hỏi câu "${question}" rất hay! Hãy mở khung chat Cụ Rùa Thông Thái ở góc dưới bên phải để nhận câu trả lời chi tiết và kể chuyện lịch sử nhé! 🐢📜`);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Banner & Mascot Widget */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black px-3 py-1 bg-amber-500/20 text-amber-900 border border-amber-500/30 rounded-full shadow-sm">
              ✨ Sân chơi Lịch sử Tiểu học · SGK Lớp 4 & Lớp 5
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-2 tracking-tight drop-shadow-sm">
              Đại Việt Kids Playground
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-semibold mt-1">
              Khám phá hào khí ngàn năm qua từng thẻ bài, dòng thời gian và thử thách đố vui!
            </p>
          </div>
        </div>

        <MascotWidget
          message={mascotMessage}
          mood={mascotMood}
          onAskMascot={handleAskMascot}
        />
      </div>

      {/* Dòng Thời Gian Lịch Sử */}
      <TimelineBar
        onSelectPeriod={handleSelectPeriod}
        selectedId={selectedPeriod?.id}
      />

      {/* Khu vực Khám phá Chi tiết & Thử thách Đố vui */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Thẻ Kiến Thức Flashcard (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-amber-950 flex items-center gap-2">
              <span>🎴</span> Thẻ Bài Kiến Thức Trực Quan
            </h3>
            <span className="text-xs text-slate-500 font-bold">Chạm thẻ để lật xem ghi nhớ</span>
          </div>

          {selectedPeriod ? (
            <HistoryCard
              period={selectedPeriod}
              onExploreMore={(p) => handleAskMascot(`Hãy kể cho cháu nghe chi tiết về ${p.title} (${p.year})`)}
            />
          ) : (
            <div className="bg-white border-2 border-amber-200 shadow-xl shadow-amber-500/5 rounded-3xl p-8 text-center text-slate-600">
              <span className="text-5xl block mb-3 animate-bounce">👆</span>
              <p className="text-sm sm:text-base font-bold text-slate-700">
                Cháu hãy chọn một mốc thời gian trên Dòng thời gian phía trên để hiển thị Thẻ bài kiến thức tương ứng nhé!
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Khung Đố Vui Trắc Nghiệm (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-amber-950 flex items-center gap-2">
              <span>🏆</span> Thử Thách Của Cụ Rùa
            </h3>
            <span className="text-xs text-slate-500 font-bold">Kiểm tra kiến thức</span>
          </div>

          <QuizWidget
            onNextQuiz={() => {
              setMascotMood('happy');
              setMascotMessage("Hoan hô! Cháu đã hoàn thành thử thách! Hãy chọn mốc thời gian khác hoặc hỏi Cụ Rùa thêm câu hỏi đố vui nhé! 🐢🎉");
            }}
          />
        </div>
      </div>
    </div>
  );
}
