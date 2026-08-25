import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export function AdminLayout() {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: '/admin/kb', icon: '📚', label: t('admin.navUpload') },
    { path: '/admin/kb-docs', icon: '🗂️', label: t('admin.navManage') },
  ];

  return (
    <div className="flex flex-1 min-h-[calc(100vh-73px)] w-full bg-slate-50/60">
      {/* Sidebar */}
      <aside className="w-64 bg-white/90 border-r-2 border-amber-200/80 flex flex-col backdrop-blur-xl shrink-0 shadow-sm">
        <div className="p-6 border-b-2 border-amber-100 bg-gradient-to-r from-amber-500/10 to-yellow-500/10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <div>
              <h2 className="text-lg font-black text-amber-950">
                {t('admin.title')}
              </h2>
              <p className="text-xs font-bold text-amber-800/80 mt-0.5">{t('admin.subtitle')}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4 space-y-1.5 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (location.pathname === '/admin' && item.path === '/admin/kb') ||
                             (location.pathname.startsWith(item.path + '/'));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-amber-400/25 text-amber-950 font-black border-2 border-amber-400 shadow-sm' 
                    : 'text-slate-600 hover:bg-amber-50 hover:text-amber-950 font-bold'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 p-6 sm:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
