export const HttpStatus = {
    // 2xx Success
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,

    // 3xx Redirection
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    NOT_MODIFIED: 304,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,

    // 4xx Client Error
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    GONE: 410,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,

    // 5xx Server Error
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
} as const;

export const HttpMessage = {
    // 2xx Success
    [HttpStatus.OK]: 'Success',
    [HttpStatus.CREATED]: 'Created successfully',
    [HttpStatus.ACCEPTED]: 'Request accepted',
    [HttpStatus.NO_CONTENT]: 'No content',

    // 4xx Client Error
    [HttpStatus.BAD_REQUEST]: 'Bad request',
    [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
    [HttpStatus.FORBIDDEN]: 'Forbidden',
    [HttpStatus.NOT_FOUND]: 'Not found',
    [HttpStatus.CONFLICT]: 'Conflict',
    [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable entity',
    [HttpStatus.TOO_MANY_REQUESTS]: 'Too many requests',

    // 5xx Server Error
    [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal server error',
    [HttpStatus.SERVICE_UNAVAILABLE]: 'Service unavailable',
} as const;
