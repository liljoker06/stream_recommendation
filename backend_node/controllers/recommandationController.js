import pool from "../config/database.js";
import axios from "axios";

const IA_BASE_URL = "http://backend_ia:9000";

const normalize = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/**
 * GET /api/recommandations/:userId
 */
export const getRecommandations = async (req, res) => {
  const { userId } = req.params;

  try {
    /* =========================
       1. Vérification utilisateur
    ========================= */
    const userCheck = await pool.query(
      "SELECT user_id FROM users WHERE user_id = $1",
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable",
      });
    }

    /* =========================
       2. Appel IA
    ========================= */
    let orderedGenres = [];

    try {
      const iaRes = await axios.get(
        `${IA_BASE_URL}/recommend/${userId}`,
        { timeout: 3000 }
      );

      orderedGenres = (iaRes.data?.recommendations || []).map(normalize);
    } catch {
      orderedGenres = [];
    }

    /* =========================
       3. Génération des poids
       ex: premier = 7, puis 6...
    ========================= */
    const genreWeights = {};
    let weight = 7;

    for (const genre of orderedGenres) {
      genreWeights[genre] = Math.max(weight, 1);
      weight--;
    }

    /* =========================
       4. Récupération contenus
       (PAS d'events, PAS de filtrage)
    ========================= */
    const contentsRes = await pool.query(`
      SELECT
        content_id,
        tmdb_id,
        title,
        description,
        type,
        category,
        tags,
        duration,
        language,
        popularity_score,
        metadata
      FROM contents
      LIMIT 500
    `);

    /* =========================
       5. Scoring
    ========================= */
    const scored = contentsRes.rows.map((content) => {
      let score = 0;

      const tags = (content.tags || "")
        .split(",")
        .map(normalize);

      const category = content.category
        ? normalize(content.category)
        : null;

      for (const tag of tags) {
        if (genreWeights[tag]) {
          score += genreWeights[tag];
        }
      }

      if (category && genreWeights[category]) {
        score += genreWeights[category];
      }

      return {
        ...content,
        score,
      };
    });

    /* =========================
       6. Sélection IA
    ========================= */
    const aiItems = scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    /* =========================
       7. Fallback popularité
    ========================= */
    const discoveryItems = scored
      .sort(
        (a, b) =>
          (parseFloat(b.popularity_score) || 0) -
          (parseFloat(a.popularity_score) || 0)
      )
      .slice(0, 20);

    /* =========================
       8. Réponse
    ========================= */
    return res.json({
      success: true,
      strategy: aiItems.length ? "ai_weighted_genres" : "popular_only",
      user_id: userId,
      sections: [
        {
          key: "ai_reco",
          title: "Recommandé pour vous",
          subtitle: "Basé sur vos genres préférés",
          source: "ai",
          items: aiItems,
        },
        {
          key: "discovery",
          title: "À découvrir",
          subtitle: "Films populaires",
          source: "fallback",
          items: discoveryItems,
        },
      ],
    });

  } catch (error) {
    console.error("Erreur recommandation:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur recommandation",
      error: error.message,
    });
  }
};
