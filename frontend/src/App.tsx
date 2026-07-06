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
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-300 hidden sm:inline">
            Xin chào, <span className="text-amber-400 font-bold">{user?.full_name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors px-3 py-1.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/10"
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1">
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 px-4 py-2 rounded-xl shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-amber-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3.5">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
              <span className="text-3xl animate-bounce">🐢</span>
              <Link to="/" className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-sm hover:opacity-90">
                Lumos History
              </Link>
            </h1>
            <nav className="hidden md:flex gap-6">
              <Link
                to="/"
                className={`text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1.5 ${
                  location.pathname === '/' ? 'text-amber-400 drop-shadow-md border-b-2 border-amber-400 pb-1' : 'text-slate-300 hover:text-amber-300'
                }`}
              >
                <span>🏰</span> Sân Chơi Lịch Sử
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className={`text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-1.5 ${
                    location.pathname.startsWith('/admin') ? 'text-teal-400 drop-shadow-md border-b-2 border-teal-400 pb-1' : 'text-teal-500/80 hover:text-teal-400'
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
      <footer className="mt-auto py-8 text-center text-slate-500 text-xs sm:text-sm border-t border-slate-800/80 bg-slate-950/60">
        <p className="font-semibold text-slate-400 mb-1">🐢 Lumos History Bot · Trợ lý Lịch sử & Địa lý Tiểu học (Lớp 4 & Lớp 5)</p>
        <p>Phát triển bởi đội ngũ sáng tạo AI · Dữ liệu chuẩn Sách Giáo Khoa Bộ GD&ĐT</p>
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
              <Route path="/alerts" element={<Home />} />
              <Route path="/survival" element={<Home />} />
              <Route path="/research" element={<Home />} />
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
