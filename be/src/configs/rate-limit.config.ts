export const rateLimitConfig = {
    LOGIN: {
        WINDOW_MS: 15 * 60 * 1000,    // 15 minutes
        MAX_REQUESTS: 5,              // 5 requests per window
    },
    API: {
        WINDOW_MS: 60 * 1000,         // 1 minute
        MAX_REQUESTS: 60,             // 60 requests per minute
    },
} as const;

export default rateLimitConfig;
