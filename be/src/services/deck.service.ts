import { PrismaClient, Deck } from '@prisma/client';
import { AppError } from '../utils/errors';

export class DeckService {
    private prisma = new PrismaClient();

    /**
     * Create a new deck
     */
    public async createDeck(data: {
        name: string;
        description?: string;
        color?: string;
        isPublic?: boolean;
        userId: string;
        parentDeckId?: number;
        languageId?: number;
    }): Promise<Deck> {
        let path = '';
        let level = 1;

        // Handle parent deck relationships if provided
        if (data.parentDeckId) {
            const parentDeck = await this.prisma.deck.findUnique({
                where: { id: data.parentDeckId }
            });

            if (!parentDeck) {
                throw new AppError('Parent deck not found', 404);
            }

            // Verify ownership of parent deck
            console.log(parentDeck);
            console.log(data.userId);
            if (parentDeck.userId !== data.userId) {
                throw new AppError('You do not have permission to create a deck under this parent', 403);
            }

            path = parentDeck.path;
            level = parentDeck.level + 1;
        }

        // Create new deck
        const newDeck = await this.prisma.deck.create({
            data: {
                name: data.name,
                description: data.description,
                color: data.color,
                isPublic: data.isPublic || false,
                path: path, // Temporary path, will update after creation
                level,
                userId: data.userId,
                parentDeckId: data.parentDeckId,
                languageId: data.languageId
            }
        });

        // Update path to include the new deck's ID
        const updatedPath = data.parentDeckId
            ? `${path}/${newDeck.id}`
            : `${newDeck.id}`;

        return this.prisma.deck.update({
            where: { id: newDeck.id },
            data: { path: updatedPath }
        });
    }

    /**
     * Get a specific deck by ID
     */
    public async getDeck(id: number, userId?: string): Promise<Deck> {
        const deck = await this.prisma.deck.findUnique({
            where: { id },
            include: {
                language: true,
                childDecks: {
                    where: {
                        OR: [
                            { isPublic: true },
                            userId ? { userId } : {}
                        ]
                    }
                },
                parentDeck: true
            }
        });

        if (!deck) {
            throw new AppError('Deck not found', 404);
        }

        // Check access permissions
        if (!deck.isPublic && deck.userId !== userId) {
            throw new AppError('You do not have permission to view this deck', 403);
        }

        return deck;
    }

    /**
     * Get decks for a specific user
     */
    public async getUserDecks(
        userId: string,
        options?: {
            parentDeckId?: number | null; // null for root decks, undefined for all parent decks
            search?: string;
            languageId?: number;
            page?: number;
            limit?: number;
            sortBy?: string;
            sortOrder?: 'asc' | 'desc';
        }
    ): Promise<{
        data: Deck[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrevious: boolean;
        }
    }> {
        const {
            parentDeckId,
            search,
            languageId,
            page = 1,
            limit = 10,
            sortBy = 'name',
            sortOrder = 'asc'
        } = options || {};

        // Validate pagination params
        const currentPage = Math.max(1, page);
        const itemsPerPage = Math.min(100, Math.max(1, limit));
        const skip = (currentPage - 1) * itemsPerPage;

        // Build search conditions
        const whereCondition: any = {
            userId, // Deck thuộc về user cụ thể
            level: 1, // Chỉ tìm deck gốc
        };

        // Tìm theo parentDeckId nếu được chỉ định
        if (parentDeckId !== undefined) {
            whereCondition.parentDeckId = parentDeckId === null ? null : parentDeckId;
        }

        // Add search filter if provided
        if (search) {
            whereCondition.OR = [
                { name: { contains: search } },
                { description: { contains: search } }
            ];
        }

        // Add language filter if provided
        if (languageId) {
            whereCondition.languageId = languageId;
        }

        // Create orderBy object
        const orderByClause: any = {};
        orderByClause[sortBy] = sortOrder;

        // Count total parent decks (for pagination)
        const totalDecks = await this.prisma.deck.count({
            where: whereCondition
        });

        // Get user's parent decks with pagination
        const decks = await this.prisma.deck.findMany({
            where: whereCondition,
            include: {
                language: true,
                // Lấy thông tin về deck con
                childDecks: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        color: true,
                        isPublic: true,
                        createdAt: true,
                        updatedAt: true,
                        // Đếm số lượng flashcard trong mỗi deck con (nếu cần)
                        // _count: {
                        //     select: {
                        //         flashcards: true
                        //     }
                        // }
                    },
                    orderBy: {
                        id: 'asc' // Sắp xếp theo ID của deck con
                    }
                },
                // Đếm tổng số flashcard trong deck này
                // _count: {
                //     select: {
                //         flashcards: true
                //     }
                // }
            },
            orderBy: orderByClause,
            skip,
            take: itemsPerPage
        });

        // Calculate total pages
        const totalPages = Math.ceil(totalDecks / itemsPerPage);

        return {
            data: decks,
            pagination: {
                total: totalDecks,
                page: currentPage,
                limit: itemsPerPage,
                totalPages,
                hasNext: currentPage < totalPages,
                hasPrevious: currentPage > 1
            }
        };
    }

    /**
     * Update an existing deck
     */
    public async updateDeck(
        id: number,
        userId: string,
        data: {
            name?: string;
            description?: string;
            color?: string;
            isPublic?: boolean;
            parentDeckId?: number | null;
            languageId?: number | null;
        }
    ): Promise<Deck> {
        // Check if deck exists
        const existingDeck = await this.prisma.deck.findUnique({
            where: { id }
        });

        if (!existingDeck) {
            throw new AppError('Deck not found', 404);
        }

        // Verify ownership
        if (existingDeck.userId !== userId) {
            throw new AppError('You do not have permission to update this deck', 403);
        }

        let path = existingDeck.path;
        let level = existingDeck.level;

        // Handle parent deck changes
        if (data.parentDeckId !== undefined) {
            // If changing to root level (no parent)
            if (data.parentDeckId === null) {
                path = `${id}`;
                level = 1;
            }
            // If changing to a different parent
            else if (data.parentDeckId !== existingDeck.parentDeckId) {
                // Verify new parent exists
                const newParent = await this.prisma.deck.findUnique({
                    where: { id: data.parentDeckId }
                });

                if (!newParent) {
                    throw new AppError('New parent deck not found', 404);
                }

                // Verify ownership of new parent
                if (newParent.userId !== userId) {
                    throw new AppError('You do not have permission to move this deck to the selected parent', 403);
                }

                // Prevent circular references
                if (newParent.path.includes(`/${id}/`) || newParent.path === `${id}`) {
                    throw new AppError('Cannot move a deck to its own child deck', 400);
                }

                path = `${newParent.path}/${id}`;
                level = newParent.level + 1;
            }
        }

        // Update the deck
        return this.prisma.deck.update({
            where: { id },
            data: {
                ...data,
                path,
                level
            },
            include: {
                language: true,
                parentDeck: true
            }
        });
    }

    /**
     * Delete a deck
     */
    public async deleteDeck(id: number, userId: string): Promise<void> {
        // Check if deck exists
        const deck = await this.prisma.deck.findUnique({
            where: { id },
            include: {
                childDecks: true
            }
        });

        if (!deck) {
            throw new AppError('Deck not found', 404);
        }

        // Check for child decks
        if (deck.childDecks.length > 0) {
            throw new AppError('Cannot delete a deck that has child decks. Please delete the child decks first.', 400);
        }

        // Delete the deck
        await this.prisma.deck.delete({
            where: { id }
        });
    }

    public async havePermissionToDeck(deckId: number, userId: string): Promise<boolean> {
        const deck = await this.prisma.deck.findUnique({
            where: { id: deckId },
            select: {
                userId: true,
                isPublic: true
            }
        });

        if (!deck) {
            return false;
        }

        return deck.userId === userId;
    }
}
