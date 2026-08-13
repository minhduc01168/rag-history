import { useState } from 'react';

export interface QuizData {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface QuizWidgetProps {
  quiz?: QuizData;
  onNextQuiz?: () => void;
}

export function QuizWidget({ quiz, onNextQuiz }: QuizWidgetProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const defaultQuiz: QuizData = {
    question: "🐢 **Cụ Rùa đố cháu biết:** Ai là người đã chỉ huy chiến thắng Bạch Đằng vĩ đại năm 938 chấm dứt hơn 1000 năm Bắc thuộc?",
    options: [
      "A. Ngô Quyền",
      "B. Đinh Bộ Lĩnh",
      "C. Lý Thái Tổ"
    ],
    correct_answer: "A. Ngô Quyền",
    explanation: "Hoan hô cháu! Đúng rồi đấy! Năm 938, Ngô Quyền đã dùng kế cọc nhọn trên sông Bạch Đằng đánh tan quân Nam Hán, mở ra kỷ nguyên độc lập cho nước ta."
  };

  const currentQuiz = quiz || defaultQuiz;

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    onNextQuiz && onNextQuiz();
  };

  const isCorrect = selectedOption && currentQuiz.correct_answer.startsWith(selectedOption[0]);

  return (
    <div className="bg-white border-2 border-amber-200/80 rounded-3xl p-6 shadow-xl shadow-amber-500/5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl animate-pulse">🎯</span>
          <h3 className="text-xl font-black text-amber-950 tracking-tight">
            Đố Vui Lịch Sử Cùng Cụ Rùa
          </h3>
        </div>
        <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-950 border border-amber-300 rounded-full shadow-sm">
          Góc Thử Thách
        </span>
      </div>

      {/* Câu hỏi */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50/60 border-2 border-amber-200/80 rounded-2xl p-5 mb-6 shadow-sm">
        <p className="text-slate-950 font-extrabold text-base leading-relaxed">
          {currentQuiz.question}
        </p>
      </div>

      {/* Danh sách đáp án */}
      <div className="space-y-3">
        {currentQuiz.options.map((opt, idx) => {
          let btnStyle = "bg-white hover:bg-amber-50 border-slate-200 hover:border-amber-400 text-slate-800 font-bold shadow-sm";
          if (isAnswered) {
            const isThisCorrect = currentQuiz.correct_answer.startsWith(opt[0]);
            const isThisSelected = selectedOption === opt;

            if (isThisCorrect) {
              btnStyle = "bg-emerald-500 text-white border-emerald-600 shadow-md font-black scale-[1.02]";
            } else if (isThisSelected && !isThisCorrect) {
              btnStyle = "bg-rose-500 text-white border-rose-600 shadow-md font-black";
            } else {
              btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60 font-bold";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnswered}
              className={`
                w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between
                ${btnStyle}
                ${!isAnswered ? 'hover:border-amber-500/50 hover:scale-[1.01] active:scale-98 cursor-pointer' : 'cursor-default'}
              `}
            >
              <span className="text-sm sm:text-base font-medium">{opt}</span>
              {isAnswered && currentQuiz.correct_answer.startsWith(opt[0]) && (
                <span className="text-xl">✅</span>
              )}
              {isAnswered && selectedOption === opt && !currentQuiz.correct_answer.startsWith(opt[0]) && (
                <span className="text-xl">❌</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Giải thích sau khi trả lời */}
      {isAnswered && (
        <div className={`
          mt-6 p-5 rounded-2xl border-2 animate-in fade-in slide-in-from-bottom-3 duration-300 shadow-md
          ${isCorrect
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-rose-50 border-rose-300 text-rose-950'}
        `}>
          <div className="flex items-center gap-2 mb-2 font-black text-base">
            <span>{isCorrect ? '🎉 Hoan hô! Cháu trả lời chính xác!' : '💡 Chưa đúng rồi! Cháu thử nhớ lại xem nhé:'}</span>
          </div>
          <p className="text-sm font-bold leading-relaxed text-slate-800">
            {currentQuiz.explanation}
          </p>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReset}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <span>🔄 Câu hỏi đố vui tiếp theo</span>
              <span>➡️</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
