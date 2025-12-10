import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Movie } from "../types/Movie";
import Recommandation from "../components/Recommandation";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Remplacer par votre appel API
    // fetch(`/api/movies/${id}`)
    //   .then(res => res.json())
    //   .then(data => setMovie(data))
    //   .finally(() => setLoading(false));

    // Données mockées pour l'exemple
    setMovie({
      id: parseInt(id || "0"),
      titre: "Tron : Ares",
      date: "2025-10-08",
      popularite: 413.6393,
      note: 6.546,
      synopsis:
        "Julian, directeur de Dillinger System, a créé avec l'IA Arès un supersoldat humanoïde sans sensations, version vivante de son programme de sécurité...",
      budget: 220000000,
      revenu: 142073994,
      duree: 119,
      genres: "Science-Fiction, Aventure, Action",
      langue_originale: "en",
      site_officiel: "",
    });
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="text-white text-xl">Film non trouvé</div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

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
      <div className="relative h-[60vh] mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/50 to-transparent" />
        <div className="container mx-auto px-4 h-full flex items-end pb-12">
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">{movie.titre}</h1>
            <div className="flex items-center gap-4 text-lg mb-4">
              <span className="text-netflix-red font-bold">
                ⭐ {movie.note.toFixed(1)}/10
              </span>
              <span>{new Date(movie.date).getFullYear()}</span>
              <span>{formatDuration(movie.duree)}</span>
            </div>
            <div className="flex gap-2 mb-4">
              {movie.genres.split(",").map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-netflix-gray rounded-full text-sm"
                >
                  {genre.trim()}
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
            <p className="text-gray-200 leading-relaxed text-lg">
              {movie.synopsis}
            </p>
          </div>

          {/* Informations */}
          <div className="bg-netflix-dark p-6 rounded-lg border border-netflix-gray">
            <h2 className="text-xl font-bold mb-4">Informations</h2>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Popularité:</span>
                <span className="ml-2 font-semibold text-white">
                  {movie.popularite.toFixed(1)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Budget:</span>
                <span className="ml-2 font-semibold text-white">
                  {formatCurrency(movie.budget)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Revenu:</span>
                <span className="ml-2 font-semibold text-white">
                  {formatCurrency(movie.revenu)}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Langue originale:</span>
                <span className="ml-2 font-semibold uppercase text-white">
                  {movie.langue_originale}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Date de sortie:</span>
                <span className="ml-2 font-semibold text-white">
                  {new Date(movie.date).toLocaleDateString("fr-FR")}
                </span>
              </div>
              {movie.site_officiel && (
                <div>
                  <a
                    href={movie.site_officiel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-netflix-red hover:underline"
                  >
                    Site officiel →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer section */}
      <div className="container mx-auto px-4 pb-12">
        <h2 className="text-3xl font-bold mb-6">Bande-annonce</h2>
        <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* FILM section */}
      <div className="container mx-auto px-4 pb-12">
        <h2 className="text-3xl font-bold mb-6">Voir le film</h2>
        <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://uqload.bz/q108xqqe2okl.html"
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Section Recommandations */}
      <Recommandation currentMovieId={movie.id} type="movie" />
    </div>
  );
}
