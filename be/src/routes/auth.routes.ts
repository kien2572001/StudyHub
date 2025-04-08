import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    changePasswordSchema
} from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

// Protected routes
router.post('/logout', authMiddleware.authenticate, authController.logout);
router.get('/me', authMiddleware.authenticate, authController.getCurrentUser);
router.put('/change-password',
    authMiddleware.authenticate,
    validate(changePasswordSchema),
    authController.changePassword
);

export default router;
