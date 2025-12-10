import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-netflix-dark">
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%), url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&h=1080&fit=crop')`
          }}
        />
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Vos recommandations personnalisées
              </h1>
              <p className="text-xl md:text-2xl text-netflix-gray mb-8 leading-relaxed">
                Découvrez des films et séries sélectionnés spécialement pour vous grâce à notre système de recommandation intelligent.
              </p>
              <p className="text-lg text-white mb-10">
                Explorez notre catalogue, ajoutez vos favoris à votre liste et profitez de suggestions personnalisées basées sur vos préférences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/movies" 
                  className="flex items-center justify-center gap-3 bg-netflix-red text-white px-8 py-4 text-lg font-semibold hover:bg-netflix-red-dark transition-colors duration-200 rounded"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  Explorer les Films
                </Link>
                <Link 
                  to="/series" 
                  className="flex items-center justify-center gap-3 bg-netflix-gray/80 text-white px-8 py-4 text-lg font-semibold hover:bg-netflix-gray transition-colors duration-200 rounded border border-netflix-gray"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Explorer les Séries
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="py-20 bg-netflix-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-netflix-gray max-w-3xl mx-auto">
              Notre système de recommandation analyse vos préférences pour vous proposer le meilleur contenu
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Étape 1 */}
            <div className="bg-netflix-dark p-8 rounded-lg border border-netflix-gray hover:border-netflix-red transition-colors">
              <div className="w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Parcourez</h3>
              <p className="text-netflix-gray text-lg">
                Explorez notre catalogue de films et séries avec des informations détaillées : notes, durée, genre, année de sortie.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="bg-netflix-dark p-8 rounded-lg border border-netflix-gray hover:border-netflix-red transition-colors">
              <div className="w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Ajoutez à votre liste</h3>
              <p className="text-netflix-gray text-lg">
                Créez votre liste personnalisée en ajoutant les films et séries qui vous intéressent pour les retrouver facilement.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="bg-netflix-dark p-8 rounded-lg border border-netflix-gray hover:border-netflix-red transition-colors">
              <div className="w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Recevez des recommandations</h3>
              <p className="text-netflix-gray text-lg">
                Notre IA vous propose des suggestions personnalisées basées sur vos goûts et vos préférences de genre.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Catégories */}
      <section className="py-20 bg-netflix-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
            Explorez par catégorie
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Films */}
            <Link 
              to="/movies" 
              className="group relative h-80 rounded-lg overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%), url('https://images.unsplash.com/photo-1489599408017-293606b66a6d?w=800&h=600&fit=crop')`
                }}
              />
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <h3 className="text-4xl font-bold text-white mb-3">Films</h3>
                <p className="text-lg text-netflix-gray mb-4">
                  Des milliers de films recommandés selon vos goûts
                </p>
                <div className="flex items-center text-netflix-red font-semibold">
                  <span>Explorer maintenant</span>
                  <svg className="w-6 h-6 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Séries */}
            <Link 
              to="/series" 
              className="group relative h-80 rounded-lg overflow-hidden"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%), url('https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&h=600&fit=crop')`
                }}
              />
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <h3 className="text-4xl font-bold text-white mb-3">Séries</h3>
                <p className="text-lg text-netflix-gray mb-4">
                  Des séries captivantes sélectionnées pour vous
                </p>
                <div className="flex items-center text-netflix-red font-semibold">
                  <span>Explorer maintenant</span>
                  <svg className="w-6 h-6 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-20 bg-netflix-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-xl text-netflix-gray max-w-2xl mx-auto">
              Des milliers d'utilisateurs font confiance à notre plateforme de recommandation
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-netflix-dark p-6 rounded-lg">
              <div className="text-5xl font-bold text-netflix-red mb-2">15K+</div>
              <div className="text-netflix-gray text-lg">Films disponibles</div>
            </div>
            <div className="bg-netflix-dark p-6 rounded-lg">
              <div className="text-5xl font-bold text-netflix-red mb-2">8K+</div>
              <div className="text-netflix-gray text-lg">Séries disponibles</div>
            </div>
            <div className="bg-netflix-dark p-6 rounded-lg">
              <div className="text-5xl font-bold text-netflix-red mb-2">95%</div>
              <div className="text-netflix-gray text-lg">Précision des recommandations</div>
            </div>
            <div className="bg-netflix-dark p-6 rounded-lg">
              <div className="text-5xl font-bold text-netflix-red mb-2">50K+</div>
              <div className="text-netflix-gray text-lg">Utilisateurs actifs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action final */}
      <section className="py-20 bg-gradient-to-t from-netflix-red/20 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à découvrir votre prochain favori ?
          </h2>
          <p className="text-xl text-netflix-gray mb-10">
            Commencez dès maintenant à explorer nos recommandations personnalisées
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/movies" 
              className="bg-netflix-red text-white px-10 py-4 text-lg font-semibold hover:bg-netflix-red-dark transition-colors rounded"
            >
              Voir les Films
            </Link>
            <Link 
              to="/series" 
              className="bg-transparent text-white px-10 py-4 text-lg font-semibold hover:bg-netflix-gray transition-colors rounded border-2 border-white"
            >
              Voir les Séries
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}