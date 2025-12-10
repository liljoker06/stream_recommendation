export default function Footer() {
  return (
    <footer className="bg-netflix-black border-t border-netflix-gray py-12">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Questions fréquentes</a></li>
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Centre d'aide</a></li>
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Compte</a></li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Presse</a></li>
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Relations investisseurs</a></li>
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Recrutement</a></li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Confidentialité</a></li>
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Conditions d'utilisation</a></li>
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Préférences de cookies</a></li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3">
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Mentions légales</a></li>
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Nous contacter</a></li>
              <li><a href="#" className="text-netflix-text-gray text-xs hover:underline transition-all">Test de vitesse</a></li>
            </ul>
          </div>
        </div>
        
        <div className="text-netflix-text-gray text-xs">
          <p>&copy; 2025 ReCommend - Système de recommandation intelligent</p>
        </div>
      </div>
    </footer>
  );
}