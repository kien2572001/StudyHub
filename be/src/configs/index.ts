import paginationConfig from './pagination.config';
import uploadConfig from './upload.config';
import cacheConfig from './cache.config';
import rateLimitConfig from './rate-limit.config';
import authConfig from './auth.config';
import appConfig from './app.config';

export const config = {
    app: appConfig,
    pagination: paginationConfig,
    upload: uploadConfig,
    cache: cacheConfig,
    rateLimit: rateLimitConfig,
    auth: authConfig,
} as const;

export default config;
