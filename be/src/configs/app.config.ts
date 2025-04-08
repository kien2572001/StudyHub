export const appConfig = {
    APP_NAME: process.env.APP_NAME || 'MyApp',
    APP_VERSION: process.env.APP_VERSION || '1.0.0',
    APP_PORT: parseInt(process.env.APP_PORT || '3000', 10),
    APP_HOST: process.env.APP_HOST || 'localhost',
    APP_URL: process.env.APP_URL || `http://${process.env.APP_HOST}:${process.env.APP_PORT}`,
    APP_ENV: process.env.APP_ENV || 'development',
    APP_SECRET: process.env.APP_SECRET || 'mysecretkey',
} as const;

export default appConfig;