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
 */
export const getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const content = await Content.findById(id);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé'
      });
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