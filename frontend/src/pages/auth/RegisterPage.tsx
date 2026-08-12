import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
      const response = await fetch('http://localhost:8000/api/v1/auth/register', {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-8 shadow-2xl shadow-amber-950/40 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-amber-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-yellow-500/20 blur-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3 animate-bounce">🐢</div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent mb-2">
              Đăng Ký Tài Khoản Học Sinh
            </h1>
            <p className="text-slate-300 text-sm">Tham gia Sân chơi Lịch sử & Địa lý Tiểu học Lumos History</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <p className="text-green-400 text-sm text-center">Đăng ký thành công! Đang chuyển hướng...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Họ và tên học sinh</label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border border-slate-700/80 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm"
                placeholder="Nguyễn Văn An"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Email phụ huynh / học sinh</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-700/80 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-700/80 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Số điện thoại phụ huynh</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-700/80 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm"
                  placeholder="0912345678"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Khu vực (Tỉnh/Thành)</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-slate-700/80 focus:border-amber-500 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm [&>option]:bg-slate-800"
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
              className="w-full mt-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl py-3 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký tài khoản ngay 🚀'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-400 text-sm">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
