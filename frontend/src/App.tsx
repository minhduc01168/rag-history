import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { Dashboard } from './components/Dashboard'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { TerraBotWidget } from './components/TerraBotWidget'
import { AdminLayout } from './pages/admin/AdminLayout'
import { KnowledgeBasePage } from './pages/admin/KnowledgeBasePage'
import { KBDocumentsPage } from './pages/admin/KBDocumentsPage'

function HeaderAuth() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4">

      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-950 hidden sm:inline">
            Xin chào, <span className="text-amber-950 font-black underline underline-offset-2">{user?.full_name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-rose-950 hover:bg-rose-600 hover:text-white transition-all px-3 py-1.5 rounded-xl border border-rose-900/20 bg-rose-500/20"
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="text-sm font-extrabold text-slate-950 hover:bg-slate-950/10 transition-all px-3 py-1.5 rounded-xl">
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="text-xs font-black bg-slate-950 hover:bg-slate-900 text-amber-300 px-4 py-2 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            Đăng ký học
          </Link>
        </div>
      )}
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user } = useAuth()
  const isOffline = location.pathname === '/offline'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'
  const isAdminPage = location.pathname.startsWith('/admin')

  if (isOffline || isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/70 via-slate-50 to-amber-100/40 text-slate-800 flex flex-col font-sans">
      <header className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-b border-amber-600/20 shadow-lg shadow-amber-500/15 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
              <span className="text-3xl animate-bounce filter drop-shadow">🐢</span>
              <Link to="/" className="text-slate-950 font-black tracking-tight hover:opacity-90 transition-opacity drop-shadow-sm">
                Đại Việt Kids AI
              </Link>
            </h1>
            <nav className="hidden md:flex gap-6">
              <Link
                to="/"
                className={`text-sm font-extrabold transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                  location.pathname === '/' ? 'bg-slate-950 text-amber-300 shadow-md' : 'text-slate-900 hover:bg-slate-950/10'
                }`}
              >
                <span>🏰</span> Sân Chơi Lịch Sử
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`text-sm font-extrabold transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                    location.pathname.startsWith('/admin') ? 'bg-teal-900 text-teal-200 shadow-md' : 'text-teal-950 hover:bg-teal-900/10'
                  }`}
                >
                  <span>📚</span> Quản Trị Dữ Liệu SGK
                </Link>
              )}
            </nav>
          </div>
          <HeaderAuth />
        </div>
      </header>
      <main className={isAdminPage ? "flex-1 w-full flex flex-col" : "flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"}>
        {children}
      </main>
      <TerraBotWidget />
      <footer className="mt-auto py-8 text-center text-slate-600 text-xs sm:text-sm border-t border-amber-200/80 bg-white/80 backdrop-blur-sm">
        <p className="font-bold text-slate-700 mb-1">🐢 Đại Việt Kids AI · Trợ lý Lịch sử & Địa lý Tiểu học (Lớp 4 & Lớp 5)</p>
        <p className="text-slate-500">Phát triển bởi đội ngũ sáng tạo AI · Dữ liệu chuẩn Sách Giáo Khoa Bộ GD&ĐT</p>
      </footer>
    </div>
  )
}

function Home() {
  return <Dashboard />
}

function Offline() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
      <div className="text-center p-8 max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl backdrop-blur-md shadow-2xl">
        <div className="text-6xl mb-4 animate-bounce">🐢</div>
        <h2 className="text-2xl font-bold text-amber-300">Mất kết nối Internet rồi!</h2>
        <p className="mt-2 text-slate-400 text-sm">Cháu hãy kiểm tra lại kết nối mạng để cùng Cụ Rùa tiếp tục khám phá lịch sử nhé!</p>
        <Link
          to="/"
          className="mt-6 inline-block bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 px-6 py-2.5 rounded-xl text-sm font-bold hover:from-amber-400 hover:to-yellow-400 transition-all shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95"
        >
          Thử kết nối lại
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/offline" element={<Offline />} />
              
              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<KnowledgeBasePage />} />
                  <Route path="kb" element={<KnowledgeBasePage />} />
                  <Route path="kb-docs" element={<KBDocumentsPage />} />
                  <Route path="*" element={<KnowledgeBasePage />} />
                </Route>
              </Route>
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
