export const cacheConfig = {
    DURATIONS: {
        SHORT: 60,           // 1 minute
        MEDIUM: 300,         // 5 minutes
        LONG: 3600,          // 1 hour
        VERY_LONG: 86400,    // 1 day
    },
} as const;

export default cacheConfig;
