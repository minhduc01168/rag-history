import { useState } from 'react';

export interface TimelinePeriod {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const HISTORICAL_PERIODS: TimelinePeriod[] = [
  {
    id: 'hung_vuong',
    year: '700 TCN',
    title: 'Thời Hùng Vương - Văn Lang',
    description: '18 đời Vua Hùng dựng nước, truyền thuyết Thánh Gióng, Sơn Tinh - Thủy Tinh, trống đồng Đông Sơn.',
    icon: '🥁',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'hai_ba_trung',
    year: 'Năm 40',
    title: 'Hai Bà Trưng Khởi Nghĩa',
    description: 'Trưng Trắc, Trưng Nhị phất cờ khởi nghĩa đánh đuổi quân Tô Định, lập nên vương triều độc lập.',
    icon: '🐘',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'ngo_quyen',
    year: 'Năm 938',
    title: 'Chiến Thắng Bạch Đằng',
    description: 'Ngô Quyền dùng trận địa cọc ngầm chông sắt đánh tan quân Nam Hán, mở ra kỷ nguyên độc lập.',
    icon: '⚓',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'dinh_bo_linh',
    year: 'Năm 968',
    title: 'Đinh Bộ Lĩnh - Đại Cồ Việt',
    description: 'Cậu bé chăn trâu lấy cờ lau tập trận, dẹp loạn 12 sứ quân, lên ngôi Hoàng đế lập nước Đại Cồ Việt.',
    icon: '🌾',
    color: 'from-emerald-500 to-green-600',
  },
  {
    id: 'ly_thai_to',
    year: 'Năm 1010',
    title: 'Dời Đô Về Thăng Long',
    description: 'Vua Lý Thái Tổ thấy rồng vàng bay lên bèn dời đô từ Hoa Lư về thành Đại La, đổi tên là Thăng Long.',
    icon: '🐉',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'tran_hung_dao',
    year: 'Năm 1288',
    title: 'Hào Khí Đông A - Nhà Trần',
    description: 'Trần Hưng Đạo cùng quân dân nhà Trần 3 lần đánh bại quân Nguyên Mông hùng mạnh nhất thế giới.',
    icon: '⚔️',
    color: 'from-red-600 to-amber-600',
  },
];

interface TimelineBarProps {
  onSelectPeriod: (period: TimelinePeriod) => void;
  selectedId?: string;
}

export function TimelineBar({ onSelectPeriod, selectedId }: TimelineBarProps) {
  const [activeId, setActiveId] = useState<string>(selectedId || HISTORICAL_PERIODS[0].id);

  const handleSelect = (period: TimelinePeriod) => {
    setActiveId(period.id);
    onSelectPeriod(period);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-3xl p-6 shadow-2xl shadow-amber-900/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce">📜</span>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Dòng Thời Gian Lịch Sử Việt Nam
            </h3>
            <p className="text-xs text-slate-400">
              Chạm vào từng mốc thời gian để cùng Cụ Rùa quay ngược quá khứ nhé!
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
          SGK Lớp 4 & 5
        </span>
      </div>

      {/* Timeline track */}
      <div className="relative mt-8 mb-4">
        <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500/30 via-yellow-500/50 to-amber-500/30 -translate-y-1/2 rounded-full" />

        <div className="relative flex justify-between gap-2 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-amber-500/40">
          {HISTORICAL_PERIODS.map((period) => {
            const isSelected = activeId === period.id;
            return (
              <button
                key={period.id}
                onClick={() => handleSelect(period)}
                className={`
                  group relative flex flex-col items-center min-w-[120px] transition-all duration-300
                  focus:outline-none transform hover:-translate-y-1
                `}
              >
                {/* Year Badge */}
                <span className={`
                  text-xs font-bold px-2.5 py-0.5 rounded-full mb-2 transition-all duration-300
                  ${isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/50 scale-110'
                    : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'}
                `}>
                  {period.year}
                </span>

                {/* Node Icon */}
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                  bg-gradient-to-br ${period.color}
                  shadow-lg transition-all duration-300 border-2
                  ${isSelected
                    ? 'border-white scale-125 shadow-amber-500/60 rotate-6'
                    : 'border-transparent opacity-80 group-hover:opacity-100 group-hover:scale-110'}
                `}>
                  {period.icon}
                </div>

                {/* Title */}
                <span className={`
                  mt-3 text-xs font-semibold text-center max-w-[110px] line-clamp-2 transition-all duration-300
                  ${isSelected ? 'text-amber-300 font-bold scale-105' : 'text-slate-400 group-hover:text-slate-200'}
                `}>
                  {period.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
