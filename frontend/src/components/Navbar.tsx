import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const [isMobileOpen, setIsMobileOpen]   = useState(false);
  const [showUserMenu, setShowUserMenu]   = useState(false);
  const [isScrolled, setIsScrolled]       = useState(false);
  const [isVisible, setIsVisible]         = useState(true);
  const lastScrollY                        = useRef(0);
  const userMenuRef                        = useRef<HTMLDivElement>(null);

  /* ── Scroll: solid bg + hide on scroll-down ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 40);
      setIsVisible(y < lastScrollY.current || y < 80);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close user menu on outside click ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Close mobile menu on route change ── */
  useEffect(() => { setIsMobileOpen(false); }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/movies', label: 'Films' },
    { to: '/series', label: 'Séries' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-sm border-b border-white/5'
          : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-netflix-red rounded"
          >
            <svg className="w-6 h-6 text-netflix-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <span className="text-white font-bold text-lg tracking-tight">
              Re<span className="text-netflix-red">Commend</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors duration-200 ${
                  isActive(to)
                    ? 'text-white bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right: user */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(v => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-white/10 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                >
                  {/* Avatar initials */}
                  <div className="w-7 h-7 rounded-full bg-netflix-red flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:block text-white text-sm font-medium max-w-[120px] truncate">
                    {user?.name ?? 'Mon compte'}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-[#141414] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/8">
                      <p className="text-white text-xs font-semibold truncate">{user?.name ?? 'Utilisateur'}</p>
                      <p className="text-white/40 text-[11px] truncate mt-0.5">{user?.email ?? ''}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/8 transition-colors duration-200 cursor-pointer flex items-center gap-2.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
                >
                  S'identifier
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-netflix-red hover:bg-netflix-red-dark transition-colors duration-200 rounded"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileOpen(v => !v)}
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded"
              aria-label={isMobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isMobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-white/8">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`block px-4 py-2.5 text-sm font-medium rounded transition-colors duration-200 ${
                  isActive(to)
                    ? 'text-white bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </Link>
            ))}

            {!isAuthenticated && (
              <div className="pt-3 border-t border-white/8 flex flex-col gap-2">
                <Link to="/login" className="block text-center py-2 text-sm text-white/70 hover:text-white transition-colors duration-200">
                  S'identifier
                </Link>
                <Link to="/signup" className="block text-center py-2.5 text-sm font-semibold text-white bg-netflix-red hover:bg-netflix-red-dark transition-colors duration-200 rounded">
                  S'inscrire
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <div className="pt-3 border-t border-white/8">
                <button
                  onClick={() => logout()}
                  className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
