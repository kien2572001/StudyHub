const db = require('../config/db');

class QueueService {
    async addJob(job) {
        const { id, bucket, key } = job;
        await db.query(
            'INSERT INTO jobs (id, s3_bucket, s3_key, status) VALUES (?, ?, ?, ?)',
            [id, bucket, key, 'pending']
        );
        console.log(`[${id}] Đã thêm job mới: ${key}`);
        return id;
    }

    async getNextJob() {
        const [processingJobs] = await db.query(
            'SELECT COUNT(*) as count FROM jobs WHERE status = ?',
            ['processing']
        );

        if (processingJobs[0].count > 0) {
            return null;
        }

        const [pendingJobs] = await db.query(
            'SELECT * FROM jobs WHERE status = ? ORDER BY created_at ASC LIMIT 1',
            ['pending']
        );

        return pendingJobs.length > 0 ? pendingJobs[0] : null;
    }

    async updateJob(jobId, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), jobId];

        await db.query(
            `UPDATE jobs SET ${fields} WHERE id = ?`,
            values
        );
    }

    async getJob(jobId) {
        const [rows] = await db.query(
            'SELECT * FROM jobs WHERE id = ?',
            [jobId]
        );
        return rows.length > 0 ? rows[0] : null;
    }
}

module.exports = new QueueService();
