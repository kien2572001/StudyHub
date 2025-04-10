import paginationConfig from './pagination.config';
import uploadConfig from './upload.config';
import cacheConfig from './cache.config';
import rateLimitConfig from './rate-limit.config';
import authConfig from './auth.config';
import appConfig from './app.config';
import awsConfig from './aws.config';
import redisConfig from "./redis.config";

export const config = {
    app: appConfig,
    pagination: paginationConfig,
    upload: uploadConfig,
    cache: cacheConfig,
    rateLimit: rateLimitConfig,
    auth: authConfig,
    awsConfig: awsConfig,
    redis: redisConfig,
} as const;

export default config;
