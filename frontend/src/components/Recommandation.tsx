import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { recommandationAPI } from "../services/api";
import type { Content } from "../types";

interface RecommendationProps {
  userId: string;
  type?: "movie" | "series";
}

export default function Recommandation({
  userId,
  type = "movie",
}: RecommendationProps) {
  const navigate = useNavigate();

  const [items, setItems] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // =====================================================
  // FETCH RECOMMENDATIONS
  // =====================================================
  useEffect(() => {
    if (!userId) return;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        const res = await recommandationAPI.getForUser(userId);
        console.log("📦 RECO API RESPONSE:", res);

        if (!res?.success || !Array.isArray(res.sections)) {
          setItems([]);
          return;
        }

        // 🎯 priorité IA → fallback discovery
        const aiSection = res.sections.find(
          (s: any) => s.key === "ai_reco"
        );

        const discoverySection = res.sections.find(
          (s: any) => s.key === "discovery"
        );

        const selectedItems =
          aiSection?.items?.length > 0
            ? aiSection.items
            : discoverySection?.items || [];

        console.log(
          "🎬 RECO ITEMS:",
          selectedItems.map((i: Content) => i.content_id)
        );

        setItems(selectedItems);
      } catch (err) {
        console.error("❌ Recommendation fetch error:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  // =====================================================
  // DUPLICATION POUR SCROLL INFINI
  // =====================================================
  const duplicatedItems = [...items, ...items, ...items];

  // =====================================================
  // AUTO SCROLL
  // =====================================================
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isPaused || items.length === 0) return;

    let rafId: number;
    const speed = 0.5;
    const itemWidth = 208;
    const singleSetWidth = items.length * itemWidth;

    const scroll = () => {
      container.scrollLeft += speed;

      if (container.scrollLeft >= singleSetWidth) {
        container.scrollLeft = 0;
      }

      rafId = requestAnimationFrame(scroll);
    };

    rafId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused, items]);

  // =====================================================
  // NAVIGATION
  // =====================================================
  const handleClick = (id: string) => {
    navigate(`/${type}/${id}`);
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="bg-netflix-black py-12">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-1">
            Recommandé pour vous ⭐
          </h2>
          <p className="text-gray-400">
            Basé sur vos goûts et votre activité
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-400">
            Chargement des recommandations…
          </p>
        )}

        {/* EMPTY */}
        {!loading && items.length === 0 && (
          <p className="text-gray-500">
            Aucune recommandation disponible pour le moment
          </p>
        )}

        {/* SCROLL */}
        {!loading && items.length > 0 && (
          <div
            className="relative group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-hidden pb-4"
            >
              {duplicatedItems.map((movie, index) => (
                <div
                  key={`${movie.content_id}-${index}`}
                  className="flex-shrink-0 w-48 cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => handleClick(movie.content_id)}
                >
                  {/* POSTER */}
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3">
                    <img
                      src={movie.metadata?.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />

                    {/* RATING */}
                    {movie.metadata?.vote_average && (
                      <div className="absolute top-2 left-2 bg-netflix-red text-white text-xs font-bold px-2 py-1 rounded">
                        ⭐ {movie.metadata.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* TITLE */}
                  <h3 className="text-white font-semibold text-sm line-clamp-2">
                    {movie.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
