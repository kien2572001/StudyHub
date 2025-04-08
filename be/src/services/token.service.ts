import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export class TokenService {
    private prisma = new PrismaClient();

    // Save refresh token to database
    public async saveRefreshToken(userId: string, token: string) {
        // Delete any existing refresh tokens for this user
        await this.prisma.refreshToken.deleteMany({
            where: { userId }
        });

        // Create new refresh token
        return this.prisma.refreshToken.create({
            data: {
                id: uuidv4(),
                token,
                userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });
    }

    // Find refresh token in database
    public async findRefreshToken(token: string) {
        return this.prisma.refreshToken.findFirst({
            where: {
                token,
                expiresAt: {
                    gt: new Date()
                }
            }
        });
    }

    // Delete refresh token from database
    public async deleteRefreshToken(token: string) {
        return this.prisma.refreshToken.deleteMany({
            where: { token }
        });
    }
}
