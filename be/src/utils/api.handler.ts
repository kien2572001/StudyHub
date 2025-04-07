import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../constants';
// import { logger } from '../config/logger';

/**
 * Class ApiHandler - Cung cấp phương thức xử lý API request
 */
export class ApiHandler {
    /**
     * Hàm xử lý API chung (success)
     */
    static success<T>(
        res: Response,
        data: T,
        message: string = 'Success',
        statusCode: number = HttpStatus.OK
    ) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Hàm xử lý API error
     */
    static error(
        res: Response,
        message: string = 'Internal Server Error',
        statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
        errors: any = null
    ) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        if (errors) {
            Object.assign(response, { errors });
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Hàm tạo handler cho controller
     */
    static createHandler(handler: Function) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await handler(req, res, next);
            } catch (error) {
                // Log lỗi
                // logger.error(`[API Error] ${error.message}`, {
                //     stack: error.stack,
                //     path: req.path,
                //     method: req.method,
                //     params: req.params,
                //     query: req.query,
                //     body: req.body
                // });

                // Chuyển qua error middleware để xử lý
                next(error);
            }
        };
    }

    /**
     * Handler xử lý trường hợp không tìm thấy (404)
     */
    static notFound(res: Response, message: string = 'Resource not found') {
        return ApiHandler.error(res, message, HttpStatus.NOT_FOUND);
    }

    /**
     * Handler xử lý tạo thành công (201)
     */
    static created<T>(res: Response, data: T, message: string = 'Resource created successfully') {
        return ApiHandler.success(res, data, message, HttpStatus.CREATED);
    }

    /**
     * Handler xử lý trường hợp không có nội dung (204)
     */
    static noContent(res: Response) {
        return res.status(HttpStatus.NO_CONTENT).end();
    }

    /**
     * Handler xử lý dữ liệu không hợp lệ (400)
     */
    static badRequest(res: Response, message: string = 'Bad request', errors?: any) {
        return ApiHandler.error(res, message, HttpStatus.BAD_REQUEST, errors);
    }

    /**
     * Handler xử lý trường hợp không có quyền (401)
     */
    static unauthorized(res: Response, message: string = 'Unauthorized') {
        return ApiHandler.error(res, message, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handler xử lý trường hợp cấm truy cập (403)
     */
    static forbidden(res: Response, message: string = 'Forbidden') {
        return ApiHandler.error(res, message, HttpStatus.FORBIDDEN);
    }
}
