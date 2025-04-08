import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export class JwtUtils {
    private accessTokenSecret: string = process.env.JWT_ACCESS_SECRET || 'access-secret';
    private refreshTokenSecret: string = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

    private accessTokenExpiry: string = process.env.JWT_ACCESS_EXPIRES || '15m';
    private refreshTokenExpiry: string = process.env.JWT_REFRESH_EXPIRES || '7d';

    // Generate access token
    public generateAccessToken(userId: string, role: string): string {
        // @ts-ignore
        return jwt.sign(
            { userId, role },
            this.accessTokenSecret,
            { expiresIn: this.accessTokenExpiry }
        );
    }

    // Generate refresh token
    public generateRefreshToken(userId: string): string {
        // @ts-ignore
        return jwt.sign(
            { userId },
            this.refreshTokenSecret,
            { expiresIn: this.refreshTokenExpiry }
        );
    }

    // Verify access token
    public verifyAccessToken(token: string): any {
        try {
            return jwt.verify(token, this.accessTokenSecret);
        } catch (error) {
            return null;
        }
    }

    // Verify refresh token
    public verifyRefreshToken(token: string): any {
        try {
            return jwt.verify(token, this.refreshTokenSecret);
        } catch (error) {
            return null;
        }
    }
}