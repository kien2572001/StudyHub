import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { JwtUtils } from '../utils/jwt.utils';
import { AppError } from '../utils/errors';
import { TokenService } from './token.service';

export class AuthService {
    private prisma = new PrismaClient();
    private jwtUtils = new JwtUtils();
    private tokenService = new TokenService();

    // Register new user
    public async register(userData: any) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new AppError('User with this email already exists', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });

        return user;
    }

    // User login
    public async login(email: string, password: string) {
        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Invalid credentials', 401);
        }

        // Generate tokens
        const accessToken = this.jwtUtils.generateAccessToken(user.id, user.role);
        const refreshToken = this.jwtUtils.generateRefreshToken(user.id);

        // Save refresh token to database
        await this.tokenService.saveRefreshToken(user.id, refreshToken);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken
        };
    }

    // Refresh access token
    public async refreshToken(refreshToken: string) {
        // Verify refresh token
        const payload = this.jwtUtils.verifyRefreshToken(refreshToken);
        if (!payload) {
            throw new AppError('Invalid refresh token', 401);
        }

        // Check if token exists in database
        const tokenExists = await this.tokenService.findRefreshToken(refreshToken);
        if (!tokenExists) {
            throw new AppError('Invalid refresh token', 401);
        }

        // Get user
        const user = await this.prisma.user.findUnique({
            where: { id: payload.userId }
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Generate new access token
        const accessToken = this.jwtUtils.generateAccessToken(user.id, user.role);

        return { accessToken };
    }

    // Logout user
    public async logout(refreshToken: string) {
        await this.tokenService.deleteRefreshToken(refreshToken);
    }

    // Get user by ID
    public async getUserById(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    }

    // Change password
    public async changePassword(userId: string, currentPassword: string, newPassword: string) {
        // Get user
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new AppError('Current password is incorrect', 400);
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
    }
}
