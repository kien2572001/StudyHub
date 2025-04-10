export const awsConfig = {
    // AWS S3
    S3: {
        BUCKET_NAME: process.env.S3_BUCKET_NAME || 'your-bucket-name',
        REGION: process.env.S3_REGION || 'us-east-1',
        ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID || 'your-access-key-id',
        SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY || 'your-secret-access-key',
        UPLOAD_URL_EXPIRATION_TIME: parseInt(process.env.S3_UPLOAD_URL_EXPIRATION || '900', 10), // 15 minutes
        READ_URL_EXPIRATION_TIME: parseInt(process.env.S3_READ_URL_EXPIRATION || '3600', 10), // 1 hour
    },
}

export default awsConfig;