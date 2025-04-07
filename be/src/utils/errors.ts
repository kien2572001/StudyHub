// @ts-ignore
import { ErrorCode } from '../constants/error.constants';
import { HttpStatus } from '../constants';

/**
 * Custom Error class để chuẩn hóa lỗi trong ứng dụng
 */
export class AppError extends Error {
    statusCode: number;
    errorCode: string;
    details: any;
    isOperational: boolean;

    constructor(
        message: string,
        statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: string = ErrorCode.UNEXPECTED_ERROR,
        details: any = null
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        this.isOperational = true; // Lỗi đã được xử lý

        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Factory method để tạo lỗi NOT_FOUND
     */
    static notFound(message: string = 'Resource not found', details: any = null): AppError {
        return new AppError(
            message,
            HttpStatus.NOT_FOUND,
            ErrorCode.RESOURCE_NOT_FOUND,
            details
        );
    }

    /**
     * Factory method để tạo lỗi BAD_REQUEST
     */
    static badRequest(message: string = 'Bad request', details: any = null): AppError {
        return new AppError(
            message,
            HttpStatus.BAD_REQUEST,
            ErrorCode.INVALID_INPUT,
            details
        );
    }

    /**
     * Factory method để tạo lỗi UNAUTHORIZED
     */
    static unauthorized(message: string = 'Unauthorized', details: any = null): AppError {
        return new AppError(
            message,
            HttpStatus.UNAUTHORIZED,
            ErrorCode.NOT_AUTHENTICATED,
            details
        );
    }

    /**
     * Factory method để tạo lỗi FORBIDDEN
     */
    static forbidden(message: string = 'Forbidden', details: any = null): AppError {
        return new AppError(
            message,
            HttpStatus.FORBIDDEN,
            ErrorCode.INSUFFICIENT_PERMISSIONS,
            details
        );
    }

    /**
     * Factory method để tạo lỗi CONFLICT
     */
    static conflict(message: string = 'Resource conflict', details: any = null): AppError {
        return new AppError(
            message,
            HttpStatus.CONFLICT,
            ErrorCode.RESOURCE_CONFLICT,
            details
        );
    }

    /**
     * Factory method để tạo lỗi VALIDATION
     */
    static validation(message: string = 'Validation error', details: any = null): AppError {
        return new AppError(
            message,
            HttpStatus.UNPROCESSABLE_ENTITY,
            ErrorCode.VALIDATION_ERROR,
            details
        );
    }
}
