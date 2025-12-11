export const VALID_GENRES = [
    "Action",
    "Aventure",
    "Animation",
    "Comédie",
    "Crime",
    "Documentaire",
    "Drame",
    "Familial",
    "Fantastique",
    "Histoire",
    "Horreur",
    "Musique",
    "Mystère",
    "Romance",
    "Science-Fiction",
    "Téléfilm",
    "Thriller",
    "Guerre",
    "Western"
] as const;

export type ValidGenre = typeof VALID_GENRES[number];




// correction si mal encodés
const GENRE_CORRECTIONS: Record<string, ValidGenre> = {
    // Problèmes d'encodage UTF-8
    "Com├®die": "Comédie",
    "ComÃ©die": "Comédie",
    "Comedie": "Comédie",

    "Myst├¿re": "Mystère",
    "MystÃ¨re": "Mystère",
    "Mystere": "Mystère",

    "T├®l├®film": "Téléfilm",
    "TÃ©lÃ©film": "Téléfilm",
    "Telefilm": "Téléfilm",

    // Variantes anglaises
    "Comedy": "Comédie",
    "Drama": "Drame",
    "Family": "Familial",
    "Fantasy": "Fantastique",
    "Horror": "Horreur",
    "Music": "Musique",
    "Mystery": "Mystère",
    "War": "Guerre",
    "Adventure": "Aventure",
    "Documentary": "Documentaire",
    "History": "Histoire",
    "TV Movie": "Téléfilm",
    "Sci-Fi": "Science-Fiction",
    "SF": "Science-Fiction",
};

/**
 * Normalise un genre en corrigeant l'encodage et les variantes
 */
export function normalizeGenre(genre: string): ValidGenre | null {
    if (!genre || genre.trim() === "") {
        return null;
    }

    const trimmed = genre.trim();

    // Vérifier si le genre nécessite une correction
    if (trimmed in GENRE_CORRECTIONS) {
        return GENRE_CORRECTIONS[trimmed];
    }

    // Vérifier si le genre est déjà valide
    if (VALID_GENRES.includes(trimmed as ValidGenre)) {
        return trimmed as ValidGenre;
    }

    // Recherche insensible à la casse
    const lowerGenre = trimmed.toLowerCase();
    for (const validGenre of VALID_GENRES) {
        if (validGenre.toLowerCase() === lowerGenre) {
            return validGenre;
        }
    }

    return null;
}

/**
 * Extrait et normalise les genres depuis une chaîne (séparés par des virgules)
 */
export function extractGenres(genresString: string, maxGenres = 3): ValidGenre[] {
    if (!genresString) {
        return [];
    }

    const rawGenres = genresString.split(',').map(g => g.trim());
    const normalized: ValidGenre[] = [];

    for (const genre of rawGenres) {
        const normalizedGenre = normalizeGenre(genre);
        if (normalizedGenre && !normalized.includes(normalizedGenre)) {
            normalized.push(normalizedGenre);
            if (normalized.length >= maxGenres) {
                break;
            }
        }
    }

    return normalized;
}

/**
 * Filtre les catégories pour ne garder que les valides
 */
export function filterValidCategories(categories: string[]): ValidGenre[] {
    const valid: ValidGenre[] = [];

    for (const category of categories) {
        const normalized = normalizeGenre(category);
        if (normalized && !valid.includes(normalized)) {
            valid.push(normalized);
        }
    }

    return valid.sort();
}

/**
 * Vérifie si une catégorie est valide
 */
export function isValidGenre(genre: string): boolean {
    return normalizeGenre(genre) !== null;
}
