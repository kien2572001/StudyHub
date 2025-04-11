// src/routes/book.routes.ts
import express from 'express';
import { BookController } from '../controllers/book.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const bookController = new BookController();
const authMiddleware = new AuthMiddleware();

// POST /books - Tạo sách mới
router.post('/',authMiddleware.authenticate, bookController.createBook);

// GET /books - Lấy tất cả sách của người dùng hiện tại (với các tùy chọn lọc)
router.get('/',authMiddleware.authenticate, bookController.getUserBooks);

// GET /books/:id - Lấy thông tin chi tiết của một sách
router.get('/:id',authMiddleware.authenticate, bookController.getBook);

// PUT /books/:id - Cập nhật thông tin sách
router.put('/:id',authMiddleware.authenticate, bookController.updateBook);

// DELETE /books/:id - Xóa sách
router.delete('/:id',authMiddleware.authenticate, bookController.deleteBook);

// PATCH /books/:id/last-read - Cập nhật vị trí đọc cuối cùng
router.patch('/:id/last-read',authMiddleware.authenticate, bookController.updateLastRead);

export default router;
