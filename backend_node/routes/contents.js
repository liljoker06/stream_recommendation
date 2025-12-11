import express from 'express';
import {
  getAllContents,
  getContentById,
  getCategories,
  autoFetchMissingTrailers
} from '../controllers/contentController.js';

const router = express.Router();


//==== CONTENUS ====//
router.get('/', getAllContents);
router.get('/categories', getCategories);
router.post('/auto-fetch-trailers', autoFetchMissingTrailers); //automatique trailer
router.get('/:id', getContentById);


export default router;
