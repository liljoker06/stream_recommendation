import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  id: number;
  title: string;
  image: string;
  rating: number;
  duration: string;
  year: number;
  genre: string;
  onAddToList?: (id: number) => void;
  onRate?: (id: number, rating: number) => void;
}

export default function MovieCard({ 
  id, 
  title, 
  image, 
  rating, 
  duration, 
  year, 
  genre,
  onAddToList,
  onRate 
}: MovieCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const navigate = useNavigate();

  const handleAddToList = () => {
    setIsInList(!isInList);
    if (onAddToList) {
      onAddToList(id);
    }
  };

  const handleCardClick = () => {
    navigate(`/movie/${id}`);
  };

  return (
    <div 
      className="group relative bg-netflix-black rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
      onClick={handleCardClick}
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
        
        {/* Note en haut à gauche */}
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
            <span className="text-white font-semibold">{year}</span>
            <span>•</span>
            <span>{duration}</span>
            <span>•</span>
            <span>{genre}</span>
          </div>

          {/* Actions de recommandation */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="px-3 py-2 text-xs font-medium text-white bg-netflix-gray hover:bg-netflix-light-gray rounded transition-colors duration-200 border border-gray-500"
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
          <p className="text-gray-400 text-xs mt-1">{year} • {genre}</p>
        </div>
      )}
    </div>
  );
}
