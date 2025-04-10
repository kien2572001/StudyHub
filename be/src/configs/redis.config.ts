export const redisConfig = {
    // Kết nối
    HOST: process.env.REDIS_HOST || 'localhost',
    PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
    PASSWORD: process.env.REDIS_PASSWORD || '123456',
    DB: parseInt(process.env.REDIS_DB || '0', 10),
    USE_TLS: process.env.REDIS_TLS === 'true',

    // Thời gian timeout/retry
    CONNECTION_TIMEOUT: 10000,
    MAX_RETRIES_PER_REQUEST: 3,

    // TTL mặc định (giây)
    DEFAULT_CACHE_TTL: 3600, // 1 giờ
    SESSION_TTL: 86400,      // 1 ngày
    UPLOAD_URL_TTL: 900,     // 15 phút
    RATE_LIMIT_TTL: 60,      // 1 phút

    // Prefixes cho keys
    KEY_PREFIX: {
        SESSION: 'sess:',
        CACHE: 'cache:',
        UPLOAD_URL: 'upload_url:',
        READ_URL: 'read_url:',
        RATE_LIMIT: 'ratelimit:',
        USER: 'user:'
    }
} as const;

export default redisConfig;
