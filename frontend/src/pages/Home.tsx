import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentAPI } from '../services/api';
import type { Content } from '../types';

/* ── Static data (genres) ───────────────────────────── */
const CATEGORIES = [
  { label: "Action",         color: "#E11D48", img: "https://images.unsplash.com/photo-1508002366005-75a695ee2d17?w=300&h=170&fit=crop" },
  { label: "Science-Fiction",color: "#6366F1", img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&h=170&fit=crop" },
  { label: "Thriller",       color: "#F59E0B", img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=170&fit=crop" },
  { label: "Drame",          color: "#10B981", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=170&fit=crop" },
  { label: "Horreur",        color: "#8B5CF6", img: "https://images.unsplash.com/photo-1610144591825-d5e31490f7c6?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { label: "Comédie",        color: "#EC4899", img: "https://images.unsplash.com/photo-1569701813229-33284b643e3c?w=300&h=170&fit=crop" },
];

/* ── Skeleton cell ──────────────────────────────────── */
function SkeletonCell({ aspect = "aspect-video" }: { aspect?: string }) {
  return (
    <div className={`${aspect} rounded-lg bg-[#1A2634] animate-pulse`} />
  );
}

/* ── Page ───────────────────────────────────────────── */
export default function Home() {
  const [movies, setMovies] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentAPI.getMovies(16).then(res => {
      if (res.success) setMovies(res.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const heroMovies    = movies.slice(0, 12);
  const featuredMovies = movies.slice(12, 16);

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >

      {/* ════════════════════════════════════════════════
          SECTION 1 — HERO
          Left: mosaic grid (API) | Right: headline + CTAs
      ════════════════════════════════════════════════ */}
      <section className="flex flex-col lg:flex-row min-h-[92vh] items-center">

        {/* Mosaic grid (left, 58%) */}
        <div className="w-full lg:w-[58%] p-4 md:p-6 lg:p-8 order-2 lg:order-1">
          <div className="grid grid-cols-3 gap-2">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => <SkeletonCell key={i} />)
              : heroMovies.map(movie => (
                  <Link
                    key={movie.content_id}
                    to={`/movie/${movie.content_id}`}
                    className="group relative overflow-hidden rounded-lg bg-[#1A2634] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
                  >
                    <div className="aspect-video">
                      <img
                        src={movie.metadata?.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                        <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))
            }
          </div>
        </div>

        {/* Text + CTAs (right, 42%) */}
        <div className="w-full lg:w-[42%] px-6 md:px-10 lg:px-12 py-16 lg:py-0 order-1 lg:order-2 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight mb-5">
            Regardez des films<br />et des séries
          </h1>
          <p className="text-[#8197A4] text-sm md:text-base leading-relaxed mb-8 max-w-md">
            Découvrez des milliers de films et séries recommandés par notre intelligence artificielle,
            adaptés à vos goûts en temps réel grâce à notre pipeline Big Data.
          </p>

          <div className="flex flex-col gap-3 max-w-xs">
            <Link
              to="/movies"
              className="w-full text-center bg-white text-[#0F171E] px-6 py-3 text-sm font-bold hover:bg-white/90 transition-colors duration-200 rounded cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Explorer les Films
            </Link>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-white/15" />
              <span className="text-[#8197A4] text-xs">ou</span>
              <div className="flex-1 h-px bg-white/15" />
            </div>

            <Link
              to="/series"
              className="w-full text-center bg-transparent text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors duration-200 rounded cursor-pointer border border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Explorer les Séries
            </Link>
          </div>

          <p className="text-[#8197A4] text-xs mt-6 max-w-xs leading-relaxed">
            Plus de 15 000 films et 8 000 séries. Recommandations personnalisées à chaque connexion.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 2 — CATEGORIES
          Left: headline + desc | Right: 3×2 genre grid
      ════════════════════════════════════════════════ */}
      <section className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 px-6 md:px-10 lg:px-0 py-20 border-t border-white/8">

        <div className="w-full lg:w-[40%] lg:pl-12 lg:pr-10 flex-shrink-0">
          <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold leading-tight mb-5">
            Vos genres préférés<br />réunis au même endroit
          </h2>
          <p className="text-[#8197A4] text-sm md:text-base leading-relaxed mb-7 max-w-sm">
            Notre IA identifie vos genres favoris à partir de vos comportements de navigation
            et vous présente du contenu ciblé, à chaque visite.
          </p>
          <Link
            to="/movies"
            className="inline-flex items-center gap-2 text-white text-sm font-semibold hover:text-[#E11D48] transition-colors duration-200 cursor-pointer group"
          >
            Voir tout le catalogue
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="w-full lg:w-[60%] lg:pr-12">
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.label}
                to="/movies"
                className="group relative overflow-hidden rounded-lg aspect-video cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 brightness-50 group-hover:brightness-75"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-3">
                  <div className="w-1 h-4 rounded-full mb-1.5" style={{ backgroundColor: cat.color }} aria-hidden="true" />
                  <span className="text-white text-xs font-bold">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 3 — FEATURED CONTENT (API)
          Left: text + CTA | Right: 2×2 thumbnails
      ════════════════════════════════════════════════ */}
      <section className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 px-6 md:px-10 lg:px-0 py-20 border-t border-white/8">

        <div className="w-full lg:w-[40%] lg:pl-12 lg:pr-10 flex-shrink-0">
          <span className="text-[#E11D48] text-xs font-semibold tracking-widest uppercase mb-3 block">
            Sélection du moment
          </span>
          <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold leading-tight mb-5">
            Les titres les plus<br />regardés cette semaine
          </h2>
          <p className="text-[#8197A4] text-sm md:text-base leading-relaxed mb-7 max-w-sm">
            Retrouvez les films et séries en tête des tendances,
            mis à jour en continu grâce à notre analyse Big Data.
          </p>
          <Link
            to="/movies"
            className="inline-flex items-center gap-2.5 bg-transparent text-white border border-white/30 px-5 py-2.5 text-sm font-semibold hover:bg-white/10 transition-colors duration-200 rounded cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Voir les tendances
          </Link>
        </div>

        <div className="w-full lg:w-[60%] lg:pr-12">
          <div className="grid grid-cols-2 gap-3">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCell key={i} aspect="aspect-video" />)
              : featuredMovies.map((movie, i) => {
                  const badges = ["Nouveau", "4K", "Exclusif", undefined];
                  const badge = badges[i];
                  return (
                    <Link
                      key={movie.content_id}
                      to={`/movie/${movie.content_id}`}
                      className="group relative overflow-hidden rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
                    >
                      <div className="aspect-video">
                        <img
                          src={movie.metadata?.poster_url}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      {badge && (
                        <div className="absolute top-2.5 left-2.5 bg-[#E11D48] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {badge}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                        <span className="text-white text-xs font-semibold line-clamp-1">{movie.title}</span>
                        <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-2">
                          <svg className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  );
                })
            }
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SECTION 4 — FEATURES
      ════════════════════════════════════════════════ */}
      <section className="border-t border-white/8 px-6 md:px-12 lg:px-16 py-20">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-10 text-center">
          {[
            {
              icon: (
                <>
                  <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.5 8.5L15 12l-5.5 3.5v-7z" />
                </>
              ),
              title: "Regardez où vous voulez",
              desc:  "Accédez à votre catalogue depuis n'importe quel appareil connecté.",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              ),
              title: "IA en temps réel",
              desc:  "Nos recommandations s'affinent automatiquement à chaque connexion via notre pipeline Spark.",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              ),
              title: "Économie de données",
              desc:  "Streaming optimisé et recommandations légères pour une expérience fluide.",
            },
          ].map(f => (
            <div key={f.title}>
              <div className="w-14 h-14 rounded-full bg-[#1A2634] flex items-center justify-center mx-auto mb-5">
                <svg className="w-6 h-6 text-[#00A8E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-white font-bold text-sm mb-2">{f.title}</h3>
              <p className="text-[#8197A4] text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-white/8 px-6 py-8 text-center">
        <p className="text-[#8197A4] text-xs">
          © 2025 ReCommend — Plateforme de recommandation Big Data
          {' · '}
          <Link to="/movies" className="hover:text-white transition-colors duration-200 cursor-pointer">Films</Link>
          {' · '}
          <Link to="/series" className="hover:text-white transition-colors duration-200 cursor-pointer">Séries</Link>
        </p>
      </div>

    </div>
  );
}
