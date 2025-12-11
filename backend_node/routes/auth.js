import express from 'express';
import { signup, login, verify } from '../controllers/authController.js';

const router = express.Router();

//==== Authentification ====//
router.post('/signup', signup);
router.post('/login', login);
router.get('/verify', verify);


export default router;
