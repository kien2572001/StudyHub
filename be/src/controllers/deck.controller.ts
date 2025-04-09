import { Request, Response } from 'express';
import { DeckService } from '../services/deck.service';
import { asyncHandler } from '../utils/async.handler';
import { ApiHandler } from '../utils/api.handler';

export class DeckController {
    private deckService = new DeckService();

    // Create a new deck
    public createDeck = asyncHandler(async (req: Request, res: Response) => {
        // @ts-ignore - req.user is set by auth middleware
        const userId = req.user?.userId;
        const deckData = { ...req.body, userId };

        const result = await this.deckService.createDeck(deckData);
        return ApiHandler.success(res, result, 'Deck created successfully', 201);
    });

    // Get a specific deck
    public getDeck = asyncHandler(async (req: Request, res: Response) => {
        const deckId = parseInt(req.params.id);
        // @ts-ignore - req.user may be set by auth middleware
        const userId = req.user?.id;

        const result = await this.deckService.getDeck(deckId, userId);
        return ApiHandler.success(res, result, 'Deck retrieved successfully');
    });

    // Get all decks for current user
    public getUserDecks = asyncHandler(async (req: Request, res: Response) => {
        // @ts-ignore - req.user is set by auth middleware
        const userId = req.user.id;
        const {
            parentDeckId,
            search,
            languageId,
            page,
            limit,
            sortBy,
            sortOrder
        } = req.query;

        const options = {
            // null để tìm deck gốc, undefined để tìm tất cả deck cha
            parentDeckId: parentDeckId === undefined
                ? undefined
                : parentDeckId === 'null'
                    ? null
                    : parseInt(parentDeckId as string),
            search: search as string,
            languageId: languageId ? parseInt(languageId as string) : undefined,
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 10,
            sortBy: sortBy as string || 'name',
            sortOrder: (sortOrder as 'asc' | 'desc') || 'asc'
        };

        const result = await this.deckService.getUserDecks(userId, options);
        return ApiHandler.success(res, result, 'Decks retrieved successfully');
    });

    // Update an existing deck
    public updateDeck = asyncHandler(async (req: Request, res: Response) => {
        const deckId = parseInt(req.params.id);
        // @ts-ignore - req.user is set by auth middleware
        const userId = req.user.id;
        const updateData = req.body;

        const result = await this.deckService.updateDeck(deckId, userId, updateData);
        return ApiHandler.success(res, result, 'Deck updated successfully');
    });

    // Delete a deck
    public deleteDeck = asyncHandler(async (req: Request, res: Response) => {
        const deckId = parseInt(req.params.id);
        // @ts-ignore - req.user is set by auth middleware
        const userId = req.user.id;

        const result = await this.deckService.deleteDeck(deckId, userId);
        return ApiHandler.success(res, result, 'Deck deleted successfully');
    });
}
