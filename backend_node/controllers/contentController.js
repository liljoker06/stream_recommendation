import Content from '../models/Content.js';

/**
 * Récupère tous les contenus avec filtres
 */
export const getAllContents = async (req, res) => {
  try {
    const { type, category, limit, offset } = req.query;
    
    const contents = await Content.findAll({
      type,
      category,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    });
    
    res.status(200).json({
      success: true,
      count: contents.length,
      data: contents
    });
  } catch (error) {
    console.error('Erreur getAllContents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des contenus',
      error: error.message
    });
  }
};

/**
 * Récupère un contenu par ID
 * Si auto_fetch_trailer=true et qu'il n'y a pas de trailer, recherche automatiquement sur YouTube
 */
export const getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { auto_fetch_trailer } = req.query;
    
    let content = await Content.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
    }

    // Si pas de trailer et auto_fetch_trailer activé, chercher sur YouTube
    if (auto_fetch_trailer === 'true' && !content.trailer_url) {
      
      try {
        const { createRequire } = await import('module');
        const require = createRequire(import.meta.url);
        const yts = require('youtube-search-without-api-key');
        const pool = (await import('../config/database.js')).default;
        
        const searchQuery = `${content.title} ${content.metadata?.year || ''} official trailer`;
        const results = await yts.search(searchQuery);

        if (results && results.length > 0) {
          const appropriateTrailer = results.find(video => {
            if (!video.duration) return false;
            const parts = video.duration.split(':').map(Number);
            let seconds = 0;
            if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
            else if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            else seconds = parts[0];
            return seconds >= 60 && seconds <= 240;
          });

          const selectedVideo = appropriateTrailer || results.find(v => {
            if (!v.duration) return false;
            const parts = v.duration.split(':').map(Number);
            const seconds = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0];
            return seconds <= 300;
          }) || results[0];

          const videoId = selectedVideo.url.split('v=')[1]?.split('&')[0] || selectedVideo.url.split('/').pop();
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          const thumbnailUrl = selectedVideo.thumbnail?.url || selectedVideo.thumbnail;

          // Vérifier si un trailer existe déjà
          const checkResult = await pool.query(
            'SELECT trailer_id, trailer_url FROM trailers WHERE content_id = $1',
            [id]
          );

          if (checkResult.rows.length === 0) {
            //sipas de ligne : insert
            await pool.query(
              `INSERT INTO trailers (content_id, trailer_url, thumbnail_url)
               VALUES ($1, $2, $3)`,
              [id, embedUrl, thumbnailUrl]
            );
            console.log(`✅ Trailer inséré: ${selectedVideo.title} (${selectedVideo.duration})`);
          } else if (!checkResult.rows[0].trailer_url || checkResult.rows[0].trailer_url.trim() === '') {
            // sinon si ligne existe mais trailer_url vide : update

            await pool.query(
              `UPDATE trailers SET trailer_url = $1, thumbnail_url = $2 WHERE content_id = $3`,
              [embedUrl, thumbnailUrl, id]
            );
            console.log(`Trailer mis à jour: ${selectedVideo.title} (${selectedVideo.duration})`);
          } else {
            console.log(`ℹTrailer déjà présent pour "${content.title}"`);
          }

          // Recharger le contenu avec le nouveau trailer
          content = await Content.findById(id);
        }
      } catch (ytError) {
        console.error(' Erreur recherche YouTube:', ytError.message);
        // si crash on continue sans trailer
      }
    }
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Erreur getContentById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du contenu',
      error: error.message
    });
  }
};

/**
 * Récupère les catégories distinctes
 */
export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    
    const categories = await Content.findDistinctCategories(type);
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Erreur getCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories',
      error: error.message
    });
  }
};

/**
 * Recherche et insère automatiquement les trailers manquants pour tous les contenus
 */
export const autoFetchMissingTrailers = async (req, res) => {
  try {
    const { type } = req.query; // 'movie' ou 'series'
    
    // Récupérer tous les contenus sans trailer
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const yts = require('youtube-search-without-api-key');
    const pool = (await import('../config/database.js')).default;

    let query = `
      SELECT c.content_id, c.title, c.metadata
      FROM contents c
      LEFT JOIN trailers t ON c.content_id = t.content_id
      WHERE t.trailer_url IS NULL OR t.trailer_url = ''
    `;
    
    const params = [];
    if (type) {
      query += ' AND c.type = $1';
      params.push(type);
    }
    
    query += ' LIMIT 20'; 
    
    const result = await pool.query(query, params);
    const contentsWithoutTrailer = result.rows;
    
    console.log(`🔍 ${contentsWithoutTrailer.length} contenus sans trailer trouvés`);
    
    const results = [];
    
    for (const content of contentsWithoutTrailer) {
      try {
        const searchQuery = `${content.title} ${content.metadata?.year || ''} official trailer`;
        const ytResults = await yts.search(searchQuery);
        
        if (ytResults && ytResults.length > 0) {
          const appropriateTrailer = ytResults.find(video => {
            if (!video.duration) return false;
            const parts = video.duration.split(':').map(Number);
            let seconds = 0;
            if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
            else if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            else seconds = parts[0];
            return seconds >= 60 && seconds <= 240;
          });

          const selectedVideo = appropriateTrailer || ytResults.find(v => {
            if (!v.duration) return false;
            const parts = v.duration.split(':').map(Number);
            const seconds = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0];
            return seconds <= 300;
          }) || ytResults[0];

          const videoId = selectedVideo.url.split('v=')[1]?.split('&')[0] || selectedVideo.url.split('/').pop();
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          const thumbnailUrl = selectedVideo.thumbnail?.url || selectedVideo.thumbnail;

          // Vérifier et insérer
          const checkResult = await pool.query(
            'SELECT trailer_id FROM trailers WHERE content_id = $1',
            [content.content_id]
          );

          if (checkResult.rows.length === 0) {
            await pool.query(
              'INSERT INTO trailers (content_id, trailer_url, thumbnail_url) VALUES ($1, $2, $3)',
              [content.content_id, embedUrl, thumbnailUrl]
            );
          } else {
            await pool.query(
              'UPDATE trailers SET trailer_url = $1, thumbnail_url = $2 WHERE content_id = $3',
              [embedUrl, thumbnailUrl, content.content_id]
            );
          }

          results.push({
            content_id: content.content_id,
            title: content.title,
            trailer_found: true,
            trailer_url: embedUrl
          });
          
          console.log(`${content.title}: trailer trouvé`);
        } else {
          results.push({
            content_id: content.content_id,
            title: content.title,
            trailer_found: false
          });
          console.log(` ${content.title}: aucun trailer trouvé`);
        }
        
        // Petit délai pour ne pas surcharger YouTube
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(` Erreur pour ${content.title}:`, error.message);
        results.push({
          content_id: content.content_id,
          title: content.title,
          error: error.message
        });
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Traitement terminé pour ${results.length} contenus`,
      data: results
    });
    
  } catch (error) {
    console.error('Erreur autoFetchMissingTrailers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche automatique des trailers',
      error: error.message
    });
  }
};