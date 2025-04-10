import Redis from 'ioredis';
import redisConfig from '../configs/redis.config';

/**
 * Redis service - Quản lý tất cả tương tác với Redis
 */
class RedisService {
    client: any;

    constructor() {
        this.connect();
        this.setupEventHandlers();
    }

    /**
     * Khởi tạo kết nối Redis
     */
    connect() {
        this.client = new Redis({
            host: redisConfig.HOST,
            port: redisConfig.PORT,
            password: redisConfig.PASSWORD,
            db: redisConfig.DB,
            tls: redisConfig.USE_TLS ? {} : undefined,
            connectTimeout: redisConfig.CONNECTION_TIMEOUT,
            maxRetriesPerRequest: redisConfig.MAX_RETRIES_PER_REQUEST,
            retryStrategy(times) {
                return Math.min(times * 50, 2000);
            },
            enableReadyCheck: true,
            enableOfflineQueue: true,
        });

        // Graceful shutdown
        process.on('SIGINT', () => {
            this.client.quit().then(() => {
                console.log('Redis client disconnected through app termination');
                process.exit(0);
            });
        });

        return this.client;
    }

    /**
     * Thiết lập các sự kiện cho Redis client
     */
    setupEventHandlers() {
        this.client.on('connect', () => {
            console.log('🔌 Redis client connected');
        });

        this.client.on('ready', () => {
            console.log('✅ Redis client ready');
        });

        this.client.on('error', (err: any) => {
            console.error('❌ Redis client error:', err);
        });

        this.client.on('close', () => {
            console.log('🔒 Redis client connection closed');
        });

        this.client.on('reconnecting', () => {
            console.log('🔄 Redis client reconnecting...');
        });
    }

    /**
     * Lấy client Redis
     */
    getClient() {
        return this.client;
    }

    /**
     * Lưu giá trị
     * @param {string} key - Key
     * @param {string} value - Giá trị
     * @param {number} ttl - Thời gian hết hạn (giây)
     */
    async set(key: any, value: string, ttl = redisConfig.DEFAULT_CACHE_TTL) {
        try {
            if (ttl) {
                return await this.client.set(key, value, 'EX', ttl);
            }
            return await this.client.set(key, value);
        } catch (error) {
            console.error(`Redis error - set ${key}:`, error);
            throw error;
        }
    }

    /**
     * Lấy giá trị
     * @param {string} key - Key
     */
    async get(key: any) {
        try {
            return await this.client.get(key);
        } catch (error) {
            console.error(`Redis error - get ${key}:`, error);
            throw error;
        }
    }

    /**
     * Xóa key
     * @param {string} key - Key
     */
    async delete(key: any) {
        try {
            return await this.client.del(key);
        } catch (error) {
            console.error(`Redis error - delete ${key}:`, error);
            throw error;
        }
    }

    /**
     * Cập nhật thời gian hết hạn
     * @param {string} key - Key
     * @param {number} ttl - Thời gian hết hạn mới (giây)
     */
    async expire(key: any, ttl: any) {
        try {
            return await this.client.expire(key, ttl);
        } catch (error) {
            console.error(`Redis error - expire ${key}:`, error);
            throw error;
        }
    }

    /**
     * Lưu dữ liệu JSON
     * @param {string} key - Key
     * @param {object} value - Object cần lưu
     * @param {number} ttl - Thời gian hết hạn (giây)
     */
    async setJson(key: any, value: any, ttl = redisConfig.DEFAULT_CACHE_TTL) {
        try {
            const stringValue = JSON.stringify(value);
            return await this.set(key, stringValue, ttl);
        } catch (error) {
            console.error(`Redis error - setJson ${key}:`, error);
            throw error;
        }
    }

    /**
     * Lấy dữ liệu JSON
     * @param {string} key - Key
     */
    async getJson(key: any) {
        try {
            const data = await this.get(key);
            if (!data) return null;

            try {
                return JSON.parse(data);
            } catch (err) {
                console.error(`Failed to parse JSON from Redis key ${key}:`, err);
                return data; // Trả về dạng string nếu parse fail
            }
        } catch (error) {
            console.error(`Redis error - getJson ${key}:`, error);
            throw error;
        }
    }

    /**
     * Xóa các keys theo pattern
     * @param {string} pattern - Pattern (ví dụ: "cache:*")
     */
    async deleteByPattern(pattern: any) {
        try {
            let cursor = '0';
            do {
                const [nextCursor, keys] = await this.client.scan(
                    cursor, 'MATCH', pattern, 'COUNT', 100
                );
                cursor = nextCursor;

                if (keys.length > 0) {
                    await this.client.del(...keys);
                }
            } while (cursor !== '0');

            return true;
        } catch (error) {
            console.error(`Redis error - deleteByPattern ${pattern}:`, error);
            throw error;
        }
    }
}

// Tạo và export một instance duy nhất (Singleton)
const redisService = new RedisService();
export default redisService;
