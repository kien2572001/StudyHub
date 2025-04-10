import configs from "../configs";
import {v4 as uuidv4} from "uuid";
import redisService from "./redis.service";
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: configs.awsConfig.S3.ACCESS_KEY_ID,
    secretAccessKey: configs.awsConfig.S3.SECRET_ACCESS_KEY,
    region: configs.awsConfig.S3.REGION,
});
const s3Client = new AWS.S3();

class FileService {
    async createPresignedUrl(fileName: string, fileType: string, folder = 'media'): Promise<string> {
        const fileKey = `${folder}/${uuidv4()}-${fileName}`;
        const params = {
            Bucket: configs.awsConfig.S3.BUCKET_NAME,
            Key: fileKey,
            Expires: configs.awsConfig.S3.UPLOAD_URL_EXPIRATION_TIME,
            ContentType: fileType,
        };

        return await s3Client.getSignedUrlPromise('putObject', params);
    }

    async createReadUrl(fileKey: string): Promise<string> {
        const cacheKey = `${configs.redis.KEY_PREFIX.READ_URL}${fileKey}`;
        const cachedUrl = await redisService.get(cacheKey);
        if (cachedUrl) {
            return cachedUrl;
        }

        const params = {
            Bucket: configs.awsConfig.S3.BUCKET_NAME,
            Key: fileKey,
            Expires: configs.awsConfig.S3.READ_URL_EXPIRATION_TIME,
        };

        const url = await s3Client.getSignedUrlPromise('getObject', params);
        // @ts-ignore
        await redisService.set(cacheKey, url, configs.awsConfig.S3.READ_URL_EXPIRATION_TIME);

        return url;
    }

    async deleteFile(fileKey: string): Promise<void> {
        const params = {
            Bucket: configs.awsConfig.S3.BUCKET_NAME,
            Key: fileKey,
        };

        // Xóa file khỏi Redis cache
        const cacheKey = `${configs.redis.KEY_PREFIX.READ_URL}${fileKey}`;
        await redisService.delete(cacheKey);
        await s3Client.deleteObject(params).promise();
    }
}

export default new FileService();