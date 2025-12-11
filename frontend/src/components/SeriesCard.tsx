import { useState } from 'react';

interface SeriesCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  seasons: number;
  year: number;
  genre: string;
}

export default function SeriesCard({ 
  id, 
  title, 
  image, 
  rating, 
  seasons, 
  year, 
  genre
}: SeriesCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div 
      className="group relative bg-netflix-black rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:z-10"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Image principale */}
      <div className="relative aspect-[2/3]">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay gradient au survol */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* ut à gauche */}
        <div className="absolute top-2 left-2 bg-netflix-red text-white text-xs font-bold px-2 py-1 rounded">
          ⭐ {rating.toFixed(1)}
        </div>
      </div>

      {/* Détails au survol */}
      {showDetails && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-netflix-black via-netflix-black to-transparent">
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{title}</h3>
          
          {/* Métadonnées */}
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
            <span className="text-netflix-white font-semibold">{year}</span>
            <span>•</span>
            <span>{seasons} saison{seasons > 1 ? 's' : ''}</span>
            <span>•</span>
            <span>{genre}</span>
          </div>

          {/* Actions de recommandation */}
          <div className="flex items-center gap-2">
           
            <button
              onClick={() => {/* Modal détails */}}
              className="px-3 py-2 text-xs font-medium text-white bg-netflix-dark hover:bg-netflix-gray rounded transition-colors duration-200 border border-netflix-gray"
            >
              ℹ️ Info
            </button>
          </div>
        </div>
      )}

      {/* Titre visible sans survol (mobile) */}
      {!showDetails && (
        <div className="p-3 bg-netflix-black">
          <h3 className="text-white font-semibold text-sm line-clamp-1">{title}</h3>
          <p className="text-gray-300 text-xs mt-1">{year} • {seasons} saison{seasons > 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  );
}
