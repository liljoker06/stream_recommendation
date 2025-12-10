import MovieCard from '../components/MovieCard';

// Mock data - à remplacer par des vrais appels API
const moviesData = [
  { id: 1, title: 'Inception', image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', rating: 8.8, duration: '2h28', year: 2010, genre: 'Science-Fiction' },
  { id: 2, title: 'The Dark Knight', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', rating: 9.0, duration: '2h32', year: 2008, genre: 'Action' },
  { id: 3, title: 'Interstellar', image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', rating: 8.6, duration: '2h49', year: 2014, genre: 'Science-Fiction' },
  { id: 4, title: 'Parasite', image: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', rating: 8.5, duration: '2h12', year: 2019, genre: 'Thriller' },
  { id: 5, title: 'The Shawshank Redemption', image: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', rating: 9.3, duration: '2h22', year: 1994, genre: 'Drame' },
  { id: 6, title: 'Pulp Fiction', image: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', rating: 8.9, duration: '2h34', year: 1994, genre: 'Crime' },
  { id: 7, title: 'The Matrix', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', rating: 8.7, duration: '2h16', year: 1999, genre: 'Science-Fiction' },
  { id: 8, title: 'Forrest Gump', image: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', rating: 8.8, duration: '2h22', year: 1994, genre: 'Drame' },
  { id: 9, title: 'Fight Club', image: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', rating: 8.8, duration: '2h19', year: 1999, genre: 'Drame' },
  { id: 10, title: 'The Godfather', image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', rating: 9.2, duration: '2h55', year: 1972, genre: 'Crime' },
  { id: 11, title: 'Gladiator', image: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', rating: 8.5, duration: '2h35', year: 2000, genre: 'Action' },
  { id: 12, title: 'Saving Private Ryan', image: 'https://image.tmdb.org/t/p/w500/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg', rating: 8.6, duration: '2h49', year: 1998, genre: 'Guerre' },
];

export default function Movies() {
  const handleRate = (id: number, rating: number) => {
    console.log(`Film ${id} noté ${rating}`);
    // TODO: Implémenter la notation
  };

  return (
    <div className="min-h-screen bg-netflix-dark pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Films recommandés</h1>
          <p className="text-gray-300 text-lg">
            Découvrez notre sélection de films basée sur vos préférences
          </p>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-netflix-red text-white text-sm font-medium rounded hover:bg-netflix-red-dark transition-colors whitespace-nowrap">
            Tous les genres
          </button>
          <button className="px-4 py-2 bg-netflix-dark text-gray-300 text-sm font-medium rounded hover:bg-netflix-gray hover:text-white transition-colors whitespace-nowrap border border-gray-600">
            Action
          </button>
          <button className="px-4 py-2 bg-netflix-dark text-gray-300 text-sm font-medium rounded hover:bg-netflix-gray hover:text-white transition-colors whitespace-nowrap border border-gray-600">
            Drame
          </button>
          <button className="px-4 py-2 bg-netflix-dark text-gray-300 text-sm font-medium rounded hover:bg-netflix-gray hover:text-white transition-colors whitespace-nowrap border border-gray-600">
            Science-Fiction
          </button>
          <button className="px-4 py-2 bg-netflix-dark text-gray-300 text-sm font-medium rounded hover:bg-netflix-gray hover:text-white transition-colors whitespace-nowrap border border-gray-600">
            Thriller
          </button>
          <button className="px-4 py-2 bg-netflix-dark text-gray-300 text-sm font-medium rounded hover:bg-netflix-gray hover:text-white transition-colors whitespace-nowrap border border-gray-600">
            Crime
          </button>
        </div>

        {/* Grille de films */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {moviesData.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              image={movie.image}
              rating={movie.rating}
              duration={movie.duration}
              year={movie.year}
              genre={movie.genre}
              onRate={handleRate}
            />
          ))}
        </div>

        {/* Section "Charger plus" */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-netflix-black text-white text-sm font-medium rounded hover:bg-netflix-gray transition-colors border border-netflix-gray">
            Charger plus de recommandations
          </button>
        </div>
      </div>
    </div>
  );
}