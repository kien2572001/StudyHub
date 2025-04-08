export const authConfig = {
    JWT_ACCESS_EXPIRATION: 15 * 60,      // 15 minutes
    JWT_REFRESH_EXPIRATION: 7 * 24 * 60 * 60, // 7 days
    PASSWORD_RESET_EXPIRATION: 1 * 60 * 60,   // 1 hour
} as const;

export default authConfig;
