const mysql = require('mysql2/promise');

class Database {
    constructor() {
        this.pool = null;
    }

    async getConnection() {
        if (this.pool) return this.pool;

        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '123456',
            database: process.env.DB_NAME || 'ebook_converter',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Kiểm tra kết nối
        try {
            const connection = await this.pool.getConnection();
            console.log('Database connection successful');
            connection.release();
            return this.pool;
        } catch (error) {
            console.error('Database connection failed:', error);
            throw error;
        }
    }

    // Các phương thức tiện ích
    async query(sql, params) {
        const pool = await this.getConnection();
        return pool.query(sql, params);
    }

    async end() {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            console.log('Pool connections closed');
        }
    }
}

// Xuất singleton instance
const instance = new Database();
module.exports = instance;
