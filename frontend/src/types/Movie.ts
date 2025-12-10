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
