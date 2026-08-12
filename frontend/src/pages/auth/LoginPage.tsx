import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
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
      const userResponse = await fetch('http://localhost:8000/api/v1/auth/me', {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-8 shadow-2xl shadow-amber-950/40 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-amber-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-yellow-500/20 blur-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3 animate-bounce">🐢</div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent mb-2">
              Lumos History
            </h1>
            <p className="text-slate-300 text-sm">Đăng nhập vào Sân chơi Lịch sử & Địa lý</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email học sinh / Quản trị</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-700/80 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm"
                placeholder="hocsinh@lumoshistory.edu.vn"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Mật khẩu</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-700/80 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl py-3 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập ngay 🚀'}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-400 text-sm">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4">
              Đăng ký học ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
