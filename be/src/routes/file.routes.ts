import express from 'express';
import { FileController } from '../controllers/file.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const fileController = new FileController();
const authMiddleware = new AuthMiddleware();

// File management routes
router.post('/upload-url', authMiddleware.authenticate, fileController.getUploadUrl);
router.get('/:fileKey', authMiddleware.authenticate, fileController.getFileUrl);
router.delete('/:fileKey', authMiddleware.authenticate, fileController.deleteFile);

export default router;
