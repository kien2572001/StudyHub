const AWS = require('aws-sdk');
const fs = require('fs-extra');

class S3Service {
    constructor() {
        this.s3 = new AWS.S3();
    }

    async downloadFile(bucket, key, localPath) {
        const data = await this.s3.getObject({
            Bucket: bucket,
            Key: key
        }).promise();

        await fs.writeFile(localPath, data.Body);
        return localPath;
    }

    async uploadFile(bucket, key, localPath) {
        const fileContent = await fs.readFile(localPath);

        await this.s3.putObject({
            Bucket: bucket,
            Key: key,
            Body: fileContent,
            ContentType: key.endsWith('.epub') ? 'application/epub+zip' : 'application/octet-stream'
        }).promise();

        return key;
    }

    getSignedUrl(bucket, key, expiresIn = 604800) {
        return this.s3.getSignedUrl('getObject', {
            Bucket: bucket,
            Key: key,
            Expires: expiresIn
        });
    }
}

module.exports = new S3Service();
