import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Đăng ký thất bại. Vui lòng thử lại.');
      }

      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-slate-50 to-amber-100/50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border-2 border-amber-200/80 rounded-3xl p-8 shadow-xl shadow-amber-500/10 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-amber-400/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-yellow-400/20 blur-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3 animate-bounce filter drop-shadow">🐢</div>
            <h1 className="text-3xl font-black text-amber-950 tracking-tight mb-2">
              Đăng Ký Tài Khoản Học Sinh
            </h1>
            <p className="text-slate-600 text-sm font-bold">Tham gia Sân chơi Lịch sử & Địa lý Tiểu học Đại Việt Kids AI</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-2xl">
              <p className="text-rose-800 text-sm font-bold text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl">
              <p className="text-emerald-800 text-sm font-bold text-center">Đăng ký thành công! Đang chuyển hướng...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Họ và tên học sinh</label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl px-4 py-3 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm shadow-sm"
                placeholder="Nguyễn Văn An"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Email phụ huynh / học sinh</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl px-4 py-3 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm shadow-sm"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl px-4 py-3 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Số điện thoại phụ huynh</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl px-4 py-3 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm shadow-sm"
                  placeholder="0912345678"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Khu vực (Tỉnh/Thành)</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl px-4 py-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm shadow-sm"
                >
                  <option value="">Chọn khu vực</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP Hồ Chí Minh">TP Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Quảng Ninh">Quảng Ninh</option>
                  <option value="Nghệ An">Nghệ An</option>
                  <option value="Lào Cai">Lào Cai</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-6 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-3.5 px-4 rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 text-sm"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản ngay 🚀'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-600 font-bold text-sm">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-amber-600 hover:text-amber-500 font-black underline underline-offset-4">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
