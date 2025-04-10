import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import deckRoutes from "./deck.routes";
import fileRoutes from './file.routes';
import { ApiRoutes } from '../constants';

const router = Router();

// API prefix
const API_PREFIX = ApiRoutes.API_PREFIX;

// Mount routes
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/users`, userRoutes);
router.use(`${API_PREFIX}/decks`, deckRoutes);
router.use(`${API_PREFIX}/files`, fileRoutes);

export default router;
