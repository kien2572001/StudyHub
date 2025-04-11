import { Request, Response } from 'express';
import { BookService } from '../services/book.service';
import { asyncHandler } from '../utils/async.handler';
import { ApiHandler } from '../utils/api.handler';

export class BookController {
    private bookService = new BookService();

    // Create a new book
    public createBook = asyncHandler(async (req: Request, res: Response) => {
        // @ts-ignore - req.user is set by auth middleware
        const userId = req.user?.userId;
        const bookData = { ...req.body, userId };

        const result = await this.bookService.createBook(bookData);
        return ApiHandler.success(res, result, 'Book created successfully', 201);
    });

    // Get a specific book
    public getBook = asyncHandler(async (req: Request, res: Response) => {
        const bookId = parseInt(req.params.id);
        // @ts-ignore - req.user is set by auth middleware
        const userId : string  = req.user?.userId;

        const result = await this.bookService.getBook(bookId, userId);
        if (!result) {
            return ApiHandler.error(res, 'Book not found', 404);
        }
        return ApiHandler.success(res, result, 'Book retrieved successfully');
    });

    // Get all books for current user
    public getUserBooks = asyncHandler(async (req: Request, res: Response) => {
        // @ts-ignore - req.user is set by auth middleware
        const userId : string  = req.user?.userId;
        const {
            search,
            fileFormat,
            page,
            limit,
            sortBy,
            sortOrder
        } = req.query;

        const options = {
            search: search as string,
            fileFormat: fileFormat as string,
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 10,
            sortBy: sortBy as string || 'title',
            sortOrder: (sortOrder as 'asc' | 'desc') || 'asc'
        };

        const result = await this.bookService.getUserBooks(userId, options);
        return ApiHandler.success(res, result, 'Books retrieved successfully');
    });

    // Update an existing book
    public updateBook = asyncHandler(async (req: Request, res: Response) => {
        const bookId = parseInt(req.params.id);
        // @ts-ignore - req.user is set by auth middleware
        const userId : string = req.user?.userId;
        const updateData = req.body;

        const result = await this.bookService.updateBook(bookId, userId, updateData);
        return ApiHandler.success(res, result, 'Book updated successfully');
    });

    // Delete a book
    public deleteBook = asyncHandler(async (req: Request, res: Response) => {
        const bookId = parseInt(req.params.id);
        // @ts-ignore - req.user is set by auth middleware
        const userId : string = req.user?.userId;

        const result = await this.bookService.deleteBook(bookId, userId);
        return ApiHandler.success(res, result, 'Book deleted successfully');
    });

    // Update last read position
    public updateLastRead = asyncHandler(async (req: Request, res: Response) => {
        const bookId = parseInt(req.params.id);
        // @ts-ignore - req.user is set by auth middleware
        const userId : string = req.user?.userId;
        const { readingPage } = req.body;

        if (readingPage === undefined) {
            return ApiHandler.error(res, 'Reading page is required', 400);
        }

        const result = await this.bookService.updateLastRead(bookId, userId, readingPage);
        return ApiHandler.success(res, result, 'Reading progress updated successfully');
    });
}
