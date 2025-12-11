import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { contentAPI } from "../services/api";
import type { Content } from "../types";
import { filterValidCategories } from "../utils/genres";

import {
  eventTracker,
  startDurationTimer,
  stopDurationTimer,
} from "../services/eventTracker";

export default function Movies() {
  const [movies, setMovies] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const user = localStorage.getItem("user");
  const user_id = user ? JSON.parse(user).user_id : null;

  // TRACKING : Ouverture de la page Films
  useEffect(() => {
    if (!user_id) return;

    eventTracker.viewCategory({
      user_id,
      content: {
        content_id: null,
        tags: [],
        category: "all_movies",
      },
    });

    startDurationTimer();

    return () => {
      stopDurationTimer({
        user_id,
        content: {
          content_id: null,
          tags: [],
          category: selectedCategory ?? "all_movies",
        },
      });
    };
  }, []);


  // TRACKING : Changement de catégorie
  useEffect(() => {
    if (!user_id) return;

    // STOP timer de l’ancienne catégorie
    stopDurationTimer({
      user_id,
      content: {
        content_id: null,
        tags: [],
        category: selectedCategory ?? "all_movies",
      },
    });

    // START nouveau timer
    startDurationTimer();

    // Envoi événement au backend
    eventTracker.viewCategory({
      user_id,
      content: {
        content_id: null,
        tags: [],
        category: selectedCategory ?? "all_movies",
      },
    });
  }, [selectedCategory]);


  // Chargement catégories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await contentAPI.getCategories("movie");
      if (response.success) {
        setCategories(filterValidCategories(response.data));
      }
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
    }
  };


  useEffect(() => {
    loadMovies();
  }, [selectedCategory]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = selectedCategory
        ? await contentAPI.getByCategory(selectedCategory, "movie")
        : await contentAPI.getMovies();

      if (response.success) {
        setMovies(response.data);
      } else {
        setError("Erreur lors du chargement des films");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Impossible de charger les films");
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-netflix-dark pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Films recommandés
          </h1>
          <p className="text-gray-300 text-lg">
            Découvrez notre sélection de films basée sur vos préférences
          </p>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors whitespace-nowrap ${
              !selectedCategory
                ? "bg-netflix-red text-white hover:bg-netflix-red-dark"
                : "bg-netflix-dark text-gray-300 border border-gray-600 hover:bg-netflix-gray hover:text-white"
            }`}
          >
            Tous les genres
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-netflix-red text-white hover:bg-netflix-red-dark"
                  : "bg-netflix-dark text-gray-300 border border-gray-600 hover:bg-netflix-gray hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-netflix-red"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white px-6 py-4 rounded mb-8">
            <p className="font-medium">{error}</p>
            <button
              onClick={loadMovies}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Liste */}
        {!loading && !error && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.content_id}
                id={movie.content_id}
                title={movie.title}
                image={movie.metadata.poster_url}
                rating={movie.metadata.vote_average}
                duration={formatDuration(movie.duration)}
                year={new Date().getFullYear()}
                genre={movie.category}
              />
            ))}
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              Aucun film trouvé pour cette catégorie
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
