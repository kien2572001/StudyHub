export const AppConstants = {
    // Pagination defaults
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,

    // File upload limits
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],

    // Cache durations (in seconds)
    CACHE_DURATIONS: {
        SHORT: 60,           // 1 minute
        MEDIUM: 300,         // 5 minutes
        LONG: 3600,          // 1 hour
        VERY_LONG: 86400,    // 1 day
    },

    // Rate limiting
    RATE_LIMIT: {
        LOGIN_WINDOW_MS: 15 * 60 * 1000,    // 15 minutes
        LOGIN_MAX_REQUESTS: 5,              // 5 requests per window

        API_WINDOW_MS: 60 * 1000,           // 1 minute
        API_MAX_REQUESTS: 60,               // 60 requests per minute
    },

    // Token expiration times (in seconds)
    JWT_ACCESS_EXPIRATION: 15 * 60,      // 15 minutes
    JWT_REFRESH_EXPIRATION: 7 * 24 * 60 * 60, // 7 days
    PASSWORD_RESET_EXPIRATION: 1 * 60 * 60,   // 1 hour

    // User roles
    ROLES: {
        USER: 'USER',
    },
} as const;
