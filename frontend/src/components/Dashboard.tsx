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
            <span className="text-xs font-bold px-3 py-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30 rounded-full shadow-sm">
              ✨ Sân chơi Lịch sử Tiểu học · SGK Lớp 4 & Lớp 5
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 drop-shadow-md bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent">
              Lumos History Playground
            </h2>
            <p className="text-slate-400 text-sm mt-1">
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
            <h3 className="text-xl font-bold text-amber-300 flex items-center gap-2">
              <span>🎴</span> Thẻ Bài Kiến Thức Trực Quan
            </h3>
            <span className="text-xs text-slate-400 font-medium">Chạm thẻ để lật xem ghi nhớ</span>
          </div>

          {selectedPeriod ? (
            <HistoryCard
              period={selectedPeriod}
              onExploreMore={(p) => handleAskMascot(`Hãy kể cho cháu nghe chi tiết về ${p.title} (${p.year})`)}
            />
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
              <span className="text-4xl block mb-2">👆</span>
              <p className="text-sm font-medium">
                Cháu hãy chọn một mốc thời gian trên Dòng thời gian phía trên để hiển thị Thẻ bài kiến thức tương ứng nhé!
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Khung Đố Vui Trắc Nghiệm (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-amber-300 flex items-center gap-2">
              <span>🏆</span> Thử Thách Của Cụ Rùa
            </h3>
            <span className="text-xs text-slate-400 font-medium">Kiểm tra kiến thức</span>
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
