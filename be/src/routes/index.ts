import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import { ApiRoutes } from '../constants';

const router = Router();

// API prefix
const API_PREFIX = ApiRoutes.API_PREFIX;

// Mount routes
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/users`, userRoutes);

export default router;
