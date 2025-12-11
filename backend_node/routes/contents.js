import express from 'express';
import {
  getAllContents,
  getContentById,
  getCategories
} from '../controllers/contentController.js';

const router = express.Router();


//==== CONTENUS ====//
router.get('/', getAllContents);
router.get('/categories', getCategories);
router.get('/:id', getContentById);


export default router;
