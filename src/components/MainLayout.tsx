import { type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StatusLight from './ui/StatusLight';

interface MainLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  {
    label: 'Inicio',
    path: '/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
      </svg>
    ),
  },
  {
    label: 'Generar',
    path: '/generar',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: 'Historial',
    path: '/historial',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Biblioteca',
    path: '/biblioteca',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'USUARIO';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-bg text-textLight flex">
      {/* Sidebar */}
      <aside className="w-56 bg-surface border-r border-army/40 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-army/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan/15 border border-cyan/30 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-textLight uppercase tracking-wider">Sandbox</p>
              <p className="text-[10px] text-textLight/40">Resiliencia Digital</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-cyan/10 text-cyan border border-cyan/20'
                    : 'text-textLight/60 hover:text-textLight hover:bg-navy border border-transparent'
                }`}
              >
                <span className={active ? 'text-cyan' : 'text-textLight/40'}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-army/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-danger/70 hover:text-danger hover:bg-danger/10 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-12 bg-surface border-b border-army/30 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <StatusLight color="#00C851" size={10} />
            <span className="text-xs text-textLight/50 uppercase tracking-wider">Sistema Operativo</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-textLight/30 uppercase tracking-wider">{role}</span>
            <div className="w-7 h-7 rounded-full bg-army/50 border border-army flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-textLight/50">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
