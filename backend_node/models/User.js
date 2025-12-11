import pool from '../config/database.js';

class User {
  /**
   * Trouve un utilisateur par email
   * @param {string} email 
   * @returns {Promise<Object|null>}
   */
  static async findByEmail(email) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de l'utilisateur: ${error.message}`);
    }
  }

  /**
   * Trouve un utilisateur par ID
   * @param {number} userId 
   * @returns {Promise<Object|null>}
   */
  static async findById(userId) {
    try {
      const result = await pool.query(
        'SELECT user_id, name, email, age, gender, preferences, created_at FROM users WHERE user_id = $1',
        [userId]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de l'utilisateur: ${error.message}`);
    }
  }

  /**
   * Crée un nouvel utilisateur
   * @param {Object} userData 
   * @returns {Promise<Object>}
   */
  static async create(userData) {
    const { name, email, password, age, gender, preferences } = userData;
    
    try {
      const result = await pool.query(
        `INSERT INTO users (name, email, password, age, gender, preferences, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
         RETURNING user_id, name, email, age, gender, created_at`,
        [
          name || null,
          email,
          password,
          age || null,
          gender || null,
          JSON.stringify(preferences || {})
        ]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Cet email est déjà utilisé');
      }
      throw new Error(`Erreur lors de la création de l'utilisateur: ${error.message}`);
    }
  }
}

export default User;
