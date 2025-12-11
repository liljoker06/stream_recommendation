export interface Movie {
  id: number;
  titre: string;
  date: string;
  popularite: number;
  note: number;
  synopsis: string;
  budget: number;
  revenu: number;
  duree: number;
  genres: string;
  langue_originale: string;
  site_officiel: string;
  image?: string;
}

export interface Content {
  content_id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  duration: number;
  metadata: {
    poster_url: string;
    backdrop_url: string;
    vote_average: number;
    budget: number;
    revenue: number;
    tmdb_id: number;
    homepage: string;
    raw_genres: string;
  };
}

export interface ContentDetail {
  content_id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  tags: string;
  duration: number;
  creator_id: string;
  upload_date: string;
  language: string;
  popularity_score: number;
  metadata: {
    poster_url: string;
    backdrop_url: string;
    vote_average: number;
    budget: number;
    revenue: number;
    tmdb_id: number;
    homepage: string;
    raw_genres: string;
  };
  trailer_url?: string;
  thumbnail_url?: string;
  streaming_links?: Array<{
    platform: string;
    quality: string;
    url: string;
    is_premium: boolean;
  }>;
}

export interface MovieCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  duration: string;
  year: number;
  genre: string;
}
