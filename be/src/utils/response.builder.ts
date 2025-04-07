import { Response } from 'express';
import { HttpStatus } from '../constants';

/**
 * ResponseBuilder - Builder pattern để tạo API response
 */
export class ResponseBuilder<T> {
    private statusCode: number = HttpStatus.OK;
    private success: boolean = true;
    private message: string = 'Success';
    private data: T | null = null;
    private meta: Record<string, any> | null = null;
    private errors: any = null;

    /**
     * Set HTTP status code
     */
    withStatusCode(statusCode: number): ResponseBuilder<T> {
        this.statusCode = statusCode;
        return this;
    }

    /**
     * Set success status
     */
    withSuccess(success: boolean): ResponseBuilder<T> {
        this.success = success;
        return this;
    }

    /**
     * Set response message
     */
    withMessage(message: string): ResponseBuilder<T> {
        this.message = message;
        return this;
    }

    /**
     * Set response data
     */
    withData(data: T): ResponseBuilder<T> {
        this.data = data;
        return this;
    }

    /**
     * Set metadata (pagination, etc)
     */
    withMeta(meta: Record<string, any>): ResponseBuilder<T> {
        this.meta = meta;
        return this;
    }

    /**
     * Set error data
     */
    withErrors(errors: any): ResponseBuilder<T> {
        this.errors = errors;
        this.success = false;
        return this;
    }

    /**
     * Build OK (200) response
     */
    ok(res: Response): Response {
        return this.withStatusCode(HttpStatus.OK).send(res);
    }

    /**
     * Build Created (201) response
     */
    created(res: Response): Response {
        return this.withStatusCode(HttpStatus.CREATED).send(res);
    }

    /**
     * Build No Content (204) response
     */
    noContent(res: Response): Response {
        return res.status(HttpStatus.NO_CONTENT).end();
    }

    /**
     * Build Bad Request (400) response
     */
    badRequest(res: Response, errors?: any): Response {
        this.success = false;
        this.message = 'Bad Request';
        if (errors) this.errors = errors;
        return this.withStatusCode(HttpStatus.BAD_REQUEST).send(res);
    }

    /**
     * Build Unauthorized (401) response
     */
    unauthorized(res: Response): Response {
        this.success = false;
        this.message = 'Unauthorized';
        return this.withStatusCode(HttpStatus.UNAUTHORIZED).send(res);
    }

    /**
     * Build Not Found (404) response
     */
    notFound(res: Response, message?: string): Response {
        this.success = false;
        this.message = message || 'Resource not found';
        return this.withStatusCode(HttpStatus.NOT_FOUND).send(res);
    }

    /**
     * Send response
     */
    send(res: Response): Response {
        const responseBody: any = {
            success: this.success,
            message: this.message,
            timestamp: new Date().toISOString(),
        };

        if (this.data !== null) {
            responseBody.data = this.data;
        }

        if (this.meta !== null) {
            responseBody.meta = this.meta;
        }

        if (this.errors !== null) {
            responseBody.errors = this.errors;
        }

        return res.status(this.statusCode).json(responseBody);
    }
}

/**
 * Factory function to create ResponseBuilder
 */
export function createResponse<T = any>(): ResponseBuilder<T> {
    return new ResponseBuilder<T>();
}
