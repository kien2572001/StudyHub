import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/async.handler';
import { ApiHandler } from '../utils/api.handler';

export class AuthController {
    private authService = new AuthService();

    // Register new user
    public register = asyncHandler(async (req: Request, res: Response) => {
        const userData = req.body;
        const result = await this.authService.register(userData);

        return ApiHandler.success(res, result, 'User registered successfully', 201);
    });

    // User login
    public login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const result = await this.authService.login(email, password);

        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'strict'
        });

        return ApiHandler.success(res, {
            accessToken: result.accessToken,
            user: result.user
        }, 'Login successful');
    });

    // Refresh access token
    public refreshToken = asyncHandler(async (req: Request, res: Response) => {
        // Get refresh token from cookie or request body
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            return ApiHandler.error(res, 'Refresh token is required', 400);
        }

        const result = await this.authService.refreshToken(refreshToken);

        return ApiHandler.success(res, {
            accessToken: result.accessToken
        }, 'Token refreshed successfully');
    });

    // Logout user
    public logout = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await this.authService.logout(refreshToken);
            res.clearCookie('refreshToken');
        }

        return ApiHandler.success(res, null, 'Logged out successfully');
    });

    // Get current user
    public getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
        // @ts-ignore - req.user is set by auth middleware
        const userId = req.user.id;
        const user = await this.authService.getUserById(userId);

        return ApiHandler.success(res, user, 'User retrieved successfully');
    });

    // Change password
    public changePassword = asyncHandler(async (req: Request, res: Response) => {
        const { currentPassword, newPassword } = req.body;
        // @ts-ignore
        const userId = req.user.id;

        await this.authService.changePassword(userId, currentPassword, newPassword);

        return ApiHandler.success(res, null, 'Password changed successfully');
    });
}
