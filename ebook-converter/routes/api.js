const express = require('express');
const router = express.Router();
const queueService = require('../services/queue');
const path = require('path');
const db = require('../config/db');

// API nhận request chuyển đổi
router.post('/process', async (req, res) => {
    try {
        const { bucket, key, job_id = Date.now().toString() } = req.body;

        if (!bucket || !key) {
            return res.status(400).json({ success: false, error: 'Thiếu thông tin bucket hoặc key' });
        }

        // Kiểm tra định dạng file
        const fileExt = path.extname(key).toLowerCase();
        if (!['.mobi', '.azw', '.azw3'].includes(fileExt)) {
            return res.status(400).json({ success: false, error: 'Định dạng file không được hỗ trợ' });
        }

        // Thêm job vào queue
        await queueService.addJob({
            id: job_id,
            bucket,
            key
        });

        res.status(200).json({
            success: true,
            message: 'Đã thêm công việc vào hàng đợi',
            job_id
        });
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API kiểm tra trạng thái
router.get('/status/:jobId', async (req, res) => {
    try {
        const job = await queueService.getJob(req.params.jobId);

        if (!job) {
            return res.status(404).json({ success: false, error: 'Không tìm thấy công việc' });
        }

        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// API kiểm tra sức khỏe
router.get('/health', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM jobs WHERE status = "pending"');
        res.json({ status: 'OK', pending_jobs: rows[0].count });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', error: error.message });
    }
});

module.exports = router;
