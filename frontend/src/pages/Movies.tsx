import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { contentAPI, recommandationAPI } from "../services/api";
import type { Content } from "../types";
import { filterValidCategories } from "../utils/genres";

import {
  eventTracker,
  startDurationTimer,
  stopDurationTimer,
} from "../services/eventTracker";

type RecommendationSection = {
  key: string;
  title: string;
  subtitle?: string;
  source: "ai" | "cold_start";
  items: Content[];
};

export default function Movies() {
  const [movies, setMovies] = useState<Content[]>([]);
  const [sections, setSections] = useState<RecommendationSection[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showRecommended, setShowRecommended] = useState(false);

  const user = localStorage.getItem("user");
  const user_id = user ? JSON.parse(user).user_id : null;

  // =====================================================
  // ENTRY PAGE TRACKING
  // =====================================================
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
          category: "all_movies",
        },
      });
    };
  }, []);

  // =====================================================
  // CATEGORY CHANGE (CLASSIC)
  // =====================================================
  useEffect(() => {
    if (!user_id || showRecommended) return;

    stopDurationTimer({
      user_id,
      content: {
        content_id: null,
        tags: [],
        category: selectedCategory ?? "all_movies",
      },
    });

    startDurationTimer();

    eventTracker.viewCategory({
      user_id,
      content: {
        content_id: null,
        tags: [],
        category: selectedCategory ?? "all_movies",
      },
    });
  }, [selectedCategory]);

  // =====================================================
  // SWITCH TO RECOMMENDATIONS ⭐
  // =====================================================
  useEffect(() => {
    if (!user_id) return;

    if (showRecommended) {
      stopDurationTimer({
        user_id,
        content: {
          content_id: null,
          tags: [],
          category: selectedCategory ?? "all_movies",
        },
      });

      startDurationTimer();

      eventTracker.viewCategory({
        user_id,
        content: {
          content_id: null,
          tags: [],
          category: "recommendations_ai",
        },
      });
    }
  }, [showRecommended]);

  // =====================================================
  // LOAD CATEGORIES
  // =====================================================
  useEffect(() => {
    (async () => {
      try {
        const res = await contentAPI.getCategories("movie");
        if (res.success) {
          setCategories(filterValidCategories(res.data));
        }
      } catch (err) {
        console.error("Erreur catégories:", err);
      }
    })();
  }, []);

  // =====================================================
  // LOAD DATA
  // =====================================================
  useEffect(() => {
    if (showRecommended) loadRecommendations();
    else loadMovies();
  }, [selectedCategory, showRecommended]);

  // =====================================================
  // LOAD MOVIES
  // =====================================================
  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = selectedCategory
        ? await contentAPI.getByCategory(selectedCategory, "movie")
        : await contentAPI.getMovies();

      if (res.success) setMovies(res.data);
      else setError("Erreur chargement films");
    } catch {
      setError("Impossible de charger les films");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD RECOMMENDATIONS (IA + COLD)
  // =====================================================
const loadRecommendations = async () => {
  if (!user_id) return;

  try {
    setLoading(true);
    setError(null);

    const res = await recommandationAPI.getForUser(user_id);

    console.log("📦 API RECOMMENDATIONS RESPONSE:", res);

    if (res.success && Array.isArray(res.sections)) {
      console.log(
        "✅ SET SECTIONS:",
        res.sections.map(s => ({
          key: s.key,
          count: s.items.length
        }))
      );

      setSections(res.sections);
    } else {
      console.warn("⚠️ NO SECTIONS RECEIVED");
      setSections([]);
    }
  } catch (err) {
    console.error("❌ Reco error:", err);
    setError("Erreur chargement recommandations");
  } finally {
    setLoading(false);
  }
};


  // =====================================================
// TRACK VIEW OF RECOMMENDATION SECTIONS
// =====================================================
useEffect(() => {
  if (!user_id || !showRecommended || sections.length === 0) return;

  sections.forEach((section) => {
    eventTracker.viewCategory({
      user_id,
      content: {
        content_id: null,
        tags: [],
        category: section.key, // ex: ai_top, cold_discovery
      },
    });
  });
}, [showRecommended, sections]);

  // =====================================================
  // UTILS
  // =====================================================
  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m.toString().padStart(2, "0")}`;
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="min-h-screen bg-netflix-dark pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            {showRecommended ? "Pour vous ⭐" : "Films"}
          </h1>
          <p className="text-gray-400 mt-1">
            {showRecommended
              ? "Recommandations personnalisées"
              : "Explorez notre catalogue"}
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 mb-10 overflow-x-auto">
          <button
            onClick={() => {
              setShowRecommended(true);
              setSelectedCategory(null);
            }}
            className={`px-4 py-2 rounded ${
              showRecommended
                ? "bg-netflix-red text-white"
                : "border border-gray-600 text-gray-300"
            }`}
          >
            Pour vous ⭐
          </button>

          <button
            onClick={() => {
              setShowRecommended(false);
              setSelectedCategory(null);
            }}
            className={`px-4 py-2 rounded ${
              !showRecommended && !selectedCategory
                ? "bg-netflix-red text-white"
                : "border border-gray-600 text-gray-300"
            }`}
          >
            Tous les genres
          </button>

          {!showRecommended &&
            categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setShowRecommended(false);
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded ${
                  selectedCategory === cat
                    ? "bg-netflix-red text-white"
                    : "border border-gray-600 text-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-t-2 border-netflix-red rounded-full" />
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="text-red-400 py-10 text-center">{error}</div>
        )}

        {/* RECOMMENDATION SECTIONS */}
        {!loading && showRecommended &&
  sections.map((section) => (
    <div key={section.key} className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-1">
        {section.title}
      </h2>

      {section.subtitle && (
        <p className="text-gray-400 mb-4">{section.subtitle}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {section.items.map((movie) => (
          <MovieCard
            key={movie.content_id}
            id={movie.content_id}
            title={movie.title}
            image={movie.metadata?.poster_url}
            rating={movie.metadata?.vote_average}
            duration={formatDuration(movie.duration)}
            year={new Date().getFullYear()}
            genre={movie.category}
          />
        ))}
      </div>
    </div>
  ))}


        {/* STANDARD MOVIES */}
        {!loading && !showRecommended && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard
                key={movie.content_id}
                id={movie.content_id}
                title={movie.title}
                image={movie.metadata?.poster_url}
                rating={movie.metadata?.vote_average}
                duration={formatDuration(movie.duration)}
                year={new Date().getFullYear()}
                genre={movie.category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
