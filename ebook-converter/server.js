const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');
const apiRoutes = require('./routes/api');
const queueService = require('./services/queue');
const s3Service = require('./services/s3');
const converterService = require('./services/converter');
const db = require('./config/db');

// Khởi tạo Express
const app = express();
const PORT = process.env.PORT || 3000;

// Tạo thư mục tạm
fs.ensureDirSync(path.join(__dirname, 'temp/downloads'));
fs.ensureDirSync(path.join(__dirname, 'temp/converted'));

// Middleware
app.use(bodyParser.json());
app.use('/api', apiRoutes);

// Worker function xử lý job
async function processNextJob() {
    try {
        const job = await queueService.getNextJob();

        if (!job) {
            setTimeout(processNextJob, 5000);
            return;
        }

        console.log(`[${job.id}] Bắt đầu xử lý job: ${job.s3_key}`);

        // Cập nhật trạng thái
        await queueService.updateJob(job.id, { status: 'processing' });

        // Đường dẫn cho file
        const fileName = path.basename(job.s3_key);
        const inputPath = path.join(__dirname, 'temp/downloads', fileName);
        const outputName = `${path.parse(fileName).name}.epub`;
        const outputPath = path.join(__dirname, 'temp/converted', outputName);

        try {
            // Tải file từ S3
            await s3Service.downloadFile(job.s3_bucket, job.s3_key, inputPath);

            // Chuyển đổi file
            await converterService.convertToEpub(inputPath, outputPath);

            // Upload file đã chuyển đổi lên S3
            const outputKey = `books/converted/${outputName}`;
            await s3Service.uploadFile(job.s3_bucket, outputKey, outputPath);

            // Tạo URL tải xuống
            const signedUrl = s3Service.getSignedUrl(job.s3_bucket, outputKey);

            // Cập nhật trạng thái
            await queueService.updateJob(job.id, {
                status: 'completed',
                output_key: outputKey,
                download_url: signedUrl
            });

            console.log(`[${job.id}] Đã hoàn thành job: ${job.s3_key}`);
        } catch (error) {
            console.error(`[${job.id}] Lỗi:`, error);

            // Cập nhật trạng thái lỗi
            await queueService.updateJob(job.id, {
                status: 'failed',
                error: error.message
            });
        } finally {
            // Dọn dẹp
            try {
                await fs.remove(inputPath);
                await fs.remove(outputPath);
            } catch (e) {
                console.error(`[${job.id}] Lỗi khi dọn dẹp:`, e);
            }
        }
    } catch (error) {
        console.error('Lỗi khi xử lý queue:', error);
    }

    // Gọi đệ quy để xử lý job tiếp theo
    setTimeout(processNextJob, 1000);
}

// Khởi động server và worker
async function startServer() {
    try {
        await db.getConnection();
        app.listen(PORT, () => {
            console.log(`Server đang chạy tại http://localhost:${PORT}`);
            processNextJob();
        });
    } catch (err) {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    }
}

// Khởi động server
startServer();