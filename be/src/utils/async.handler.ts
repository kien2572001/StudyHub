import { Request, Response, NextFunction } from 'express';

/**
 * Middleware để bắt lỗi với async/await
 *
 * @param fn Hàm async cần thực thi
 * @returns Express middleware
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};