const https = require('https');
const http = require('http');
const url = require('url');

// EC2 API endpoint - cập nhật URL thực tế của EC2 instance của bạn
const API_ENDPOINT = process.env.EC2_API_ENDPOINT || 'http://your-ec2-ip:3000/api/process';

exports.handler = async (event) => {
    console.log('Nhận S3 event:', JSON.stringify(event, null, 2));

    try {
        // Lấy thông tin từ S3 event
        const bucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

        // Kiểm tra điều kiện - chỉ xử lý file trong thư mục original
        if (!key.startsWith(process.env.S3_ORIGINAL_PREFIX || 'original/')) {
            console.log('Bỏ qua file không nằm trong thư mục original:', key);
            return { statusCode: 200, body: 'Ignored' };
        }

        // Kiểm tra định dạng file
        if (!key.match(/\.(mobi|azw|azw3)$/i)) {
            console.log('Bỏ qua file không hỗ trợ:', key);
            return { statusCode: 200, body: 'Ignored' };
        }

        // Tạo ID duy nhất cho job
        const jobId = event.Records[0].responseElements?.['x-amz-request-id'] ||
            `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Gửi request đến EC2
        const payload = JSON.stringify({
            bucket,
            key,
            job_id: jobId
        });

        console.log('Đang gửi yêu cầu tới EC2:', API_ENDPOINT);
        const response = await makeRequest(API_ENDPOINT, payload);
        console.log('Response từ EC2:', response);

        return {
            statusCode: 200,
            body: 'Success',
            jobId,
            bucket,
            key
        };
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, body: error.toString() };
    }
};

// Hàm gửi HTTP request
function makeRequest(endpoint, data) {
    return new Promise((resolve, reject) => {
        const parsedUrl = url.parse(endpoint);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
            path: parsedUrl.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        const req = protocol.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                resolve(responseBody);
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(data);
        req.end();
    });
}
