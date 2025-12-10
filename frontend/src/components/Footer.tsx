export default function Footer() {
  return (
    <footer className="bg-netflix-black border-t border-netflix-gray py-12">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="grid text-center grid-cols-2 md:grid-cols-2 gap-8 mb-12">
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Questions fréquentes</a></li>
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Centre d'aide</a></li>
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Compte</a></li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Confidentialité</a></li>
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Conditions d'utilisation</a></li>
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Préférences de cookies</a></li>
            </ul>
          </div>
        </div>
        
        <div className="text-netflix-text-gray  text-center text-xs">
          <p>&copy; 2025 ReCommend - Recommandation intelligente</p>
        </div>
      </div>
    </footer>
  );
}