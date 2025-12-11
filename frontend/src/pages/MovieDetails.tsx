import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { contentAPI } from "../services/api";
import Recommandation from "../components/Recommandation";
import type { ContentDetail } from "../types";
import { extractGenres } from "../utils/genres";

import {
  eventTracker,
  startDurationTimer,
  stopDurationTimer,
} from "../services/eventTracker";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------
  // Chargement du film
  // ---------------------------------------
  useEffect(() => {
    if (!id) return;

    const loadMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await contentAPI.getById(id);

        if (response.success) {
          setMovie(response.data);
        } else {
          setError("Film non trouvé");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les détails du film");
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [id]);

  // ---------------------------------------
  // Tracking de la page + timer global
  // ---------------------------------------
  useEffect(() => {
    if (!movie) return;

    const userData = localStorage.getItem("user");
    const user_id = userData ? JSON.parse(userData).user_id : null;

    if (!user_id) {
      console.warn("Impossible de tracker : user_id manquant");
      return;
    }

    const payload = {
      user_id,
      content: {
        content_id: movie.content_id,
        tags: movie.tags ? movie.tags.split(",").map((t) => t.trim()) : [],
      },
    };

    // Événement : ouverture de la page du film
    eventTracker.viewFilmPage(payload);

    // Timer : durée passée sur la page
    startDurationTimer();

    return () => {
      stopDurationTimer({
        ...payload,
        source: "page",
      });
    };
  }, [movie]);

  // ---------------------------------------
  // Chargement / Erreurs
  // ---------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-netflix-black flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-4">{error || "Film non trouvé"}</div>
        <button
          onClick={() => navigate("/movies")}
          className="px-6 py-3 bg-netflix-red text-white rounded hover:bg-netflix-red-dark transition-colors"
        >
          Retour aux films
        </button>
      </div>
    );
  }

  // ---------------------------------------
  // Formatage durée
  // ---------------------------------------
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  // ---------------------------------------
  // RENDER UI
  // ---------------------------------------
  return (
    <div className="min-h-screen bg-netflix-black text-white">
      {/* Bouton retour */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-netflix-gray hover:text-white transition-colors"
        >
          ← Retour
        </button>
      </div>

      {/* Hero section */}
      <div
        className="relative h-[60vh] mb-8 bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.metadata.poster_url})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/80 to-netflix-black/30" />
        <div className="container mx-auto px-4 h-full flex items-end pb-12">
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>

            <div className="flex items-center gap-4 text-lg mb-4">
              <span className="text-netflix-red font-bold">
                ⭐ {movie.metadata.vote_average.toFixed(1)}/10
              </span>
              <span>{new Date(movie.upload_date).getFullYear()}</span>
              <span>{formatDuration(movie.duration)}</span>
              <span className="px-3 py-1 bg-netflix-red rounded text-sm">
                {movie.language.toUpperCase()}
              </span>
            </div>

            <div className="flex gap-2 mb-4">
              {extractGenres(movie.tags).map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-netflix-gray rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Synopsis */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-gray-200 leading-relaxed text-lg">{movie.description}</p>

            {/* Trailer */}
            {movie.trailer_url && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Bande-annonce</h2>

                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    onLoad={() => {
                      const userData = localStorage.getItem("user");
                      const user_id = userData ? JSON.parse(userData).user_id : null;

                      if (user_id)
                        eventTracker.openTrailer({
                          user_id,
                          content: {
                            content_id: movie.content_id,
                            tags: movie.tags
                              ? movie.tags.split(",").map((t) => t.trim())
                              : [],
                          },
                        });
                    }}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={movie.trailer_url}
                    title="Bande-annonce"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Plateformes de streaming */}
            {movie.streaming_links && movie.streaming_links.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Où regarder</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {movie.streaming_links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-netflix-dark rounded-lg border border-netflix-gray hover:border-netflix-red transition-colors"
                    >
                      <div>
                        <div className="font-semibold">{link.platform}</div>
                        <div className="text-sm text-gray-400">
                          Qualité: {link.quality}
                          {link.is_premium && " • Premium"}
                        </div>
                      </div>
                      <span className="text-netflix-red">→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="bg-netflix-dark p-6 rounded-lg border border-netflix-gray h-fit">
            <h2 className="text-xl font-bold mb-4">Informations</h2>
            <div className="space-y-3">
              {movie.popularity_score && (
                <div>
                  <span className="text-gray-400">Popularité:</span>
                  <span className="ml-2 font-semibold text-white">
                    {movie.popularity_score.toFixed(1)}
                  </span>
                </div>
              )}
              <div>
                <span className="text-gray-400">Catégorie:</span>
                <span className="ml-2 font-semibold text-white">{movie.category}</span>
              </div>
              <div>
                <span className="text-gray-400">Langue:</span>
                <span className="ml-2 font-semibold uppercase text-white">{movie.language}</span>
              </div>
              <div>
                <span className="text-gray-400">Date de sortie:</span>
                <span className="ml-2 font-semibold text-white">
                  {new Date(movie.upload_date).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Film */}
      <div className="container mx-auto px-4 pb-12">
        {movie.streaming_links && movie.streaming_links.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Voir le film</h2>

            <div
              className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl"
              style={{ paddingBottom: "56.25%" }}
            >
              {movie.streaming_links.map((link) => (
                <iframe
                  key={link.url}
                  onLoad={() => {
                    const userData = localStorage.getItem("user");
                    const user_id = userData ? JSON.parse(userData).user_id : null;

                    if (user_id)
                      eventTracker.playContent({
                        user_id,
                        content: {
                          content_id: movie.content_id,
                          tags: movie.tags ? movie.tags.split(",").map((t) => t.trim()) : [],
                        },
                      });
                  }}
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://uqload.bz/q108xqqe2okl.html" // ton URL test
                  title="Film"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Recommandation />
    </div>
  );
}
