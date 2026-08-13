import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
      }

      const data = await response.json();
      
      // Fetch user info
      const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      });
      
      const userData = await userResponse.json();
      login(data.access_token, userData);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-slate-50 to-amber-100/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-2 border-amber-200/80 rounded-3xl p-8 shadow-xl shadow-amber-500/10 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-amber-400/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-yellow-400/20 blur-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3 animate-bounce filter drop-shadow">🐢</div>
            <h1 className="text-3xl font-black text-amber-950 tracking-tight mb-2">
              Đại Việt Kids AI
            </h1>
            <p className="text-slate-600 text-sm font-bold">Đăng nhập vào Sân chơi Lịch sử & Địa lý</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-2xl">
              <p className="text-rose-800 text-sm font-bold text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Email học sinh / Quản trị</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl px-4 py-3 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm shadow-sm"
                placeholder="hocsinh@daivietkids.edu.vn"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Mật khẩu</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white rounded-2xl px-4 py-3 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-sm shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-3.5 px-4 rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 text-sm"
            >
              {loading ? 'Đang đăng nhập...' : 'Vào Sân Chơi Lịch Sử 🚀'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-400 text-sm">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-amber-600 hover:text-amber-500 font-bold underline underline-offset-4">
              Đăng ký học ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
