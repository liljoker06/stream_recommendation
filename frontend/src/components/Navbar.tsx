import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  // const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);

  

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
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
              <Link 
                to="/watchlist" 
                className="text-sm font-medium text-netflix-white hover:text-netflix-gray transition-colors duration-200 px-4 py-2"
              >
                Ma liste
              </Link>

            </nav>
            
            {/* Authentification */}

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
              <Link 
                to="/watchlist" 
                className="block px-6 py-3 text-sm text-netflix-white hover:bg-netflix-gray transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ma liste
              </Link>
              
              {/* Actions utilisateur mobile */}

            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
