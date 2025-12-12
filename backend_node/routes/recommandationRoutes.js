import express from 'express';
import { getRecommandations } from '../controllers/recommandationController.js';

const router = express.Router();

// GET /api/recommendations/:userId
router.get('/:userId', getRecommandations);

export default router;
