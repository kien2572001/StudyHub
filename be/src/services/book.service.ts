import {Book, PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export class BookService {
    async createBook(bookData: Omit<Book, 'id' | 'uploadDate'>): Promise<Book> {
        return prisma.book.create({
            data: bookData
        });
    }

    async getBook(id: number, userId: string): Promise<Book | null> {
        return prisma.book.findFirst({
            where: {
                id,
                userId
            }
        });
    }

    async getUserBooks(
        userId: string,
        options: {
            search?: string;
            fileFormat?: string;
            // page?: number;
            // limit?: number;
            sortBy?: string;
            sortOrder?: 'asc' | 'desc';
        }
    ): Promise<Book[]> {
        const {
            search,
            fileFormat,
            // page = 1,
            // limit = 10,
            sortBy = 'title',
            sortOrder = 'asc'
        } = options;

        // Build the where clause
        const where: any = { userId };

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { author: { contains: search } },
                { description: { contains: search } }
            ];
        }

        if (fileFormat) {
            where.fileFormat = fileFormat;
        }

        // Get paginated books
        return await prisma.book.findMany({
            where,
            // skip: (page - 1) * limit,
            // take: limit,
            orderBy: {
                [sortBy]: sortOrder
            }
        });
    }

    async updateBook(id: number, userId: string, updateData: Partial<Book>): Promise<Book> {
        // First check if the book exists and belongs to the user
        const book = await prisma.book.findFirst({
            where: {
                id,
                userId
            }
        });

        if (!book) {
            throw new Error('Book not found or you do not have permission to update it');
        }

        return prisma.book.update({
            where: { id },
            data: updateData
        });
    }

    async deleteBook(id: number, userId: string): Promise<Book> {
        // First check if the book exists and belongs to the user
        const book = await prisma.book.findFirst({
            where: {
                id,
                userId
            }
        });

        if (!book) {
            throw new Error('Book not found or you do not have permission to delete it');
        }

        return prisma.book.delete({
            where: { id }
        });
    }

    async updateLastRead(id: number, userId: string, readingPage: number): Promise<Book> {
        return prisma.book.update({
            where: {
                id
            },
            data: {
                lastOpened: new Date(),
                readingPage
            }
        });
    }
}
