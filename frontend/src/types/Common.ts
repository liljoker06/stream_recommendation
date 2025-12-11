/**
 * Interface pour les genres de films/séries
 */
export interface Genre {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Type pour les réponses API génériques
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
