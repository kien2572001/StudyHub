import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
// import { logger } from '../config/logger';
import { HttpStatus, HttpMessage } from '../constants';
import { ErrorCode } from '../constants';
import { AppError } from '../utils/errors';

/**
 * Middleware xử lý lỗi tập trung cho toàn bộ ứng dụng
 */
export function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // Mặc định
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = HttpMessage[HttpStatus.INTERNAL_SERVER_ERROR];
    let errorCode: string = ErrorCode.UNEXPECTED_ERROR;
    let errorDetails = null;

    // Log lỗi
    // logger.error(`[Error Handler] ${err.message}`, {
    //     stack: err.stack,
    //     path: req.path,
    //     method: req.method
    // });

    console.log(`[Error Handler] ${err.message}`)
    console.log(err.stack)


    // Xử lý AppError (custom error)
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.details;
        errorCode = err.errorCode;
        errorDetails = err.details;
    }
    // Xử lý các lỗi validation từ thư viện khác (ví dụ: Joi, express-validator)
    else if (err.name === 'ValidationError') {
        statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
        //message = 'Validation error';
        errorCode = ErrorCode.VALIDATION_ERROR;
        errorDetails = err.message;
    }

    // Gửi response lỗi
    const errorResponse: any = {
        success: false,
        message,
        code: errorCode,
        timestamp: new Date().toISOString()
    };

    // Thêm chi tiết lỗi trong môi trường development
    // if (config.isDevelopment) {
    //     errorResponse.stack = err.stack;
    //     if (errorDetails) {
    //         errorResponse.details = errorDetails;
    //     }
    // } else if (errorDetails && statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
    //     // Trong production chỉ hiển thị details cho các lỗi không phải server error
    //     errorResponse.details = errorDetails;
    // }

    return res.status(statusCode).json(errorResponse);
}
