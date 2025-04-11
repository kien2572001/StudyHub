CREATE DATABASE IF NOT EXISTS ebook_converter;
USE ebook_converter;

CREATE TABLE IF NOT EXISTS jobs (
                                    id VARCHAR(50) PRIMARY KEY,
    s3_bucket VARCHAR(255) NOT NULL,
    s3_key VARCHAR(255) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    output_key VARCHAR(255),
    download_url TEXT,
    error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
