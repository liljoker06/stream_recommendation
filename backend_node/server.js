import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/contents.js';
import pool from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

//== Middlewares ==
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//==Routes test
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend Node.js fonctionne',
    timestamp: new Date().toISOString()
  });
});

// Test de connexion à la base de données
app.get('/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

app.use('/api/auth', authRoutes); // route auth
app.use('/api/contents', contentRoutes); // route contenus

//==Erreur 404++
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route non trouvée' 
  });
});
