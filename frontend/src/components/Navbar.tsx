import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  

  return (
    <nav 
      className={`fixed top-0 w-full z-50 bg-black transition-all duration-300 ${
        isScrolled 
          ? 'bg-netflix-black' 
          : 'bg-gradient-to-b from-netflix-black/80 to-transparent'
      } ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center group">
            <span className="text-3xl font-black text-netflix-red tracking-tight group-hover:text-netflix-red-dark transition-colors duration-200">
              ReCommend
            </span>
          </Link>
          
          {/* Menu Desktop */}
          <div className="hidden lg:flex items-center gap-12">
            <nav className="flex items-center gap-8">
              <Link 
                to="/movies" 
                className="text-sm font-medium text-netflix-white hover:text-netflix-gray transition-colors duration-200 px-4 py-2"
              >
                Films
              </Link>
              <Link 
                to="/series" 
                className="text-sm font-medium text-netflix-white hover:text-netflix-gray transition-colors duration-200 px-4 py-2"
              >
                Séries
              </Link>
              <Link 
                to="/trending" 
                className="text-sm font-medium text-netflix-white hover:text-netflix-gray transition-colors duration-200 px-4 py-2"
              >
                Nouveautés
              </Link>
            </nav>
            
            {/* Authentification */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
                >
                  <svg className="w-5 h-5 text-netflix-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <svg className="w-3 h-3 text-netflix-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Menu utilisateur ReCommend */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-netflix-black border border-netflix-gray shadow-2xl">
                    <div className="py-1">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-netflix-white hover:bg-netflix-gray transition-colors"
                        >
                          Se déconnecter
                        </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-netflix-white hover:text-netflix-gray transition-colors duration-200"
                >
                  S'identifier
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-1 text-sm font-medium text-white bg-netflix-red hover:bg-netflix-red-dark transition-colors duration-200 rounded"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:opacity-80 transition-opacity duration-200"
          >
            <svg className="w-6 h-6 text-netflix-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

          {/* Menu Mobile ReCommend */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-netflix-black border-t border-netflix-gray">
            <div className="py-4 space-y-2">
              <Link 
                to="/movies" 
                className="block px-6 py-3 text-sm text-netflix-white hover:bg-netflix-gray transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Films
              </Link>
              <Link 
                to="/series" 
                className="block px-6 py-3 text-sm text-netflix-white hover:bg-netflix-gray transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Séries
              </Link>
              <Link 
                to="/trending" 
                className="block px-6 py-3 text-sm text-netflix-white hover:bg-netflix-gray transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nouveautés
              </Link>
              
              {/* Actions utilisateur mobile */}
              {isAuthenticated ? (
                <div className="border-t border-netflix-gray pt-2 mt-2">
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-6 py-3 text-sm text-netflix-white hover:bg-netflix-gray transition-colors"
                  >
                    Se déconnecter
                  </button>
                </div>
              ) : (
                <div className="border-t border-netflix-gray pt-4 mt-2 px-6 space-y-3">
                  <Link 
                    to="/login" 
                    className="block w-full text-center text-sm font-medium text-netflix-white hover:text-netflix-gray transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    S'identifier
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-netflix-red hover:bg-netflix-red-dark transition-colors rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
