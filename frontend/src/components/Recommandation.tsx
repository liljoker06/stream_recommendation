import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

interface RecommendationProps {
  currentMovieId?: number;
  type?: 'movie' | 'series';
}

// Mock data - à remplacer par un appel API basé sur le film actuel
const recommendedMovies = [
  { id: 101, title: 'Blade Runner 2049', image: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', rating: 8.0, year: 2017, genre: 'Science-Fiction' },
  { id: 102, title: 'Arrival', image: 'https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg', rating: 7.9, year: 2016, genre: 'Science-Fiction' },
  { id: 103, title: 'Ex Machina', image: 'https://image.tmdb.org/t/p/w500/9goPE2IoMIXxTLWzl7aizwuIiLh.jpg', rating: 7.7, year: 2015, genre: 'Science-Fiction' },
  { id: 104, title: 'The Martian', image: 'https://image.tmdb.org/t/p/w500/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg', rating: 8.0, year: 2015, genre: 'Science-Fiction' },
  { id: 105, title: 'Interstellar', image: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', rating: 8.6, year: 2014, genre: 'Science-Fiction' },
  { id: 106, title: 'Inception', image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', rating: 8.8, year: 2010, genre: 'Science-Fiction' },
  { id: 107, title: 'The Matrix', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', rating: 8.7, year: 1999, genre: 'Science-Fiction' },
  { id: 108, title: 'Dune', image: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', rating: 8.0, year: 2021, genre: 'Science-Fiction' },
];

export default function Recommandation({ currentMovieId: _currentMovieId, type = 'movie' }: RecommendationProps) {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Dupliquer les films pour créer un effet de boucle infinie
  const duplicatedMovies = [...recommendedMovies, ...recommendedMovies, ...recommendedMovies];

  // Auto-scroll avec boucle infinie
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || isPaused) return;

    let animationFrameId: number;
    const scrollSpeed = 0.5; // Pixels par frame

    const scroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;

        // Calculer la largeur d'un set complet de films
        const itemWidth = 208; // 192px width + 16px gap
        const singleSetWidth = recommendedMovies.length * itemWidth;

        // Réinitialiser la position quand on atteint la fin du premier set dupliqué
        if (scrollContainer.scrollLeft >= singleSetWidth) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPaused]);
  
  // TODO: Utiliser currentMovieId pour filtrer les recommandations via API
  // const fetchRecommendations = async () => {
  //   const response = await fetch(`/api/recommendations/${currentMovieId}`);
  //   return response.json();
  // };

  const handleMovieClick = (id: number) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="bg-netflix-black py-12">
      <div className="container mx-auto px-4">
        {/* Titre de la section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            {type === 'movie' ? 'Films recommandés pour vous' : 'Séries recommandées pour vous'}
          </h2>
          <p className="text-gray-400">
            Basé sur vos préférences et ce que vous regardez
          </p>
        </div>

        {/* Bandeau horizontal scrollable avec auto-scroll */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-hidden scrollbar-hide pb-4"
          >
            {duplicatedMovies.map((movie, index) => (
              <div
                key={`${movie.id}-${index}`}
                className="flex-shrink-0 w-48 cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => handleMovieClick(movie.id)}
                onMouseEnter={() => setHoveredId(movie.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Image du film */}
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 shadow-lg">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Note en overlay */}
                  <div className="absolute top-2 left-2 bg-netflix-red text-white text-xs font-bold px-2 py-1 rounded">
                    ⭐ {movie.rating.toFixed(1)}
                  </div>

                  {/* Overlay au survol */}
                  {hoveredId === movie.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/80 to-transparent flex items-end p-4">
                      <div className="text-white">
                        <p className="text-sm font-semibold mb-1">{movie.year}</p>
                        <p className="text-xs text-gray-300">{movie.genre}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Titre du film */}
                <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                  {movie.title}
                </h3>
                <p className="text-gray-400 text-xs">
                  {movie.year} • {movie.genre}
                </p>
              </div>
            ))}
          </div>

          {/* Indicateur de scroll */}
          <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-netflix-black to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
