import { Request, Response, NextFunction } from 'express';
import { JwtUtils } from '../utils/jwt.utils';
import { AppError } from '../utils/errors';
import { asyncHandler } from '../utils/async.handler';

export class AuthMiddleware {
    private jwtUtils = new JwtUtils();

    // Authentication middleware
    public authenticate = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            // Get token from header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new AppError('Authentication required', 401);
            }

            const token = authHeader.split(' ')[1];

            // Verify token
            const decoded = this.jwtUtils.verifyAccessToken(token);
            if (!decoded) {
                throw new AppError('Invalid or expired token', 401);
            }

            // Attach user to request
            // @ts-ignore - req.user is set by authenticate middleware
            //fix late
            req.user = decoded;
            // console.log('decoded', decoded);
            next();
        }
    );

    // Role-based authorization middleware
    public authorize = (roles: string[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            // @ts-ignore - req.user is set by authenticate middleware
            if (!req.user || !roles.includes(req.user.role)) {
                throw new AppError('Access forbidden', 403);
            }
            next();
        };
    };
}
