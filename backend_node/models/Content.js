import pool from '../config/database.js';

/**
 * Modèle Content - Gestion des films/séries
 */
class Content {
  /**
   * Récupère tous les contenus avec filtres optionnels
   * @param {Object} filters - Filtres (type, category, limit)
   * @returns {Promise<Array>}
   */
  static async findAll(filters = {}) {
    const { type, category, limit = 50, offset = 0 } = filters;
    
    let query = `
      SELECT 
        c.*,
        t.trailer_url,
        t.thumbnail_url,
        json_agg(
          json_build_object(
            'platform', sl.platform,
            'quality', sl.quality,
            'url', sl.url,
            'is_premium', sl.is_premium
          )
        ) FILTER (WHERE sl.link_id IS NOT NULL) as streaming_links
      FROM contents c
      LEFT JOIN trailers t ON c.content_id = t.content_id
      LEFT JOIN streaming_links sl ON c.content_id = sl.content_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (type) {
      query += ` AND c.type = $${paramCount}`;
      params.push(type);
      paramCount++;
    }
    
    if (category) {
      query += ` AND c.category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }
    
    query += `
      GROUP BY c.content_id, t.trailer_id, t.trailer_url, t.thumbnail_url
      ORDER BY c.popularity_score DESC, c.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    
    params.push(limit, offset);
    
    try {
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des contenus: ${error.message}`);
    }
  }

  /**
   * Récupère un contenu par ID
   * @param {string} contentId 
   * @returns {Promise<Object|null>}
   */
  static async findById(contentId) {
    try {
      const query = `
        SELECT 
          c.*,
          t.trailer_url,
          t.thumbnail_url,
          json_agg(
            json_build_object(
              'platform', sl.platform,
              'quality', sl.quality,
              'url', sl.url,
              'is_premium', sl.is_premium
            )
          ) FILTER (WHERE sl.link_id IS NOT NULL) as streaming_links
        FROM contents c
        LEFT JOIN trailers t ON c.content_id = t.content_id
        LEFT JOIN streaming_links sl ON c.content_id = sl.content_id
        WHERE c.content_id = $1
        GROUP BY c.content_id, t.trailer_id, t.trailer_url, t.thumbnail_url
      `;
      
      const result = await pool.query(query, [contentId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du contenu: ${error.message}`);
    }
  }

  /**
   * Récupère les catégories distinctes
   * @param {string} type - Filtrer par type (movie/series)
   * @returns {Promise<Array<string>>}
   */
  static async findDistinctCategories(type = null) {
    try {
      let query = 'SELECT DISTINCT category FROM contents';
      const params = [];
      
      if (type) {
        query += ' WHERE type = $1';
        params.push(type);
      }
      
      query += ' ORDER BY category';
      
      const result = await pool.query(query, params);
      return result.rows.map(row => row.category);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des catégories: ${error.message}`);
    }
  }

}

export default Content;
