import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import StatusLight from './ui/StatusLight';

interface MainLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { label: 'Inicio', path: '/' },
  { label: 'Generar', path: '/generar' },
  { label: 'Historial', path: '/historial' },
  { label: 'Biblioteca', path: '/biblioteca' },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'USUARIO';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-bg text-textLight flex flex-col">
      {/* Header */}
      <header className="bg-surface/80 backdrop-blur-md border-b border-army/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/logo.png" alt="Logo" className="rounded-lg" style={{ width: 68, height: 65, objectFit: 'contain' }} />
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-textLight uppercase tracking-wider leading-none">Sandbox</p>
              <p className="text-[10px] text-textLight/40">Resiliencia Digital</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    active
                      ? 'bg-cyan/10 text-cyan border border-cyan/20'
                      : 'text-textLight/50 hover:text-textLight hover:bg-navy border border-transparent'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <StatusLight color="#00C851" size={8} />
              <span className="text-[10px] text-textLight/40 uppercase tracking-wider">{role}</span>
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-danger/60 hover:text-danger hover:bg-danger/10 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-navy transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-army/30 bg-surface/95 backdrop-blur-md">
            <nav className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-cyan/10 text-cyan'
                        : 'text-textLight/60 hover:text-textLight hover:bg-navy'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-danger/60 hover:text-danger hover:bg-danger/10 transition-colors"
              >
                Cerrar Sesión
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
